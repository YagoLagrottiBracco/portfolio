/**
 * Checks the external links inside every article, once per URL, and lists the
 * articles that have gone a year without a revision. Run by hand or by the
 * weekly link-check workflow.
 *
 *   npm run check:article-links
 *
 * "Broken" (404, 410, 5xx, unknown host) fails the run; "blocked" (403, 429,
 * LinkedIn's 999…) means the site refuses robots and needs a look by hand.
 */
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { extractLinks, isExternal, verdictFor } from "../src/lib/article-links"
import { createBlogIndex } from "../src/lib/blog-content"

const STALE_DAYS = 365
const CONCURRENCY = 8

async function status(url: string): Promise<number | null> {
  const attempt = (method: "HEAD" | "GET") =>
    fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(15_000), headers: { "user-agent": "Mozilla/5.0 (compatible; lagrotti.dev link check)" } })
  try {
    const head = await attempt("HEAD")
    // Plenty of servers refuse HEAD but answer GET.
    if (head.status < 400) return head.status
    return (await attempt("GET")).status
  } catch {
    return null
  }
}

async function main() {
  const directory = join(process.cwd(), "src", "content", "blog")
  const posts = createBlogIndex(readdirSync(directory).filter((name) => /\.mdx?$/.test(name)).map((filename) => ({ filename, source: readFileSync(join(directory, filename), "utf8") }))).getAllPosts()

  const usedBy = new Map<string, Set<string>>()
  for (const post of posts) {
    for (const { url } of extractLinks(post.content)) {
      if (!isExternal(url)) continue
      usedBy.set(url, (usedBy.get(url) ?? new Set()).add(post.slug))
    }
  }

  const urls = [...usedBy.keys()]
  const results: { url: string; code: number | null; verdict: ReturnType<typeof verdictFor> }[] = []
  for (let index = 0; index < urls.length; index += CONCURRENCY) {
    results.push(...(await Promise.all(urls.slice(index, index + CONCURRENCY).map(async (url) => {
      const code = await status(url)
      return { url, code, verdict: verdictFor(code) }
    }))))
  }

  const print = (verdict: "broken" | "blocked", title: string) => {
    const rows = results.filter((result) => result.verdict === verdict)
    console.log(`\n${title} (${rows.length})`)
    for (const row of rows) console.log(`  ${String(row.code ?? "no answer").padEnd(10)} ${row.url}\n             in ${[...usedBy.get(row.url)!].join(", ")}`)
  }
  print("broken", "Broken links")
  print("blocked", "Refused to robots (check by hand)")

  const cutoff = Date.now() - STALE_DAYS * 86_400_000
  const stale = posts.filter((post) => Date.parse(post.updatedAt ?? post.date) < cutoff)
  console.log(`\nArticles without a revision for over ${STALE_DAYS} days (${stale.length})`)
  for (const post of stale) console.log(`  ${(post.updatedAt ?? post.date).slice(0, 10)}  ${post.url}`)

  console.log(`\n${results.filter((result) => result.verdict === "ok").length} of ${results.length} external links in ${posts.length} articles answer.`)
  process.exitCode = results.some((result) => result.verdict === "broken") ? 1 : 0
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
