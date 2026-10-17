import "server-only"

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
}

/** Approved mentions from webmention.io, opt-in through server-only env vars. */
export async function getWebmentions(postUrl: string, fetcher: typeof fetch = fetch): Promise<Webmention[]> {
  const token = process.env.WEBMENTION_IO_TOKEN
  if (!token) return []

  const target = `${SITE_URL}${postUrl}`
  const url = new URL("https://webmention.io/api/mentions.jf2")
  url.searchParams.set("token", token)
  url.searchParams.set("target", target)
  url.searchParams.set("per-page", "100")

  const response = await fetcher(url, { headers: { Accept: "application/json" }, cache: "no-store" })
  if (!response.ok) return []
  const payload = await response.json() as { children?: Jf2Entry[] }
  if (!Array.isArray(payload.children)) return []

  return payload.children.flatMap(entry => {
    if (entry.type !== "entry") return []
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
