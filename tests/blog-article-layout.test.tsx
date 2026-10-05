import assert from "node:assert/strict"
import test from "node:test"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { BlogArticle } from "../src/components/blog/BlogArticle"
import { BlogPostList } from "../src/components/blog/BlogPostList"
import type { BlogPost } from "../src/lib/blog-content"

const post: BlogPost = {
  translationKey: "article", title: "A useful article", slug: "article", excerpt: "Summary",
  date: "2026-09-24", tags: ["architecture"], locale: "pt",
  content: "## API\n\nUseful text.\n\n### Details\n\nMore text.",
  url: "/blog/article", readingMinutes: 2,
}

test("article shows one title, outline anchors and reading details", () => {
  const html = renderToStaticMarkup(<BlogArticle post={post} translations={[post]} />)
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1)
  assert.match(html, /href="#api"/)
  assert.match(html, /href="#details"/)
  assert.match(html, /2 min/)
  assert.doesNotMatch(html, /<figcaption[^>]*>\s*<\/figcaption>/)
})

test("cards with or without a cover remain linked and readable", () => {
  const html = renderToStaticMarkup(<BlogPostList posts={[
    { slug: "covered", url: "/blog/covered", title: "Covered", excerpt: "A", date: "2026-09-24", dateLabel: "24/09/2026", tags: ["a"], image: { src: "/cover.webp", alt: "Cover", width: 1200, height: 630 } },
    { slug: "plain", url: "/blog/plain", title: "Plain", excerpt: "B", date: "2026-09-24", dateLabel: "24/09/2026", tags: ["b"] },
  ]} filterTags={[]} copy={{ read: "Ler", all: "Todos", filterLabel: "Filtrar", clear: "Limpar" }} />)

  assert.match(html, /src="\/cover.webp"/)
  assert.match(html, /alt="Cover"/)
  assert.match(html, /href="\/blog\/plain"/)
  assert.match(html, />Plain<\/a>/)
})
