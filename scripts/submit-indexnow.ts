import { parseArgs } from "node:util"
import { buildIndexNowPayload, INDEXNOW_ENDPOINT } from "../src/lib/resource-participation"
import { getParticipationCanonicalUrls } from "../src/lib/resource-participation-server"
import { changedSince, parseSitemap } from "../src/lib/indexnow"
import { SITE_URL } from "../src/lib/site"

async function boundedText(response: Response, max: number): Promise<string> {
  if (!response.ok || Number(response.headers.get("content-length")) > max) throw Error("Production response is unavailable or oversized")
  const reader = response.body?.getReader()
  if (!reader) throw Error("Missing production response body")
  let size = 0
  const parts: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > max) { await reader.cancel(); throw Error("Production response exceeds limit") }
    parts.push(value)
  }
  return Buffer.concat(parts).toString("utf8")
}

async function main() {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: {
    publish: { type: "boolean", default: false }, submit: { type: "boolean", default: false },
    "dry-run": { type: "boolean", default: false }, all: { type: "boolean", default: false }, since: { type: "string" },
  } })
  if (values["dry-run"] && (values.publish || values.submit)) throw Error("Choose --dry-run or --publish")
  if (values.since !== undefined && (!/^\d+$/.test(values.since) || Number(values.since) > 3650 || values.all || positionals.length)) throw Error("Use --since 0–3650 without --all or explicit URLs")
  const known = new Set(getParticipationCanonicalUrls())
  let selected = positionals.length ? positionals : [...known]
  if (selected.some(url => !known.has(url))) throw Error("Only known canonical site pages can be submitted")
  if (values.since !== undefined || values.publish || values.submit) {
    const response = await fetch(`${SITE_URL}/sitemap.xml`, { redirect: "error", signal: AbortSignal.timeout(10_000) })
    const entries = parseSitemap(await boundedText(response, 5_000_000))
    const live = new Set(entries.map(entry => entry.url))
    if (positionals.some(url => !live.has(url))) throw Error("Requested page is absent from the deployed sitemap; no submission sent")
    selected = values.since !== undefined
      ? changedSince(entries, new Date(Date.now() - Number(values.since) * 86_400_000)).filter(url => known.has(url))
      : selected.filter(url => live.has(url))
  }
  if (selected.some(url => !known.has(url))) throw Error("Only known canonical site pages can be submitted")
  if (!selected.length) { console.log(JSON.stringify({ dryRun: !values.publish && !values.submit, urls: 0 })); return }
  const payload = buildIndexNowPayload(selected)
  if (!values.publish && !values.submit) { console.log(JSON.stringify({ dryRun: true, endpoint: INDEXNOW_ENDPOINT, payload }, null, 2)); return }
  const keyResponse = await fetch(payload.keyLocation, { redirect: "error", signal: AbortSignal.timeout(10_000), cache: "no-store" })
  if ((await boundedText(keyResponse, 256)).trim() !== payload.key) throw Error("Production key mismatch; no submission sent")
  const response = await fetch(INDEXNOW_ENDPOINT, { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify(payload), redirect: "error", signal: AbortSignal.timeout(15_000) })
  await response.body?.cancel()
  if (response.status !== 200 && response.status !== 202) throw Error(`IndexNow rejected submission (HTTP ${response.status}); indexing is not guaranteed`)
  console.log(JSON.stringify({ submitted: true, status: response.status, urls: payload.urlList.length, message: "Received; indexing and ranking are not guaranteed." }))
}
main().catch(error => { console.error(error instanceof Error ? error.message : "IndexNow submission failed"); process.exitCode = 1 })
