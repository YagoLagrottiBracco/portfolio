import { getAllPosts } from "@/lib/blog"
import { buildBlogFeed } from "@/lib/blog-feed"

const SITE_URL = "https://lagrotti.dev"

export const dynamic = "force-static"

/** Portuguese feed; `/en/blog/feed.xml` and `/es/blog/feed.xml` live under `[locale]`. */
export function GET() {
  return new Response(buildBlogFeed(getAllPosts("pt"), "pt", SITE_URL), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
