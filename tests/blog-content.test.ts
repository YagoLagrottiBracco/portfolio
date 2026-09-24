import assert from "node:assert/strict"
import test from "node:test"
import { createBlogIndex } from "../src/lib/blog-content"

const source = (locale: string, slug: string, body = "## A heading\n\nContent with [a link](https://example.com).") => `---\ntitle: A title\nslug: ${slug}\ntranslationKey: article\nexcerpt: A useful excerpt.\ndate: 2026-09-01\ntags: [seo]\nlocale: ${locale}\n---\n\n${body}\n`

test("publishes exact localized slugs and links translations", () => {
  const index = createBlogIndex([
    { filename: "article.pt.mdx", source: source("pt", "artigo") },
    { filename: "article.en.mdx", source: source("en", "article") },
  ], { now: new Date("2026-09-24T12:00:00Z") })
  assert.equal(index.getPostBySlug("article")?.locale, "en")
  assert.equal(index.getPostBySlug("artigo")?.locale, "pt")
  assert.deepEqual(index.getPostTranslations(index.getPostBySlug("article")!).map(post => post.locale), ["en", "pt"])
})

test("does not publish drafts or future posts", () => {
  const index = createBlogIndex([
    { filename: "draft.pt.mdx", source: source("pt", "draft").replace("locale: pt", "locale: pt\ndraft: true") },
    { filename: "future.pt.mdx", source: source("pt", "future").replace("translationKey: article", "translationKey: future").replace("date: 2026-09-01", "date: 2026-10-01") },
  ], { now: new Date("2026-09-24T12:00:00Z") })
  assert.equal(index.getAllPosts().length, 0)
})

test("rejects invalid SEO content before publishing", () => {
  assert.throws(() => createBlogIndex([{ filename: "bad.pt.mdx", source: source("pt", "Bad slug", "# Duplicate title") }]), /slug|H1/i)
})
