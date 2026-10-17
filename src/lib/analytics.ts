import { attributionProperties, browserStorages } from "@/lib/attribution"

/**
 * The handful of actions worth counting on top of page views: they are what
 * tells a visit that read from a visit that reached out.
 *
 * Events go to Umami, which records them on the Hobby plan (Vercel Analytics
 * only counts page views there). Each one carries where the visitor came from,
 * so a contact can be credited to the link that brought them.
 */
export type EventName =
  | "cv_download"
  | "contact_click"
  | "project_link_click"
  | "article_click"
  /** A share button under an article; `network` says which. */
  | "article_share"
  | "article_print"
  | "newsletter_signup"
  /** The vCard was downloaded. */
  | "contact_save"
  | "brief_submitted"
  /** Calendly embed: a time was picked, then the booking was confirmed. */
  | "meeting_slot_selected"
  | "meeting_booked"
  /** A result picked in the site-wide search, with the query (≤ 40 characters). */
  | "site_search"
  | "testimonial_submitted"

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Record<string, string>) => void }
  }
}

export function trackEvent(name: EventName, properties: Record<string, string>) {
  const { local, session } = browserStorages()
  window.umami?.track(name, { ...properties, ...attributionProperties(local, session) })
}
