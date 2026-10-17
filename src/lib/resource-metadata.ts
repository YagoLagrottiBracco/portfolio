import type { Metadata } from "next"
import { locales, localeTags, type Locale } from "@/lib/i18n"
import { getResourcePath } from "@/lib/resource-routes"
import { getResourceEntry, resourceSections } from "@/lib/resource-catalog"

export const resourceHeading = {
  pt: "Recursos abertos de engenharia",
  en: "Open engineering resources",
  es: "Recursos abiertos de ingeniería",
}
export const resourceDescription = {
  pt: "Ferramentas, demos, código e decisões de arquitetura para experimentar, reutilizar e levar ao seu time.",
  en: "Tools, demos, code and architecture decisions to explore, reuse and bring to your team.",
  es: "Herramientas, demos, código y decisiones de arquitectura para explorar, reutilizar y llevar a tu equipo.",
}
export function buildResourceMetadata(
  locale: Locale,
  section?: string,
  slug?: string
): Metadata {
  const collection = resourceSections.find((s) => s.slug === section)
  const entry = section && slug ? getResourceEntry(section, slug) : undefined
  if ((section && !collection) || (slug && !entry))
    return { robots: { index: false, follow: true } }
  const title =
    entry?.title[locale] ?? collection?.title[locale] ?? resourceHeading[locale]
  const description =
    entry?.description[locale] ??
    collection?.description[locale] ??
    resourceDescription[locale]
  const path = getResourcePath(locale, section, slug)
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [localeTags[l], getResourcePath(l, section, slug)])
        ),
        "x-default": getResourcePath("pt", section, slug),
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      locale: localeTags[locale].replace("-", "_"),
      images: [
        {
          url: "/recursos/engineering-kit.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/recursos/engineering-kit.png"],
    },
  }
}
