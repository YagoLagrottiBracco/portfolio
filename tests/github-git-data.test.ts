import assert from "node:assert/strict"
import test from "node:test"
import { commitFiles } from "../src/lib/github-git-data"

test("creates one atomic GitHub commit for all files", async () => {
  const calls: Array<{ method: string; path: string; body?: unknown }> = []
  const fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = new URL(input instanceof Request ? input.url : String(input))
    calls.push({ method: init?.method ?? "GET", path: url.pathname, body: init?.body ? JSON.parse(String(init.body)) : undefined })
    const path = url.pathname
    const body = path.endsWith("/git/ref/heads/main") ? { object: { sha: "head" } }
      : path.endsWith("/git/commits/head") ? { tree: { sha: "tree" } }
      : path.endsWith("/git/blobs") ? { sha: "blob" }
      : path.endsWith("/git/trees") ? { sha: "new-tree" }
      : path.endsWith("/git/commits") ? { sha: "commit" }
      : { object: { sha: "commit" } }
    return new Response(JSON.stringify(body), { status: 201 })
  }
  const result = await commitFiles({ fetch, repository: "owner/repo", branch: "main", token: "token", message: "publish", files: [{ path: "src/content/blog/a.pt.mdx", content: "post", encoding: "utf8" }] })
  assert.equal(result.sha, "commit")
  assert.deepEqual(calls.map(call => call.method + " " + call.path), [
    "GET /repos/owner/repo/git/ref/heads/main",
    "GET /repos/owner/repo/git/commits/head",
    "POST /repos/owner/repo/git/blobs",
    "POST /repos/owner/repo/git/trees",
    "POST /repos/owner/repo/git/commits",
    "PATCH /repos/owner/repo/git/refs/heads/main",
  ])
})

test("maps a branch conflict to a safe error", async () => {
  const fetch = async (input: RequestInfo | URL) => {
    const path = new URL(input instanceof Request ? input.url : String(input)).pathname
    return new Response(JSON.stringify(path.endsWith("/git/ref/heads/main") ? { object: { sha: "head" } } : { tree: { sha: "tree" } }), { status: path.endsWith("/git/ref/heads/main") ? 200 : 409 })
  }
  await assert.rejects(() => commitFiles({ fetch, repository: "owner/repo", branch: "main", token: "token", message: "publish", files: [] }), /conflict/i)
})