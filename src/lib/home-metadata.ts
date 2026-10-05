import type { Metadata } from "next"

import { locales, localeTags, type Locale } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"

/**
 * Each homepage is written for the people searching in its language: the
 * Portuguese one for the Brazilian market, the English one for remote roles
 * abroad, the Spanish one for Latin America and Spain.
 */
export const homeCopy: Record<Locale, { title: string; description: string }> = {
  pt: {
    title: "Yago Lagrotti | Engenheiro de Software Sênior · Fullstack · DevOps",
    description:
      "Engenheiro de Software Sênior com mais de 10 anos construindo produtos de ponta a ponta: desenvolvimento fullstack, arquitetura de sistemas e DevOps. React, Next.js, Node.js, Python, Laravel, PostgreSQL, MySQL, MongoDB, Docker e Terraform. Aberto a vagas remotas e a projetos sob medida.",
  },
  en: {
    title: "Yago Lagrotti | Senior Software Engineer · Fullstack · DevOps",
    description:
      "Senior Software Engineer with 10+ years building products end to end across fullstack development, systems architecture, and DevOps. React, Next.js, Node.js, Python, Laravel, PostgreSQL, MySQL, MongoDB, Docker, and Terraform. Open to remote roles and custom projects.",
  },
  es: {
    title: "Yago Lagrotti | Ingeniero de software sénior · Fullstack · DevOps",
    description:
      "Ingeniero de software sénior con más de 10 años creando productos de principio a fin: desarrollo fullstack, arquitectura de sistemas y DevOps. React, Next.js, Node.js, Python, Laravel, PostgreSQL, MySQL, MongoDB, Docker y Terraform. Abierto a puestos remotos y proyectos a medida.",
  },
}

export function getHomeAlternates(): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [localeTags[locale], getHomePath(locale)])),
    "x-default": getHomePath("pt"),
  }
}

export function buildHomeMetadata(locale: Locale): Metadata {
  const { title, description } = homeCopy[locale]
  const path = getHomePath(locale)
  // Named explicitly: a page that sets its own `openGraph` does not inherit the
  // generated card from the root segment, and `/en` and `/es` would ship without one.
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: title }

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path, languages: getHomeAlternates() },
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
      locale: localeTags[locale].replace("-", "_"),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  }
}
