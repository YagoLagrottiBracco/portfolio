/**
 * Does the live site still work? Checks what a visitor and a recruiter reach
 * first: the home, the blog and its newest article, the PDF résumé, the
 * sitemap and the newsletter API. Plain Node, no dependencies, so the hourly
 * workflow (.github/workflows/uptime.yml) runs it without `npm ci`.
 *
 *   node scripts/uptime-check.mjs                         # https://lagrotti.dev
 *   node scripts/uptime-check.mjs http://127.0.0.1:3000   # any other deploy
 *
 * Exits 1 when a check fails twice in a row (a single cold start is not an outage).
 */
import { pathToFileURL } from "node:url"

const TIMEOUT_MS = 15_000
const SLOW_MS = 8_000

/** Each check: what to fetch and what a working answer looks like. `body` reads the response text. */
export const checks = [
  { name: "Home", path: "/", type: "text/html", contains: "</html>" },
  { name: "Blog", path: "/blog", type: "text/html", contains: "</html>" },
  { name: "Feed", path: "/blog/feed.xml", type: "xml", contains: "<item>" },
  { name: "Artigo mais recente", path: "@article", type: "text/html", contains: "<article" },
  { name: "Currículo (PDF)", path: "/cv/pt", type: "application/pdf", startsWith: "%PDF" },
  { name: "Sitemap", path: "/sitemap.xml", type: "xml", contains: "<urlset" },
  {
    name: "API da newsletter",
    path: "/api/newsletter",
    // An address that can never subscribe: the API must refuse it, which proves it runs.
    init: { method: "POST", headers: { accept: "application/json", "content-type": "application/json" }, body: JSON.stringify({ email: "uptime-check", page: "/" }) },
    status: [400, 429],
  },
]

/** The newest article's path, from the feed's first item. */
export function firstArticlePath(feed, base) {
  const item = feed.match(/<item>[\s\S]*?<link>([^<]+)<\/link>/)
  if (!item) return null
  const url = new URL(item[1].trim(), base)
  return url.pathname
}

/** What is wrong with a response, or null when it is fine. */
export function verdict(check, { status, type, body, ms }) {
  const expected = check.status ?? [200]
  if (!expected.includes(status)) return `HTTP ${status}, esperado ${expected.join(" ou ")}`
  if (check.type && !(type ?? "").includes(check.type)) return `tipo ${type || "ausente"}, esperado ${check.type}`
  if (check.contains && !body.includes(check.contains)) return `resposta sem "${check.contains}"`
  if (check.startsWith && !body.startsWith(check.startsWith)) return `resposta não começa com "${check.startsWith}"`
  if (ms > SLOW_MS) return `lento: ${ms} ms`
  return null
}

async function probe(base, check, path) {
  const started = Date.now()
  try {
    const response = await fetch(new URL(path, base), { redirect: "follow", signal: AbortSignal.timeout(TIMEOUT_MS), headers: { "user-agent": "lagrotti.dev uptime check" }, ...check.init })
    const body = await response.text()
    const result = { status: response.status, type: response.headers.get("content-type"), body, ms: Date.now() - started }
    return { ...result, problem: verdict(check, result) }
  } catch (error) {
    return { status: 0, body: "", ms: Date.now() - started, problem: error?.name === "TimeoutError" ? `sem resposta em ${TIMEOUT_MS / 1000} s` : String(error?.cause?.code ?? error?.message ?? error) }
  }
}

export async function run(base, { retryDelayMs = 5_000, log = console.log } = {}) {
  let article = null
  let failed = 0
  for (const check of checks) {
    const path = check.path === "@article" ? article : check.path
    if (!path) {
      log(`✖ ${check.name}: sem artigo para testar, porque o feed falhou ou veio vazio`)
      failed++
      continue
    }
    let result = await probe(base, check, path)
    if (result.problem) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs))
      result = await probe(base, check, path)
    }
    if (check.path === "/blog/feed.xml" && !result.problem) article = firstArticlePath(result.body, base)
    if (result.problem) failed++
    log(`${result.problem ? "✖" : "✔"} ${check.name} (${path}): ${result.problem ?? `HTTP ${result.status} em ${result.ms} ms`}`)
  }
  return failed
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const base = process.argv[2] ?? process.env.SITE_URL ?? "https://lagrotti.dev"
  // No top-level await: the tests load this file through tsx, which compiles it to CommonJS.
  void run(base).then((failed) => {
    if (failed) {
      console.log(`\n${failed} verificação(ões) falharam em ${base}.`)
      process.exitCode = 1
    }
  })
}
