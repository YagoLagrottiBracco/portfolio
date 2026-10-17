import "server-only"

import references from "@/data/resources/references.json"
import type { ApprovedReference } from "@/lib/webmention"
import { SITE_URL } from "@/lib/site"

export interface Webmention {
  author: string
  authorUrl?: string
  url: string
  text: string
  published?: string
}

interface Jf2Entry {
  type?: string
  author?: { name?: unknown; url?: unknown } | string
  url?: unknown
  content?: { text?: unknown } | string
  published?: unknown
  "wm-source"?: unknown
  "wm-target"?: unknown
  "wm-private"?: unknown
}

/** Optional webmention.io enrichment is restricted to pairs approved in the reviewed GitHub dataset. */
export async function getWebmentions(postUrl: string, fetcher: typeof fetch = fetch): Promise<Webmention[]> {
  const token = process.env.WEBMENTION_IO_TOKEN
  if (!token) return []

  const target = `${SITE_URL}${postUrl}`
  const approved = new Set((references as ApprovedReference[]).filter(entry => entry.target === target && entry.review?.reviewer && entry.review?.issueUrl).map(entry => entry.source))
  if (approved.size === 0) return []
  const url = new URL("https://webmention.io/api/mentions.jf2")
  url.searchParams.set("target", target)
  url.searchParams.set("per-page", "100")

  const response = await fetcher(url, { headers: { Accept: "application/json", Authorization: `Bearer ${token}` }, cache: "no-store", redirect: "error", signal: AbortSignal.timeout(5000) })
  if (!response.ok) return []
  const payload = await response.json() as { children?: Jf2Entry[] }
  if (!Array.isArray(payload.children)) return []

  return payload.children.flatMap(entry => {
    if (entry.type !== "entry" || entry["wm-private"] !== false || entry["wm-target"] !== target || typeof entry["wm-source"] !== "string" || !approved.has(entry["wm-source"])) return []
    const author = typeof entry.author === "object" && entry.author !== null ? entry.author : undefined
    const content = typeof entry.content === "object" && entry.content !== null ? entry.content.text : entry.content
    if (typeof entry.url !== "string" || typeof content !== "string" || !content.trim()) return []
    return [{
      author: typeof author?.name === "string" && author.name.trim() ? author.name : "Webmention",
      authorUrl: typeof author?.url === "string" ? author.url : undefined,
      url: entry.url,
      text: content.trim(),
      published: typeof entry.published === "string" ? entry.published : undefined,
    }]
  }).slice(0, 20)
}
