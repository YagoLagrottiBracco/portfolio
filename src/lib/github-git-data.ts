export interface CommitFile {
  path: string
  content: string | Uint8Array
  encoding: "utf8" | "base64"
}

export interface GitHubCommitInput {
  fetch?: typeof globalThis.fetch
  repository: string
  branch: string
  token: string
  message: string
  files: CommitFile[]
}

export class GitHubPublishError extends Error {
  constructor(public readonly kind: "conflict" | "upstream", message: string) {
    super(message)
  }
}

export async function commitFiles(input: GitHubCommitInput): Promise<{ sha: string }> {
  const fetcher = input.fetch ?? fetch
  const [owner, repository] = input.repository.split("/")
  if (!owner || !repository || input.repository.split("/").length !== 2) throw new GitHubPublishError("upstream", "GitHub repository is invalid")
  const base = "https://api.github.com/repos/" + owner + "/" + repository
  const request = async (path: string, init?: RequestInit) => {
    const response = await fetcher(base + path, {
      ...init,
      headers: { Accept: "application/vnd.github+json", Authorization: "Bearer " + input.token, "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json", ...(init?.headers ?? {}) },
    })
    if (!response.ok) {
      if (response.status === 409 || response.status === 422) throw new GitHubPublishError("conflict", "Publication conflict: the target branch changed")
      throw new GitHubPublishError("upstream", "GitHub could not publish the article")
    }
    return response.json() as Promise<Record<string, unknown>>
  }
  const ref = await request("/git/ref/heads/" + encodeURIComponent(input.branch))
  const head = String((ref.object as Record<string, unknown>).sha)
  const parent = await request("/git/commits/" + head)
  const blobs = await Promise.all(input.files.map(async file => {
    const content = typeof file.content === "string" ? Buffer.from(file.content, "utf8").toString("base64") : Buffer.from(file.content).toString("base64")
    const blob = await request("/git/blobs", { method: "POST", body: JSON.stringify({ content, encoding: "base64" }) })
    return { path: file.path, mode: "100644", type: "blob", sha: String(blob.sha) }
  }))
  const tree = await request("/git/trees", { method: "POST", body: JSON.stringify({ base_tree: (parent.tree as Record<string, unknown>).sha, tree: blobs }) })
  const commit = await request("/git/commits", { method: "POST", body: JSON.stringify({ message: input.message, tree: tree.sha, parents: [head] }) })
  await request("/git/refs/heads/" + encodeURIComponent(input.branch), { method: "PATCH", body: JSON.stringify({ sha: commit.sha, force: false }) })
  return { sha: String(commit.sha) }
}