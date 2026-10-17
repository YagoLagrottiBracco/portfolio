import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"

import { CaseStudyPresentation } from "@/components/organisms/CaseStudyPresentation"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { isLocale, locales } from "@/lib/i18n"
import { buildSlides, getPresentationPath } from "@/lib/presentation"
import { buildPresentationMetadata } from "@/lib/presentation-metadata"
import { getCaseStudyBySlug, getCaseStudyProjects } from "@/lib/projects"

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "pt").flatMap((locale) => getCaseStudyProjects().map((project) => ({ locale, slug: project.slug })))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const project = getCaseStudyBySlug(slug)
  return project && isLocale(locale) && locale !== "pt" ? buildPresentationMetadata(project, locale) : {}
}

export default async function LocalizedPresentationPage({ params }: PageProps) {
  const { locale, slug } = await params
  const project = getCaseStudyBySlug(slug)
  if (!project || !isLocale(locale)) notFound()
  if (locale === "pt") permanentRedirect(getPresentationPath("pt", slug))
  return <CaseStudyPresentation slides={buildSlides(project, locale)} locale={locale} backHref={getCaseStudyPath(locale, project.slug)} />
}
