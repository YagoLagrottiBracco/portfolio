import { notFound } from "next/navigation"

import { localizeLabel } from "@/data/content-labels"
import { projectCategories } from "@/data/personal"
import { isLocale, locales, type Locale } from "@/lib/i18n"
import { renderOgCard } from "@/lib/og-card"
import { getCaseStudyBySlug, getCaseStudyProjects } from "@/lib/projects"

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return locales.flatMap((locale) => getCaseStudyProjects().map((project) => ({ locale, slug: project.slug })))
}

const caseStudy: Record<Locale, string> = { pt: "Estudo de caso", en: "Case study", es: "Caso de estudio" }

/** Share card of a case study: title, tagline, its first hard number and a thumbnail. */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const project = getCaseStudyBySlug(slug)
  if (!project || !isLocale(locale)) notFound()
  const category = projectCategories.find((item) => item.id === project.category)?.label[locale]
  // The first number the tagline does not already state.
  const tagline = project.tagline[locale]
  const metric = project.caseStudy.metrics
    ?.map((value) => localizeLabel(value, locale))
    .find((value) => {
      const number = /[~≈]?\d[\d.,]*\+?/.exec(value)?.[0]
      return !number || !tagline.includes(number)
    })
  return renderOgCard({
    eyebrow: [caseStudy[locale], category].filter(Boolean).join(" · "),
    title: project.title[locale],
    subtitle: tagline,
    highlight: metric ?? project.status[locale],
    image: project.image,
  })
}
