import {
  getResourceEntry,
  getResourceEntries,
  resourceSections,
} from "./resource-catalog"
import { getResourcePath } from "./resource-routes"
import { type Locale, isLocale, localeTags } from "./i18n"
import { SITE_URL } from "./site"
import { withUtm } from "./utm"
import { ECOSYSTEM_DATE, ECOSYSTEM_VERSION } from "@/data/resources/ecosystem"

export function escapeResourceXml(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&apos;",
        })[char]!
    )
}
export function resolvePublicResource(id: string, locale: Locale) {
  if (!isLocale(locale) || !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(id))
    throw new Error("Invalid resource")
  const [section, slug] = id.split("/")
  const entry = getResourceEntry(section, slug)
  if (!entry) throw new Error("Unknown resource")
  return {
    id,
    section,
    entry,
    url: SITE_URL + getResourcePath(locale, section, slug),
  }
}
function wrap(text: string, width: number, max: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ")
  const lines: string[] = []
  let line = ""
  for (const word of words) {
    if (line && line.length + word.length + 1 > width) {
      lines.push(line)
      line = word
    } else line += (line ? " " : "") + word
  }
  if (line) lines.push(line)
  return lines.slice(0, max).map(
    (value, index) =>
      Array.from(value)
        .slice(0, width + 10)
        .join("") + (index === max - 1 && lines.length > max ? "…" : "")
  )
}
export function buildResourceCard(id: string, locale: Locale): string {
  const { entry, url } = resolvePublicResource(id, locale)
  const titles = wrap(entry.title[locale], 42, 2),
    descriptions = wrap(entry.description[locale], 68, 3)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="320" viewBox="0 0 800 320" role="img" aria-labelledby="title description"><title id="title">${escapeResourceXml(entry.title[locale])}</title><desc id="description">${escapeResourceXml(url)}</desc><rect width="800" height="320" rx="20" fill="#0a0a0a"/><rect x="1" y="1" width="798" height="318" rx="19" fill="none" stroke="#404040"/><g font-family="system-ui, sans-serif"><text x="32" y="45" fill="#60a5fa" font-size="15">YAGO LAGROTTI BRACCO · OPEN RESOURCES</text>${titles.map((line, index) => `<text x="32" y="${94 + index * 36}" fill="#fafafa" font-size="29" font-weight="700">${escapeResourceXml(line)}</text>`).join("")}${descriptions.map((line, index) => `<text x="32" y="${190 + index * 24}" fill="#d4d4d4" font-size="17">${escapeResourceXml(line)}</text>`).join("")}<text x="32" y="292" fill="#60a5fa" font-size="15">lagrotti.dev · ${escapeResourceXml(locale.toUpperCase())}</text></g></svg>`
}
export const shortResourceLinks = [
  { code: "kit", resource: "campanhas/kit-engenharia" },
  { code: "json", resource: "ferramentas/json" },
  { code: "env", resource: "ferramentas/env" },
  { code: "filas", resource: "demos/queue" },
  { code: "worker", resource: "templates/worker" },
  { code: "adr", resource: "templates/adr" },
  { code: "ecossistema", resource: "ecossistema/terminal" },
  { code: "desafios", resource: "ecossistema/desafios" },
] as const
export function getShortDestination(
  code: string,
  locale: Locale = "pt"
): string {
  const link = shortResourceLinks.find((item) => item.code === code)
  if (!link || !isLocale(locale)) throw new Error("Unknown short link")
  return withUtm(resolvePublicResource(link.resource, locale).url, {
    utm_source: "qr",
    utm_medium: "offline",
    utm_campaign: "recursos-2026-10",
    utm_content: code,
  })
}
export function getShortResourceUrl(code: string, locale: Locale): string {
  getShortDestination(code, locale)
  return `${SITE_URL}/r/${code}${locale === "pt" ? "" : `?lang=${locale}`}`
}
export function buildResourceFeed(
  locale: Locale,
  resource?: string,
  section?: string
): string {
  if (!isLocale(locale)) throw new Error("Invalid locale")
  if (section && !resourceSections.some((item) => item.slug === section))
    throw new Error("Invalid section")
  if (resource) resolvePublicResource(resource, locale)
  const records = resourceSections
    .filter((item) => !section || item.slug === section)
    .flatMap((collection) =>
      getResourceEntries(collection.slug).map((entry) => ({
        section: collection.slug,
        entry,
        id: `${collection.slug}/${entry.slug}`,
      }))
    )
    .filter((item) => !resource || item.id === resource)
  if (resource && section && !records.length)
    throw new Error("Resource does not belong to selected section")
  const feedUrl = new URL(SITE_URL + getResourcePath(locale) + "/feed.xml")
  if (resource) feedUrl.searchParams.set("resource", resource)
  if (section) feedUrl.searchParams.set("section", section)
  const copy = {
    pt: [
      "Lançamentos dos recursos",
      "Materiais de engenharia para usar e acompanhar.",
    ],
    en: ["Resource releases", "Engineering materials to use and follow."],
    es: [
      "Lanzamientos de recursos",
      "Materiales de ingeniería para usar y seguir.",
    ],
  }[locale]
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Yago Lagrotti Bracco — ${copy[0]}</title><link>${SITE_URL + getResourcePath(locale)}</link><description>${copy[1]}</description><language>${localeTags[locale]}</language><lastBuildDate>${new Date(ECOSYSTEM_DATE + "T12:00:00Z").toUTCString()}</lastBuildDate><atom:link href="${escapeResourceXml(feedUrl.toString())}" rel="self" type="application/rss+xml"/>${records.map(({ entry, id, section: group }) => `<item><title>${escapeResourceXml(entry.title[locale])} · v${ECOSYSTEM_VERSION}</title><link>${escapeResourceXml(withUtm(SITE_URL + getResourcePath(locale, group, entry.slug), { utm_source: "resource-rss", utm_medium: "feed" }))}</link><guid isPermaLink="false">urn:lagrotti:resource:${escapeResourceXml(id)}:${ECOSYSTEM_VERSION}:${locale}</guid><pubDate>${new Date(ECOSYSTEM_DATE + "T12:00:00Z").toUTCString()}</pubDate><category>${escapeResourceXml(group)}</category><description>${escapeResourceXml(entry.description[locale])}</description></item>`).join("")}</channel></rss>\n`
}
