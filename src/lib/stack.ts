/**
 * Evidence behind each technology page: the skill list, the projects whose
 * stack names it, the jobs whose description mentions it and the articles
 * tagged with it. Pure and client-safe; articles come in as an argument
 * because reading them needs the server.
 */
import { personalData } from "@/data/personal"
import { MIN_TECH_EVIDENCE, techCatalog, type TechEntry } from "@/data/stack"
import type { Locale } from "@/lib/i18n"

type Project = (typeof personalData.projects)[number]
type Job = (typeof personalData.experience)[number]

const normalize = (value: string) => value.trim().toLowerCase()

export function techName(entry: TechEntry, locale: Locale): string {
  return entry.localizedName?.[locale] ?? entry.name
}

export function namesTech(entry: TechEntry, name: string): boolean {
  return entry.aliases.includes(normalize(name))
}

export function projectsUsing(entry: TechEntry): Project[] {
  return personalData.projects.filter((project) => project.techStack.some((name) => namesTech(entry, name)))
}

export function jobsMentioning(entry: TechEntry): Job[] {
  const pattern = entry.textPattern
  return pattern ? personalData.experience.filter((job) => pattern.test(job.description.en) || pattern.test(job.position.en)) : []
}

export function isListedSkill(entry: TechEntry): boolean {
  return personalData.skills.some((skill) => namesTech(entry, skill))
}

export interface TaggedPost { translationKey: string; tags: string[] }

export function postsTagged<T extends TaggedPost>(entry: TechEntry, posts: T[]): T[] {
  return posts.filter((post) => post.tags.some((tag) => namesTech(entry, tag)))
}

/** Evidence count; an article and its translations count once. */
export function evidenceCount(entry: TechEntry, posts: TaggedPost[]): number {
  const articles = new Set(postsTagged(entry, posts).map((post) => post.translationKey)).size
  return (isListedSkill(entry) ? 1 : 0) + projectsUsing(entry).length + jobsMentioning(entry).length + articles
}

/** The technologies with enough evidence for a page of their own, most evidence first. */
export function publishedTechs(posts: TaggedPost[]): TechEntry[] {
  return techCatalog
    .map((entry) => ({ entry, count: evidenceCount(entry, posts) }))
    .filter(({ count }) => count >= MIN_TECH_EVIDENCE)
    .sort((a, b) => b.count - a.count || a.entry.name.localeCompare(b.entry.name))
    .map(({ entry }) => entry)
}

export function findTech(slug: string): TechEntry | undefined {
  return techCatalog.find((entry) => entry.slug === slug)
}

/** The catalog entry a stack or tag name belongs to, if any. */
export function techFor(name: string): TechEntry | undefined {
  return techCatalog.find((entry) => namesTech(entry, name))
}

/** Technologies used alongside `entry` in its projects, most frequent first. */
export function relatedTechs(entry: TechEntry, published: TechEntry[], limit = 6): TechEntry[] {
  const counts = new Map<string, number>()
  for (const project of projectsUsing(entry)) {
    for (const name of project.techStack) {
      const other = techFor(name)
      if (other && other.slug !== entry.slug && published.includes(other)) counts.set(other.slug, (counts.get(other.slug) ?? 0) + 1)
    }
  }
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([slug]) => findTech(slug)!)
}

/** Technologies mentioned in each job, for the experience timeline filter. */
export function jobTechs(job: Job): TechEntry[] {
  return techCatalog.filter((entry) => entry.textPattern && (entry.textPattern.test(job.description.en) || entry.textPattern.test(job.position.en)))
}

export function getStackPath(locale: Locale, slug?: string): string {
  const base = locale === "pt" ? "/stack" : `/${locale}/stack`
  return slug ? `${base}/${slug}` : base
}

export function parseStackPath(pathname: string): { locale: Locale; slug?: string } | null {
  const match = /^(?:\/(en|es))?\/stack(?:\/([a-z0-9-]+))?\/?$/.exec(pathname)
  if (!match) return null
  return { locale: (match[1] as Locale | undefined) ?? "pt", slug: match[2] }
}
