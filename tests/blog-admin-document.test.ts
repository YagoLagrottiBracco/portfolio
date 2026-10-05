import assert from "node:assert/strict"
import test from "node:test"
import { groupBlogSources } from "../src/lib/blog-admin-document"

const source = (locale: string, draft: boolean) => `---\ntitle: Title\nslug: slug-${locale}\ntranslationKey: group\nexcerpt: Excerpt\ndate: 2026-01-01\ntags: [blog]\nlocale: ${locale}\ndraft: ${draft}\neditorNote: keep me\n---\n\n## Heading\n\nBody\n`

test("groups locale sources without losing draft state or extra frontmatter", () => {
  const [bundle] = groupBlogSources(["pt", "en", "es"].map(locale => ({ path: `src/content/blog/slug-${locale}.${locale}.mdx`, source: source(locale, locale === "en"), blobSha: `sha-${locale}` })))
  assert.deepEqual(Object.keys(bundle.articles).sort(), ["en", "es", "pt"])
  assert.equal(bundle.articles.en?.draft, true)
  assert.equal(bundle.articles.en?.blobSha, "sha-en")
  assert.equal(bundle.articles.en?.extraFrontmatter.editorNote, "keep me")
})
