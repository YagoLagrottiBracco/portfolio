import assert from "node:assert/strict"
import test from "node:test"
import { parsePublishRequest, preparePublication } from "../src/lib/blog-publishing"

const article = (locale: "pt" | "en" | "es", slug: string) => ({
  title: `Title ${locale}`,
  slug,
  excerpt: `Excerpt ${locale}`,
  date: "2026-09-24",
  tags: ["seo"],
  content: "## Article\n\nUseful content.",
})

const payload = (image?: unknown) => ({
  translationKey: "article",
  articles: {
    pt: article("pt", "artigo"),
    en: article("en", "article"),
    es: article("es", "articulo"),
  },
  ...(image === undefined ? {} : { image }),
})

test("requires exactly pt, en, and es article bodies", () => {
  assert.throws(() => parsePublishRequest({ translationKey: "article", articles: { pt: article("pt", "artigo") } }), /pt, en, and es/i)
})

test("serializes three MDX files with an HTTPS image", () => {
  const publication = preparePublication(parsePublishRequest(payload({
    kind: "remote",
    url: "https://images.example.com/cover.webp",
    alt: "Cover",
    width: 1200,
    height: 630,
  })))
  assert.deepEqual(publication.files.map(file => file.path), [
    "src/content/blog/artigo.pt.mdx",
    "src/content/blog/article.en.mdx",
    "src/content/blog/articulo.es.mdx",
  ])
  assert.match(String(publication.files[0].content), /url: .+https:\/\/images.example.com\/cover.webp/)
})

test("stores a valid uploaded image below public/blog", () => {
  const publication = preparePublication(parsePublishRequest(payload({
    kind: "upload",
    filename: "cover.png",
    contentType: "image/png",
    base64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aJb8AAAAASUVORK5CYII=",
    alt: "Cover",
    width: 1,
    height: 1,
  })))
  assert.match(publication.files.at(-1)!.path, /^public\/blog\/article-[a-f0-9]{12}\.png$/)
})

test("rejects unsafe images and invalid SEO bodies", () => {
  assert.throws(() => parsePublishRequest(payload({ kind: "remote", url: "http://images.example.com/cover.webp", alt: "Cover", width: 1, height: 1 })), /HTTPS/)
  assert.throws(() => preparePublication(parsePublishRequest({
    ...payload(),
    articles: { pt: { ...article("pt", "artigo"), content: "# Duplicate" }, en: article("en", "article"), es: article("es", "articulo") },
  })), /H1/)
})