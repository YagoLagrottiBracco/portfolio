import "server-only"

import { auth } from "@/auth"
import { createBlogAdminHandlers } from "@/lib/blog-admin-handler"
import { listBlogBundles, type GitHubBlogConfig } from "@/lib/blog-admin-repository"
import { commitFiles, GitHubPublishError } from "@/lib/github-git-data"

export function blogAdminConfig(): GitHubBlogConfig {
  const repository = process.env.BLOG_GITHUB_REPOSITORY
  const token = process.env.BLOG_GITHUB_TOKEN
  if (!repository || !token) throw new GitHubPublishError("upstream", "Blog repository is not configured")
  return { repository, token, branch: process.env.BLOG_GITHUB_BRANCH ?? "main" }
}

export function blogAdminHandlers() {
  return createBlogAdminHandlers({
    allowedGithubId: process.env.BLOG_ADMIN_GITHUB_ID ?? "",
    expectedOrigin: new URL(process.env.BLOG_SITE_URL ?? "https://lagrotti.dev").origin,
    getSession: () => auth(),
    listBundles: () => listBlogBundles(blogAdminConfig()),
    commit: prepared => commitFiles({ ...blogAdminConfig(), message: prepared.commitMessage, files: prepared.files, expectedBlobs: prepared.expectedBlobs, deletePaths: prepared.deletePaths }),
  })
}
