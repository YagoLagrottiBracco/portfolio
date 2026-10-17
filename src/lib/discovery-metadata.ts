import type { Metadata } from "next"

import { discoveryPages, type DiscoverySlug } from "@/data/discovery"
import { locales, localeTags, type Locale } from "@/lib/i18n"
import { getDiscoveryPath } from "@/lib/discovery-routes"

import { SITE_URL } from "@/lib/site"

export function buildDiscoveryMetadata(locale: Locale, slug: DiscoverySlug): Metadata {
  const page = discoveryPages[slug]
  const path = getDiscoveryPath(locale, slug)
  return {
    metadataBase: new URL(SITE_URL),
    title: page.title[locale],
    description: page.description[locale],
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(locales.map(item => [localeTags[item], getDiscoveryPath(item, slug)])),
        "x-default": getDiscoveryPath("pt", slug),
      },
    },
    openGraph: {
      type: "website",
      title: page.title[locale],
      description: page.description[locale],
      url: path,
      locale: localeTags[locale].replace("-", "_"),
    },
  }
}
