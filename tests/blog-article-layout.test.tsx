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
    { slug: "covered", url: "/blog/covered", title: "Covered", excerpt: "A", date: "2026-09-24", dateLabel: "24/09/2026", tags: ["a"], image: { src: "/cover.webp", alt: "Cover", width: 1200, height: 630 }, searchText: "covered a" },
    { slug: "plain", url: "/blog/plain", title: "Plain", excerpt: "B", date: "2026-09-24", dateLabel: "24/09/2026", tags: ["b"], searchText: "plain b" },
  ]} filterTags={[]} copy={{ read: "Ler", all: "Todos", filterLabel: "Filtrar", clear: "Limpar", search: "Buscar", searchPlaceholder: "Buscar", results: "{count}", noResults: "Nada para {query}", reset: "Limpar" }} />)

  // Local covers go through the image optimizer.
  assert.match(html, /src="\/_next\/image\?url=%2Fcover\.webp/)
  assert.match(html, /alt="Cover"/)
  assert.match(html, /href="\/blog\/plain"/)
  assert.match(html, />Plain<\/a>/)
})

test("only the public page adds sharing, the contact invitation and related reading", () => {
  const preview = renderToStaticMarkup(<BlogArticle post={post} translations={[post]} />)
  assert.doesNotMatch(preview, /share-title|article-cta-title|related-title|newsletter/)

  const html = renderToStaticMarkup(<BlogArticle post={post} translations={[post]} extras={{
    url: "https://lagrotti.dev/blog/article",
    related: [{ url: "/blog/other", title: "Other", excerpt: "More", date: "2026-09-01", dateLabel: "1 de setembro de 2026", readingMinutes: 3 }],
    caseStudy: { title: "EnvRune", url: "/projetos/envrune" },
    newsletter: true,
  }} />)
  assert.match(html, /linkedin\.com\/sharing\/share-offsite\/\?url=https%3A%2F%2Flagrotti\.dev%2Fblog%2Farticle%3Futm_source%3Dlinkedin/)
  assert.match(html, /href="\/projetos\/envrune"/)
  assert.match(html, /href="\/blog\/other"/)
  assert.match(html, /action="\/api\/newsletter"/)
  assert.match(html, /id="article-body"/)
})
