import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { HomeScreen } from "@/components/organisms/HomeScreen"
import { buildHomeMetadata } from "@/lib/home-metadata"
import { isLocale, locales } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"

interface PageProps {
  params: Promise<{ locale: string }>
}

/** English and Spanish homepages; Portuguese is served at `/`. */
export function generateStaticParams() {
  return locales.filter((locale) => locale !== "pt").map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params

  return isLocale(locale) && locale !== "pt" ? buildHomeMetadata(locale) : {}
}

/**
 * `[locale]` matches any single path segment, so anything that is not a
 * supported language has to be turned away here or `/foo` would render a
 * homepage.
 */
export default async function LocalizedHomePage({ params }: PageProps) {
  const { locale } = await params

  if (!isLocale(locale)) notFound()
  if (locale === "pt") permanentRedirect(getHomePath("pt"))

  return <HomeScreen locale={locale} />
}
