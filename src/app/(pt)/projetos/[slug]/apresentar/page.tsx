import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CaseStudyPresentation } from "@/components/organisms/CaseStudyPresentation"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { buildSlides } from "@/lib/presentation"
import { buildPresentationMetadata } from "@/lib/presentation-metadata"
import { getCaseStudyBySlug, getCaseStudyProjects } from "@/lib/projects"

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getCaseStudyProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = getCaseStudyBySlug((await params).slug)
  return project ? buildPresentationMetadata(project, "pt") : {}
}

export default async function PresentationPage({ params }: PageProps) {
  const project = getCaseStudyBySlug((await params).slug)
  if (!project) notFound()
  return <CaseStudyPresentation slides={buildSlides(project, "pt")} locale="pt" backHref={getCaseStudyPath("pt", project.slug)} />
}
