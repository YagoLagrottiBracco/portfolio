/**
 * @file projects.ts
 * @description Lookup helpers over the single project list in `@/data/personal`.
 *
 * Case study pages exist only for projects flagged `featured` that actually
 * carry a `caseStudy` — everything else lives as a card in the homepage grid.
 */
import { personalData, type ProjectEntry } from "@/data/personal"

/** A project that is guaranteed to have a case study attached. */
export type CaseStudyProject = ProjectEntry & Required<Pick<ProjectEntry, "caseStudy">>

/** Every project with a written case study, in display order. */
export function getCaseStudyProjects(): CaseStudyProject[] {
  return personalData.projects.filter(
    (project): project is CaseStudyProject => Boolean(project.featured && project.caseStudy)
  )
}

/** Finds a case study by slug, or `undefined` if there is no page for it. */
export function getCaseStudyBySlug(slug: string): CaseStudyProject | undefined {
  return getCaseStudyProjects().find((project) => project.slug === slug)
}

/**
 * The previous and next case study relative to `slug`, wrapping around so the
 * reader always has somewhere to go from the bottom of a page.
 */
export function getAdjacentCaseStudies(slug: string) {
  const all = getCaseStudyProjects()
  const index = all.findIndex((project) => project.slug === slug)

  if (index === -1 || all.length < 2) {
    return { previous: undefined, next: undefined }
  }

  return {
    previous: all[(index - 1 + all.length) % all.length],
    next: all[(index + 1) % all.length],
  }
}
