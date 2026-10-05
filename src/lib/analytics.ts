import { track } from "@vercel/analytics"

/**
 * The handful of actions worth counting on top of page views: they are what
 * tells a visit that read from a visit that reached out.
 */
type EventName = "cv_download" | "contact_click" | "project_link_click" | "article_click"

export function trackEvent(name: EventName, properties: Record<string, string>) {
  track(name, properties)
}
