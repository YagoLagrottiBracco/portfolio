import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { StackScreen } from "@/components/organisms/StackScreens"
import { getAllPosts } from "@/lib/blog"
import { isLocale, locales } from "@/lib/i18n"
import { getStackPath, publishedTechs } from "@/lib/stack"
import { buildStackMetadata } from "@/lib/stack-metadata"

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

/** English and Spanish versions of every published technology page. */
export function generateStaticParams() {
  const techs = publishedTechs(getAllPosts())
  return locales.filter((locale) => locale !== "pt").flatMap((locale) => techs.map((entry) => ({ locale, slug: entry.slug })))
}

const find = (slug: string) => publishedTechs(getAllPosts()).find((entry) => entry.slug === slug)

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const entry = find(slug)
  return entry && isLocale(locale) && locale !== "pt" ? buildStackMetadata(locale, entry) : {}
}

export default async function LocalizedStackPage({ params }: PageProps) {
  const { locale, slug } = await params
  const entry = find(slug)
  if (!entry || !isLocale(locale)) notFound()
  if (locale === "pt") permanentRedirect(getStackPath("pt", slug))
  return <StackScreen entry={entry} locale={locale} />
}
