/**
 * UTM parameters: the tags on a link that say where a visit came from.
 * Pure functions, shared by the browser (reading a landing URL), the feeds and
 * the résumé (tagging the links they hand out) and `npm run utm`.
 */
export const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const

export type UtmKey = (typeof UTM_KEYS)[number]
export type Utm = Partial<Record<UtmKey, string>>

/** UTM values found in a query string; blank values are dropped and the rest lower-cased. */
export function readUtm(search: string): Utm {
  const params = new URLSearchParams(search)
  const utm: Utm = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim().toLowerCase()
    if (value) utm[key] = value
  }
  return utm
}

/** `url` with the given UTM values set, keeping its other query parameters and its hash. */
export function withUtm(url: string, utm: Utm): string {
  const parsed = new URL(url)
  for (const key of UTM_KEYS) {
    const value = utm[key]
    if (value) parsed.searchParams.set(key, value)
  }
  return parsed.toString()
}
