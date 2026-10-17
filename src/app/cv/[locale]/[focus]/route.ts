import { notFound } from "next/navigation"

import { buildCvPdf } from "@/lib/cv"
import { cvFocuses, isCvFocus } from "@/lib/cv-focus"
import { getCvFileName } from "@/lib/cv-routes"
import { isLocale, locales } from "@/lib/i18n"

/** One PDF per language and focus, generated at build time. */
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) => cvFocuses.map((focus) => ({ locale, focus })))
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; focus: string }> }) {
  const { locale, focus } = await params
  if (!isLocale(locale) || !isCvFocus(focus)) notFound()

  return new Response(Buffer.from(await buildCvPdf(locale, focus)), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${getCvFileName(locale, focus)}"`,
    },
  })
}
