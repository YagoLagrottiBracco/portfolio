import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { CaseStudyScreen } from "@/components/organisms/CaseStudyScreen"
import { buildCaseStudyMetadata } from "@/lib/case-study-metadata"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { isLocale, locales } from "@/lib/i18n"
import { getCaseStudyBySlug, getCaseStudyProjects } from "@/lib/projects"

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

/** English and Spanish case studies; Portuguese is served unprefixed. */
export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== "pt")
    .flatMap((locale) => getCaseStudyProjects().map((project) => ({ locale, slug: project.slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const project = getCaseStudyBySlug(slug)

  if (!project || !isLocale(locale) || locale === "pt") return {}

  return buildCaseStudyMetadata(project, locale)
}

export default async function LocalizedCaseStudyPage({ params }: PageProps) {
  const { locale, slug } = await params
  const project = getCaseStudyBySlug(slug)

  if (!project || !isLocale(locale)) notFound()
  if (locale === "pt") permanentRedirect(getCaseStudyPath("pt", slug))

  return <CaseStudyScreen project={project} locale={locale} />
}
