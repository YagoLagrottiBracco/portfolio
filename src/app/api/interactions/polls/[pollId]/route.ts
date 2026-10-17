import { getPollDefinition, getPollResults, interactionsConfigured, voteInPoll } from "@/lib/interactions"
import { isLocale, type Locale } from "@/lib/i18n"
import { clientIp } from "@/lib/audit-log"
import { createRateLimiter } from "@/lib/rate-limit"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Best effort per process; eviction and cold starts reset individual windows.
const limiter = createRateLimiter({ limit: 20, windowMs: 10 * 60 * 1000, maxKeys: 1000 })

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
  try {
    const results = await getPollResults(pollId)
    if (!results) return Response.json({ error: "Unknown poll" }, { status: 404 })
    return Response.json(localize(results, resolveLocale(request)))
  } catch {
    return Response.json({ error: "Interaction store unavailable" }, { status: 503 })
  }
}

export async function POST(request: Request, context: { params: Promise<{ pollId: string }> }) {
  const { pollId } = await context.params
  if (!getPollDefinition(pollId)) return Response.json({ error: "Unknown poll" }, { status: 404 })
  if (!interactionsConfigured()) return Response.json({ configured: false }, { status: 503 })
  const limit = limiter.hit(clientIp(request))
  if (!limit.allowed) return Response.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } })

  const body = await request.json().catch(() => null) as { option?: unknown } | null
  if (typeof body?.option !== "string") return Response.json({ error: "Option is required" }, { status: 400 })

  try {
    const results = await voteInPoll(pollId, body.option)
    if (!results) return Response.json({ error: "Unknown poll or option" }, { status: 404 })
    return Response.json(localize(results, resolveLocale(request)))
  } catch {
    return Response.json({ error: "Interaction store unavailable" }, { status: 503 })
  }
}
