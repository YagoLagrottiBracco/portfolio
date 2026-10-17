/**
 * Prints last month's traffic report (Markdown, in Portuguese) from Umami Cloud.
 *
 *   UMAMI_API_KEY=… UMAMI_WEBSITE_ID=… npm run report:traffic
 *   npm run report:traffic -- --month 2026-09
 *
 * The scheduled workflow `.github/workflows/traffic-report.yml` runs it on the
 * first day of each month and opens an issue with the result.
 */
import { parseArgs } from "node:util"

import {
  buildTrafficReport,
  monthPeriod,
  previousMonth,
  REPORT_TIME_ZONE,
  type FunnelStepResult,
  type MetricRow,
  type Section,
  type Stats,
  type ValueRow,
} from "../src/lib/traffic-report"
import { createUmamiClient } from "../src/lib/umami"

const { values } = parseArgs({ options: { month: { type: "string" } } })
const apiKey = process.env.UMAMI_API_KEY
const websiteId = process.env.UMAMI_WEBSITE_ID
if (!apiKey || !websiteId) {
  console.error("Set UMAMI_API_KEY and UMAMI_WEBSITE_ID (see docs/utm.md).")
  process.exit(1)
}

const period = monthPeriod(values.month ?? previousMonth(new Date()))
// UMAMI_API_URL points elsewhere for a self-hosted Umami (its `/api` root).
const umami = createUmamiClient({ apiKey, websiteId, baseUrl: process.env.UMAMI_API_URL })
const range = { startAt: period.startAt, endAt: period.endAt, timezone: REPORT_TIME_ZONE }

/** A failed call becomes a note in its section instead of failing the report. */
async function attempt<T>(load: () => Promise<T>): Promise<Section<T>> {
  try {
    return { ok: true, data: await load() }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

const metric = (type: string) => attempt(() => umami.get<MetricRow[]>("/metrics", { ...range, type, limit: 10 }))
const contactsBy = (propertyName: string) =>
  attempt(() => umami.get<ValueRow[]>("/event-data/values", { ...range, eventName: "contact_click", propertyName }))

async function main() {
  const [stats, channels, referrers, sources, campaigns, pages, entries, events, contactsBySource, contactsByFirstSource, funnels] = await Promise.all([
    attempt(() => umami.get<Stats & { comparison?: Stats }>("/stats", { ...range, compare: "prev" })),
    metric("channel"),
    metric("referrer"),
    metric("utmSource"),
    metric("utmCampaign"),
    metric("path"),
    metric("entry"),
    attempt(() => umami.get<MetricRow[]>("/metrics", { ...range, type: "event", limit: 20 })),
    contactsBy("source"),
    contactsBy("first_source"),
    attempt(async () => {
      const saved = await umami.get<{ data: { id: string; name: string }[] }>("/funnels", { pageSize: 20 })
      return Promise.all(saved.data.map(async (funnel) => ({
        name: funnel.name,
        steps: await umami.get<FunnelStepResult[]>(`/funnels/${encodeURIComponent(funnel.id)}/stats`, { startAt: period.startAt, endAt: period.endAt, timezone: REPORT_TIME_ZONE }),
      })))
    }),
  ])

  process.stdout.write(buildTrafficReport({ period, stats, channels, referrers, sources, campaigns, pages, entries, events, contactsBySource, contactsByFirstSource, funnels }))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
