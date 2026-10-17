import { audit as defaultAudit, clientIp, requestId, type AuditLog } from "@/lib/audit-log"
import { isLocale, type Locale } from "@/lib/i18n"
import { createRateLimiter, type RateLimiter } from "@/lib/rate-limit"
import { SITE_URL } from "@/lib/site"

/**
 * Newsletter signups, sent to Buttondown, which mails the confirmation link:
 * nobody is subscribed until they click it (double opt-in).
 *
 * Responses never say whether an address was already subscribed — "check your
 * inbox" covers both cases — so the form cannot be used to probe who reads.
 */
export type SubscribeStatus = "pending" | "invalid" | "unavailable"

export interface Subscription {
  email: string
  locale: Locale
  /** Path of the page the form was on; the signup is credited to it. */
  page: string
  source?: string
  medium?: string
  campaign?: string
  firstSource?: string
  firstCampaign?: string
  /** A field hidden from people: anything in it came from a bot. */
  trap: string
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/** Attribution values as `src/lib/attribution.ts` stores them: UTM tags or a referrer host. */
const TAG = /^[a-z0-9][a-z0-9._-]{0,99}$/

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "")
const tag = (value: unknown) => {
  const candidate = text(value).toLowerCase()
  return TAG.test(candidate) ? candidate : undefined
}

/** A subscription from the form fields, or `null` when the address is unusable. */
export function parseSubscription(input: Record<string, unknown>): Subscription | null {
  const email = text(input.email)
  if (email.length > 254 || !EMAIL.test(email)) return null
  const page = text(input.page)
  return {
    email,
    locale: isLocale(input.locale) ? input.locale : "pt",
    // Only a path on this site: it becomes the redirect target of the no-JS form.
    page: /^\/(?![/\\])[^\s\\]{0,200}$/.test(page) ? page : "/",
    source: tag(input.source),
    medium: tag(input.medium),
    campaign: tag(input.campaign),
    firstSource: tag(input.first_source),
    firstCampaign: tag(input.first_campaign),
    trap: text(input.website),
  }
}

const ALREADY_SUBSCRIBED = new Set(["email_already_exists", "subscriber_already_exists"])
const REFUSED_ADDRESS = new Set(["email_invalid", "email_empty", "email_blocked", "subscriber_blocked", "subscriber_suppressed", "ip_address_spammy"])

/** Creates the subscriber at Buttondown. See https://docs.buttondown.com/api-subscribers-create */
export async function subscribe(subscription: Subscription, { apiKey, ip, fetch: fetcher = fetch }: { apiKey: string; ip?: string; fetch?: typeof fetch }): Promise<SubscribeStatus> {
  const response = await fetcher("https://api.buttondown.com/v1/subscribers", {
    method: "POST",
    headers: { Authorization: `Token ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email_address: subscription.email,
      referrer_url: `${SITE_URL}${subscription.page}`,
      ...(subscription.source ? { utm_source: subscription.source } : {}),
      ...(subscription.medium ? { utm_medium: subscription.medium } : {}),
      ...(subscription.campaign ? { utm_campaign: subscription.campaign } : {}),
      metadata: {
        locale: subscription.locale,
        page: subscription.page,
        ...(subscription.firstSource ? { first_source: subscription.firstSource } : {}),
        ...(subscription.firstCampaign ? { first_campaign: subscription.firstCampaign } : {}),
      },
      // Buttondown uses it to stop spam signups and to place the subscriber.
      ...(ip && ip !== "unknown" ? { ip_address: ip } : {}),
    }),
  })

  if (response.status === 201) return "pending"
  if (response.status === 409) return "pending"
  if (response.status === 400) {
    const code = await response.json().then((body: { code?: unknown }) => body?.code, () => undefined)
    if (typeof code === "string" && ALREADY_SUBSCRIBED.has(code)) return "pending"
    if (typeof code === "string" && REFUSED_ADDRESS.has(code)) return "invalid"
  }
  return "unavailable"
}

const HTTP_STATUS: Record<SubscribeStatus, number> = { pending: 200, invalid: 400, unavailable: 503 }

interface NewsletterHandlerOptions {
  apiKey: string | undefined
  fetch?: typeof fetch
  /** Per caller IP: a person subscribes once, a script many times. */
  limiter?: RateLimiter
  log?: AuditLog
}

export function createNewsletterHandler({ apiKey, fetch: fetcher, limiter = createRateLimiter({ limit: 5, windowMs: 60 * 60_000 }), log = defaultAudit }: NewsletterHandlerOptions) {
  return async function handler(request: Request): Promise<Response> {
    const ip = clientIp(request)
    const wantsJson = (request.headers.get("accept") ?? "").includes("application/json")
    let page = "/"

    // The JavaScript form reads JSON; the plain HTML form follows a redirect
    // back to its page, where `#newsletter-<status>` reveals the message.
    const respond = (status: SubscribeStatus, httpStatus = HTTP_STATUS[status]) =>
      wantsJson
        ? Response.json({ status }, { status: httpStatus, headers: { "Cache-Control": "no-store" } })
        : new Response(null, { status: 303, headers: { Location: `${page}#newsletter-${status}`, "Cache-Control": "no-store" } })

    const origin = request.headers.get("origin")
    if (origin && origin !== new URL(request.url).origin && origin !== SITE_URL) {
      log("newsletter.subscribe", { outcome: "denied", ip, requestId: requestId(request), reason: "origin" })
      return Response.json({ status: "invalid" }, { status: 403 })
    }

    const limit = limiter.hit(ip)
    if (!limit.allowed) {
      log("newsletter.subscribe", { outcome: "limited", ip, requestId: requestId(request) })
      return respond("unavailable", 429)
    }

    if (Number(request.headers.get("content-length")) > 10_000) return respond("invalid", 413)
    let fields: Record<string, unknown>
    try {
      fields = (request.headers.get("content-type") ?? "").includes("application/json")
        ? await request.json()
        : Object.fromEntries(await request.formData())
    } catch {
      return respond("invalid")
    }

    const subscription = fields && typeof fields === "object" ? parseSubscription(fields) : null
    if (!subscription) return respond("invalid")
    page = subscription.page
    const context = { ip, requestId: requestId(request), locale: subscription.locale, page: subscription.page, source: subscription.source }

    if (subscription.trap) {
      // Look like success, so the bot learns nothing.
      log("newsletter.subscribe", { outcome: "denied", ...context, reason: "trap" })
      return respond("pending")
    }
    if (!apiKey) {
      log("newsletter.subscribe", { outcome: "error", ...context, reason: "not configured" })
      return respond("unavailable")
    }

    let status: SubscribeStatus
    try {
      status = await subscribe(subscription, { apiKey, ip, fetch: fetcher })
    } catch {
      status = "unavailable"
    }
    log("newsletter.subscribe", { outcome: status === "pending" ? "ok" : status === "invalid" ? "invalid" : "error", ...context })
    return respond(status)
  }
}
