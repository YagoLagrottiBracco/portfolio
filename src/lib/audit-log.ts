/**
 * Who did what through the write APIs (publishing, the editor, the newsletter).
 *
 * Two records, for two lifetimes:
 * - a JSON line in the function logs for every attempt, refused ones included.
 *   Vercel keeps runtime logs only briefly on the Hobby plan, so a log drain is
 *   what makes these durable;
 * - git trailers on every commit the APIs make, which last as long as the history.
 *
 * Never pass secrets or request bodies in `fields`.
 */
export type AuditOutcome = "ok" | "denied" | "limited" | "invalid" | "conflict" | "error"

export type AuditLog = (action: string, fields: { outcome: AuditOutcome } & Record<string, unknown>) => void

export const audit: AuditLog = (action, fields) => {
  console.info(JSON.stringify({ audit: action, at: new Date().toISOString(), ...fields }))
}

/** The caller's address as Vercel reports it: it overwrites `x-forwarded-for`, so the first entry is trustworthy there. */
export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown"
}

/** Vercel's id for the request, which also names it in the dashboard logs. */
export function requestId(request: Request): string | undefined {
  return request.headers.get("x-vercel-id") ?? undefined
}

/** `message` followed by git trailers (`Key: value` lines after a blank line); empty values are skipped. */
export function withTrailers(message: string, trailers: Record<string, string | undefined>): string {
  const lines = Object.entries(trailers)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .map(([key, value]) => `${key}: ${value.replace(/[\r\n]+/g, " ")}`)
  return lines.length ? `${message.trimEnd()}\n\n${lines.join("\n")}` : message
}

/**
 * True when the request comes from a page of this site (or carries no Origin,
 * as same-origin GETs and some navigations do). Compares the Origin header
 * with the host the request was addressed to — what a cross-site form or
 * fetch cannot fake — and also accepts the canonical site.
 */
export function isSameOrigin(request: Request, siteUrl: string): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true
  let host: string
  try {
    host = new URL(origin).host
  } catch {
    return false
  }
  const addressed = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? new URL(request.url).host
  return host === addressed || origin === siteUrl
}
