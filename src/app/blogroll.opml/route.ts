import { blogroll } from "@/data/discovery"
import { getBlogFeedPath } from "@/lib/blog-routes"
import { locales } from "@/lib/i18n"
import { SITE_URL } from "@/lib/site"

export const dynamic = "force-static"

function escapeXml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

export function GET() {
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<opml version="2.0">',
    "  <head><title>Yago Lagrotti — feeds</title></head>",
    "  <body>",
    ...locales.map(locale => `    <outline text="Yago Lagrotti (${locale})" title="Yago Lagrotti (${locale})" type="rss" xmlUrl="${SITE_URL}${getBlogFeedPath(locale)}" htmlUrl="${SITE_URL}${locale === "pt" ? "" : `/${locale}`}/blog"/>`),
    ...blogroll.filter(item => "feedUrl" in item && typeof item.feedUrl === "string").map(item => `    <outline text="${escapeXml(item.name)}" title="${escapeXml(item.name)}" type="rss" xmlUrl="${escapeXml(item.feedUrl)}" htmlUrl="${escapeXml(item.url)}"/>`),
    "  </body>",
    "</opml>",
    "",
  ].join("\n")
  return new Response(body, { headers: { "Content-Type": "text/x-opml; charset=utf-8" } })
}
