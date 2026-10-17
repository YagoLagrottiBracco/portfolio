import assert from "node:assert/strict"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { Window } from "happy-dom"
import {
  contributionTasks,
  getContributionTasks,
} from "../src/data/resources/contribution-tasks"
import { ContributionTasks } from "../src/components/resources/ContributionTasks"

const projectSlugs = [
  "devagent", "envrune", "dreamerz", "meu-mundo-mental", "congresso", "tripsync",
] as const

test("each public project offers a scoped proposal with pinned evidence and actionable steps", () => {
  assert.equal(new Set(contributionTasks.map((task) => task.id)).size, contributionTasks.length)
  for (const slug of projectSlugs) {
    const tasks = getContributionTasks(slug)
    assert.ok(tasks.length > 0, slug)
    for (const task of tasks) {
      assert.equal(task.projectSlug, slug)
      assert.ok(task.skills.length > 0)
      assert.ok(["S", "M"].includes(task.size))
      assert.ok(task.sources.some((source) => source.role === "target"))
      assert.ok(task.acceptanceCriteria.length >= 3)
      for (const source of task.sources) {
        assert.match(source.commit, /^[a-f0-9]{40}$/)
        const url = new URL(source.url)
        assert.equal(url.origin, "https://github.com")
        assert.equal(url.pathname, `/${source.repository}/blob/${source.commit}/${source.path}`)
        assert.ok(source.startLine > 0)
      }
      for (const locale of ["pt", "en", "es"] as const) {
        assert.ok(task.title[locale].trim().length > 10)
        assert.ok(task.evidence[locale].trim().length > 60)
        assert.ok(task.estimate[locale].trim())
        for (const step of task.acceptanceCriteria) assert.ok(step[locale].trim().length > 20)
      }
    }
  }
  assert.deepEqual(getContributionTasks("unknown-project"), [])
})

test("draft links carry the selected language, evidence and checkable steps without claiming an existing issue", () => {
  for (const task of contributionTasks) {
    for (const locale of ["pt", "en", "es"] as const) {
      const url = new URL(task.issueDraftUrls[locale])
      assert.equal(url.origin, "https://github.com")
      assert.equal(url.pathname, `/${task.repository}/issues/new`)
      assert.equal(url.searchParams.get("title"), task.title[locale])
      assert.equal(url.searchParams.has("labels"), false)
      const body = url.searchParams.get("body") ?? ""
      assert.ok(body.includes(task.evidence[locale]))
      for (const source of task.sources) assert.ok(body.includes(source.url))
      for (const step of task.acceptanceCriteria) assert.ok(body.includes(`- [ ] ${step[locale]}`))
      assert.match(body, /2026-10-17/)
    }
  }
})

test("localized cards expose source evidence, ordered criteria and a visitor-activated draft link", () => {
  const heading = { pt: "Tarefas de contribuição", en: "Contribution tasks", es: "Tareas de contribución" }
  const window = new Window()
  try {
    for (const locale of ["pt", "en", "es"] as const) {
      window.document.body.innerHTML = renderToStaticMarkup(createElement(ContributionTasks, { projectSlug: "envrune", locale }))
      assert.equal(window.document.querySelector("h2")?.textContent, heading[locale])
      const task = getContributionTasks("envrune")[0]
      assert.equal(window.document.querySelector("h3")?.textContent, task.title[locale])
      assert.equal(window.document.querySelectorAll("ol li").length, task.acceptanceCriteria.length)
      const links = [...window.document.querySelectorAll("a")]
      assert.ok(links.some((link) => link.href === task.sources[0].url))
      assert.ok(links.some((link) => link.href === task.issueDraftUrls[locale]))
      assert.equal(window.document.querySelectorAll("form, iframe, script").length, 0)
    }
    assert.equal(renderToStaticMarkup(createElement(ContributionTasks, { projectSlug: "unknown-project", locale: "en" })), "")
  } finally {
    window.close()
  }
})
