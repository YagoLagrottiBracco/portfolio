import assert from "node:assert/strict"
import test from "node:test"
import { buildCitation } from "../src/lib/resource-citation"
import {
  buildResourceCatalogue,
  getStudioResourceOptions,
  resourceCatalogueSchema,
} from "../src/lib/resource-catalogue-api"
import { collectionMarkdown } from "../src/lib/resource-studio"
import {
  buildResourceCard,
  getShortDestination,
  shortResourceLinks,
  buildResourceFeed,
} from "../src/lib/resource-discovery"
import { getBlogBlockAnchors } from "../src/lib/blog-block-anchors"

test("citations retain actual source/version and escape BibTeX fields", () => {
  const result = buildCitation({
    id: "worker",
    title: "A {worker} & 10% #test",
    author: "Yago Lagrotti Bracco",
    url: "https://lagrotti.dev/recursos/templates/worker",
    publishedAt: "2026-10-17",
    version: "1.0.0",
    kind: "software",
  })
  assert.match(result.text, /1\.0\.0/)
  assert.match(result.bibtex, /\\\{worker\\\}/)
  assert.match(result.bibtex, /\\&/)
  assert.match(result.bibtex, /year = \{2026\}/)
  assert.ok(
    result.bibtex.includes("https://lagrotti.dev/recursos/templates/worker")
  )
  assert.throws(() =>
    buildCitation({
      id: "x",
      title: "x",
      author: "x",
      url: "javascript:alert(1)",
      kind: "resource",
    })
  )
})

test("public catalogue validates filters and serves actual localized public resources", () => {
  const catalogue = buildResourceCatalogue(
    new URLSearchParams("locale=en&section=templates")
  )
  assert.equal(catalogue.locale, "en")
  assert.ok(catalogue.resources.length >= 2)
  assert.ok(
    catalogue.resources.every(
      (item) =>
        item.section === "templates" &&
        item.url.startsWith("https://lagrotti.dev/en/recursos/")
    )
  )
  assert.equal(
    new Set(catalogue.resources.map((item) => item.id)).size,
    catalogue.resources.length
  )
  assert.ok(!JSON.stringify(catalogue).includes("extraFrontmatter"))
  assert.equal(resourceCatalogueSchema.type, "object")
  assert.throws(() => buildResourceCatalogue(new URLSearchParams("locale=xx")))
  assert.throws(() =>
    buildResourceCatalogue(new URLSearchParams("section=private"))
  )
  assert.throws(() =>
    buildResourceCatalogue(new URLSearchParams("locale=en&locale=pt"))
  )
})

test("catalogue adapter supplies studio links that export canonical collection Markdown", () => {
  for (const locale of ["pt", "en", "es"]) {
    const resources = getStudioResourceOptions(new URLSearchParams({ locale }))
    const markdown = collectionMarkdown(
      { name: "Actual catalogue", ids: ["ferramentas/json"] },
      resources
    )
    assert.ok(
      markdown.includes(
        `https://lagrotti.dev${locale === "pt" ? "" : `/${locale}`}/recursos/ferramentas/json`
      )
    )
  }
})

test("README SVG cards resolve real localized resources and contain safe text only", () => {
  const svg = buildResourceCard("ferramentas/json", "es")
  assert.match(svg, /<svg/)
  assert.match(svg, /lagrotti\.dev/)
  assert.ok(!svg.includes("<script"))
  assert.ok(!svg.includes("<foreignObject"))
  assert.throws(() => buildResourceCard("<script>/bad", "pt"))
  assert.throws(() => buildResourceCard("ferramentas/nonexistent", "pt"))
})

test("short redirects are allowlisted, localized and preserve attribution", () => {
  for (const item of shortResourceLinks) {
    const url = new URL(getShortDestination(item.code, "es"))
    assert.equal(url.origin, "https://lagrotti.dev")
    assert.ok(url.pathname.startsWith("/es/recursos/"))
    assert.equal(url.searchParams.get("utm_source"), "qr")
    assert.equal(url.searchParams.get("utm_medium"), "offline")
    assert.equal(url.searchParams.get("utm_content"), item.code)
  }
  assert.throws(() => getShortDestination("https://evil.example/", "pt"))
})

test("resource RSS has versioned GUIDs, real filtered URLs and strict filters", () => {
  const feed = buildResourceFeed("pt", "templates/worker")
  assert.equal((feed.match(/<item>/g) || []).length, 1)
  assert.ok(feed.includes("templates/worker"))
  assert.ok(feed.includes("1.0.0"))
  assert.ok(feed.includes("application/rss+xml"))
  assert.throws(() => buildResourceFeed("pt", "unknown/resource"))
})

test("block anchors survive unrelated insertions and disambiguate repeated content", () => {
  const first = getBlogBlockAnchors(
    "## Heading\n\nA stable paragraph.\n\n```ts\nconst x = 1\n```\n\nA stable paragraph."
  )
  const inserted = getBlogBlockAnchors(
    "## New heading\n\nNew text.\n\n## Heading\n\nA stable paragraph.\n\n```ts\nconst x = 1\n```\n\nA stable paragraph."
  )
  assert.equal(first.length, 3)
  assert.equal(first[0].id, inserted[1].id)
  assert.notEqual(first[0].id, first[2].id)
  assert.equal(first[1].kind, "code")
  assert.ok(
    first.every((item) => /^(p|code)-[a-f0-9]{8}(?:-\d+)?$/.test(item.id))
  )
})
