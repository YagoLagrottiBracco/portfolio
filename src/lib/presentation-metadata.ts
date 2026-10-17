import type { Metadata } from "next"

import { getCaseStudyPath } from "@/lib/case-study-routes"
import type { Locale } from "@/lib/i18n"
import type { CaseStudyProject } from "@/lib/projects"

const suffix: Record<Locale, string> = { pt: "apresentação", en: "presentation", es: "presentación" }

/** Not indexed: the case study page is the canonical version of the same content. */
export function buildPresentationMetadata(project: CaseStudyProject, locale: Locale): Metadata {
  return {
    title: `${project.title[locale]} — ${suffix[locale]}`,
    description: project.tagline[locale],
    alternates: { canonical: getCaseStudyPath(locale, project.slug) },
    robots: { index: false, follow: true },
  }
}
