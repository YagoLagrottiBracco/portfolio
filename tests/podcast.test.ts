import assert from "node:assert/strict"
import test from "node:test"
import type { BlogPost } from "../src/lib/blog-content"
import { buildPodcastFeed, episodeFor } from "../src/lib/podcast"

const post: BlogPost = {
  translationKey: "kafka", title: "Kafka & eventos", slug: "kafka", excerpt: "Resumo <curto>", date: "2026-09-01", tags: ["kafka"],
  locale: "pt", content: "## A\n\nTexto.", url: "/blog/kafka", readingMinutes: 4,
}
const episode = { translationKey: "kafka", locale: "pt" as const, audioUrl: "https://cdn.example/kafka.mp3", bytes: 4_200_000, durationSeconds: 3725, publishedAt: "2026-10-01" }

test("no episode, no feed", () => {
  assert.equal(buildPodcastFeed({ locale: "pt", episodes: [], posts: [post], siteUrl: "https://lagrotti.dev", author: "Yago", email: "y@example.com" }), null)
  assert.equal(buildPodcastFeed({ locale: "en", episodes: [episode], posts: [post], siteUrl: "https://lagrotti.dev", author: "Yago", email: "y@example.com" }), null, "episodes of other languages do not count")
})

test("a recorded article becomes an episode podcast apps can read", () => {
  const feed = buildPodcastFeed({ locale: "pt", episodes: [episode], posts: [post], siteUrl: "https://lagrotti.dev", author: "Yago", email: "y@example.com" })!
  assert.match(feed, /xmlns:itunes="http:\/\/www\.itunes\.com\/dtds\/podcast-1\.0\.dtd"/)
  assert.match(feed, /<title>Kafka &amp; eventos<\/title>/)
  assert.match(feed, /<enclosure url="https:\/\/cdn\.example\/kafka\.mp3" length="4200000" type="audio\/mpeg"\/>/)
  assert.match(feed, /<itunes:duration>01:02:05<\/itunes:duration>/)
  assert.match(feed, /<itunes:image href="https:\/\/lagrotti\.dev\/podcast-cover\.png"\/>/)
  assert.match(feed, /<description>Resumo &lt;curto&gt;<\/description>/)
  assert.equal(episodeFor(post, [episode]), episode)
  assert.equal(episodeFor({ ...post, locale: "es" }, [episode]), undefined)
})
