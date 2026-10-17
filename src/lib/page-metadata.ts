import type { Metadata } from "next"

import { locales, localeTags, type Locale } from "@/lib/i18n"
import { getPagePath, type LocalizedPage } from "@/lib/page-routes"

/** Every language a standalone page exists in, keyed by hreflang tag. */
export function getPageAlternates(page: LocalizedPage): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [localeTags[locale], getPagePath(locale, page)])),
    "x-default": getPagePath("pt", page),
  }
}

export function buildPageMetadata(page: LocalizedPage, locale: Locale, { title, description }: { title: string; description: string }): Metadata {
  const path = getPagePath(locale, page)
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: title }

  return {
    title,
    description,
    alternates: { canonical: path, languages: getPageAlternates(page) },
    openGraph: { type: "website", title, description, url: path, locale: localeTags[locale].replace("-", "_"), images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  }
}
