/**
 * The monthly traffic report, in Portuguese Markdown: how many came, from
 * where, what they read and who got in touch. Data fetching lives in
 * `scripts/traffic-report.ts`; this file only shapes what came back.
 */

/** Brazil has had no daylight saving time since 2019, so the offset is fixed. */
const BRAZIL_OFFSET = "-03:00"
export const REPORT_TIME_ZONE = "America/Sao_Paulo"

export interface ReportPeriod {
  /** `YYYY-MM` */
  month: string
  startAt: number
  endAt: number
  /** "setembro de 2026" */
  label: string
}

export function monthPeriod(month: string): ReportPeriod {
  const match = /^(\d{4})-(\d{2})$/.exec(month)
  if (!match || Number(match[2]) < 1 || Number(match[2]) > 12) throw new Error(`Month must be YYYY-MM, got "${month}"`)
  const year = Number(match[1])
  const index = Number(match[2])
  const next = index === 12 ? `${year + 1}-01` : `${year}-${String(index + 1).padStart(2, "0")}`
  const startAt = Date.parse(`${month}-01T00:00:00${BRAZIL_OFFSET}`)
  const endAt = Date.parse(`${next}-01T00:00:00${BRAZIL_OFFSET}`) - 1
  const label = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: REPORT_TIME_ZONE }).format(new Date(startAt))
  return { month, startAt, endAt, label }
}

/** The month before `now`, in Brazilian time: what a report run on the 1st covers. */
export function previousMonth(now: Date): string {
  const [year, month] = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", timeZone: REPORT_TIME_ZONE }).format(now).split("-").map(Number)
  return month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`
}

export interface Stats {
  pageviews: number
  visitors: number
  visits: number
  bounces: number
  /** Seconds, summed over all visits. */
  totaltime: number
}

/** A ranked row as `/metrics` returns it: `x` is the value, `y` the count. */
export interface MetricRow { x: string | null; y: number }
export interface ValueRow { value: string | null; total: number }
export interface FunnelStepResult { type: string; value: string; visitors: number }

/** Each section is its data, or the reason it could not be fetched. */
export type Section<T> = { ok: true; data: T } | { ok: false; error: string }

export interface TrafficData {
  period: ReportPeriod
  stats: Section<Stats & { comparison?: Stats }>
  channels: Section<MetricRow[]>
  referrers: Section<MetricRow[]>
  sources: Section<MetricRow[]>
  campaigns: Section<MetricRow[]>
  pages: Section<MetricRow[]>
  entries: Section<MetricRow[]>
  events: Section<MetricRow[]>
  contactsBySource: Section<ValueRow[]>
  contactsByFirstSource: Section<ValueRow[]>
  funnels: Section<{ name: string; steps: FunnelStepResult[] }[]>
}

const number = new Intl.NumberFormat("pt-BR")

function change(current: number, previous: number | undefined): string {
  if (previous === undefined) return "—"
  if (previous === 0) return current === 0 ? "0%" : "novo"
  const percent = ((current - previous) / previous) * 100
  return `${percent > 0 ? "+" : ""}${percent.toFixed(0)}%`
}

function duration(seconds: number): string {
  const rounded = Math.round(seconds)
  const minutes = Math.floor(rounded / 60)
  const rest = rounded % 60
  if (!minutes) return `${rest}s`
  return rest ? `${minutes}min ${rest}s` : `${minutes}min`
}

const ratio = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "—")
const cell = (text: string) => text.replace(/\|/g, "\\|")

function unavailable(error: string) {
  return `_Indisponível: ${error}_`
}

function table(rows: { label: string; count: number }[], header: [string, string], empty: string, limit = 10): string {
  const shown = rows.filter((row) => row.count > 0).slice(0, limit)
  if (shown.length === 0) return `_${empty}_`
  return [`| ${header[0]} | ${header[1]} |`, "| --- | ---: |", ...shown.map((row) => `| ${cell(row.label)} | ${number.format(row.count)} |`)].join("\n")
}

const metricRows = (rows: MetricRow[], blank = "(direto / sem origem)") => rows.map((row) => ({ label: row.x || blank, count: row.y }))
const valueRows = (rows: ValueRow[]) => rows.map((row) => ({ label: row.value || "(sem origem)", count: row.total }))

function section<T>(value: Section<T>, render: (data: T) => string): string {
  return value.ok ? render(value.data) : unavailable(value.error)
}

export function buildTrafficReport(data: TrafficData): string {
  const overview = section(data.stats, (stats) => {
    const previous = stats.comparison
    const rows: [string, string, string, string][] = [
      ["Visitantes", number.format(stats.visitors), previous ? number.format(previous.visitors) : "—", change(stats.visitors, previous?.visitors)],
      ["Visitas", number.format(stats.visits), previous ? number.format(previous.visits) : "—", change(stats.visits, previous?.visits)],
      ["Páginas vistas", number.format(stats.pageviews), previous ? number.format(previous.pageviews) : "—", change(stats.pageviews, previous?.pageviews)],
      ["Rejeição (visitas de uma página)", ratio(stats.bounces, stats.visits), previous ? ratio(previous.bounces, previous.visits) : "—", ""],
      ["Tempo médio por visita", stats.visits ? duration(stats.totaltime / stats.visits) : "—", previous?.visits ? duration(previous.totaltime / previous.visits) : "—", ""],
    ]
    return ["| | Mês | Mês anterior | Variação |", "| --- | ---: | ---: | ---: |", ...rows.map((row) => `| ${row.join(" | ")} |`)].join("\n")
  })

  const funnels = section(data.funnels, (list) =>
    list.length === 0
      ? "_Nenhum funil salvo. Crie com `npm run umami:funnels`._"
      : list
          .map(({ name, steps }) => {
            const first = steps[0]?.visitors ?? 0
            const lines = steps.map((step, index) => `${index + 1}. ${step.type === "event" ? "evento" : "página"} \`${step.value}\`: ${number.format(step.visitors)} visitantes${index > 0 ? ` (${ratio(step.visitors, first)} de quem entrou)` : ""}`)
            return [`**${name}**`, "", ...lines].join("\n")
          })
          .join("\n\n"),
  )

  return [
    `# Tráfego de ${data.period.label}`,
    "",
    overview,
    "",
    "## De onde vieram",
    "",
    "### Canais",
    "",
    section(data.channels, (rows) => table(metricRows(rows), ["Canal", "Visitantes"], "Sem dados de canal.")),
    "",
    "### Sites de origem",
    "",
    section(data.referrers, (rows) => table(metricRows(rows), ["Site", "Visitas"], "Nenhum site de origem registrado.")),
    "",
    "### Fontes UTM",
    "",
    section(data.sources, (rows) => table(metricRows(rows, "(sem UTM)"), ["utm_source", "Visitas"], "Nenhum link com UTM foi usado.")),
    "",
    "### Campanhas UTM",
    "",
    section(data.campaigns, (rows) => table(metricRows(rows, "(sem campanha)"), ["utm_campaign", "Visitas"], "Nenhuma campanha registrada.")),
    "",
    "## O que leram",
    "",
    "### Páginas mais vistas",
    "",
    section(data.pages, (rows) => table(metricRows(rows), ["Página", "Visualizações"], "Sem páginas vistas.")),
    "",
    "### Páginas de entrada",
    "",
    section(data.entries, (rows) => table(metricRows(rows), ["Página", "Entradas"], "Sem dados de entrada.")),
    "",
    "## Conversões",
    "",
    "### Eventos",
    "",
    section(data.events, (rows) => table(metricRows(rows), ["Evento", "Vezes"], "Nenhum evento registrado.", 20)),
    "",
    "### Contatos pela origem da visita",
    "",
    section(data.contactsBySource, (rows) => table(valueRows(rows), ["Origem", "Cliques de contato"], "Nenhum contato com origem conhecida.")),
    "",
    "### Contatos pela origem da primeira visita",
    "",
    section(data.contactsByFirstSource, (rows) => table(valueRows(rows), ["Primeira origem", "Cliques de contato"], "Nenhum contato com primeira origem conhecida.")),
    "",
    "## Funis",
    "",
    funnels,
    "",
  ].join("\n")
}
