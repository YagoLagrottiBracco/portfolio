import assert from "node:assert/strict"
import test from "node:test"
import { act, createElement } from "react"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { Window } from "happy-dom"

import {
  isSafeProjectDemoUrl,
  projectDemos,
  type ProjectDemo,
} from "../src/data/resources/project-demos"
import { LiveProjectDemo } from "../src/components/resources/LiveProjectDemo"
import { personalData } from "../src/data/personal"

// Catches a demo that points at a fabricated or unrelated product instead of a
// public experience belonging to the project recorded in the portfolio.
test("live demos retain product provenance and complete localized guidance", () => {
  assert.ok(projectDemos.length >= 2)
  assert.equal(new Set(projectDemos.map((demo) => demo.slug)).size, projectDemos.length)
  for (const demo of projectDemos) {
    const project = personalData.projects.find((entry) => entry.slug === demo.projectSlug)
    assert.ok(project, demo.projectSlug)
    assert.ok(project.links.some((link) => new URL(link.url).origin === new URL(demo.url).origin))
    assert.ok(demo.productName.length > 3)
    assert.match(demo.checkedAt, /^\d{4}-\d{2}-\d{2}$/)
    assert.equal(isSafeProjectDemoUrl(demo.url), true)
    assert.equal(demo.embeddingSupported, true)
    for (const locale of ["pt", "en", "es"] as const) {
      assert.ok(demo.title[locale].length > 8)
      assert.ok(demo.description[locale].length > 35)
      assert.ok(demo.instructions[locale].length > 35)
    }
  }
})

// Catches protocol, credential, host-suffix and nonstandard-port escapes at the
// component boundary before a supplied URL can become an iframe or fallback.
test("only inspected HTTPS product origins can become live demo URLs", () => {
  for (const url of [
    "https://duplaface.arq.br/projetos/apto-oscar",
    "https://florapsicologa.com.br/agendar",
  ]) assert.equal(isSafeProjectDemoUrl(url), true, url)
  for (const url of [
    "javascript:alert(1)", "data:text/html,test", "/relative", "//duplaface.arq.br/",
    "http://duplaface.arq.br/", "https://duplaface.arq.br.evil.test/",
    "https://duplaface.arq.br@evil.test/", "https://user:password@duplaface.arq.br/",
    "https://duplaface.arq.br:8443/", "https://example.com/", "not a URL",
  ]) assert.equal(isSafeProjectDemoUrl(url), false, url)
})

// Catches eager iframe creation (and therefore unconsented third-party network
// requests), missing provenance or an inaccessible fallback in the initial HTML.
test("initial rendering contacts no product and always exposes the original app", () => {
  for (const demo of projectDemos) {
    for (const locale of ["pt", "en", "es"] as const) {
      const html = renderToStaticMarkup(createElement(LiveProjectDemo, { demo, locale }))
      const window = new Window()
      window.document.body.innerHTML = html
      assert.equal(window.document.querySelector("iframe, img, link, script"), null)
      const original = window.document.querySelector("a")
      assert.equal(original?.getAttribute("href"), demo.url)
      assert.equal(original?.getAttribute("target"), "_blank")
      assert.ok(original?.getAttribute("rel")?.includes("noopener"))
      assert.ok(original?.getAttribute("rel")?.includes("noreferrer"))
      assert.ok(window.document.body.textContent?.includes(demo.productName))
      assert.equal(window.document.querySelector("time")?.getAttribute("dateTime"), demo.checkedAt)
      assert.equal(window.document.querySelectorAll("button").length, 1)
      window.happyDOM.abort()
    }
  }
})

async function mountedDemo(demo: ProjectDemo, run: (window: Window, container: HTMLElement, renderDemo: (next: ProjectDemo) => Promise<void>) => Promise<void>) {
  const window = new Window({
    url: "https://lagrotti.dev/recursos/demos/example",
    settings: { disableIframePageLoading: true },
  })
  const globals = ["window", "document", "navigator", "HTMLElement", "Event", "IS_REACT_ACT_ENVIRONMENT"] as const
  const saved = new Map(globals.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))
  for (const key of globals) {
    Object.defineProperty(globalThis, key, { configurable: true, value: key === "IS_REACT_ACT_ENVIRONMENT" ? true : key === "window" ? window : window[key] })
  }
  const container = window.document.createElement("div")
  window.document.body.append(container)
  const root = createRoot(container as unknown as HTMLElement)
  try {
    await act(async () => { root.render(createElement(LiveProjectDemo, { demo, locale: "en" })) })
    await run(window, container as unknown as HTMLElement, async (next) => {
      await act(async () => { root.render(createElement(LiveProjectDemo, { demo: next, locale: "en" })) })
    })
  } finally {
    await act(async () => { root.unmount() })
    await window.happyDOM.abort()
    for (const key of globals) {
      const descriptor = saved.get(key)
      if (descriptor) Object.defineProperty(globalThis, key, descriptor)
      else Reflect.deleteProperty(globalThis, key)
    }
  }
}

// Catches removed consent gating, excess browser permissions, missing loading
// status and a close action that keeps the production app mounted in the page.
test("activation mounts a restricted product frame and closing removes it", async () => {
  await mountedDemo(projectDemos[0], async (window, container) => {
    assert.equal(container.querySelectorAll("iframe").length, 0)
    const activate = container.querySelector<HTMLButtonElement>("[data-demo-activate]")!
    await act(async () => { activate.click() })
    const frame = container.querySelector("iframe")!
    assert.equal(frame.getAttribute("src"), projectDemos[0].url)
    assert.ok(frame.getAttribute("title")?.includes(projectDemos[0].productName))
    assert.deepEqual(frame.getAttribute("sandbox")?.split(" ").sort(), ["allow-same-origin", "allow-scripts"])
    assert.equal(frame.getAttribute("referrerPolicy"), "no-referrer")
    assert.match(frame.getAttribute("allow")!, /camera 'none'/)
    assert.match(frame.getAttribute("allow")!, /microphone 'none'/)
    assert.match(frame.getAttribute("allow")!, /geolocation 'none'/)
    assert.ok(container.querySelector('[role="status"]')?.textContent?.includes("Loading"))
    await act(async () => { frame.dispatchEvent(new window.Event("load") as unknown as Event) })
    assert.equal(container.querySelector('[role="status"]')?.textContent?.includes("Loading"), false)
    await act(async () => { container.querySelector<HTMLButtonElement>("[data-demo-close]")!.click() })
    assert.equal(container.querySelectorAll("iframe").length, 0)
    assert.ok(container.querySelector("a"))
  })
})

// Catches accidental embedding after a product's permission/reachability check
// is withdrawn, and unsafe URLs leaking through the external fallback link.
test("unavailable embedding keeps the app link while unsafe URLs stay inert", async () => {
  await mountedDemo({ ...projectDemos[0], embeddingSupported: false }, async (_window, container) => {
    assert.equal(container.querySelector("button, iframe"), null)
    assert.equal(container.querySelector("a")?.getAttribute("href"), projectDemos[0].url)
  })
  await mountedDemo({ ...projectDemos[0], url: "javascript:alert(1)" }, async (_window, container) => {
    assert.equal(container.querySelector("button, iframe, a"), null)
    assert.ok(container.querySelector('[role="status"]')?.textContent)
  })
})

// Catches consent being reused when client-side navigation changes which
// external product occupies the same React component instance.
test("changing products requires a separate activation", async () => {
  await mountedDemo(projectDemos[0], async (_window, container, renderDemo) => {
    await act(async () => { container.querySelector<HTMLButtonElement>("[data-demo-activate]")!.click() })
    assert.ok(container.querySelector("iframe"))
    await renderDemo({ ...projectDemos[0], slug: "another-public-experience" })
    assert.equal(container.querySelectorAll("iframe").length, 0)
    await act(async () => { container.querySelector<HTMLButtonElement>("[data-demo-activate]")!.click() })
    await renderDemo(projectDemos[1])
    assert.equal(container.querySelectorAll("iframe").length, 0)
    assert.equal(container.querySelector('[role="status"]')?.textContent?.includes("Loading"), false)
    assert.ok(container.querySelector("[data-demo-activate]"))
    await act(async () => { container.querySelector<HTMLButtonElement>("[data-demo-activate]")!.click() })
    assert.equal(container.querySelector("iframe")?.getAttribute("src"), projectDemos[1].url)
  })
})

// Catches browsers reporting a frame network error without leaving the visitor
// an announced recovery route to the working public application.
test("a frame error preserves an announced external fallback", async () => {
  await mountedDemo(projectDemos[0], async (window, container) => {
    await act(async () => { container.querySelector<HTMLButtonElement>("[data-demo-activate]")!.click() })
    await act(async () => { container.querySelector("iframe")!.dispatchEvent(new window.Event("error") as unknown as Event) })
    assert.ok(container.querySelector('[role="status"]')?.textContent?.includes("original application"))
    assert.equal(container.querySelector("a")?.getAttribute("href"), projectDemos[0].url)
  })
})
