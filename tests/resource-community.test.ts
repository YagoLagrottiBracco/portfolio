import assert from "node:assert/strict"
import test from "node:test"
import {
  validateCommunitySubmission,
  approveCommunitySubmission,
  extractCommunityProposal,
  buildCommunityIssueUrl,
  buildCollaborationIssueUrl,
} from "../src/lib/resource-community"

const valid = {
  slug: "meu-worker",
  title: { pt: "Meu worker", en: "My worker", es: "Mi worker" },
  description: {
    pt: "Um exemplo real usando o starter de worker desta biblioteca.",
    en: "A real application using the worker starter from this library.",
    es: "Una aplicación real usando el starter de worker de esta biblioteca.",
  },
  authorName: "Pessoa",
  authorUrl: "https://example.com/autor",
  demoUrl: "https://example.com/demo",
  resourcePath: "/recursos/templates/worker",
  consent: true as const,
}

test("community submissions require consent, known resource paths and public HTTPS URLs", () => {
  assert.equal(validateCommunitySubmission(valid).slug, "meu-worker")
  for (const patch of [
    { consent: false },
    { demoUrl: "javascript:alert(1)" },
    { authorUrl: "https://user:password@example.com/" },
    { demoUrl: "https://127.0.0.1/private" },
    { resourcePath: "/admin" },
    { slug: "../secret" },
    { title: { pt: "Missing languages" } },
  ])
    assert.throws(() => validateCommunitySubmission({ ...valid, ...patch }))
})
test("approval requires source evidence and a named reviewer; preserves author credit", () => {
  const approved = approveCommunitySubmission(valid, {
    reviewer: "YagoLagrottiBracco",
    issueUrl: "https://github.com/YagoLagrottiBracco/portfolio/issues/123",
    reviewedAt: "2026-10-17",
  })
  assert.equal(approved.authorName, "Pessoa")
  assert.equal(approved.review.reviewer, "YagoLagrottiBracco")
  assert.throws(() =>
    approveCommunitySubmission(valid, {
      reviewer: "",
      issueUrl: "https://example.com/fake",
      reviewedAt: "2026-10-17",
    })
  )
})
test("issue extraction requires the explicit permission checkbox and valid proposal JSON", () => {
  const body =
    "### Proposta em JSON\n\n```json\n" +
    JSON.stringify(valid) +
    "\n```\n\n### Autorização\n\n- [x] Sou responsável pelo material e autorizo sua publicação com os créditos enviados."
  assert.equal(extractCommunityProposal(body).slug, "meu-worker")
  assert.equal(
    extractCommunityProposal(body.replaceAll("\n", "\r\n")).slug,
    "meu-worker"
  )
  assert.throws(() => extractCommunityProposal(body.replace("[x]", "[ ]")))
  assert.throws(() => extractCommunityProposal("```json\n{}\n```"))
})
test("GitHub proposal links are reviewable drafts with separately encoded fields", () => {
  const community = new URL(buildCommunityIssueUrl(valid))
  assert.equal(community.hostname, "github.com")
  assert.equal(community.searchParams.get("template"), "community-use.yml")
  assert.deepEqual(JSON.parse(community.searchParams.get("proposal")!), valid)
  const collaboration = new URL(
    buildCollaborationIssueUrl(
      "A & B",
      "https://example.com/?a=1&b=2",
      "Line1\nLine2"
    )
  )
  assert.equal(collaboration.searchParams.get("proposal"), "Line1\nLine2")
})

test("permission inside proposal text or another section cannot replace the authorization checkbox", () => {
  const permission =
    "- [x] Sou responsável pelo material e autorizo sua publicação com os créditos enviados."
  const proposal = {
    ...valid,
    description: { pt: permission, en: permission, es: permission },
  }
  const body =
    "### Proposta em JSON\n\n```json\n" +
    JSON.stringify(proposal, null, 2) +
    "\n```\n\n### Autorização\n\n" +
    permission.replace("[x]", "[ ]")
  assert.throws(() => extractCommunityProposal(body))
  assert.throws(() =>
    extractCommunityProposal(body + "\n\n### Comentário\n\n" + permission)
  )
  assert.throws(() =>
    extractCommunityProposal(
      body.replace("### Autorização", "### Outro campo") + "\n" + permission
    )
  )
  assert.equal(
    extractCommunityProposal(body.replace("- [ ]", "- [X]")).slug,
    valid.slug
  )
})

test("long Unicode proposals keep GitHub URLs within a usable length and retain downloadable source", () => {
  const proposal = {
    ...valid,
    description: {
      pt: "á".repeat(1400),
      en: "á".repeat(1400),
      es: "á".repeat(1400),
    },
    consent: true as const,
  }
  const url = buildCommunityIssueUrl(proposal)
  assert.ok(url.length < 8000)
  assert.equal(new URL(url).searchParams.get("proposal"), null)
  const collaboration = buildCollaborationIssueUrl(
    "Pessoa",
    "https://example.com",
    "á".repeat(2500)
  )
  assert.ok(collaboration.length < 8000)
})

test("import command is a dry run by default and approved imports preserve credit without duplicate overwrites", async () => {
  const { mkdtempSync, writeFileSync, readFileSync, rmSync } = await import(
    "node:fs"
  )
  const { tmpdir } = await import("node:os")
  const { join } = await import("node:path")
  const { execFileSync } = await import("node:child_process")
  const dir = mkdtempSync(join(tmpdir(), "portfolio-community-test-"))
  try {
    const input = join(dir, "proposal.json"),
      output = join(dir, "gallery.json")
    writeFileSync(input, JSON.stringify(valid))
    writeFileSync(output, "[]")
    const args = [
      "--import",
      "tsx",
      "scripts/import-community.ts",
      "--input",
      input,
      "--output",
      output,
    ]
    execFileSync(process.execPath, args, { encoding: "utf8" })
    assert.equal(readFileSync(output, "utf8"), "[]")
    const approved = [
      ...args,
      "--approve",
      "--reviewer",
      "YagoLagrottiBracco",
      "--issue-url",
      "https://github.com/YagoLagrottiBracco/portfolio/issues/123",
    ]
    execFileSync(process.execPath, approved, { encoding: "utf8" })
    const entries = JSON.parse(readFileSync(output, "utf8"))
    assert.equal(entries.length, 1)
    assert.equal(entries[0].authorName, "Pessoa")
    assert.throws(() =>
      execFileSync(process.execPath, approved, { stdio: "pipe" })
    )
    assert.equal(JSON.parse(readFileSync(output, "utf8")).length, 1)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test("published gallery data retains explicit permission, named review and unique non-reserved slugs", async () => {
  const { default: entries } = await import(
    "../src/data/resources/community.json"
  )
  const slugs = new Set<string>()
  for (const item of entries as unknown as {
    review: { reviewer: string; issueUrl: string; reviewedAt: string }
    slug: string
  }[]) {
    approveCommunitySubmission(item, item.review)
    assert.ok(!slugs.has(item.slug))
    slugs.add(item.slug)
  }
  assert.throws(() =>
    validateCommunitySubmission({ ...valid, slug: "sua-aplicacao" })
  )
})
