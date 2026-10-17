import type { AuditLog } from "@/lib/audit-log"
import { createFormEndpoint, localPage } from "@/lib/form-endpoint"
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
  return {
    email,
    locale: isLocale(input.locale) ? input.locale : "pt",
    // Only a path on this site: it becomes the redirect target of the no-JS form.
    page: localPage(input.page),
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

export function createNewsletterHandler({ apiKey, fetch: fetcher, limiter = createRateLimiter({ limit: 5, windowMs: 60 * 60_000 }), log }: NewsletterHandlerOptions) {
  return createFormEndpoint<Subscription, SubscribeStatus>({
    action: "newsletter.subscribe",
    fragment: "newsletter",
    statuses: { ok: "pending", invalid: "invalid", unavailable: "unavailable" },
    httpStatus: HTTP_STATUS,
    limiter,
    log,
    parse: parseSubscription,
    describe: (subscription) => ({ locale: subscription.locale, source: subscription.source }),
    handle: async (subscription, { ip }) => (apiKey ? subscribe(subscription, { apiKey, ip, fetch: fetcher }) : "unavailable"),
  })
}
