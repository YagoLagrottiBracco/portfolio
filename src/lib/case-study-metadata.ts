import type { Metadata } from "next"

import { getCaseStudyPath } from "@/lib/case-study-routes"
import { homeKeywords } from "@/lib/home-metadata"
import { locales, localeTags, type Locale } from "@/lib/i18n"
import type { CaseStudyProject } from "@/lib/projects"

import { SITE_URL } from "@/lib/site"

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
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [project.title[locale], ...project.techStack, ...homeKeywords[locale]],
    alternates: { canonical: path, languages: getCaseStudyAlternates(project.slug) },
    openGraph: {
      type: "article",
      title,
      description,
      url: path,
      locale: localeTags[locale].replace("-", "_"),
      images: [{ url: `/og/projetos/${locale}/${project.slug}`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og/projetos/${locale}/${project.slug}`],
    },
  }
}
