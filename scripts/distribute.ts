import { readFileSync, readdirSync } from "node:fs"
import { parseArgs } from "node:util"
import { configuredHttpsUrl } from "../src/lib/distribution-config"
import { join } from "node:path"

import { createBlogIndex, type BlogPost } from "../src/lib/blog-content"

const { values } = parseArgs({ options: { publish: { type: "boolean", default: false }, "dry-run": { type: "boolean", default: false }, slug: { type: "string" } } })
if (values.publish && values["dry-run"]) throw Error("Choose --dry-run or --publish")
const dryRun = !values.publish
const slug = values.slug
const maxAgeHours = Number(process.env.DISTRIBUTE_MAX_AGE_HOURS ?? 48)

function latestPost(): BlogPost | null {
  const directory = join(process.cwd(), "src", "content", "blog")
  const index = createBlogIndex(readdirSync(directory).filter(file => /\.mdx$/.test(file)).sort().map(file => ({
    filename: file,
    source: readFileSync(join(directory, file), "utf8"),
  })))
  const posts = index.getAllPosts().sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
  const selected = slug ? posts.find(post => post.slug === slug) : posts[0]
  if (!selected) return null
  if (!slug && Date.now() - Date.parse(selected.date) > maxAgeHours * 60 * 60 * 1000) return null
  return selected
}

function message(post: BlogPost) {
  return `${post.title}\n\n${post.excerpt}\n\nhttps://lagrotti.dev${post.url}`
}

async function mastodon(text: string): Promise<string | null> {
  const instance = configuredHttpsUrl(process.env.MASTODON_INSTANCE)
  const token = process.env.MASTODON_ACCESS_TOKEN
  if (!instance || !token) return null
  const response = await fetch(`${instance.replace(/\/$/, "")}/api/v1/statuses`, {
    method: "POST",
    signal: AbortSignal.timeout(15_000), redirect: "error",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ status: text }),
  })
  if (!response.ok) throw new Error(`Mastodon failed: ${response.status}`)
  return "mastodon"
}

async function telegram(text: string): Promise<string | null> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return null
  const response = await fetch(`https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`, {
    method: "POST",
    signal: AbortSignal.timeout(15_000), redirect: "error",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: false }),
  })
  if (!response.ok) throw new Error(`Telegram failed: ${response.status}`)
  return "telegram"
}

async function bluesky(text: string): Promise<string | null> {
  const handle = process.env.BLUESKY_HANDLE
  const password = process.env.BLUESKY_APP_PASSWORD
  const service = configuredHttpsUrl(process.env.BLUESKY_SERVICE ?? "https://bsky.social")?.replace(/\/$/, "")
  if (!handle || !password || !service) return null
  const session = await fetch(`${service}/xrpc/com.atproto.server.createSession`, {
    method: "POST",
    signal: AbortSignal.timeout(15_000), redirect: "error",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: handle, password }),
  })
  if (!session.ok) throw new Error(`Bluesky session failed: ${session.status}`)
  const { accessJwt, did } = await session.json() as { accessJwt: string; did: string }
  const createdAt = new Date().toISOString()
  const response = await fetch(`${service}/xrpc/com.atproto.repo.createRecord`, {
    method: "POST",
    signal: AbortSignal.timeout(15_000), redirect: "error",
    headers: { Authorization: `Bearer ${accessJwt}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      repo: did,
      collection: "app.bsky.feed.post",
      record: { $type: "app.bsky.feed.post", text, createdAt, langs: ["pt", "en", "es"] },
    }),
  })
  if (!response.ok) throw new Error(`Bluesky post failed: ${response.status}`)
  return "bluesky"
}

async function linkedin(text: string): Promise<string | null> {
  const token = process.env.LINKEDIN_ACCESS_TOKEN
  const personUrn = process.env.LINKEDIN_PERSON_URN
  if (!token || !personUrn) return null
  const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
    method: "POST",
    signal: AbortSignal.timeout(15_000), redirect: "error",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "X-Restli-Protocol-Version": "2.0.0" },
    body: JSON.stringify({
      author: personUrn,
      lifecycleState: "PUBLISHED",
      specificContent: { "com.linkedin.ugc.ShareContent": { shareCommentary: { text }, shareMediaCategory: "NONE" } },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    }),
  })
  if (!response.ok) throw new Error(`LinkedIn failed: ${response.status}`)
  return "linkedin"
}

async function main() {
const post = latestPost()
if (!post) {
  console.log("No recent post matched the distribution window.")
  return
}

const text = message(post)
if (dryRun) {
  console.log(`[dry-run] ${post.url}\n${text}`)
  return
}

const targets = [mastodon, telegram, bluesky, linkedin]
const published: string[] = []
for (const target of targets) {
  try {
    const name = await target(text)
    if (name) published.push(name)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}
console.log(published.length ? `Distributed to: ${published.join(", ")}` : "No distribution channel configured.")

}
main().catch(error => { console.error(error instanceof Error ? error.message : "Social distribution failed"); process.exitCode = 1 })
