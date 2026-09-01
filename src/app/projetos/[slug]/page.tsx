import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CaseStudyView } from "@/components/organisms/CaseStudyView"
import { Navigation } from "@/components/organisms/Navigation"
import { Footer } from "@/components/organisms/Footer"
import { getAdjacentCaseStudies, getCaseStudyBySlug, getCaseStudyProjects } from "@/lib/projects"

interface PageProps {
  params: Promise<{ slug: string }>
}

/** Case studies are known at build time, so every page is statically rendered. */
export function generateStaticParams() {
  return getCaseStudyProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getCaseStudyBySlug(slug)

  if (!project) return {}

  // Metadata is served in pt-BR, matching the site's canonical locale.
  const title = `${project.title.pt} — ${project.tagline.pt}`
  const description = project.description.pt

  return {
    title: project.title.pt,
    description,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/projetos/${project.slug}`,
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

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params
  const project = getCaseStudyBySlug(slug)

  if (!project) notFound()

  const { previous, next } = getAdjacentCaseStudies(slug)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main">
        <CaseStudyView project={project} previous={previous} next={next} />
      </main>
      <Footer />
    </div>
  )
}
