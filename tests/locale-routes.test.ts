import assert from "node:assert/strict"
import test from "node:test"
import { negotiateLocale } from "../src/lib/locale-negotiation"
import { getHomePath, getLocalizedPath, getRouteLocale, isHomePath } from "../src/lib/locale-routes"

test("reads the language a URL is written in", () => {
  assert.equal(getRouteLocale("/"), "pt")
  assert.equal(getRouteLocale("/en"), "en")
  assert.equal(getRouteLocale("/es/"), "es")
  assert.equal(getRouteLocale("/projetos/envrune"), "pt")
  assert.equal(getRouteLocale("/en/projetos/envrune"), "en")
  assert.equal(getRouteLocale("/blog"), "pt")
  assert.equal(getRouteLocale("/es/blog"), "es")
})

test("leaves the language open where the path does not say", () => {
  for (const path of ["/blog/some-article", "/energia", "/escola/2026", "/cv/en", "/not-a-page"]) {
    assert.equal(getRouteLocale(path), undefined, path)
  }
})

test("recognises the three homepages and nothing else", () => {
  for (const path of ["/", "/en", "/en/", "/es"]) assert.equal(isHomePath(path), true, path)
  for (const path of ["/pt", "/fr", "/en/blog", "/blog", "/english"]) assert.equal(isHomePath(path), false, path)
  assert.equal(getHomePath("pt"), "/")
  assert.equal(getHomePath("es"), "/es")
})

test("finds the same page in another language", () => {
  assert.equal(getLocalizedPath("/", "en"), "/en")
  assert.equal(getLocalizedPath("/en", "pt"), "/")
  assert.equal(getLocalizedPath("/es/projetos/vmageste", "en"), "/en/projetos/vmageste")
  assert.equal(getLocalizedPath("/projetos/vmageste", "pt"), "/projetos/vmageste")
  assert.equal(getLocalizedPath("/en/blog", "es"), "/es/blog")
  assert.equal(getLocalizedPath("/blog", "en"), "/en/blog")
  assert.equal(getLocalizedPath("/blog/some-article", "en"), null)
})

test("an explicit choice beats the browser language", () => {
  assert.equal(negotiateLocale("pt", "en-US,en;q=0.9"), "pt")
  assert.equal(negotiateLocale("es", null), "es")
  assert.equal(negotiateLocale("fr", "en-US"), "en")
})

test("follows the browser's languages in order of preference", () => {
  assert.equal(negotiateLocale(undefined, "en-US,en;q=0.9,pt;q=0.8"), "en")
  assert.equal(negotiateLocale(undefined, "pt-BR,pt;q=0.9,en;q=0.8"), "pt")
  assert.equal(negotiateLocale(undefined, "fr-FR,es-MX;q=0.7,en;q=0.9"), "en")
  assert.equal(negotiateLocale(undefined, "de;q=0.9, es-ES"), "es")
  assert.equal(negotiateLocale(undefined, "en;q=0, pt;q=0.5"), "pt")
})

test("serves Portuguese to requests that state no language, as crawlers do", () => {
  assert.equal(negotiateLocale(undefined, null), "pt")
  assert.equal(negotiateLocale(undefined, ""), "pt")
  assert.equal(negotiateLocale(undefined, "*"), "pt")
})

test("falls back to English for visitors whose languages are all unsupported", () => {
  assert.equal(negotiateLocale(undefined, "fr-FR,fr;q=0.9,de;q=0.8"), "en")
})
