import { parseArgs } from "node:util"
import { webSubHub } from "../src/lib/distribution-config"
import { getBlogFeedPath } from "../src/lib/blog-routes"
import { locales } from "../src/lib/i18n"
import { SITE_URL } from "../src/lib/site"

async function main() {
  const { values } = parseArgs({ options: { publish: { type: "boolean", default: false }, "dry-run": { type: "boolean", default: false } } })
  if (values.publish && values["dry-run"]) throw Error("Choose --dry-run or --publish")
  const hub = webSubHub()
  if (!hub) {
    if (process.env.WEBSUB_HUB_URL) throw Error("WEBSUB_HUB_URL must be an HTTPS URL without credentials or a fragment")
    console.log(JSON.stringify({ dryRun: !values.publish, configured: false, topics: [] }))
    return
  }
  const topics = locales.map(locale => `${SITE_URL}${getBlogFeedPath(locale)}`)
  if (!values.publish) { console.log(JSON.stringify({ dryRun: true, hub, topics }, null, 2)); return }
  for (const topic of topics) {
    const response = await fetch(hub, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ "hub.mode": "publish", "hub.url": topic }), signal: AbortSignal.timeout(10_000), redirect: "error" })
    await response.body?.cancel()
    if (!response.ok) throw Error(`WebSub publish failed (HTTP ${response.status})`)
  }
  console.log(JSON.stringify({ published: true, topics: topics.length }))
}
main().catch(error => { console.error(error instanceof Error ? error.message : "WebSub publication failed"); process.exitCode = 1 })
