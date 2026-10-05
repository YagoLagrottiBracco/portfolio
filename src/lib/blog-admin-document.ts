import { parseBlogSource, type BlogImage } from "@/lib/blog-content"
import type { ArticleInput } from "@/lib/blog-publishing"
import type { Locale } from "@/lib/i18n"

export interface BlogAdminSource { path: string; source: string; blobSha: string }
export interface AdminArticle extends ArticleInput {
  locale: Locale
  draft: boolean
  sourcePath: string
  blobSha: string
  extraFrontmatter: Record<string, unknown>
  imageFrontmatter?: Record<string, unknown>
}
export interface BlogAdminBundle {
  translationKey: string
  articles: Partial<Record<Locale, AdminArticle>>
  image?: BlogImage
}

export function groupBlogSources(sources: BlogAdminSource[]): BlogAdminBundle[] {
  const groups = new Map<string, BlogAdminBundle>()
  for (const source of sources) {
    const post = parseBlogSource({ filename: source.path, source: source.source })
    let bundle = groups.get(post.translationKey)
    if (!bundle) {
      bundle = { translationKey: post.translationKey, articles: {}, image: post.image }
      groups.set(post.translationKey, bundle)
    }
    if (bundle.articles[post.locale]) throw new Error(`Duplicate blog translation: ${post.translationKey}:${post.locale}`)
    bundle.articles[post.locale] = {
      title: post.title, slug: post.slug, excerpt: post.excerpt, date: post.date, updatedAt: post.updatedAt,
      tags: post.tags, content: post.content, locale: post.locale, draft: post.draft,
      sourcePath: source.path, blobSha: source.blobSha, extraFrontmatter: post.extraFrontmatter, imageFrontmatter: post.imageFrontmatter,
    }
    bundle.image ??= post.image
  }
  return [...groups.values()].sort((a, b) => a.translationKey.localeCompare(b.translationKey))
}
