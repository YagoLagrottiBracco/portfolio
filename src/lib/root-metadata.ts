import type { Metadata, Viewport } from "next"

import { personalData } from "@/data/personal"
import { homeCopy, homeKeywords } from "@/lib/home-metadata"
import { localeTags, type Locale } from "@/lib/i18n"
import { SITE_URL } from "@/lib/site"

/** Site-wide metadata, exported by each root layout. Pages may override any field. */
export function buildRootMetadata(locale: Locale): Metadata {
  const { title, description } = homeCopy[locale]

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s — ${personalData.name}`,
    },
    description,
    keywords: homeKeywords[locale],
    authors: [{ name: personalData.name, url: SITE_URL }],
    creator: personalData.name,
    openGraph: {
      type: "website",
      locale: localeTags[locale].replace("-", "_"),
      url: SITE_URL,
      siteName: personalData.name,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/ylb-icon.svg",
      apple: "/apple-touch-icon.png",
    },
    appleWebApp: { title: "Lagrotti", statusBarStyle: "black-translucent" },
    // Set GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION to claim the site in
    // Search Console and Bing Webmaster Tools without touching DNS.
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
    },
  }
}

/** Browser chrome colour, exported as `viewport` by every root layout. Dark, like the default theme. */
export const rootViewport: Viewport = { themeColor: "#0a0a0a" }
