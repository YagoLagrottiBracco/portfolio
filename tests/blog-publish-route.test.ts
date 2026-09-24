import assert from "node:assert/strict"
import test from "node:test"
import { createPublishHandler } from "../src/lib/blog-publish-handler"

const payload = {
  translationKey: "article",
  articles: {
    pt: { title: "PT", slug: "artigo", excerpt: "PT", date: "2026-09-24", tags: ["seo"], content: "## PT\n\nText." },
    en: { title: "EN", slug: "article", excerpt: "EN", date: "2026-09-24", tags: ["seo"], content: "## EN\n\nText." },
    es: { title: "ES", slug: "articulo", excerpt: "ES", date: "2026-09-24", tags: ["seo"], content: "## ES\n\nText." },
  },
}

test("rejects missing or invalid bearer keys", async () => {
  const handler = createPublishHandler({ apiKey: "secret", publish: async () => ({ sha: "commit" }) })
  assert.equal((await handler(new Request("http://test/api/blog/publish", { method: "POST", body: JSON.stringify(payload) }))).status, 401)
})

test("returns URLs and deployment-pending after publication", async () => {
  const handler = createPublishHandler({ apiKey: "secret", publish: async () => ({ sha: "commit" }) })
  const response = await handler(new Request("http://test/api/blog/publish", { method: "POST", headers: { authorization: "Bearer secret" }, body: JSON.stringify(payload) }))
  assert.equal(response.status, 201)
  assert.deepEqual(await response.json(), { commitSha: "commit", status: "deployment-pending", urls: ["/blog/artigo", "/blog/article", "/blog/articulo"] })
})