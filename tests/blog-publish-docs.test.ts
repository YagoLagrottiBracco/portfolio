import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("documents every required server environment variable", () => {
  const env = readFileSync(".env.example", "utf8")
  for (const name of ["BLOG_API_KEY", "BLOG_GITHUB_TOKEN", "BLOG_GITHUB_REPOSITORY"]) {
    assert.match(env, new RegExp("^" + name + "=", "m"))
  }
  assert.match(readFileSync("docs/blog-publishing-api.md", "utf8"), /POST \/api\/blog\/publish/)
})