import { readUtm } from "@/lib/utm"

/**
 * Where a visitor came from, kept across pages so that a conversion — a
 * contact click, a résumé download — can be credited to the link that brought
 * them, even when it happens on a later page or a later visit.
 *
 * Two touches are kept: the first one ever (localStorage) and the one that
 * started this visit (sessionStorage). Nothing leaves the browser except as
 * properties of an analytics event.
 */
export interface Touch {
  source: string
  medium?: string
  campaign?: string
  content?: string
  /** Path the visitor landed on. */
  landing: string
}

const FIRST_TOUCH_KEY = "attribution:first"
const SESSION_TOUCH_KEY = "attribution:session"

/**
 * The touch a landing describes: its UTM tags or, failing those, an external
 * referrer. A visit with neither (typed URL, internal navigation) has none.
 */
export function touchFromLanding(href: string, referrer: string): Touch | null {
  const url = new URL(href)
  const utm = readUtm(url.search)
  if (utm.utm_source) {
    return {
      source: utm.utm_source,
      medium: utm.utm_medium,
      campaign: utm.utm_campaign,
      content: utm.utm_content,
      landing: url.pathname,
    }
  }

  if (!referrer) return null
  let referrerHost: string
  try {
    referrerHost = new URL(referrer).hostname.replace(/^www\./, "")
  } catch {
    return null
  }
  if (referrerHost === url.hostname.replace(/^www\./, "")) return null
  return { source: referrerHost, medium: "referral", landing: url.pathname }
}

type StorageLike = Pick<Storage, "getItem" | "setItem">

function read(storage: StorageLike | undefined, key: string): Touch | null {
  try {
    const raw = storage?.getItem(key)
    return raw ? (JSON.parse(raw) as Touch) : null
  } catch {
    return null
  }
}

function write(storage: StorageLike | undefined, key: string, touch: Touch) {
  try {
    storage?.setItem(key, JSON.stringify(touch))
  } catch {
    // Private mode or blocked storage: attribution is a nicety, not a requirement.
  }
}

/** Records a landing: it always becomes this visit's touch, and the first touch if there was none. */
export function recordLanding(touch: Touch | null, local: StorageLike | undefined, session: StorageLike | undefined) {
  if (!touch) return
  write(session, SESSION_TOUCH_KEY, touch)
  if (!read(local, FIRST_TOUCH_KEY)) write(local, FIRST_TOUCH_KEY, touch)
}

/** Flat event properties describing both touches; empty for a visitor nobody referred. */
export function attributionProperties(local: StorageLike | undefined, session: StorageLike | undefined): Record<string, string> {
  const properties: Record<string, string> = {}
  const current = read(session, SESSION_TOUCH_KEY)
  const first = read(local, FIRST_TOUCH_KEY)

  if (current) {
    properties.source = current.source
    if (current.medium) properties.medium = current.medium
    if (current.campaign) properties.campaign = current.campaign
    if (current.content) properties.content = current.content
  }
  if (first) {
    properties.first_source = first.source
    if (first.campaign) properties.first_campaign = first.campaign
  }
  return properties
}

/** The browser's storages, or `undefined` where reading them throws. */
export function browserStorages(): { local?: StorageLike; session?: StorageLike } {
  try {
    return { local: window.localStorage, session: window.sessionStorage }
  } catch {
    return {}
  }
}
