import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { AskScreen, askCopy } from "@/components/organisms/AskScreen"
import { askEnabled } from "@/lib/ask/config"
import { isLocale, locales } from "@/lib/i18n"
import { buildPageMetadata } from "@/lib/page-metadata"
import { getPagePath } from "@/lib/page-routes"

interface PageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "pt").map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale) || locale === "pt") return {}
  return buildPageMetadata("perguntar", locale, askCopy[locale])
}

export default async function LocalizedAskPage({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale) || !askEnabled()) notFound()
  if (locale === "pt") permanentRedirect(getPagePath("pt", "perguntar"))
  return <AskScreen locale={locale} />
}
