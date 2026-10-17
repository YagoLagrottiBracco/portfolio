/**
 * Tells IndexNow (Bing, Yandex and the engines that share it) which pages
 * changed. Reads the live sitemap, so run it after a deploy.
 *
 *   INDEXNOW_KEY=… npm run indexnow                 # pages changed in the last 3 days
 *   INDEXNOW_KEY=… npm run indexnow -- --since 14   # … in the last 14 days
 *   INDEXNOW_KEY=… npm run indexnow -- --all        # every page in the sitemap
 *   INDEXNOW_KEY=… npm run indexnow -- https://lagrotti.dev/blog/x
 *
 * `.github/workflows/indexnow.yml` runs it after each production deploy.
 */
import { parseArgs } from "node:util"

import { changedSince, INDEXNOW_ENDPOINT, indexNowPayload, isIndexNowKey, parseSitemap } from "../src/lib/indexnow"
import { SITE_URL } from "../src/lib/site"

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { since: { type: "string", default: "3" }, all: { type: "boolean", default: false } },
})

async function main() {
  const key = process.env.INDEXNOW_KEY
  if (!isIndexNowKey(key)) {
    console.error("Set INDEXNOW_KEY: 8-128 letters, digits or dashes (docs/operations.md).")
    process.exitCode = 1
    return
  }

  let urls = positionals
  if (urls.length === 0) {
    const entries = parseSitemap(await (await fetch(`${SITE_URL}/sitemap.xml`)).text())
    urls = values.all ? entries.map((entry) => entry.url) : changedSince(entries, new Date(Date.now() - Number(values.since) * 86_400_000))
  }
  const payload = indexNowPayload({ siteUrl: SITE_URL, key, urls })
  if (payload.urlList.length === 0) {
    console.log("Nothing changed in that window; no ping sent.")
    return
  }

  const response = await fetch(INDEXNOW_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(payload) })
  // 200: received. 202: received, key still being verified (first pings).
  console.log(`IndexNow answered ${response.status} for ${payload.urlList.length} URL(s):`)
  for (const url of payload.urlList) console.log(`  ${url}`)
  if (response.status !== 200 && response.status !== 202) process.exitCode = 1
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
