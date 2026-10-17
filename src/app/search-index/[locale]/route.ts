import { notFound } from "next/navigation"

import { isLocale, locales } from "@/lib/i18n"
import { buildSearchIndex } from "@/lib/site-search-index"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/** The site-wide search index for one language, fetched the first time search opens. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return Response.json(buildSearchIndex(locale))
}
