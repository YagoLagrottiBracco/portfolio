/**
 * Links inside articles: which ones exist, and whether the internal ones
 * still point at a page of this site.
 */
export interface ArticleLink { url: string; image: boolean }

/** Markdown links and images, and autolinks (`<https://…>`); code is skipped. */
export function extractLinks(markdown: string): ArticleLink[] {
  const prose = markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "")
  const links: ArticleLink[] = []
  for (const match of prose.matchAll(/(!?)\[(?:[^\]\\]|\\.)*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g)) links.push({ url: match[2], image: match[1] === "!" })
  for (const match of prose.matchAll(/<(https?:\/\/[^>\s]+)>/g)) links.push({ url: match[1], image: false })
  return links
}

const OWN_HOST = /^https?:\/\/(www\.)?lagrotti\.dev(?=\/|$)/

/** A link to this site as a path ("/blog/x"), or `null` for external, anchor-only and other links. */
export function internalPath(url: string): string | null {
  if (OWN_HOST.test(url)) return url.replace(OWN_HOST, "") || "/"
  if (url.startsWith("/") && !url.startsWith("//")) return url
  return null
}

export function isExternal(url: string): boolean {
  return /^https?:\/\//.test(url) && !OWN_HOST.test(url)
}

/** The path without query and fragment, and without a trailing slash. */
export function routeOf(path: string): string {
  const bare = path.split(/[?#]/)[0]
  return bare.length > 1 ? bare.replace(/\/$/, "") : bare
}

export type LinkVerdict = "ok" | "broken" | "blocked"

/** Statuses that say "gone" versus statuses that only say "no robots here". */
export function verdictFor(status: number | null): LinkVerdict {
  if (status === null) return "broken"
  if (status < 400) return "ok"
  if ([401, 403, 405, 406, 429, 999].includes(status)) return "blocked"
  return "broken"
}
