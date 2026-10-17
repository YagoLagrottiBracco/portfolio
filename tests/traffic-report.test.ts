import assert from "node:assert/strict"
import test from "node:test"
import { buildTrafficReport, monthPeriod, previousMonth, type TrafficData } from "../src/lib/traffic-report"
import { createUmamiClient, funnels, UmamiError } from "../src/lib/umami"

test("a month runs from midnight to midnight in Brazilian time", () => {
  const period = monthPeriod("2026-09")
  assert.equal(new Date(period.startAt).toISOString(), "2026-09-01T03:00:00.000Z")
  assert.equal(new Date(period.endAt).toISOString(), "2026-10-01T02:59:59.999Z")
  assert.equal(period.label, "setembro de 2026")
  assert.equal(new Date(monthPeriod("2026-12").endAt).toISOString(), "2027-01-01T02:59:59.999Z")
  assert.throws(() => monthPeriod("2026-13"))
})

test("the report covers the month before the run, in Brazil", () => {
  assert.equal(previousMonth(new Date("2026-10-01T12:00:00Z")), "2026-09")
  // 1 January at 01:00 UTC is still 31 December in Brazil.
  assert.equal(previousMonth(new Date("2027-01-01T01:00:00Z")), "2026-11")
  assert.equal(previousMonth(new Date("2027-01-15T12:00:00Z")), "2026-12")
})

const ok = <T,>(data: T) => ({ ok: true as const, data })

test("renders numbers, sources, conversions and funnels, and says what failed", () => {
  const data: TrafficData = {
    period: monthPeriod("2026-09"),
    stats: ok({ pageviews: 1200, visitors: 300, visits: 400, bounces: 200, totaltime: 36000, comparison: { pageviews: 1000, visitors: 250, visits: 350, bounces: 175, totaltime: 31500 } }),
    channels: ok([{ x: "organic search", y: 150 }, { x: "social", y: 90 }]),
    referrers: ok([{ x: "google.com", y: 140 }, { x: null, y: 80 }]),
    sources: ok([{ x: "linkedin", y: 60 }, { x: "a|b", y: 1 }]),
    campaigns: ok([]),
    pages: ok([{ x: "/blog/artigo", y: 500 }]),
    entries: ok([{ x: "/", y: 120 }]),
    events: ok([{ x: "contact_click", y: 7 }, { x: "cv_download", y: 3 }]),
    contactsBySource: ok([{ value: "linkedin", total: 4 }]),
    contactsByFirstSource: { ok: false, error: "Umami answered 500" },
    funnels: ok([{ name: "Artigo → contato", steps: [{ type: "path", value: "/blog/*", visitors: 200 }, { type: "event", value: "contact_click", visitors: 5 }] }]),
  }
  const report = buildTrafficReport(data)

  assert.match(report, /^# Tráfego de setembro de 2026\n/)
  assert.match(report, /\| Visitantes \| 300 \| 250 \| \+20% \|/)
  assert.match(report, /\| Rejeição \(visitas de uma página\) \| 50% \| 50% \|/)
  assert.match(report, /\| Tempo médio por visita \| 1min 30s \| 1min 30s \|/)
  assert.match(report, /\| google\.com \| 140 \|\n\| \(direto \/ sem origem\) \| 80 \|/)
  assert.match(report, /\| a\\\|b \| 1 \|/, "pipes in values do not break the table")
  assert.match(report, /### Campanhas UTM\n\n_Nenhuma campanha registrada\._/)
  assert.match(report, /\| contact_click \| 7 \|/)
  assert.match(report, /### Contatos pela origem da primeira visita\n\n_Indisponível: Umami answered 500_/)
  assert.match(report, /2\. evento `contact_click`: 5 visitantes \(3% de quem entrou\)/)
})

test("calls Umami Cloud with the key as a Bearer token and reports HTTP errors", async () => {
  const urls: string[] = []
  let headers: Record<string, string> = {}
  const fetcher = (async (url: string, init: RequestInit) => {
    urls.push(url)
    headers = init.headers as Record<string, string>
    return url.includes("broken") ? new Response("{}", { status: 500 }) : Response.json([{ x: "/", y: 1 }])
  }) as unknown as typeof fetch
  const umami = createUmamiClient({ apiKey: "key", websiteId: "site-1", fetch: fetcher })

  assert.deepEqual(await umami.get("/metrics", { type: "path", startAt: 1, endAt: 2, limit: undefined }), [{ x: "/", y: 1 }])
  assert.equal(urls[0], "https://api.umami.is/v1/websites/site-1/metrics?type=path&startAt=1&endAt=2")
  assert.equal(headers.Authorization, "Bearer key")
  await assert.rejects(umami.get("/broken"), (error: unknown) => error instanceof UmamiError && error.status === 500)
})

test("funnel definitions are valid Umami steps", () => {
  for (const funnel of funnels) {
    assert.ok(funnel.steps.length >= 2, funnel.name)
    for (const step of funnel.steps) {
      assert.ok(step.type === "path" || step.type === "event")
      // Umami only accepts a wildcard at the end of a path.
      if (step.type === "path") assert.ok(!step.value.slice(0, -1).includes("*"), step.value)
    }
  }
  assert.equal(new Set(funnels.map((funnel) => funnel.name)).size, funnels.length, "names identify funnels")
})
