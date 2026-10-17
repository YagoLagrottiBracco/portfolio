import { episodes } from "@/data/podcast"
import { personalData } from "@/data/personal"
import { getAllPosts } from "@/lib/blog"
import type { Locale } from "@/lib/i18n"
import { buildPodcastFeed } from "@/lib/podcast"
import { SITE_URL } from "@/lib/site"

/** The podcast feed response for one language; 404 until it has an episode. */
export function podcastResponse(locale: Locale): Response {
  const feed = buildPodcastFeed({ locale, episodes, posts: getAllPosts(locale), siteUrl: SITE_URL, author: personalData.name, email: personalData.socialLinks.email })
  return feed
    ? new Response(feed, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
    : new Response("No episodes yet", { status: 404 })
}
