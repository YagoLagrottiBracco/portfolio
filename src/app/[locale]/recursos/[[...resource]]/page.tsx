import { notFound, permanentRedirect } from "next/navigation"
import { ResourceScreen } from "@/components/resources/ResourceScreen"
import { buildResourceMetadata } from "@/lib/resource-metadata"
import { getResourcePath } from "@/lib/resource-routes"
import {
  getResourceEntries,
  getResourceEntry,
  resourceSections,
} from "@/lib/resource-catalog"
import { isLocale } from "@/lib/i18n"

interface Props {
  params: Promise<{ locale: string; resource?: string[] }>
}
export function generateStaticParams() {
  const routes = [
    { resource: [] as string[] },
    ...resourceSections.flatMap((s) => [
      { resource: [s.slug] },
      ...getResourceEntries(s.slug).map((e) => ({
        resource: [s.slug, e.slug],
      })),
    ]),
  ]
  return ["en", "es"].flatMap((locale) =>
    routes.map((route) => ({ locale, ...route }))
  )
}
export async function generateMetadata({ params }: Props) {
  const { locale, resource = [] } = await params
  return isLocale(locale)
    ? buildResourceMetadata(locale, resource[0], resource[1])
    : {}
}
export default async function Resources({ params }: Props) {
  const { locale, resource = [] } = await params
  if (!isLocale(locale)) notFound()
  if (
    resource.length > 2 ||
    (resource[0] && !resourceSections.some((s) => s.slug === resource[0])) ||
    (resource[1] && !getResourceEntry(resource[0], resource[1]))
  )
    notFound()
  if (locale === "pt")
    permanentRedirect(getResourcePath("pt", resource[0], resource[1]))
  return <ResourceScreen locale={locale} segments={resource} />
}
