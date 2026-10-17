import "server-only"

import { getAllPosts } from "@/lib/blog"
import type { Locale } from "@/lib/i18n"
import { createUmamiClient } from "@/lib/umami"

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
    // Explicit self-hosted bases include /api; Cloud uses /v1.
    apiUrl: (process.env.UMAMI_API_URL ?? "https://api.umami.is/v1").replace(/\/+$/, ""),
  }
}

const CACHE_MS = 5 * 60 * 1000
const TIMEOUT_MS = 5000
const METRIC_LIMIT = 1000

// A single slot bounds memory. Both success and failure receive a cooldown;
// concurrent requests share the same provider call within this process.
let cached: { key: string; fetcher: typeof fetch; expiresAt: number; value: PublicAnalytics | null } | undefined
let pending: { key: string; fetcher: typeof fetch; promise: Promise<PublicAnalytics | null> } | undefined

async function query(settings: NonNullable<ReturnType<typeof config>>, fetcher: typeof fetch): Promise<PublicAnalytics | null> {
  const controller = new AbortController()
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        controller.abort()
        reject(new Error("Analytics timeout"))
      }, TIMEOUT_MS)
    })
    const client = createUmamiClient({
      apiKey: settings.token,
      websiteId: settings.websiteId,
      baseUrl: settings.apiUrl,
      fetch: (url, init) => fetcher(url, { ...init, cache: "no-store", signal: controller.signal }),
    })
    const endAt = Date.now()
    const payload = await Promise.race([client.get<unknown>("/metrics", {
      type: "path", startAt: endAt - 30 * 24 * 60 * 60 * 1000, endAt, limit: METRIC_LIMIT,
    }), timeout])
    if (!Array.isArray(payload) || payload.length > METRIC_LIMIT) return null

    const byPath = new Map(getAllPosts().map(post => [post.url, post]))
    const totals = new Map<string, number>()
    let pageviews = 0
    for (const row of payload) {
      if (!row || typeof row !== "object") continue
      const { x: path, y: views } = row
      if (typeof path !== "string" || !byPath.has(path) || !Number.isSafeInteger(views) || views <= 0) continue
      if (!Number.isSafeInteger(pageviews + views)) return null
      pageviews += views
      totals.set(path, (totals.get(path) ?? 0) + views)
    }
    const posts = [...totals].sort((a, b) => b[1] - a[1]).slice(0, 9).map(([path, views]) => {
      const post = byPath.get(path)!
      return { path, title: post.title, locale: post.locale, views }
    })
    return { configured: true, generatedAt: new Date().toISOString(), pageviews, posts }
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

export async function getPublicAnalytics(fetcher: typeof fetch = fetch): Promise<PublicAnalytics | null> {
  const settings = config()
  if (!settings) return null
  const key = JSON.stringify(settings)
  if (cached?.key === key && cached.fetcher === fetcher && cached.expiresAt > Date.now()) return cached.value
  if (pending?.key === key && pending.fetcher === fetcher) return pending.promise

  const promise = query(settings, fetcher).then(value => {
    cached = { key, fetcher, expiresAt: Date.now() + CACHE_MS, value }
    return value
  }).finally(() => {
    if (pending?.promise === promise) pending = undefined
  })
  pending = { key, fetcher, promise }
  return promise
}
