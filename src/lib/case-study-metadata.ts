import type { Metadata } from "next"

import { getCaseStudyPath } from "@/lib/case-study-routes"
import { locales, localeTags, type Locale } from "@/lib/i18n"
import type { CaseStudyProject } from "@/lib/projects"

/** Every language a case study is published in, keyed by hreflang tag. */
export function getCaseStudyAlternates(slug: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [localeTags[locale], getCaseStudyPath(locale, slug)])),
    "x-default": getCaseStudyPath("pt", slug),
  }
}

export function buildCaseStudyMetadata(project: CaseStudyProject, locale: Locale): Metadata {
  const path = getCaseStudyPath(locale, project.slug)
  const title = `${project.title[locale]} — ${project.tagline[locale]}`
  const description = project.description[locale]

  return {
    title: project.title[locale],
    description,
    alternates: { canonical: path, languages: getCaseStudyAlternates(project.slug) },
    openGraph: {
      type: "article",
      title,
      description,
      url: path,
      locale: localeTags[locale].replace("-", "_"),
      images: [{ url: project.image, width: 1440, height: 810, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.image],
    },
  }
}
