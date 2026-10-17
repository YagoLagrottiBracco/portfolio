import { notFound } from "next/navigation"

import { nowMeta } from "@/components/organisms/NowScreen"
import { recommendCopy } from "@/components/organisms/RecommendScreen"
import { privacy } from "@/data/privacy"
import { workWithMe } from "@/data/work-with-me"
import { availabilityLabel } from "@/lib/availability"
import { personalData } from "@/data/personal"
import { isLocale, locales, type Locale } from "@/lib/i18n"
import { renderOgCard } from "@/lib/og-card"
import enMessages from "@/messages/en.json"
import esMessages from "@/messages/es.json"
import ptMessages from "@/messages/pt.json"
import { localizedPages, type LocalizedPage } from "@/lib/page-routes"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) => localizedPages.map((page) => ({ locale, page })))
}

const cards: Record<LocalizedPage, (locale: Locale) => { title: string; subtitle: string; highlight?: string }> = {
  "trabalhe-comigo": (locale) => ({ title: workWithMe.title[locale], subtitle: workWithMe.description[locale], highlight: availabilityLabel[personalData.availability.status][locale] }),
  agora: (locale) => ({ title: nowMeta[locale].title, subtitle: nowMeta[locale].description, highlight: availabilityLabel[personalData.availability.status][locale] }),
  privacidade: (locale) => ({ title: privacy.title[locale], subtitle: privacy.description[locale] }),
  recomendar: (locale) => ({ title: recommendCopy[locale].title, subtitle: recommendCopy[locale].description }),
}

/** Share card of a standalone page. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale, page } = await params
  const card = localizedPages.find((candidate) => candidate === page)
  if (!card || !isLocale(locale)) notFound()
  const headline = { pt: ptMessages, en: enMessages, es: esMessages }[locale].hero.headline
  return renderOgCard({ eyebrow: headline, ...cards[card](locale) })
}
