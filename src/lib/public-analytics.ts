import "server-only"

import { getAllPosts } from "@/lib/blog"
import type { Locale } from "@/lib/i18n"

export interface PublicAnalytics {
  configured: boolean
  generatedAt: string
  pageviews: number
  posts: { path: string; title: string; locale: Locale; views: number }[]
}

function config() {
  const websiteId = process.env.UMAMI_WEBSITE_ID
  const token = process.env.UMAMI_API_KEY
  if (!websiteId || !token) return null
  return {
    websiteId,
    token,
    apiUrl: (process.env.UMAMI_API_URL ?? "https://api.umami.is").replace(/\/$/, ""),
  }
}

function localeFromPath(path: string): Locale | null {
  if (path.startsWith("/en/")) return "en"
  if (path.startsWith("/es/")) return "es"
  if (path.startsWith("/blog/")) return "pt"
  return null
}

async function fetchPageviews(fetcher: typeof fetch): Promise<{ path: string; views: number }[] | null> {
  const settings = config()
  if (!settings) return null
  const end = new Date()
  const start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000)
  const url = new URL(`${settings.apiUrl}/api/websites/${encodeURIComponent(settings.websiteId)}/pageviews`)
  url.searchParams.set("startAt", String(start.getTime()))
  url.searchParams.set("endAt", String(end.getTime()))
  url.searchParams.set("unit", "day")

  const response = await fetcher(url, {
    headers: { Authorization: `Bearer ${settings.token}`, Accept: "application/json" },
    cache: "no-store",
  })
  if (!response.ok) return null
  const payload = await response.json() as { pageviews?: { x?: unknown; y?: unknown }[] }
  if (!Array.isArray(payload.pageviews)) return null

  const totals = new Map<string, number>()
  for (const item of payload.pageviews) {
    const path = typeof item.x === "string" ? item.x : ""
    const views = typeof item.y === "number" ? item.y : Number(item.y)
    if (!path || !Number.isFinite(views) || views <= 0) continue
    totals.set(path, (totals.get(path) ?? 0) + views)
  }
  return [...totals.entries()].map(([path, views]) => ({ path, views })).sort((a, b) => b.views - a.views)
}

export async function getPublicAnalytics(fetcher: typeof fetch = fetch): Promise<PublicAnalytics | null> {
  const pageviews = await fetchPageviews(fetcher)
  if (!pageviews) return null

  const posts = getAllPosts()
  const byPath = new Map(posts.map(post => [post.url, post]))
  const popular = pageviews
    .map(item => ({ ...item, post: byPath.get(item.path) }))
    .filter((item): item is typeof item & { post: NonNullable<typeof item.post> } => Boolean(item.post && localeFromPath(item.path)))
    .slice(0, 9)
    .map(item => ({ path: item.path, title: item.post.title, locale: item.post.locale, views: item.views }))

  return {
    configured: true,
    generatedAt: new Date().toISOString(),
    pageviews: pageviews.reduce((sum, item) => sum + item.views, 0),
    posts: popular,
  }
}
