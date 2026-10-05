import assert from "node:assert/strict"
import test from "node:test"
import { getCaseStudyAlternates } from "../src/lib/case-study-metadata"
import { getCaseStudyPath, parseCaseStudyPath } from "../src/lib/case-study-routes"

test("serves Portuguese case studies unprefixed and other locales under their prefix", () => {
  assert.equal(getCaseStudyPath("pt", "envrune"), "/projetos/envrune")
  assert.equal(getCaseStudyPath("en", "envrune"), "/en/projetos/envrune")
  assert.equal(getCaseStudyPath("es", "dupla-face"), "/es/projetos/dupla-face")
})

test("reads the locale and slug back from a case study path", () => {
  assert.deepEqual(parseCaseStudyPath("/projetos/envrune"), { locale: "pt", slug: "envrune" })
  assert.deepEqual(parseCaseStudyPath("/en/projetos/dupla-face/"), { locale: "en", slug: "dupla-face" })
  assert.deepEqual(parseCaseStudyPath("/es/projetos/vmageste"), { locale: "es", slug: "vmageste" })
})

test("ignores paths that are not case studies", () => {
  for (const path of ["/", "/blog", "/en/blog", "/projetos", "/fr/projetos/envrune", "/en/projetos/envrune/extra", "/blog/projetos/envrune"]) {
    assert.equal(parseCaseStudyPath(path), null, path)
  }
})

test("lists every language of a case study with Portuguese as the default", () => {
  assert.deepEqual(getCaseStudyAlternates("envrune"), {
    "pt-BR": "/projetos/envrune",
    "en-US": "/en/projetos/envrune",
    es: "/es/projetos/envrune",
    "x-default": "/projetos/envrune",
  })
})
