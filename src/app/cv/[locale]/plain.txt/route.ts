import { notFound } from "next/navigation"

import { buildPlainTextCv } from "@/lib/cv-formats"
import { isLocale, locales } from "@/lib/i18n"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/** The résumé as plain text, for application forms and applicant-tracking systems. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return new Response(buildPlainTextCv(locale), { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
