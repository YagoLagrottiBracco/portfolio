import { commitFiles, GitHubPublishError } from "@/lib/github-git-data"
import { createPublishHandler } from "@/lib/blog-publish-handler"

export const runtime = "nodejs"

export const POST = createPublishHandler({
  apiKey: process.env.BLOG_API_KEY ?? "",
  publish: publication => {
    const token = process.env.BLOG_GITHUB_TOKEN
    const repository = process.env.BLOG_GITHUB_REPOSITORY
    if (!token || !repository) throw new GitHubPublishError("upstream", "Blog publishing is not configured")
    return commitFiles({ repository, branch: process.env.BLOG_GITHUB_BRANCH ?? "main", token, message: publication.commitMessage, files: publication.files })
  },
})