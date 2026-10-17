import type { Metadata } from "next"

import { stackCopy, techPageData } from "@/components/organisms/StackScreens"
import type { TechEntry } from "@/data/stack"
import { locales, localeTags, type Locale } from "@/lib/i18n"
import { getStackPath, techName } from "@/lib/stack"

export function getStackAlternates(slug?: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [localeTags[locale], getStackPath(locale, slug)])),
    "x-default": getStackPath("pt", slug),
  }
}

export function buildStackMetadata(locale: Locale, entry?: TechEntry): Metadata {
  const text = stackCopy[locale]
  const path = getStackPath(locale, entry?.slug)
  const title = entry ? text.metaTitle(techName(entry, locale)) : text.indexTitle
  const description = entry ? text.metaDescription(techName(entry, locale), text.counts(techPageData(entry, locale).counts)) : text.indexMeta
  const image = { url: `/og/stack/${locale}/${entry?.slug ?? "index"}`, width: 1200, height: 630, alt: title }
  return {
    title,
    description,
    alternates: { canonical: path, languages: getStackAlternates(entry?.slug) },
    openGraph: { type: "website", title, description, url: path, locale: localeTags[locale].replace("-", "_"), images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  }
}
