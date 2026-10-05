import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import matter from "gray-matter"
import { Window } from "happy-dom"
import { checkMarkdownRoundtrip } from "../src/lib/blog-editor-roundtrip"

test("checks existing posts through the actual visual editor", async () => {
  const window = new Window({ url: "https://example.com" })
  window.document.write("<!doctype html><html><head></head><body></body></html>")
  for (const key of ["window", "document", "navigator", "Node", "Element", "HTMLElement", "SVGElement", "MutationObserver", "DOMParser", "Event", "CustomEvent", "KeyboardEvent", "MouseEvent", "File", "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame", "addEventListener", "removeEventListener", "dispatchEvent"]) {
    const value = key === "window" ? window : window[key as keyof Window]
    Object.defineProperty(globalThis, key, { value: typeof value === "function" && key !== "Node" && key !== "Element" && key !== "HTMLElement" && key !== "SVGElement" && key !== "MutationObserver" && key !== "DOMParser" && key !== "Event" && key !== "CustomEvent" && key !== "KeyboardEvent" && key !== "MouseEvent" && key !== "File" ? value.bind(window) : value, configurable: true })
  }
  class Observer { observe() {} unobserve() {} disconnect() {} }
  Object.defineProperty(globalThis, "IntersectionObserver", { value: Observer, configurable: true })
  Object.defineProperty(globalThis, "ResizeObserver", { value: Observer, configurable: true })
  const { Crepe } = await import("@milkdown/crepe")
  const dir = join(process.cwd(), "src/content/blog")
  const filenames = readdirSync(dir).filter(name => name.endsWith(".mdx"))
  assert.equal(filenames.length, 54)
  for (const name of filenames) {
    const root = window.document.createElement("div")
    window.document.body.append(root)
    const body = matter(readFileSync(join(dir, name), "utf8")).content
    const crepe = new Crepe({ root: root as unknown as Node, defaultValue: body, features: { [Crepe.Feature.Latex]: false } })
    await crepe.create()
    const result = checkMarkdownRoundtrip(body, crepe.getMarkdown())
    crepe.destroy()
    root.remove()
    assert.equal(result.safe, true, name + ": " + result.reason)
  }
})
