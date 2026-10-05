import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"

test("documents editor and unchanged cron setup", () => {
  const docs = readFileSync("docs/blog-publishing.md", "utf8") + readFileSync("docs/blog-publishing-api.md", "utf8")
  const env = readFileSync(".env.example", "utf8")
  for (const name of ["AUTH_SECRET", "AUTH_URL", "AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET", "BLOG_ADMIN_GITHUB_ID", "BLOG_GITHUB_TOKEN", "BLOG_API_KEY"]) {
    assert.match(docs, new RegExp(name))
    assert.match(env, new RegExp(`^${name}=`, "m"))
  }
  assert.match(docs, /\/admin\/blog/)
  assert.match(docs, /POST \/api\/blog\/publish/)
  assert.match(docs, /\/api\/auth\/callback\/github/)
  assert.match(docs, /409/)
  assert.match(docs, /deployment-pending/)
})
