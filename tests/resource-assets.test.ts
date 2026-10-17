import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import test from "node:test"
import { join } from "node:path"
import {
  getResourceEntries,
  resourceSections,
} from "../src/lib/resource-catalog"
import { getCaseStudyProjects } from "../src/lib/projects"

const asset = (path: string) => join(process.cwd(), "public/recursos", path)
test("every editorial download and generated case asset exists", () => {
  const universal = [
    "worker-starter.zip",
    "json-clone.csv",
    "json-clone.json",
    "benchmark-json.mjs",
  ]
  for (const locale of ["pt", "en", "es"]) {
    for (const section of resourceSections)
      for (const entry of getResourceEntries(section.slug))
        if (entry.download) {
          const path = asset(
            `downloads/${universal.includes(entry.download) ? "" : `${locale}/`}${entry.download}`
          )
          assert.ok(existsSync(path), path)
          assert.ok(readFileSync(path).length > 20, path)
        }
    for (const project of getCaseStudyProjects()) {
      for (const suffix of ["svg", "png"])
        assert.ok(
          existsSync(asset(`diagramas/${locale}/${project.slug}.${suffix}`))
        )
      for (let n = 1; n <= 5; n++)
        assert.ok(
          existsSync(asset(`carrosseis/${locale}/${project.slug}-${n}.png`))
        )
      assert.ok(existsSync(asset(`curadoria/${locale}/${project.slug}.zip`)))
    }
  }
})
test("published benchmark summaries derive from raw samples and identify the environment", () => {
  const data = JSON.parse(
    readFileSync(asset("downloads/json-clone.json"), "utf8")
  )
  assert.equal(data.samples.length, 180)
  assert.ok(data.node.startsWith("v"))
  assert.ok(data.cpu.length > 2)
  for (const row of data.summary) {
    const values = data.samples
      .filter(
        (s: { size: number; method: string }) =>
          s.size === row.size && s.method === row.method
      )
      .map((s: { msPerCopy: number }) => s.msPerCopy)
      .sort((a: number, b: number) => a - b)
    assert.equal(values.length, 30)
    assert.equal(row.medianMs, (values[14] + values[15]) / 2)
    assert.ok(row.minMs > 0)
  }
})

test("tools expose their MIT notice and each launch kit includes all three languages", () => {
  assert.match(
    readFileSync(asset("downloads/tools-LICENSE.txt"), "utf8"),
    /MIT License/
  )
  for (const locale of ["pt", "en", "es"]) {
    const copy = readFileSync(
      asset(`downloads/${locale}/launch-kit.md`),
      "utf8"
    )
    for (const title of [
      "Kit aberto de engenharia",
      "Open engineering kit",
      "Kit abierto de ingeniería",
    ])
      assert.ok(copy.includes(title))
  }
})
