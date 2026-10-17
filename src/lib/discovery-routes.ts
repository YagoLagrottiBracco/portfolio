import { isDiscoverySlug, type DiscoverySlug } from "@/data/discovery-slugs"
import type { Locale } from "@/lib/i18n"

const segment = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function getDiscoveryPath(locale: Locale, slug: DiscoverySlug): string {
  if (!segment.test(slug)) throw new Error("Invalid discovery segment")
  return `${locale === "pt" ? "" : `/${locale}`}/${slug}`
}

export function parseDiscoveryPath(pathname: string): { locale: Locale; slug: DiscoverySlug } | null {
  const match = /^(?:\/(en|es))?\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(pathname)
  if (!match || !isDiscoverySlug(match[2])) return null
  return { locale: (match[1] ?? "pt") as Locale, slug: match[2] as DiscoverySlug }
}
