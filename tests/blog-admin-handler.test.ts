import assert from "node:assert/strict"
import test from "node:test"
import { createBlogAdminHandlers } from "../src/lib/blog-admin-handler"
import type { BlogAdminBundle } from "../src/lib/blog-admin-document"
import { GitHubPublishError } from "../src/lib/github-git-data"

const origin = "https://example.com"
const articles = Object.fromEntries(["pt", "en", "es"].map(locale => [locale, { title: "Title", slug: `slug-${locale}`, excerpt: "Summary", date: "2026-01-01", tags: ["blog"], content: "## Heading\n\nText" }]))
const bundle: BlogAdminBundle = { translationKey: "key", articles: { pt: { ...articles.pt, locale: "pt", draft: true, sourcePath: "src/content/blog/slug-pt.pt.mdx", blobSha: "sha", extraFrontmatter: {} } } }
const headers = { origin, "content-type": "application/json", "x-blog-csrf": "nonce" }
const request = (body: unknown, init: RequestInit = {}) => new Request(origin + "/api/admin/blog", { method: "POST", headers, body: JSON.stringify(body), ...init })

test("admin routes enforce auth, origin, and stale article versions", async () => {
  const base = { allowedGithubId: "42", expectedOrigin: origin, listBundles: async () => [bundle], commit: async () => ({ sha: "commit" }) }
  const guest = createBlogAdminHandlers({ ...base, getSession: async () => null })
  assert.equal((await guest.list()).status, 401)
  const outsider = createBlogAdminHandlers({ ...base, getSession: async () => ({ githubId: "43", editorCsrf: "nonce" }) })
  assert.equal((await outsider.list()).status, 403)
  const admin = createBlogAdminHandlers({ ...base, getSession: async () => ({ githubId: "42", editorCsrf: "nonce" }) })
  assert.equal((await admin.list()).status, 200)
  assert.equal((await admin.detail("key")).status, 200)
  assert.equal((await admin.update(request({ translationKey: "key", articles, publish: true, versions: { pt: { path: "src/content/blog/slug-pt.pt.mdx", sha: "old" }, en: null, es: null } }), "key")).status, 409)
  const newArticles = Object.fromEntries(Object.entries(articles).map(([locale, article]) => [locale, { ...article, slug: `new-${locale}` }]))
  assert.equal((await admin.create(request({ translationKey: "new", articles: newArticles, publish: true }, { headers: { ...headers, origin: "https://evil.example" } }))).status, 403)
  assert.equal((await admin.create(request({ translationKey: "new", articles: newArticles, publish: true }))).status, 201)
  assert.equal((await admin.create(request({ translationKey: "new", articles: newArticles, publish: true }, { headers: { ...headers, "x-blog-csrf": "wrong" } }))).status, 403)
  assert.equal((await admin.create(request({ translationKey: "new", articles: {}, publish: true }))).status, 400)
  const validVersions = { pt: { path: "src/content/blog/slug-pt.pt.mdx", sha: "sha" }, en: null, es: null }
  assert.equal((await admin.update(request({ translationKey: "key", articles, publish: true, versions: validVersions }), "key")).status, 200)
  const brokenGithub = createBlogAdminHandlers({ ...base, getSession: async () => ({ githubId: "42", editorCsrf: "nonce" }), commit: async () => { throw new GitHubPublishError("upstream", "GitHub unavailable") } })
  assert.equal((await brokenGithub.create(request({ translationKey: "new", articles: newArticles, publish: true }))).status, 502)
  const oversized = { kind: "upload", filename: "cover.png", contentType: "image/png", base64: Buffer.alloc(5 * 1024 * 1024 + 1).toString("base64"), alt: "Cover", width: 1, height: 1 }
  const oversizedResponse = await admin.create(request({ translationKey: "new", articles: newArticles, publish: true, image: oversized }))
  assert.equal(oversizedResponse.status, 413, await oversizedResponse.text())
})
