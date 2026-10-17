import { BodyTooLargeError, readBoundedJson } from "@/lib/bounded-body"
/**
 * `POST /api/ask`: one question in, an NDJSON stream of the cited answer out.
 * Guards first (origin, per-IP and per-instance limits, size), then Claude.
 * The SDK call is injected, so tests run without the API.
 */
import Anthropic from "@anthropic-ai/sdk"

import { audit as defaultAudit, clientIp, isSameOrigin, requestId, type AuditLog } from "@/lib/audit-log"
import { buildAskRequest, translateStream, type AskDocument, type AskEvent } from "@/lib/ask/request"
import { retrieveSections, type Section } from "@/lib/ask/retrieval"
import { isLocale, type Locale } from "@/lib/i18n"
import { createRateLimiter, type RateLimiter } from "@/lib/rate-limit"
import { SITE_URL } from "@/lib/site"

type StreamFn = (params: Anthropic.Beta.Messages.MessageCreateParamsStreaming, signal: AbortSignal) => Promise<AsyncIterable<Anthropic.Beta.Messages.BetaRawMessageStreamEvent>>

interface AskHandlerOptions {
  /** Absent while ANTHROPIC_API_KEY is not set: every request answers 503. */
  stream: StreamFn | null
  model?: string
  stableDocuments: (locale: Locale) => AskDocument[]
  sections: (locale: Locale) => Section[]
  /** Per caller IP. */
  limiter?: RateLimiter
  /** Per instance, all callers together: a ceiling on spend if the site is hammered. */
  dailyLimiter?: RateLimiter
  log?: AuditLog
}

const MIN_LENGTH = 3
const MAX_LENGTH = 300

const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } })

export function createAskHandler({
  stream,
  model,
  stableDocuments,
  sections,
  limiter = createRateLimiter({ limit: 8, windowMs: 60 * 60_000 }),
  dailyLimiter = createRateLimiter({ limit: Number(process.env.ASK_DAILY_LIMIT ?? 100), windowMs: 24 * 60 * 60_000 }),
  log = defaultAudit,
}: AskHandlerOptions) {
  return async function handler(request: Request): Promise<Response> {
    const ip = clientIp(request)
    const context = { ip, requestId: requestId(request) }

    if (!isSameOrigin(request, SITE_URL)) {
      log("ask.question", { outcome: "denied", ...context, reason: "origin" })
      return json({ error: "forbidden" }, 403)
    }
    if (!stream) {
      log("ask.question", { outcome: "error", ...context, reason: "unconfigured" })
      return json({ error: "unavailable" }, 503)
    }

    const ipLimit = limiter.hit(ip)
    if (!ipLimit.allowed || !dailyLimiter.hit("all").allowed) {
      log("ask.question", { outcome: "limited", ...context })
      return Response.json({ error: "limited" }, { status: 429, headers: { "Retry-After": String(ipLimit.retryAfterSeconds || 3600) } })
    }

    let body: { question?: unknown; locale?: unknown }
    try {
      body = await readBoundedJson(request, 4_000) as typeof body
    } catch (error) {
      const tooLarge = error instanceof BodyTooLargeError
      log("ask.question", { outcome: "invalid", ...context, reason: tooLarge ? "body_too_large" : "invalid_body" })
      return json({ error: "invalid" }, tooLarge ? 413 : 400)
    }
    const question = typeof body?.question === "string" ? body.question.replace(/\s+/g, " ").trim() : ""
    const locale: Locale = isLocale(body?.locale) ? body.locale : "pt"
    if (question.length < MIN_LENGTH || question.length > MAX_LENGTH) {
      log("ask.question", { outcome: "invalid", ...context, reason: "invalid_fields" })
      return json({ error: "invalid" }, 400)
    }

    const stable = stableDocuments(locale)
    const retrieved = retrieveSections(question, sections(locale)).map((section) => ({ title: section.title, url: section.url, text: section.text }))
    const documents = [...stable, ...retrieved]
    const params = buildAskRequest({ question, locale, stableDocuments: stable, retrievedDocuments: retrieved, model })
    // The question itself is not logged: it may hold things a visitor would not want kept.
    log("ask.question", { outcome: "ok", ...context, locale, chars: question.length, retrieved: retrieved.length })

    const encoder = new TextEncoder()
    const output = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: AskEvent) => controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`))
        try {
          for await (const event of translateStream(await stream(params, request.signal), documents)) send(event)
        } catch (error) {
          if (!request.signal.aborted) {
            log("ask.question", { outcome: "error", ...context, reason: "provider_error" })
            send({ t: "error", code: error instanceof Anthropic.RateLimitError || error instanceof Anthropic.InternalServerError ? "busy" : "unavailable" })
          }
        } finally {
          controller.close()
        }
      },
    })
    return new Response(output, { headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" } })
  }
}
