import assert from "node:assert/strict"
import test from "node:test"
import {
  getResourcePath,
  parseResourcePath,
  getEmbedPath,
} from "../src/lib/resource-routes"
import {
  resourceSections,
  getResourceEntries,
} from "../src/lib/resource-catalog"
import { getLocalizedPath, getRouteLocale } from "../src/lib/locale-routes"

test("resource and embed routes preserve identity when switching language", () => {
  assert.equal(
    getResourcePath("en", "guias", "filas"),
    "/en/recursos/guias/filas"
  )
  assert.deepEqual(parseResourcePath("/es/recursos/guias/filas/"), {
    locale: "es",
    section: "guias",
    slug: "filas",
  })
  assert.equal(
    getLocalizedPath("/recursos/guias/filas", "es"),
    "/es/recursos/guias/filas"
  )
  assert.equal(getRouteLocale("/recursos/ferramentas"), "pt")
  assert.equal(getEmbedPath("en", "json"), "/en/incorporar/json")
  assert.equal(
    getLocalizedPath("/incorporar/json", "es"),
    "/es/incorporar/json"
  )
  for (const path of [
    "/fr/recursos",
    "/recursos/a/b/c",
    "/recursosx",
    "/en/recursos/../secret",
  ])
    assert.equal(parseResourcePath(path), null)
})

test("every collection has concrete localized content and unique entry slugs", () => {
  assert.equal(resourceSections.length, 21)
  assert.equal(getResourceEntries("ecossistema").length, 20)
  assert.equal(
    new Set(resourceSections.map((s) => s.slug)).size,
    resourceSections.length
  )
  for (const section of resourceSections) {
    const entries = getResourceEntries(section.slug)
    assert.ok(entries.length > 0, section.slug)
    assert.equal(
      new Set(entries.map((entry) => entry.slug)).size,
      entries.length
    )
    for (const locale of ["pt", "en", "es"] as const) {
      assert.ok(section.title[locale].length > 3)
      for (const entry of entries) {
        assert.ok(entry.title[locale].length > 2)
        assert.ok(entry.description[locale].length > 20)
      }
    }
  }
})

test("invalid resource metadata does not throw before the page can return 404", async () => {
  const { buildResourceMetadata } = await import("../src/lib/resource-metadata")
  assert.doesNotThrow(() => buildResourceMetadata("en", "bad/segment"))
  assert.doesNotThrow(() =>
    buildResourceMetadata("es", "guias", "unknown/slug")
  )
})

test("public code catalog excludes repository links that were inaccessible anonymously", () => {
  const entries = getResourceEntries("repositorios")
  assert.equal(entries.length, 6)
  assert.ok(
    !entries.some((entry) =>
      ["techworky-digital", "templates-web-mobile"].includes(entry.slug)
    )
  )
  for (const entry of entries)
    assert.ok(entry.source?.startsWith("https://github.com/"))
})
