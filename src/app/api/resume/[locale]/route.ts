import { buildJsonResume } from "@/lib/cv-formats"
import { isLocale, locales } from "@/lib/i18n"

export const runtime = "nodejs"
export const dynamic = "force-static"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function GET(_request: Request, context: { params: Promise<{ locale: string }> }) {
  const { locale } = await context.params
  if (!isLocale(locale)) return Response.json({ error: "Unsupported locale" }, { status: 404 })
  return Response.json(buildJsonResume(locale), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
