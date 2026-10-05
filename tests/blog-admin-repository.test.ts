import assert from "node:assert/strict"
import test from "node:test"
import { listBlogBundles } from "../src/lib/blog-admin-repository"

const source = `---\ntitle: Title\nslug: slug-pt\ntranslationKey: group\nexcerpt: Excerpt\ndate: 2026-01-01\ntags: [blog]\nlocale: pt\n---\n\n## Heading\n\nBody\n`

test("reads only blog files from GitHub tree", async () => {
  const paths: string[] = []
  const fetcher = async (input: URL | RequestInfo) => {
    const url = String(input); paths.push(url)
    const body = url.includes("/git/trees/") ? { truncated: false, tree: [{ path: "src/content/blog/slug-pt.pt.mdx", type: "blob", sha: "abc" }, { path: "README.md", type: "blob", sha: "other" }] } : { content: Buffer.from(source).toString("base64"), encoding: "base64" }
    return Response.json(body)
  }
  const bundles = await listBlogBundles({ repository: "owner/repo", branch: "main", token: "token", fetch: fetcher as typeof fetch })
  assert.equal(bundles.length, 1)
  assert.equal(bundles[0].articles.pt?.blobSha, "abc")
  assert.equal(paths.length, 2)
  assert.equal(paths.some(path => path.includes("README")), false)
})

test("rejects truncated GitHub tree", async () => {
  await assert.rejects(listBlogBundles({ repository: "owner/repo", branch: "main", token: "token", fetch: (async () => Response.json({ truncated: true, tree: [] })) as typeof fetch }), /truncated/i)
})
