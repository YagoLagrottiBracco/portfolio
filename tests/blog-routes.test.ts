import assert from "node:assert/strict"
import test from "node:test"
import { getBlogIndexPath, isBlogPath } from "../src/lib/blog-routes"

test("maps each blog locale to its stable index URL", () => {
  assert.equal(getBlogIndexPath("pt"), "/blog")
  assert.equal(getBlogIndexPath("en"), "/en/blog")
  assert.equal(getBlogIndexPath("es"), "/es/blog")
})

test("recognizes blog index and article paths", () => {
  assert.equal(isBlogPath("/blog"), true)
  assert.equal(isBlogPath("/en/blog"), true)
  assert.equal(isBlogPath("/blog/welcome-to-my-blog"), true)
  assert.equal(isBlogPath("/projetos/praxis"), false)
})

