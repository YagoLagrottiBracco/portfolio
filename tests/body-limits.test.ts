import assert from "node:assert/strict"
import test from "node:test"
import sharp from "sharp"
import { createBriefHandler } from "../src/lib/brief"
import { createRecommendationHandler } from "../src/lib/recommendation"
import { createAskHandler } from "../src/lib/ask/handler"
import { createPublishHandler } from "../src/lib/blog-publish-handler"

const origin = "https://lagrotti.dev"
const publication = {
  translationKey: "cover",
  articles: Object.fromEntries(["pt", "en", "es"].map(locale => [locale, { title: locale, slug: `cover-${locale}`, excerpt: locale, date: "2026-01-01", tags: ["test"], content: "## Cover\n\nBody." }])),
}
const request = (body: string, headers: Record<string, string> = {}) => new Request(`${origin}/api/test`, {
  method: "POST", headers: { origin, accept: "application/json", "content-type": "application/json", ...headers }, body,
})

for (const declared of [undefined, "1"]) {
  test(`forms and Ask reject actual excessive bytes with content-length ${declared ?? "absent"} before delivery`, async () => {
    const logs: unknown[] = []
    let calls = 0
    const log = (_action: string, fields: unknown) => { logs.push(fields) }
    const handlers = [
      { handler: createBriefHandler({ inbox: { apiKey: "secret", from: "sender", to: "owner" }, fetch: async () => { calls++; return Response.json({}) }, log }), size: 20_000 },
      { handler: createRecommendationHandler({ projectSlugs: [], inbox: null, log }), size: 20_000 },
      { handler: createAskHandler({ stream: async () => { calls++; return (async function* () {})() }, stableDocuments: () => [], sections: () => [], log }), size: 4_000 },
    ]
    for (const { handler, size } of handlers) {
      const response = await handler(request(JSON.stringify({ question: "Private email user@example.com", padding: "x".repeat(size) }), declared ? { "content-length": declared } : {}))
      assert.equal(response.status, 413)
    }
    assert.equal(calls, 0)
    assert.equal(logs.length, 3)
    assert.ok(!JSON.stringify(logs).includes("user@example.com"))
  })
}

test("invalid JSON and invalid fields are audited without private body text", async () => {
  const logs: unknown[] = []
  const handlers = [
    createBriefHandler({ inbox: null, log: (_a, fields) => { logs.push(fields) } }),
    createAskHandler({ stream: async () => (async function* () {})(), stableDocuments: () => [], sections: () => [], log: (_a, fields) => { logs.push(fields) } }),
  ]
  for (const handler of handlers) {
    assert.equal((await handler(request('{"email":"private@example.com",'))).status, 400)
    assert.equal((await handler(request('{"email":"private@example.com"}'))).status, 400)
  }
  assert.equal(logs.length, 4)
  assert.ok(!JSON.stringify(logs).includes("private@example.com"))
})

test("plain invalid forms retain the locale redirect and record the refusal", async () => {
  const logs: unknown[] = []
  const handler = createBriefHandler({ inbox: null, log: (_a, fields) => { logs.push(fields) } })
  const response = await handler(request("page=%2Fes%2Ftrabaja-conmigo&email=private%40example.com", { accept: "text/html", "content-type": "application/x-www-form-urlencoded" }))
  assert.equal(response.status, 303)
  assert.equal(response.headers.get("location"), "/es/trabaja-conmigo#brief-invalid")
  assert.equal(logs.length, 1)
  assert.ok(!JSON.stringify(logs).includes("private@example.com"))
})

test("publication caps the total body before accessing GitHub, with absent or false length", async () => {
  let published = 0
  const logs: unknown[] = []
  const handler = createPublishHandler({ apiKey: "secret", publish: async () => { published++; return { sha: "commit" } }, log: (_a, fields) => { logs.push(fields) } })
  for (const declared of [undefined, "1"]) {
    const response = await handler(request(JSON.stringify({ ...publication, padding: "x".repeat(8 * 1024 * 1024) }), { authorization: "Bearer secret", ...(declared ? { "content-length": declared } : {}) }))
    assert.equal(response.status, 413)
  }
  assert.equal(published, 0)
  assert.equal(logs.length, 2)
})

test("publication validates image bytes, MIME type and dimensions before an atomic three-locale commit", async () => {
  const bytes = await sharp({ create: { width: 2, height: 3, channels: 3, background: "red" } }).png().toBuffer()
  const cover = { kind: "upload", filename: "cover.png", contentType: "image/png", base64: bytes.toString("base64"), alt: "Cover", width: 2, height: 3 }
  const publications: unknown[] = []
  const handler = createPublishHandler({ apiKey: "secret", publish: async input => { publications.push(input); return { sha: "commit" } }, log: () => {} })
  for (const image of [ { ...cover, base64: Buffer.from("image bytes").toString("base64") }, { ...cover, contentType: "image/webp" }, { ...cover, width: 1200 } ]) {
    assert.equal((await handler(request(JSON.stringify({ ...publication, image }), { authorization: "Bearer secret" }))).status, 400)
  }
  assert.equal(publications.length, 0)
  const response = await handler(request(JSON.stringify({ ...publication, image: cover }), { authorization: "Bearer secret" }))
  assert.equal(response.status, 201)
  assert.equal(publications.length, 1)
  assert.equal((publications[0] as { files: unknown[] }).files.length, 4)
})

test("provider and JSON errors never expose private content to audit logs", async () => {
  const logs: unknown[] = []
  const handler = createPublishHandler({ apiKey: "secret", publish: async () => { throw new Error("secret private@example.com") }, log: (_a, fields) => { logs.push(fields) } })
  assert.equal((await handler(request('{"private@example.com"', { authorization: "Bearer secret" }))).status, 400)
  assert.equal((await handler(request(JSON.stringify(publication), { authorization: "Bearer secret" }))).status, 502)
  assert.equal(logs.length, 2)
  assert.ok(!JSON.stringify(logs).includes("private@example.com"))
})

test("invalid article Markdown is a sanitized client error before publication", async () => {
  let calls = 0
  const logs: unknown[] = []
  const handler = createPublishHandler({ apiKey: "secret", publish: async () => { calls++; return { sha: "commit" } }, log: (_a, fields) => { logs.push(fields) } })
  const articles = { ...publication.articles, pt: { ...publication.articles.pt, content: "# private@example.com" } }
  const response = await handler(request(JSON.stringify({ ...publication, articles }), { authorization: "Bearer secret" }))
  assert.equal(response.status, 400)
  assert.equal(calls, 0)
  assert.ok(!JSON.stringify(logs).includes("private@example.com"))
  assert.ok(!(await response.text()).includes("private@example.com"))
})
