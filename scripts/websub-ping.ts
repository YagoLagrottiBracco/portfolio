const hub = process.env.WEBSUB_HUB_URL
const siteUrl = (process.env.SITE_URL ?? "https://lagrotti.dev").replace(/\/$/, "")
const topics = [`${siteUrl}/blog/feed.xml`, `${siteUrl}/en/blog/feed.xml`, `${siteUrl}/es/blog/feed.xml`]

if (!hub) {
  console.log("WEBSUB_HUB_URL is not configured; feeds keep working without a WebSub ping.")
  process.exit(0)
}

let failed = false
for (const topic of topics) {
  const body = new URLSearchParams({ "hub.mode": "publish", "hub.url": topic })
  const response = await fetch(hub, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body })
  console.log(`${response.ok ? "ok" : "failed"} ${topic} (${response.status})`)
  if (!response.ok) failed = true
}
process.exit(failed ? 1 : 0)

export {}
