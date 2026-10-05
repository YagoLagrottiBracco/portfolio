import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CaseStudyScreen } from "@/components/organisms/CaseStudyScreen"
import { buildCaseStudyMetadata } from "@/lib/case-study-metadata"
import { getCaseStudyBySlug, getCaseStudyProjects } from "@/lib/projects"

interface PageProps {
  params: Promise<{ slug: string }>
}

/** Case studies are known at build time, so every page is statically rendered. */
export function generateStaticParams() {
  return getCaseStudyProjects().map((project) => ({ slug: project.slug }))
}

/** Portuguese is the canonical language; `/en` and `/es` live under `[locale]`. */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getCaseStudyBySlug(slug)

  return project ? buildCaseStudyMetadata(project, "pt") : {}
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const project = getCaseStudyBySlug(slug)

  if (!project) notFound()

  return <CaseStudyScreen project={project} locale="pt" />
}
