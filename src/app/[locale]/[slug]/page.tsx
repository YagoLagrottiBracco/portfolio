import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { DiscoveryScreen } from "@/components/discovery/DiscoveryScreen"
import { discoverySlugs, isDiscoverySlug } from "@/data/discovery"
import { buildDiscoveryMetadata } from "@/lib/discovery-metadata"
import type { Locale } from "@/lib/i18n"

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  const nonPtLocales: Locale[] = ["en", "es"]
  return nonPtLocales.flatMap((locale) =>
    discoverySlugs.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  if ((locale !== "en" && locale !== "es") || !isDiscoverySlug(slug)) return {}
  return buildDiscoveryMetadata(locale as Locale, slug)
}

export default async function LocalizedDiscoveryPage({ params }: PageProps) {
  const { locale, slug } = await params
  if ((locale !== "en" && locale !== "es") || !isDiscoverySlug(slug)) notFound()

  return <DiscoveryScreen slug={slug} locale={locale as Locale} />
}

