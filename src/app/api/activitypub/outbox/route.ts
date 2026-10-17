import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

import { createBlogIndex } from "@/lib/blog-content"
import { SITE_URL } from "@/lib/site"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  if (process.env.ACTIVITYPUB_MODE !== "native") return Response.json({ error: "ActivityPub is not configured" }, { status: 404 })
  const directory = join(process.cwd(), "src", "content", "blog")
  const posts = createBlogIndex(readdirSync(directory).filter(file => /\.mdx$/.test(file)).map(file => ({
    filename: file,
    source: readFileSync(join(directory, file), "utf8"),
  }))).getAllPosts().slice(0, 20)

  const actor = `${SITE_URL}/fediverse/actor`
  return Response.json({
    "@context": "https://www.w3.org/ns/activitystreams",
    id: `${SITE_URL}/api/activitypub/outbox`,
    type: "OrderedCollection",
    totalItems: posts.length,
    orderedItems: posts.map(post => ({
      id: `${SITE_URL}${post.url}#activity`,
      type: "Create",
      actor,
      published: new Date(post.date).toISOString(),
      object: {
        id: `${SITE_URL}${post.url}`,
        type: "Article",
        name: post.title,
        summary: post.excerpt,
        url: `${SITE_URL}${post.url}`,
        content: post.excerpt,
        published: new Date(post.date).toISOString(),
        attributedTo: actor,
      },
    })),
  }, { headers: { "Content-Type": "application/activity+json" } })
}
