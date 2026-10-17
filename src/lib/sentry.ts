/**
 * Browser errors to Sentry without its SDK (develop.sentry.dev/sdk/data-model/envelopes):
 * a DSN parser and the envelope a single error travels in. No imports, so
 * `security-headers.ts` (loaded by next.config.ts) can use it too.
 */
export interface SentryDsn {
  /** Where the browser sends: also the origin the CSP must allow. */
  origin: string
  envelopeUrl: string
  /** CSP violation reports, in the browser's own report format. */
  securityUrl: string
  dsn: string
}

/** `https://PUBLIC_KEY@HOST/PROJECT_ID`, or `null` for anything else. */
export function parseDsn(dsn: string | undefined): SentryDsn | null {
  if (!dsn) return null
  let url: URL
  try {
    url = new URL(dsn)
  } catch {
    return null
  }
  const project = url.pathname.replace(/^\/+|\/+$/g, "")
  if (url.protocol !== "https:" || !url.username || !/^\d+$/.test(project)) return null
  const key = encodeURIComponent(url.username)
  return {
    origin: url.origin,
    envelopeUrl: `${url.origin}/api/${project}/envelope/?sentry_key=${key}&sentry_version=7`,
    securityUrl: `${url.origin}/api/${project}/security/?sentry_key=${key}`,
    dsn,
  }
}

export interface BrowserError {
  type: string
  message: string
  stack?: string
  url: string
  userAgent: string
  locale?: string
  release?: string
}

/** One error as an envelope: header, item header, event, one JSON object per line. */
export function buildEnvelope(error: BrowserError, dsn: string, now = new Date(), eventId = crypto.randomUUID().replace(/-/g, "")): string {
  const event = {
    event_id: eventId,
    timestamp: now.getTime() / 1000,
    platform: "javascript",
    level: "error",
    logger: "browser",
    environment: "production",
    ...(error.release ? { release: error.release } : {}),
    request: { url: error.url, headers: { "User-Agent": error.userAgent } },
    exception: { values: [{ type: error.type, value: error.message.slice(0, 500) }] },
    tags: { path: new URL(error.url).pathname, ...(error.locale ? { locale: error.locale } : {}) },
    extra: error.stack ? { stack: error.stack.slice(0, 4000) } : {},
  }
  return [JSON.stringify({ event_id: eventId, sent_at: now.toISOString(), dsn }), JSON.stringify({ type: "event" }), JSON.stringify(event)].join("\n")
}

/** Errors that are not the site's: browser extensions, cross-origin scripts, a famous benign loop. */
export function isNoise(message: string, source?: string): boolean {
  if (source && /^(chrome|moz|safari)(-web)?-extension:/.test(source)) return true
  return /^Script error\.?$|ResizeObserver loop|Non-Error promise rejection captured/i.test(message)
}
