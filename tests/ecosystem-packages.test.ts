import test from "node:test"
import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { execFileSync, spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { compareJson, inspectEnvKeys } from "../src/lib/resource-tools"

test("standalone engines preserve the existing browser JSON and env contracts", async () => {
  const engines = await import("../packages/resource-tools/lib/engines.mjs")
  for (const [left, right] of [
    ['{"a/b":1,"nested":[1,2]}', '{"a/b":2,"nested":[1,3]}'],
    ['{"n":9007199254740993}', '{}'], ['{', '{}'], ['0.1', '0.1'],
  ]) assert.deepEqual(engines.compareJson(left, right), compareJson(left, right))
  assert.deepEqual(engines.inspectEnvKeys("TOKEN=secret\nPORT=80", "TOKEN=other\nTOKEN=third"), inspectEnvKeys("TOKEN=secret\nPORT=80", "TOKEN=other\nTOKEN=third"))
})

test("versioned artifacts install outside the workspace, have matching hashes and reject conflicting rebuilds", async () => {
  const { buildEcosystemPackages } = await import("../scripts/build-ecosystem-packages")
  const directory = mkdtempSync(join(tmpdir(), "ecosystem-release-"))
  try {
    const outputDirectory = join(directory, "release")
    const manifest = await buildEcosystemPackages({ outputDirectory })
    assert.equal(manifest.version, "1.0.0")
    assert.ok(manifest.artifacts.length >= 4)
    for (const artifact of manifest.artifacts) {
      const bytes = readFileSync(join(outputDirectory, artifact.filename))
      assert.equal(bytes.length, artifact.bytes)
      assert.equal(createHash("sha256").update(bytes).digest("hex"), artifact.sha256)
    }
    const installDirectory = join(directory, "consumer")
    mkdirSync(installDirectory)
    writeFileSync(join(installDirectory, "package.json"), '{"name":"isolated-consumer","private":true}')
    execFileSync("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund", "--package-lock=false", join(outputDirectory, "resource-tools-1.0.0.tgz")], { cwd: installDirectory, stdio: "pipe" })
    const cli = join(installDirectory, "node_modules/.bin/resource-tools")
    const reference = join(installDirectory, "reference.env"), candidate = join(installDirectory, "candidate.env")
    writeFileSync(reference, "TOKEN=UNPRINTED_SECRET\nPORT=80\n")
    writeFileSync(candidate, "TOKEN=UNPRINTED_OTHER\n")
    const execution = spawnSync(cli, ["env", reference, candidate, "--json"], { encoding: "utf8", cwd: installDirectory })
    assert.equal(execution.status, 1, execution.stderr)
    assert.deepEqual(JSON.parse(execution.stdout).result.missing, ["PORT"])
    assert.ok(!execution.stdout.includes("UNPRINTED"))
    // Run the downloaded Action itself after extraction, without workspace imports.
    execFileSync("unzip", ["-q", join(outputDirectory, "resource-action-1.0.0.zip"), "-d", join(directory, "extracted")])
    const summary = join(directory, "summary.md")
    const action = spawnSync(process.execPath, [join(directory, "extracted/resource-action/run.mjs")], { encoding: "utf8", cwd: installDirectory, env: { ...process.env, RESOURCE_TOOL: "env", RESOURCE_REFERENCE: reference, RESOURCE_CANDIDATE: candidate, GITHUB_STEP_SUMMARY: summary } })
    assert.equal(action.status, 1, action.stderr)
    assert.ok(!readFileSync(summary, "utf8").includes("UNPRINTED"))
    for (const filename of ["worker-starter-1.0.0.zip", "http-lab-1.0.0.zip", "resource-tools-source-1.0.0.zip"])
      execFileSync("unzip", ["-tqq", join(outputDirectory, filename)])
    const second = await buildEcosystemPackages({ outputDirectory })
    assert.deepEqual(second, manifest)
    const originalManifest = readFileSync(join(outputDirectory, "manifest.json"))
    writeFileSync(join(outputDirectory, "resource-tools-1.0.0.tgz"), "conflicting bytes")
    await assert.rejects(buildEcosystemPackages({ outputDirectory }), /Immutable release conflict/)
    assert.deepEqual(readFileSync(join(outputDirectory, "manifest.json")), originalManifest)
  } finally { rmSync(directory, { recursive: true, force: true }) }
})
