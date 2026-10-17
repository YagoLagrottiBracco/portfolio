/**
 * Résumé variants for a role's focus. A focus never adds a claim: it picks the
 * headline line, which skills come first and which case studies make the cut
 * from what `personalData` already holds. Experience stays complete and in
 * order, because a reader checks the timeline before anything else.
 */
import type { ProjectCategoryId } from "@/data/personal"
import type { Locale } from "@/lib/i18n"

export const cvFocuses = ["backend", "fullstack", "ia", "lideranca"] as const
export type CvFocus = (typeof cvFocuses)[number]

export interface FocusSpec {
  label: Record<Locale, string>
  /** Replaces the "Fullstack · Architecture · DevOps" line under the name. */
  headline: Record<Locale, string>
  /** Shown first, in this order; the remaining skills follow. Names must exist in `personalData.skills`. */
  skills: string[]
  /** Case studies of these categories come first. */
  categories: ProjectCategoryId[]
}

export const cvFocusSpecs: Record<CvFocus, FocusSpec> = {
  backend: {
    label: { pt: "Backend e arquitetura", en: "Backend and architecture", es: "Backend y arquitectura" },
    headline: { pt: "Backend · Arquitetura · Sistemas orientados a eventos", en: "Backend · Architecture · Event-driven systems", es: "Backend · Arquitectura · Sistemas orientados a eventos" },
    skills: ["Node.js", "TypeScript", "NestJS", "Python", "FastAPI", "Django", "Golang", "Apache Kafka", "PostgreSQL", "Redis", "ClickHouse", "Event-Driven Architecture", "Microservices", "DDD", "Clean Architecture"],
    categories: ["arquitetura", "plataformas"],
  },
  fullstack: {
    label: { pt: "Fullstack e produto", en: "Fullstack and product", es: "Fullstack y producto" },
    headline: { pt: "Fullstack · Produto de ponta a ponta · DevOps", en: "Fullstack · End-to-end product · DevOps", es: "Fullstack · Producto de punta a punta · DevOps" },
    skills: ["React", "Next.js", "TypeScript", "Node.js", "Laravel", "PostgreSQL", "MySQL", "Docker", "DevOps"],
    categories: ["produtos", "plataformas"],
  },
  ia: {
    label: { pt: "IA aplicada", en: "Applied AI", es: "IA aplicada" },
    headline: { pt: "IA aplicada · Agentes · Automação de processos", en: "Applied AI · Agents · Process automation", es: "IA aplicada · Agentes · Automatización de procesos" },
    skills: ["Python", "FastAPI", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
    categories: ["ia", "arquitetura"],
  },
  lideranca: {
    label: { pt: "Liderança técnica", en: "Technical leadership", es: "Liderazgo técnico" },
    headline: { pt: "Liderança técnica · Arquitetura · Entrega de produto", en: "Technical leadership · Architecture · Product delivery", es: "Liderazgo técnico · Arquitectura · Entrega de producto" },
    skills: ["Clean Architecture", "DDD", "Microservices", "Event-Driven Architecture", "DevOps", "Terraform", "Docker", "Node.js", "TypeScript"],
    categories: ["arquitetura", "plataformas"],
  },
}

export function isCvFocus(value: unknown): value is CvFocus {
  return typeof value === "string" && cvFocuses.some((focus) => focus === value)
}

/** `skills` with the focus's ones first, each listed once. */
export function orderSkills(skills: string[], focus?: CvFocus): string[] {
  if (!focus) return skills
  const first = cvFocusSpecs[focus].skills.filter((skill) => skills.includes(skill))
  return [...first, ...skills.filter((skill) => !first.includes(skill))]
}

/** The case studies to print: the focus's categories first, keeping the curated order within each group, at most `limit`. */
export function pickProjects<T extends { category: ProjectCategoryId }>(projects: T[], focus?: CvFocus, limit = 6): T[] {
  if (!focus) return projects
  const { categories } = cvFocusSpecs[focus]
  const rank = (project: T) => {
    const index = categories.indexOf(project.category)
    return index === -1 ? categories.length : index
  }
  return projects
    .map((project, index) => ({ project, index }))
    .sort((a, b) => rank(a.project) - rank(b.project) || a.index - b.index)
    .slice(0, limit)
    .map((entry) => entry.project)
}
