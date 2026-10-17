import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { NowScreen, nowMeta } from "@/components/organisms/NowScreen"
import { isLocale, locales } from "@/lib/i18n"
import { buildPageMetadata } from "@/lib/page-metadata"
import { getPagePath } from "@/lib/page-routes"

interface PageProps {
  params: Promise<{ locale: string }>
}

/** English and Spanish; Portuguese is served unprefixed. */
export function generateStaticParams() {
  return locales.filter((locale) => locale !== "pt").map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale) || locale === "pt") return {}
  return buildPageMetadata("agora", locale, nowMeta[locale])
}

export default async function LocalizedNowPage({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  if (locale === "pt") permanentRedirect(getPagePath("pt", "agora"))
  return <NowScreen locale={locale} />
}
