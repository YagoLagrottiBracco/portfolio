import { groupBlogSources, type BlogAdminBundle, type BlogAdminSource } from "@/lib/blog-admin-document"

export interface GitHubBlogConfig { repository: string; branch: string; token: string; fetch?: typeof globalThis.fetch }

async function githubGet(config: GitHubBlogConfig, path: string): Promise<Record<string, unknown>> {
  if (!/^[\w.-]+\/[\w.-]+$/.test(config.repository)) throw new Error("Invalid GitHub repository")
  const response = await (config.fetch ?? fetch)(`https://api.github.com/repos/${config.repository}${path}`, {
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${config.token}`, "X-GitHub-Api-Version": "2022-11-28" },
    cache: "no-store",
  })
  if (!response.ok) throw new Error(`GitHub read failed (${response.status})`)
  return response.json() as Promise<Record<string, unknown>>
}

export async function listBlogBundles(config: GitHubBlogConfig): Promise<BlogAdminBundle[]> {
  const tree = await githubGet(config, `/git/trees/${encodeURIComponent(config.branch)}?recursive=1`)
  if (tree.truncated) throw new Error("GitHub tree is truncated")
  if (!Array.isArray(tree.tree)) throw new Error("GitHub tree is invalid")
  const files = tree.tree.filter((item): item is { path: string; sha: string; type: string } => {
    if (!item || typeof item !== "object") return false
    const entry = item as Record<string, unknown>
    return entry.type === "blob" && typeof entry.sha === "string" && typeof entry.path === "string" && /^src\/content\/blog\/[^/]+\.mdx$/.test(entry.path)
  })
  const sources: BlogAdminSource[] = await Promise.all(files.map(async file => {
    const blob = await githubGet(config, `/git/blobs/${encodeURIComponent(file.sha)}`)
    if (blob.encoding !== "base64" || typeof blob.content !== "string") throw new Error("GitHub blob is invalid")
    return { path: file.path, blobSha: file.sha, source: Buffer.from(blob.content.replace(/\s/g, ""), "base64").toString("utf8") }
  }))
  return groupBlogSources(sources)
}

export async function loadBlogBundle(config: GitHubBlogConfig, translationKey: string): Promise<BlogAdminBundle | null> {
  return (await listBlogBundles(config)).find(bundle => bundle.translationKey === translationKey) ?? null
}
