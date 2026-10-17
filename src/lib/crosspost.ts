/**
 * Republishing an article on dev.to without competing with the original:
 * `canonical_url` tells search engines lagrotti.dev is the source, and the
 * footer link is tagged so readers who come back show up as `devto`.
 */
import type { BlogPost } from "@/lib/blog-content"
import { withUtm } from "@/lib/utm"

/** dev.to tags: at most four, lowercase letters and digits only ("next.js" → "nextjs"). */
export function devtoTags(tags: string[]): string[] {
  const cleaned = tags
    .map((tag) => tag.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter((tag) => tag.length > 0 && tag.length <= 30)
  return [...new Set(cleaned)].slice(0, 4)
}

/** Relative links and images in the Markdown, made absolute so they work off-site. */
export function absolutizeMarkdown(markdown: string, siteUrl: string): string {
  return markdown.replace(/(\]\()(\/(?!\/)[^)\s]*)/g, (_match, open: string, path: string) => `${open}${siteUrl}${path}`)
}

const footer: Record<BlogPost["locale"], string> = {
  pt: "Publicado originalmente em",
  en: "Originally published at",
  es: "Publicado originalmente en",
}

export type AiDisclosure = "not_disclosed" | "no_ai" | "some_ai" | "fully_autonomous"

/** The `article` object of `POST https://dev.to/api/articles`; always a draft. */
export function devtoArticle(post: BlogPost, siteUrl: string, aiDisclosure?: AiDisclosure) {
  const canonical = `${siteUrl}${post.url}`
  const back = withUtm(canonical, { utm_source: "devto", utm_medium: "crosspost", utm_campaign: post.translationKey })
  const cover = post.image?.src
  return {
    title: post.title,
    description: post.excerpt,
    body_markdown: `${absolutizeMarkdown(post.content, siteUrl)}\n\n---\n\n*${footer[post.locale]} [lagrotti.dev](${back}).*\n`,
    published: false,
    canonical_url: canonical,
    tags: devtoTags(post.tags),
    ...(cover ? { main_image: cover.startsWith("/") ? `${siteUrl}${cover}` : cover } : {}),
    ...(aiDisclosure ? { ai_disclosure_level: aiDisclosure } : {}),
  }
}
