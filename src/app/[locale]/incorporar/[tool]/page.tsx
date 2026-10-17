import { notFound, permanentRedirect } from "next/navigation"
import { ResourceEmbed } from "@/components/resources/ResourceEmbed"
import { isLocale } from "@/lib/i18n"
import { getEmbedPath } from "@/lib/resource-routes"
export const metadata = { robots: { index: false, follow: true } }
export function generateStaticParams() {
  return ["en", "es"].flatMap((locale) =>
    ["json", "env", "queue"].map((tool) => ({ locale, tool }))
  )
}
export default async function Embed({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>
}) {
  const { locale, tool } = await params
  if (
    !isLocale(locale) ||
    (tool !== "json" && tool !== "env" && tool !== "queue")
  )
    notFound()
  if (locale === "pt") permanentRedirect(getEmbedPath("pt", tool))
  return <ResourceEmbed tool={tool} locale={locale} />
}
