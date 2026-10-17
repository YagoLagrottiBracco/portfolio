import { notFound } from "next/navigation"

import { stackCopy, techPageData } from "@/components/organisms/StackScreens"
import { getAllPosts } from "@/lib/blog"
import { isLocale, locales, type Locale } from "@/lib/i18n"
import { renderOgCard } from "@/lib/og-card"
import { publishedTechs, techName } from "@/lib/stack"

export const dynamic = "force-static"
export const dynamicParams = false

/** `index` is the technology list; every other slug is a technology page. */
export function generateStaticParams() {
  const slugs = ["index", ...publishedTechs(getAllPosts()).map((entry) => entry.slug)]
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

const eyebrow: Record<Locale, string> = { pt: "Tecnologia", en: "Technology", es: "Tecnología" }

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const text = stackCopy[locale]
  if (slug === "index") return renderOgCard({ eyebrow: eyebrow[locale], title: text.indexTitle, subtitle: text.indexMeta })
  const entry = publishedTechs(getAllPosts()).find((candidate) => candidate.slug === slug)
  if (!entry) notFound()
  return renderOgCard({ eyebrow: eyebrow[locale], title: text.title(techName(entry, locale)), highlight: text.counts(techPageData(entry, locale).counts) })
}
