import { notFound } from "next/navigation"

import { buildCvPdf } from "@/lib/cv"
import { getCvFileName } from "@/lib/cv-routes"
import { isLocale, locales } from "@/lib/i18n"

/** Generated once at build time, one PDF per language. */
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) notFound()

  return new Response(Buffer.from(await buildCvPdf(locale)), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${getCvFileName(locale)}"`,
    },
  })
}
