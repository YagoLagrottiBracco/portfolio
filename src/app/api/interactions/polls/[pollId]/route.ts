import { getPollDefinition, getPollResults, interactionsConfigured, voteInPoll } from "@/lib/interactions"
import { isLocale, type Locale } from "@/lib/i18n"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const buckets = new Map<string, { count: number; resetAt: number }>()

function rateLimit(request: Request): boolean {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local"
  const now = Date.now()
  const bucket = buckets.get(forwarded)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(forwarded, { count: 1, resetAt: now + 10 * 60 * 1000 })
    return true
  }
  bucket.count += 1
  return bucket.count <= 20
}

function resolveLocale(request: Request): Locale {
  const value = new URL(request.url).searchParams.get("locale")
  return isLocale(value) ? value : "pt"
}

function localize(results: NonNullable<Awaited<ReturnType<typeof getPollResults>>>, locale: Locale) {
  return {
    configured: results.configured,
    total: results.total,
    options: results.options.map(option => ({ ...option, label: option.label[locale] ?? option.label.pt })),
  }
}

export async function GET(request: Request, context: { params: Promise<{ pollId: string }> }) {
  const { pollId } = await context.params
  if (!getPollDefinition(pollId)) return Response.json({ error: "Unknown poll" }, { status: 404 })
  const results = await getPollResults(pollId)
  if (!results) return Response.json({ error: "Unknown poll" }, { status: 404 })
  return Response.json(localize(results, resolveLocale(request)))
}

export async function POST(request: Request, context: { params: Promise<{ pollId: string }> }) {
  const { pollId } = await context.params
  if (!interactionsConfigured()) return Response.json({ configured: false }, { status: 503 })
  if (!rateLimit(request)) return Response.json({ error: "Too many requests" }, { status: 429 })

  const body = await request.json().catch(() => null) as { option?: unknown } | null
  if (typeof body?.option !== "string") return Response.json({ error: "Option is required" }, { status: 400 })

  const results = await voteInPoll(pollId, body.option)
  if (!results) return Response.json({ error: "Unknown poll or option" }, { status: 404 })
  return Response.json(localize(results, resolveLocale(request)))
}
