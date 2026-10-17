import { notFound } from "next/navigation"

import { buildJsonResume } from "@/lib/cv-formats"
import { isLocale, locales } from "@/lib/i18n"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/** The résumé as JSON Resume (jsonresume.org). */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return Response.json(buildJsonResume(locale), { headers: { "Access-Control-Allow-Origin": "*" } })
}
