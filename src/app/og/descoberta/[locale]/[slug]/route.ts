import { notFound } from "next/navigation"

import { discoveryPages, discoverySlugs, isDiscoverySlug } from "@/data/discovery"
import { isLocale, locales } from "@/lib/i18n"
import { renderOgCard } from "@/lib/og-card"
import enMessages from "@/messages/en.json"
import esMessages from "@/messages/es.json"
import ptMessages from "@/messages/pt.json"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) => discoverySlugs.map((slug) => ({ locale, slug })))
}

/** Share card of a Discovery Hub page. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale) || !isDiscoverySlug(slug)) notFound()
  const page = discoveryPages[slug]
  const headline = { pt: ptMessages, en: enMessages, es: esMessages }[locale].hero.headline
  return renderOgCard({
    eyebrow: headline,
    title: page.title[locale],
    subtitle: page.description[locale],
  })
}

