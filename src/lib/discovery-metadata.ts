import type { Metadata } from "next"

import { discoveryPages, type DiscoverySlug } from "@/data/discovery"
import { locales, localeTags, type Locale } from "@/lib/i18n"
import { getDiscoveryPath } from "@/lib/discovery-routes"

import { SITE_URL } from "@/lib/site"

export function buildDiscoveryMetadata(locale: Locale, slug: DiscoverySlug): Metadata {
  const page = discoveryPages[slug]
  const path = getDiscoveryPath(locale, slug)
  const title = page.title[locale]
  const description = page.description[locale]
  const image = { url: `/og/descoberta/${locale}/${slug}`, width: 1200, height: 630, alt: title }

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(locales.map(item => [localeTags[item], getDiscoveryPath(item, slug)])),
        "x-default": getDiscoveryPath("pt", slug),
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      locale: localeTags[locale].replace("-", "_"),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

