import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { StackIndexScreen } from "@/components/organisms/StackScreens"
import { isLocale, locales } from "@/lib/i18n"
import { getStackPath } from "@/lib/stack"
import { buildStackMetadata } from "@/lib/stack-metadata"

interface PageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "pt").map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  return isLocale(locale) && locale !== "pt" ? buildStackMetadata(locale) : {}
}

export default async function LocalizedStackIndexPage({ params }: PageProps) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  if (locale === "pt") permanentRedirect(getStackPath("pt"))
  return <StackIndexScreen locale={locale} />
}
