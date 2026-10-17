import assert from "node:assert/strict"
import test from "node:test"
import { buildSearchText } from "../src/lib/blog-search"
import { rankSearch, type SearchItem } from "../src/lib/site-search"

const item = (kind: SearchItem["kind"], title: string, description = "", keywords: string[] = []): SearchItem => ({ kind, title, description, url: `/${title}`, text: buildSearchText([title, description, ...keywords]) })

test("needs every word, ignores accents and ranks title matches first", () => {
  const items = [
    item("article", "Como escalei eventos", "Kafka e ClickHouse em produção"),
    item("stack", "Apache Kafka", "1 projeto · 1 artigo", ["kafka"]),
    item("case", "VMageste", "~3 milhões de eventos por dia", ["Apache Kafka", "ClickHouse"]),
    item("resource", "Guia de filas", "Quando usar uma fila"),
  ]
  assert.deepEqual(rankSearch(items, "kafka").map((result) => result.title), ["Apache Kafka", "VMageste", "Como escalei eventos"])
  assert.deepEqual(rankSearch(items, "PRODUÇÃO kafka").map((result) => result.title), ["Como escalei eventos"])
  assert.deepEqual(rankSearch(items, "  "), [])
  assert.equal(rankSearch(items, "a", 2).length, 2)
})

test("a special character in the query is searched literally", () => {
  assert.deepEqual(rankSearch([item("stack", "C++ (linguagem)")], "c++").map((result) => result.title), ["C++ (linguagem)"])
})

test("all 21 portfolio projects (featured case studies and grid projects) are indexed in every language", async () => {
  const { projectsData } = await import("../src/data/projects-data")
  const { locales } = await import("../src/lib/i18n")
  const { getHomePath } = await import("../src/lib/locale-routes")
  const { getCaseStudyPath } = await import("../src/lib/case-study-routes")
  const { getCaseStudyProjects } = await import("../src/lib/projects")

  const caseStudySlugs = new Set(getCaseStudyProjects().map((p) => p.slug))
  assert.equal(projectsData.length, 21)
  assert.equal(caseStudySlugs.size, 10)

  for (const locale of locales) {
    const projectItems: SearchItem[] = projectsData.map((project) => ({
      ...item(
        "case",
        project.title[locale],
        project.tagline[locale],
        [project.description[locale], project.slug, ...project.techStack]
      ),
      url: caseStudySlugs.has(project.slug) ? getCaseStudyPath(locale, project.slug) : `${getHomePath(locale)}#projects`,
    }))
    const normify = rankSearch(projectItems, "normify").find((entry) => entry.title.startsWith("Normify"))
    assert.ok(normify)
    assert.equal(normify.url, `${getHomePath(locale)}#projects`)
    assert.ok(rankSearch(projectItems, "tripsync").some((entry) => entry.title.startsWith("TripSync")))
    const vmageste = rankSearch(projectItems, "vmageste").find((entry) => entry.url === getCaseStudyPath(locale, "vmageste"))
    assert.ok(vmageste)
  }
})



