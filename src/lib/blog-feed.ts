import type { BlogPost } from "@/lib/blog-content"
import { getBlogFeedPath, getBlogIndexPath } from "@/lib/blog-routes"
import { localeTags, type Locale } from "@/lib/i18n"

const channelCopy: Record<Locale, { title: string; description: string }> = {
  pt: {
    title: "Yago Lagrotti Bracco — Blog de engenharia de software",
    description: "Notas técnicas sobre arquitetura, produtos digitais, IA e entrega de software.",
  },
  en: {
    title: "Yago Lagrotti Bracco — Software engineering blog",
    description: "Technical notes on architecture, digital products, AI, and software delivery.",
  },
  es: {
    title: "Yago Lagrotti Bracco — Blog de ingeniería de software",
    description: "Notas técnicas sobre arquitectura, productos digitales, IA y entrega de software.",
  },
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/** RSS 2.0 feed for one locale's posts, newest first as the blog index lists them. */
export function buildBlogFeed(posts: BlogPost[], locale: Locale, siteUrl: string): string {
  const copy = channelCopy[locale]
  const newest = posts.reduce<number | null>((latest, post) => {
    const time = Date.parse(post.updatedAt ?? post.date)
    return latest === null || time > latest ? time : latest
  }, null)

  const items = posts.map((post) => {
    const url = `${siteUrl}${post.url}`
    return [
      "    <item>",
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${escapeXml(url)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
      `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
      `      <description>${escapeXml(post.excerpt)}</description>`,
      ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
      "    </item>",
    ].join("\n")
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(copy.title)}</title>`,
    `    <link>${escapeXml(`${siteUrl}${getBlogIndexPath(locale)}`)}</link>`,
    `    <description>${escapeXml(copy.description)}</description>`,
    `    <language>${localeTags[locale]}</language>`,
    `    <atom:link href="${escapeXml(`${siteUrl}${getBlogFeedPath(locale)}`)}" rel="self" type="application/rss+xml"/>`,
    ...(newest === null ? [] : [`    <lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>`]),
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n")
}
