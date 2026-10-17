/**
 * A case study as slides, for screen-sharing in an interview. Built only from
 * the case study's own fields, in reading order; a field that is missing
 * simply has no slide.
 */
import { localizeLabel } from "@/data/content-labels"
import { personalData, projectCategories, type CaseStudyDiagramStage } from "@/data/personal"
import type { Locale } from "@/lib/i18n"
import type { CaseStudyProject } from "@/lib/projects"

export type Slide =
  | { kind: "cover"; title: string; subtitle: string; meta: string[] }
  | { kind: "text"; title: string; body: string }
  | { kind: "diagram"; title: string; stages: CaseStudyDiagramStage[] }
  | { kind: "points"; title: string; points: { title: string; description: string }[] }
  | { kind: "metrics"; title: string; metrics: string[] }
  | { kind: "stack"; title: string; items: string[] }
  | { kind: "contact"; title: string; lines: string[] }

const labels: Record<Locale, { context: string; challenge: string; solution: string; architecture: string; diagram: string; highlights: string; metrics: string; stack: string; contact: string }> = {
  pt: { context: "Contexto", challenge: "O desafio", solution: "A arquitetura", architecture: "Organização do código", diagram: "Fluxo da arquitetura", highlights: "Decisões de engenharia", metrics: "Escopo e resultados", stack: "Stack", contact: "Obrigado!" },
  en: { context: "Context", challenge: "The challenge", solution: "The architecture", architecture: "How the code is organised", diagram: "Architecture flow", highlights: "Engineering decisions", metrics: "Scope and results", stack: "Stack", contact: "Thank you!" },
  es: { context: "Contexto", challenge: "El desafío", solution: "La arquitectura", architecture: "Organización del código", diagram: "Flujo de la arquitectura", highlights: "Decisiones de ingeniería", metrics: "Alcance y resultados", stack: "Stack", contact: "¡Gracias!" },
}

/** Three decisions fit on a slide; more go to the next one. */
const PER_SLIDE = 3

export function buildSlides(project: CaseStudyProject, locale: Locale): Slide[] {
  const label = labels[locale]
  const { caseStudy } = project
  const category = projectCategories.find((item) => item.id === project.category)?.label[locale]
  const slides: Slide[] = [
    { kind: "cover", title: project.title[locale], subtitle: project.tagline[locale], meta: [category, project.year, project.status[locale]].filter((value): value is string => Boolean(value)) },
    { kind: "text", title: label.context, body: caseStudy.context[locale] },
    { kind: "text", title: label.challenge, body: caseStudy.challenge[locale] },
    { kind: "text", title: label.solution, body: caseStudy.solution[locale] },
  ]
  if (caseStudy.diagram?.length) slides.push({ kind: "diagram", title: label.diagram, stages: caseStudy.diagram })
  if (caseStudy.architecture) slides.push({ kind: "text", title: label.architecture, body: caseStudy.architecture[locale] })
  for (let index = 0; index < caseStudy.highlights.length; index += PER_SLIDE) {
    slides.push({
      kind: "points",
      title: label.highlights,
      points: caseStudy.highlights.slice(index, index + PER_SLIDE).map((item) => ({ title: item.title[locale], description: item.description[locale] })),
    })
  }
  if (caseStudy.metrics?.length) slides.push({ kind: "metrics", title: label.metrics, metrics: caseStudy.metrics.map((metric) => localizeLabel(metric, locale)) })
  slides.push({ kind: "stack", title: label.stack, items: project.techStack.map((tech) => localizeLabel(tech, locale)) })
  slides.push({ kind: "contact", title: label.contact, lines: [personalData.name, personalData.socialLinks.email, `${personalData.socialLinks.domain}`, personalData.socialLinks.linkedin.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")] })
  return slides
}

export { getPresentationPath, parsePresentationPath } from "@/lib/presentation-routes"
