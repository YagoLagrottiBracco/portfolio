import assert from "node:assert/strict"
import test from "node:test"
import type { BlogPost } from "../src/lib/blog-content"
import { buildBlogFeed } from "../src/lib/blog-feed"
import { getBlogFeedPath } from "../src/lib/blog-routes"
import { getFilterTags } from "../src/lib/blog-tags"

const post = (overrides: Partial<BlogPost>): BlogPost => ({
  translationKey: "key", title: "Title", slug: "slug", excerpt: "Excerpt", date: "2026-08-14", tags: ["a"],
  locale: "en", content: "## Body", url: "/blog/slug", readingMinutes: 1, ...overrides,
})

test("maps each locale to its feed URL", () => {
  assert.equal(getBlogFeedPath("pt"), "/blog/feed.xml")
  assert.equal(getBlogFeedPath("en"), "/en/blog/feed.xml")
  assert.equal(getBlogFeedPath("es"), "/es/blog/feed.xml")
})

test("builds an RSS feed with absolute links and escaped text", () => {
  const feed = buildBlogFeed(
    [post({ title: "Kafka & ClickHouse <fast>", slug: "kafka", url: "/blog/kafka", tags: ["saas", "c++ & go"], updatedAt: "2026-09-01" })],
    "en",
    "https://lagrotti.dev",
  )
  assert.match(feed, /^<\?xml version="1\.0" encoding="UTF-8"\?>\n<rss version="2\.0"/)
  assert.match(feed, /<language>en-US<\/language>/)
  assert.match(feed, /<link>https:\/\/lagrotti\.dev\/en\/blog<\/link>/)
  assert.match(feed, /<atom:link href="https:\/\/lagrotti\.dev\/en\/blog\/feed\.xml" rel="self"/)
  assert.match(feed, /<title>Kafka &amp; ClickHouse &lt;fast&gt;<\/title>/)
  assert.match(feed, /<guid isPermaLink="true">https:\/\/lagrotti\.dev\/blog\/kafka<\/guid>/)
  assert.match(feed, /<pubDate>Fri, 14 Aug 2026 00:00:00 GMT<\/pubDate>/)
  assert.match(feed, /<lastBuildDate>Tue, 01 Sep 2026 00:00:00 GMT<\/lastBuildDate>/)
  assert.match(feed, /<category>c\+\+ &amp; go<\/category>/)
})

test("an empty feed is still valid and carries no build date", () => {
  const feed = buildBlogFeed([], "pt", "https://lagrotti.dev")
  assert.doesNotMatch(feed, /<item>|<lastBuildDate>/)
  assert.match(feed, /<link>https:\/\/lagrotti\.dev\/blog<\/link>/)
})

test("offers as filters only the tags shared by several posts, most used first", () => {
  const tags = getFilterTags([
    { tags: ["next.js", "saas"] },
    { tags: ["next.js", "architecture", "architecture"] },
    { tags: ["architecture", "next.js", "one-off"] },
    { tags: ["saas"] },
  ])
  assert.deepEqual(tags, [
    { tag: "next.js", count: 3 },
    { tag: "architecture", count: 2 },
    { tag: "saas", count: 2 },
  ])
})
