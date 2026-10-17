import assert from "node:assert/strict"
import test from "node:test"
import type { BlogPost } from "../src/lib/blog-content"
import { absolutizeMarkdown, devtoArticle, devtoTags } from "../src/lib/crosspost"
import { changedSince, indexNowPayload, isIndexNowKey, parseSitemap } from "../src/lib/indexnow"

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://lagrotti.dev</loc></url>
<url><loc>https://lagrotti.dev/blog/novo</loc><lastmod>2026-10-16T00:00:00.000Z</lastmod></url>
<url><loc>https://lagrotti.dev/blog/antigo</loc><lastmod>2026-01-01T00:00:00.000Z</lastmod></url>
</urlset>`

test("finds the pages that changed since a date, ignoring undated ones", () => {
  const entries = parseSitemap(sitemap)
  assert.equal(entries.length, 3)
  assert.deepEqual(changedSince(entries, new Date("2026-10-14T00:00:00Z")), ["https://lagrotti.dev/blog/novo"])
})

test("builds the IndexNow payload for this host only", () => {
  assert.equal(isIndexNowKey("abc"), false)
  assert.equal(isIndexNowKey("0123456789abcdef0123456789abcdef"), true)
  assert.deepEqual(indexNowPayload({ siteUrl: "https://lagrotti.dev", key: "0123456789abcdef", urls: ["https://lagrotti.dev/blog/novo", "https://evil.example/x"] }), {
    host: "lagrotti.dev",
    key: "0123456789abcdef",
    keyLocation: "https://lagrotti.dev/indexnow-key.txt",
    urlList: ["https://lagrotti.dev/blog/novo"],
  })
})

const post: BlogPost = {
  translationKey: "kafka-key", title: "Kafka & ClickHouse", slug: "kafka", excerpt: "Resumo", date: "2026-09-01",
  tags: ["next.js", "Arquitetura", "kafka", "next-js", "ia", "extra"], locale: "pt", url: "/blog/kafka", readingMinutes: 5,
  content: "## Seção\n\nVeja [o estudo](/projetos/vmageste) e ![diagrama](/blog/d.png) e [fora](https://example.com/a) e [protocolo](//cdn.example/x).",
  image: { src: "/blog/kafka.png", alt: "Capa", width: 1200, height: 630 },
}

test("dev.to gets at most four plain tags", () => {
  assert.deepEqual(devtoTags(post.tags), ["nextjs", "arquitetura", "kafka", "ia"])
})

test("only site-relative links become absolute", () => {
  assert.equal(
    absolutizeMarkdown(post.content, "https://lagrotti.dev"),
    "## Seção\n\nVeja [o estudo](https://lagrotti.dev/projetos/vmageste) e ![diagrama](https://lagrotti.dev/blog/d.png) e [fora](https://example.com/a) e [protocolo](//cdn.example/x).",
  )
})

test("the dev.to draft credits the original and links back with UTMs", () => {
  const article = devtoArticle(post, "https://lagrotti.dev", "some_ai")
  assert.equal(article.published, false)
  assert.equal(article.canonical_url, "https://lagrotti.dev/blog/kafka")
  assert.equal(article.main_image, "https://lagrotti.dev/blog/kafka.png")
  assert.equal(article.ai_disclosure_level, "some_ai")
  assert.match(article.body_markdown, /\*Publicado originalmente em \[lagrotti\.dev\]\(https:\/\/lagrotti\.dev\/blog\/kafka\?utm_source=devto&utm_medium=crosspost&utm_campaign=kafka-key\)\.\*\n$/)
})
