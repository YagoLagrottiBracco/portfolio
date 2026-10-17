/** giscus (GitHub Discussions) settings for the article comments; see `ArticleComments`. */
export const GISCUS_ORIGIN = "https://giscus.app"

export interface GiscusConfig {
  repo: string
  repoId: string
  category: string
  categoryId: string
}

/** From the environment, or `null` until every value is set. */
export function giscusConfig(env: Record<string, string | undefined> = process.env): GiscusConfig | null {
  const repo = env.NEXT_PUBLIC_GISCUS_REPO
  const repoId = env.NEXT_PUBLIC_GISCUS_REPO_ID
  const category = env.NEXT_PUBLIC_GISCUS_CATEGORY
  const categoryId = env.NEXT_PUBLIC_GISCUS_CATEGORY_ID
  return repo && repoId && category && categoryId ? { repo, repoId, category, categoryId } : null
}
