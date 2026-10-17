/**
 * @file NowScreen.tsx
 * @description `/agora` and its `/en` and `/es` versions: availability, the
 * current role, this year's case studies, the latest articles and Yago's own
 * notes. Everything but the notes comes from the site's data, so the page
 * stays current with no upkeep.
 */
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"
import { nowNotes } from "@/data/now"
import { personalData } from "@/data/personal"
import { availabilityLabel } from "@/lib/availability"
import { getAllPosts } from "@/lib/blog"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { localeTags, type Locale } from "@/lib/i18n"
import { getPagePath } from "@/lib/page-routes"
import { getCaseStudyProjects } from "@/lib/projects"
import { getResourcePath } from "@/lib/resource-routes"
import { cn } from "@/lib/utils"

const copy: Record<Locale, { title: string; intro: string; updated: string; availability: string; role: string; projects: string; writing: string; notes: string; evolution: string; workWithMe: string; about: string }> = {
  pt: {
    title: "Agora",
    intro: "No que estou trabalhando nesta fase. Uma página /now: muda quando a minha rotina muda.",
    updated: "Atualizada em",
    availability: "Disponibilidade",
    role: "Onde estou",
    projects: "Projetos deste ano",
    writing: "O que escrevi por último",
    notes: "Notas",
    evolution: "Evolução documentada dos projetos",
    workWithMe: "Como trabalhar comigo",
    about: "O que é uma página /now?",
  },
  en: {
    title: "Now",
    intro: "What I am working on at this stage. A /now page: it changes when my routine does.",
    updated: "Updated on",
    availability: "Availability",
    role: "Where I am",
    projects: "This year's projects",
    writing: "What I wrote last",
    notes: "Notes",
    evolution: "Documented evolution of the projects",
    workWithMe: "How to work with me",
    about: "What is a /now page?",
  },
  es: {
    title: "Ahora",
    intro: "En qué estoy trabajando en esta etapa. Una página /now: cambia cuando cambia mi rutina.",
    updated: "Actualizada el",
    availability: "Disponibilidad",
    role: "Dónde estoy",
    projects: "Proyectos de este año",
    writing: "Lo último que escribí",
    notes: "Notas",
    evolution: "Evolución documentada de los proyectos",
    workWithMe: "Cómo trabajar conmigo",
    about: "¿Qué es una página /now?",
  },
}

/** Title and description for the page metadata. */
export const nowMeta: Record<Locale, { title: string; description: string }> = {
  pt: { title: "Agora — no que estou trabalhando", description: "Disponibilidade, trabalho atual, projetos do ano e últimos artigos de Yago Lagrotti Bracco." },
  en: { title: "Now — what I am working on", description: "Availability, current work, this year's projects and latest articles by Yago Lagrotti Bracco." },
  es: { title: "Ahora — en qué estoy trabajando", description: "Disponibilidad, trabajo actual, proyectos del año y últimos artículos de Yago Lagrotti Bracco." },
}

/** The latest of the dates the page is built from. */
function lastUpdate(dates: string[]): string {
  return dates.reduce((latest, date) => (Date.parse(date) > Date.parse(latest) ? date : latest))
}

export function NowScreen({ locale }: { locale: Locale }) {
  const text = copy[locale]
  const { availability } = personalData
  const year = availability.updatedAt.slice(0, 4)
  const currentRoles = personalData.experience.filter((job) => /present/i.test(job.period.en))
  const projects = getCaseStudyProjects().filter((project) => project.year?.includes(year))
  const posts = getAllPosts(locale).slice(0, 3)
  const updatedAt = lastUpdate([availability.updatedAt, nowNotes.updatedAt, ...posts.map((post) => post.updatedAt ?? post.date)])
  const format = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "long", timeZone: "UTC" })

  const heading = "text-xs font-semibold uppercase tracking-widest text-muted-foreground"

  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
      <Navigation />
      <main id="main" className="pb-24 pt-28">
        <article className="container mx-auto max-w-3xl px-4">
          <header className="rise-in">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{text.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{text.intro}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {text.updated} <time dateTime={updatedAt}>{format.format(new Date(updatedAt))}</time>
            </p>
          </header>

          <section aria-labelledby="now-availability" className="mt-12">
            <h2 id="now-availability" className={heading}>{text.availability}</h2>
            <p className={cn("mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium",
              availability.status === "available" ? "border-brand/30 bg-brand-soft text-brand" : "border-hairline bg-surface text-foreground")}>
              <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
              {availabilityLabel[availability.status][locale]}
            </p>
          </section>

          {currentRoles.length > 0 && (
            <section aria-labelledby="now-role" className="mt-12">
              <h2 id="now-role" className={heading}>{text.role}</h2>
              <ul className="mt-4 space-y-6">
                {currentRoles.map((job) => (
                  <li key={job.company}>
                    <p className="font-semibold">{job.position[locale]} · {job.company}</p>
                    <p className="text-sm text-muted-foreground">{job.period[locale]}</p>
                    <p className="mt-2 leading-relaxed">{job.description[locale]}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {nowNotes.notes.length > 0 && (
            <section aria-labelledby="now-notes" className="mt-12">
              <h2 id="now-notes" className={heading}>{text.notes}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5">
                {nowNotes.notes.map((note) => <li key={note.en}>{note[locale]}</li>)}
              </ul>
            </section>
          )}

          {projects.length > 0 && (
            <section aria-labelledby="now-projects" className="mt-12">
              <h2 id="now-projects" className={heading}>{text.projects}</h2>
              <ul className="mt-4 space-y-3">
                {projects.map((project) => (
                  <li key={project.slug}>
                    <Link href={getCaseStudyPath(locale, project.slug)} className="group block">
                      <span className="font-semibold group-hover:text-brand">{project.title[locale]}</span>
                      <span className="block text-sm text-muted-foreground">{project.tagline[locale]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {posts.length > 0 && (
            <section aria-labelledby="now-writing" className="mt-12">
              <h2 id="now-writing" className={heading}>{text.writing}</h2>
              <ul className="mt-4 space-y-3">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link href={post.url} className="group block">
                      <span className="font-semibold group-hover:text-brand">{post.title}</span>
                      <span className="block text-sm text-muted-foreground">
                        <time dateTime={post.date}>{format.format(new Date(post.date))}</time>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav aria-label={text.title} className="mt-14 flex flex-wrap gap-x-6 gap-y-3 border-t border-hairline pt-8 text-sm font-semibold">
            <Link href={getResourcePath(locale, "atualizacoes")} className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline">
              {text.evolution} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href={getPagePath(locale, "trabalhe-comigo")} className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline">
              {text.workWithMe} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline-offset-4 hover:underline">
              {text.about}
            </a>
          </nav>
        </article>
      </main>
      <Footer />
    </div>
  )
}
