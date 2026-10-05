import assert from "node:assert/strict"
import test from "node:test"
import { prepareAdminSave } from "../src/lib/blog-admin-save"
import type { BlogAdminBundle } from "../src/lib/blog-admin-document"

const articles = {
  pt: { title: "Título", slug: "artigo", excerpt: "Resumo", date: "2026-01-01", tags: ["blog"], content: "## Introdução\n\nTexto" },
  en: { title: "Title", slug: "article", excerpt: "Summary", date: "2026-01-01", tags: ["blog"], content: "## Introduction\n\nText" },
  es: { title: "Título", slug: "articulo", excerpt: "Resumen", date: "2026-01-01", tags: ["blog"], content: "## Introducción\n\nTexto" },
}

test("saves three locales atomically, preserving unknown fields and blob versions", async () => {
  const existing: BlogAdminBundle = { translationKey: "key", image: { src: "https://example.com/cover.png", alt: "Cover", width: 10, height: 10 }, articles: { pt: { ...articles.pt, locale: "pt", draft: true, sourcePath: "src/content/blog/artigo.pt.mdx", blobSha: "old-sha", extraFrontmatter: { editorialNote: "retain" }, imageFrontmatter: { url: "https://example.com/cover.png", alt: "Cover", width: 10, height: 10, credit: "Keep credit" } } } }
  const result = await prepareAdminSave({ translationKey: "key", articles, publish: false }, existing, [])
  assert.equal(result.files.filter(file => file.path.endsWith(".mdx")).length, 3)
  assert.equal(result.expectedBlobs["src/content/blog/artigo.pt.mdx"], "old-sha")
  assert.match(String(result.files[0].content), /editorialNote: retain/)
  assert.match(String(result.files[0].content), /credit: Keep credit/)
})

test("locks published slugs and rejects duplicates", async () => {
  const existing: BlogAdminBundle = { translationKey: "key", articles: { pt: { ...articles.pt, locale: "pt", draft: false, sourcePath: "src/content/blog/artigo.pt.mdx", blobSha: "old", extraFrontmatter: {} } } }
  await assert.rejects(prepareAdminSave({ translationKey: "key", articles: { ...articles, pt: { ...articles.pt, slug: "new" } }, publish: true }, existing, []), /published slug/i)
  await assert.rejects(prepareAdminSave({ translationKey: "key", articles, publish: true }, null, ["article"]), /duplicate slug/i)
  await assert.rejects(prepareAdminSave({ translationKey: "key", articles, publish: false }, existing, []), /published article/i)
})
