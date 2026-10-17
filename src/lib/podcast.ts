/**
 * Podcast feed (RSS 2.0 with the iTunes tags Apple and Spotify read) for the
 * recorded articles of one language.
 */
import type { Episode } from "@/data/podcast"
import type { BlogPost } from "@/lib/blog-content"
import { localeTags, type Locale } from "@/lib/i18n"

const channel: Record<Locale, { title: string; description: string; path: string }> = {
  pt: { title: "Yago Lagrotti Bracco — artigos em áudio", description: "Os artigos do blog sobre arquitetura, produtos digitais, IA e entrega de software, lidos em voz alta.", path: "/blog" },
  en: { title: "Yago Lagrotti Bracco — articles in audio", description: "The blog's articles on architecture, digital products, AI and software delivery, read aloud.", path: "/en/blog" },
  es: { title: "Yago Lagrotti Bracco — artículos en audio", description: "Los artículos del blog sobre arquitectura, productos digitales, IA y entrega de software, leídos en voz alta.", path: "/es/blog" },
}

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")

function duration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

/** The episode of `post`, if it was recorded. */
export function episodeFor(post: Pick<BlogPost, "translationKey" | "locale">, list: Episode[]): Episode | undefined {
  return list.find((episode) => episode.translationKey === post.translationKey && episode.locale === post.locale)
}

/** `null` when the language has no recorded episode, so the route can answer 404. */
export function buildPodcastFeed({ locale, episodes, posts, siteUrl, author, email }: { locale: Locale; episodes: Episode[]; posts: BlogPost[]; siteUrl: string; author: string; email: string }): string | null {
  const items = episodes
    .filter((episode) => episode.locale === locale)
    .flatMap((episode) => {
      const post = posts.find((candidate) => candidate.translationKey === episode.translationKey && candidate.locale === locale)
      return post ? [{ episode, post }] : []
    })
    .sort((a, b) => Date.parse(b.episode.publishedAt) - Date.parse(a.episode.publishedAt))
  if (items.length === 0) return null

  const text = channel[locale]
  const image = `${siteUrl}/podcast-cover.png`
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(text.title)}</title>`,
    `    <link>${escapeXml(`${siteUrl}${text.path}`)}</link>`,
    `    <description>${escapeXml(text.description)}</description>`,
    `    <language>${localeTags[locale]}</language>`,
    `    <atom:link href="${escapeXml(`${siteUrl}${text.path}/podcast.xml`)}" rel="self" type="application/rss+xml"/>`,
    `    <itunes:author>${escapeXml(author)}</itunes:author>`,
    `    <itunes:owner><itunes:name>${escapeXml(author)}</itunes:name><itunes:email>${escapeXml(email)}</itunes:email></itunes:owner>`,
    `    <itunes:image href="${escapeXml(image)}"/>`,
    '    <itunes:category text="Technology"/>',
    "    <itunes:explicit>false</itunes:explicit>",
    ...items.map(({ episode, post }) => [
      "    <item>",
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${escapeXml(`${siteUrl}${post.url}`)}</link>`,
      `      <guid isPermaLink="false">${escapeXml(`${post.translationKey}:${locale}`)}</guid>`,
      `      <pubDate>${new Date(episode.publishedAt).toUTCString()}</pubDate>`,
      `      <description>${escapeXml(post.excerpt)}</description>`,
      `      <enclosure url="${escapeXml(episode.audioUrl)}" length="${episode.bytes}" type="${episode.audioUrl.endsWith(".m4a") ? "audio/x-m4a" : "audio/mpeg"}"/>`,
      `      <itunes:duration>${duration(episode.durationSeconds)}</itunes:duration>`,
      "    </item>",
    ].join("\n")),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n")
}
