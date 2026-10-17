import { BodyTooLargeError, readBoundedBody } from "@/lib/bounded-body"
import { audit as defaultAudit, clientIp, isSameOrigin, requestId, type AuditLog, type AuditOutcome } from "@/lib/audit-log"
import type { RateLimiter } from "@/lib/rate-limit"
import { SITE_URL } from "@/lib/site"

/**
 * What every public form endpoint on the site does before its own work:
 * refuse other origins, cap attempts per IP, read JSON or a plain HTML form,
 * drop bots caught by the hidden field, and answer the way the caller asked.
 *
 * Scripts (Accept: application/json) get `{ status }`; a plain form gets a
 * 303 back to its page with `#<fragment>-<status>`, where `:target` shows the
 * message — so every form also works without JavaScript.
 */
export interface FormSubmission {
  /** Path of the page the form was on, already validated as a local path. */
  page: string
  /** The hidden field; anything in it came from a bot. */
  trap: string
}

interface FormEndpointOptions<T extends FormSubmission, S extends string> {
  /** Audit action, e.g. `newsletter.subscribe`. */
  action: string
  /** Prefix of the no-JS fragment: `newsletter` → `#newsletter-<status>`. */
  fragment: string
  statuses: { ok: S; invalid: S; unavailable: S }
  httpStatus: Record<S, number>
  limiter: RateLimiter
  log?: AuditLog
  maxBytes?: number
  parse(fields: Record<string, unknown>): T | null
  /** Extra audit fields; never the person's message or email. */
  describe?(submission: T): Record<string, unknown>
  handle(submission: T, context: { ip: string }): Promise<S>
}

/** A local path to return to, or "/" — never another site, never a header break. */
export function localPage(value: unknown): string {
  const page = typeof value === "string" ? value.trim() : ""
  return /^\/(?![/\\])[^\s\\]{0,200}$/.test(page) ? page : "/"
}

export function createFormEndpoint<T extends FormSubmission, S extends string>(options: FormEndpointOptions<T, S>) {
  const log = options.log ?? defaultAudit
  const { ok, invalid, unavailable } = options.statuses

  return async function handler(request: Request): Promise<Response> {
    const ip = clientIp(request)
    const base = { ip, requestId: requestId(request) }
    const wantsJson = (request.headers.get("accept") ?? "").includes("application/json")
    let page = "/"

    const respond = (status: S, httpStatus = options.httpStatus[status]) =>
      wantsJson
        ? Response.json({ status }, { status: httpStatus, headers: { "Cache-Control": "no-store" } })
        : new Response(null, { status: 303, headers: { Location: `${page}#${options.fragment}-${status}`, "Cache-Control": "no-store" } })

    if (!isSameOrigin(request, SITE_URL)) {
      log(options.action, { outcome: "denied", ...base, reason: "origin" })
      return Response.json({ status: invalid }, { status: 403 })
    }

    const limit = options.limiter.hit(ip)
    if (!limit.allowed) {
      log(options.action, { outcome: "limited", ...base })
      return respond(unavailable, 429)
    }

    let fields: Record<string, unknown>
    try {
      const bytes = await readBoundedBody(request, options.maxBytes ?? 10_000)
      const contentType = request.headers.get("content-type") ?? ""
      fields = contentType.includes("application/json")
        ? JSON.parse(new TextDecoder().decode(bytes))
        : Object.fromEntries(await new Response(bytes as BodyInit, { headers: { "content-type": contentType } }).formData())
    } catch (error) {
      const tooLarge = error instanceof BodyTooLargeError
      log(options.action, { outcome: "invalid", ...base, reason: tooLarge ? "body_too_large" : "invalid_body" })
      return respond(invalid, tooLarge ? 413 : options.httpStatus[invalid])
    }

    const submission = fields && typeof fields === "object" ? options.parse(fields) : null
    if (!submission) {
      page = localPage(fields?.page)
      log(options.action, { outcome: "invalid", ...base, reason: "invalid_fields" })
      return respond(invalid)
    }
    page = submission.page
    const context = { ...base, page, ...options.describe?.(submission) }

    if (submission.trap) {
      // Look like success, so the bot learns nothing.
      log(options.action, { outcome: "denied", ...context, reason: "trap" })
      return respond(ok)
    }

    let status: S
    try {
      status = await options.handle(submission, { ip })
    } catch {
      status = unavailable
    }
    const outcome: AuditOutcome = status === ok ? "ok" : status === invalid ? "invalid" : "error"
    log(options.action, { outcome, ...context })
    return respond(status)
  }
}
