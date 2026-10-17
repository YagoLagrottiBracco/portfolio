import assert from "node:assert/strict"
import test from "node:test"
import { clientIp, withTrailers } from "../src/lib/audit-log"
import { createBlogAdminHandlers } from "../src/lib/blog-admin-handler"
import { createPublishHandler } from "../src/lib/blog-publish-handler"
import { createRateLimiter } from "../src/lib/rate-limit"

test("allows up to the limit per key, then reports when the window reopens", () => {
  const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 })
  assert.equal(limiter.hit("a", 0).allowed, true)
  assert.equal(limiter.hit("a", 1_000).allowed, true)
  assert.deepEqual(limiter.hit("a", 1_000), { allowed: false, retryAfterSeconds: 59 })
  assert.equal(limiter.hit("b", 1_000).allowed, true, "keys are counted apart")
  assert.equal(limiter.hit("a", 60_000).allowed, true, "a new window starts")
})

test("keeps memory bounded when many callers pass by", () => {
  const limiter = createRateLimiter({ limit: 1, windowMs: 60_000, maxKeys: 3 })
  for (const key of ["a", "b", "c", "d", "e"]) assert.equal(limiter.hit(key, 0).allowed, true)
  // "a" was evicted to make room, so it starts over instead of being refused.
  assert.equal(limiter.hit("a", 0).allowed, true)
})

test("reads the caller from Vercel's forwarding headers", () => {
  assert.equal(clientIp(new Request("http://t", { headers: { "x-forwarded-for": "203.0.113.7, 10.0.0.1" } })), "203.0.113.7")
  assert.equal(clientIp(new Request("http://t", { headers: { "x-real-ip": "198.51.100.2" } })), "198.51.100.2")
  assert.equal(clientIp(new Request("http://t")), "unknown")
})

test("appends git trailers, skipping empty values and line breaks", () => {
  assert.equal(withTrailers("feat(blog): publish x", { "Published-Via": "blog-api", "Request-Id": undefined }), "feat(blog): publish x\n\nPublished-Via: blog-api")
  assert.equal(withTrailers("draft(blog): x", { "Edited-By": "github:42", "Request-Id": "gru1::a\nb" }), "draft(blog): x\n\nEdited-By: github:42\nRequest-Id: gru1::a b")
  assert.equal(withTrailers("same", {}), "same")
})

const payload = {
  translationKey: "article",
  articles: {
    pt: { title: "PT", slug: "artigo", excerpt: "PT", date: "2026-09-24", tags: ["seo"], content: "## PT\n\nText." },
    en: { title: "EN", slug: "article", excerpt: "EN", date: "2026-09-24", tags: ["seo"], content: "## EN\n\nText." },
    es: { title: "ES", slug: "articulo", excerpt: "ES", date: "2026-09-24", tags: ["seo"], content: "## ES\n\nText." },
  },
}

test("the publish API refuses bursts and records every attempt", async () => {
  const entries: { action: string; outcome: string }[] = []
  let context: unknown
  const handler = createPublishHandler({
    apiKey: "secret",
    publish: async (_publication, received) => { context = received; return { sha: "commit" } },
    limiter: createRateLimiter({ limit: 2, windowMs: 60_000 }),
    log: (action, fields) => entries.push({ action, outcome: fields.outcome }),
  })
  const request = (authorization: string) => new Request("http://test/api/blog/publish", {
    method: "POST",
    headers: { authorization, "x-forwarded-for": "203.0.113.7", "x-vercel-id": "gru1::req" },
    body: JSON.stringify(payload),
  })

  assert.equal((await handler(request("Bearer wrong"))).status, 401)
  assert.equal((await handler(request("Bearer secret"))).status, 201)
  const limited = await handler(request("Bearer secret"))
  assert.equal(limited.status, 429)
  assert.ok(Number(limited.headers.get("retry-after")) > 0)
  assert.deepEqual(context, { requestId: "gru1::req" })
  assert.deepEqual(entries.map(entry => entry.outcome), ["denied", "ok", "limited"])
})

test("the editor caps saves per editor and tells the commit who saved", async () => {
  const origin = "https://lagrotti.dev"
  let context: unknown
  const outcomes: string[] = []
  const admin = createBlogAdminHandlers({
    allowedGithubId: "42",
    expectedOrigin: origin,
    getSession: async () => ({ githubId: "42", editorCsrf: "nonce" }),
    listBundles: async () => [],
    commit: async (_prepared, received) => { context = received; return { sha: "draft-sha" } },
    limiter: createRateLimiter({ limit: 1, windowMs: 60_000 }),
    log: (_action, fields) => outcomes.push(fields.outcome),
  })
  const article = (slug: string) => ({ title: "Título", slug, excerpt: "Resumo", date: "2026-10-05", tags: ["seo"], content: "## Seção\n\nTexto." })
  const save = () => admin.create(new Request(`${origin}/api/admin/blog`, {
    method: "POST",
    headers: { origin, "content-type": "application/json", "x-blog-csrf": "nonce", "x-vercel-id": "gru1::save" },
    body: JSON.stringify({ translationKey: "novo-artigo", publish: false, articles: { pt: article("novo-artigo"), en: article("new-article"), es: article("nuevo-articulo") } }),
  }))

  assert.equal((await save()).status, 201)
  assert.deepEqual(context, { requestId: "gru1::save", githubId: "42" })
  assert.equal((await save()).status, 429)
  assert.deepEqual(outcomes, ["ok", "limited"])
})
