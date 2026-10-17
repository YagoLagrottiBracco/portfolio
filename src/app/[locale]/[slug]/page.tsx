import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { DiscoveryScreen } from "@/components/discovery/DiscoveryScreen"
import { discoverySlugs, isDiscoverySlug } from "@/data/discovery"
import { buildDiscoveryMetadata } from "@/lib/discovery-metadata"
import { getDiscoveryPath } from "@/lib/discovery-routes"
import { isLocale } from "@/lib/i18n"

interface PageProps { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  return ["en", "es"].flatMap(locale => discoverySlugs.map(slug => ({ locale, slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  return isLocale(locale) && locale !== "pt" && isDiscoverySlug(slug) ? buildDiscoveryMetadata(locale, slug) : {}
}

export default async function LocalizedDiscoveryPage({ params }: PageProps) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  if (locale === "pt") permanentRedirect(getDiscoveryPath("pt", isDiscoverySlug(slug) ? slug : "links"))
  if (!isDiscoverySlug(slug)) notFound()
  return <DiscoveryScreen locale={locale} slug={slug} />
}
