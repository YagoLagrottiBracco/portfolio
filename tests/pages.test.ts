import assert from "node:assert/strict"
import test from "node:test"
import { personalData } from "../src/data/personal"
import { privacy } from "../src/data/privacy"
import { workWithMe } from "../src/data/work-with-me"
import { locales } from "../src/lib/i18n"
import { getLocalizedPath, getRouteLocale } from "../src/lib/locale-routes"
import { getPagePath, parsePagePath } from "../src/lib/page-routes"
import { getCaseStudyProjects } from "../src/lib/projects"

test("standalone pages keep their Portuguese segment in every language", () => {
  assert.equal(getPagePath("pt", "trabalhe-comigo"), "/trabalhe-comigo")
  assert.equal(getPagePath("en", "privacidade"), "/en/privacidade")
  assert.deepEqual(parsePagePath("/es/trabalhe-comigo/"), { locale: "es", page: "trabalhe-comigo" })
  assert.deepEqual(parsePagePath("/privacidade"), { locale: "pt", page: "privacidade" })
  for (const path of ["/blog", "/en/blog", "/fr/privacidade", "/privacidade/extra", "/trabalhe"]) assert.equal(parsePagePath(path), null, path)
})

test("the language switcher and the route locale know the new pages", () => {
  assert.equal(getRouteLocale("/trabalhe-comigo"), "pt")
  assert.equal(getRouteLocale("/en/privacidade"), "en")
  assert.equal(getLocalizedPath("/es/trabalhe-comigo", "en"), "/en/trabalhe-comigo")
  assert.equal(getLocalizedPath("/en/privacidade", "pt"), "/privacidade")
})

/** Every string in a nested structure that is keyed by locale. */
function localizedStrings(value: unknown, path = "root"): { path: string; text: Record<string, unknown> }[] {
  if (!value || typeof value !== "object") return []
  const record = value as Record<string, unknown>
  if (locales.every((locale) => locale in record)) return [{ path, text: record }]
  return Object.entries(record).flatMap(([key, child]) => localizedStrings(child, `${path}.${key}`))
}

test("the new pages have every text in all three languages", () => {
  for (const [name, data] of [["workWithMe", workWithMe], ["privacy", privacy]] as const) {
    const entries = localizedStrings(data, name)
    assert.ok(entries.length > 10, name)
    for (const { path, text } of entries) {
      for (const locale of locales) {
        const value = text[locale]
        const filled = typeof value === "string" ? value.trim().length > 0 : value && typeof value === "object"
        assert.ok(filled, `${path}.${locale}`)
      }
    }
  }
})

test("testimonials point only at projects that exist", () => {
  const slugs = new Set(getCaseStudyProjects().map((project) => project.slug))
  for (const item of personalData.testimonials) {
    if (item.project) assert.ok(slugs.has(item.project), `${item.author}: ${item.project}`)
    for (const locale of locales) assert.ok(item.quote[locale].trim(), `${item.author}: quote.${locale}`)
  }
})

test("every availability status has its text in all languages", async () => {
  const { availabilityLabel } = await import("../src/lib/availability")
  for (const [status, text] of Object.entries(availabilityLabel)) {
    for (const locale of locales) assert.ok(text[locale].trim(), `${status}.${locale}`)
  }
  assert.ok(Object.keys(availabilityLabel).includes(personalData.availability.status))
  assert.ok(!Number.isNaN(Date.parse(personalData.availability.updatedAt)))
})

test("screening answers exist in all languages, or not at all", async () => {
  const { screening } = await import("../src/data/screening")
  assert.equal(new Set(screening.map((item) => item.id)).size, screening.length)
  for (const item of screening) {
    for (const locale of locales) {
      assert.ok(item.question[locale].trim(), `${item.id}: question.${locale}`)
      if (item.answer) assert.ok(item.answer[locale].trim(), `${item.id}: answer.${locale}`)
    }
  }
})

test("a case study becomes slides in reading order, one per section", async () => {
  const { buildSlides, parsePresentationPath, getPresentationPath } = await import("../src/lib/presentation")
  const { getCaseStudyBySlug } = await import("../src/lib/projects")
  const project = getCaseStudyBySlug("vmageste")!
  const slides = buildSlides(project, "en")
  assert.deepEqual(slides.slice(0, 4).map((slide) => slide.kind), ["cover", "text", "text", "text"])
  assert.equal(slides[0].kind === "cover" && slides[0].title, project.title.en)
  assert.equal(slides.at(-1)?.kind, "contact")
  const points = slides.filter((slide) => slide.kind === "points")
  assert.equal(points.reduce((total, slide) => total + (slide.kind === "points" ? slide.points.length : 0), 0), project.caseStudy.highlights.length)
  for (const slide of points) assert.ok(slide.kind === "points" && slide.points.length <= 3)
  assert.equal(getPresentationPath("es", "vmageste"), "/es/projetos/vmageste/apresentar")
  assert.deepEqual(parsePresentationPath("/projetos/vmageste/apresentar"), { locale: "pt", slug: "vmageste" })
  assert.equal(getRouteLocale("/en/projetos/vmageste/apresentar"), "en")
})
