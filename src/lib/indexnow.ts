/**
 * IndexNow (https://www.indexnow.org): tells Bing — and through it Copilot,
 * DuckDuckGo and Yandex — that pages changed, instead of waiting for a crawl.
 * The key is public by design: search engines fetch it from `keyLocation`
 * (`/indexnow-key.txt`) to check the site really sent the ping.
 */
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
export const INDEXNOW_KEY_PATH = "/indexnow-key.txt"

/** 8 to 128 characters of letters, digits and dashes, as the protocol requires. */
export function isIndexNowKey(key: string | undefined): key is string {
  return typeof key === "string" && /^[a-zA-Z0-9-]{8,128}$/.test(key)
}

export interface SitemapEntry { url: string; lastModified?: Date }

/** The `<url>` entries of a sitemap, with their `<lastmod>` when present. */
export function parseSitemap(xml: string): SitemapEntry[] {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].flatMap(([, entry]) => {
    const url = /<loc>([^<]+)<\/loc>/.exec(entry)?.[1]?.trim()
    if (!url) return []
    const lastmod = /<lastmod>([^<]+)<\/lastmod>/.exec(entry)?.[1]?.trim()
    const date = lastmod ? new Date(lastmod) : undefined
    return [{ url: url.replace(/&amp;/g, "&"), lastModified: date && !Number.isNaN(date.getTime()) ? date : undefined }]
  })
}

/** Entries changed since `since`; entries without a date never count as changed. */
export function changedSince(entries: SitemapEntry[], since: Date): string[] {
  return entries.filter((entry) => entry.lastModified && entry.lastModified >= since).map((entry) => entry.url)
}

export function indexNowPayload({ siteUrl, key, urls }: { siteUrl: string; key: string; urls: string[] }) {
  const origin = new URL(siteUrl)
  const own = urls.filter((url) => new URL(url).host === origin.host)
  return { host: origin.host, key, keyLocation: `${origin.origin}${INDEXNOW_KEY_PATH}`, urlList: own.slice(0, 10_000) }
}
