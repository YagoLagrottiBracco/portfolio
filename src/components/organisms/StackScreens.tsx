/**
 * @file StackScreens.tsx
 * @description `/stack` and `/stack/[slug]` (and their `/en`, `/es` versions):
 * one page per technology with enough evidence — the case studies and other
 * projects that use it, the jobs that mention it and the articles tagged with
 * it. Everything is the site's own data, regrouped; nothing is written per page.
 */
import React from "react"
import Link from "next/link"
import { ArrowRight, Briefcase, ExternalLink, FileText, Layers } from "lucide-react"

import { ContactLinks } from "@/components/molecules/ContactLinks"
import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"
import { localizeLabel } from "@/data/content-labels"
import { personalData } from "@/data/personal"
import type { TechEntry } from "@/data/stack"
import { getAllPosts } from "@/lib/blog"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { localeTags, type Locale } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"
import { getPagePath } from "@/lib/page-routes"
import { PERSON_ID, SITE_URL } from "@/lib/site"
import { getStackPath, isListedSkill, jobsMentioning, postsTagged, projectsUsing, publishedTechs, relatedTechs, techName } from "@/lib/stack"

type Counts = { projects: number; jobs: number; articles: number }

export const stackCopy: Record<Locale, {
  indexTitle: string; indexIntro: string; indexMeta: string
  title: (name: string) => string; metaTitle: (name: string) => string; metaDescription: (name: string, counts: string) => string
  counts: (counts: Counts) => string; caseStudies: string; otherProjects: string; jobs: string; articles: string; related: string
  ctaTitle: (name: string) => string; ctaText: string; workWithMe: string; all: string; skill: string
}> = {
  pt: {
    indexTitle: "Tecnologias",
    indexIntro: "Tecnologias em que atuo como Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior — cada uma com os projetos, as experiências e os artigos em que aparece. Só entram as que têm evidência suficiente.",
    indexMeta: "As tecnologias com que Yago Lagrotti Bracco (Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior) trabalha, cada uma com projetos, experiência profissional e artigos.",
    title: (name) => `${name}: projetos, experiência e artigos`,
    metaTitle: (name) => `Programador e Desenvolvedor ${name} — projetos e experiência`,
    metaDescription: (name, counts) => `Projetos reais, arquitetura e experiência profissional de Yago Lagrotti Bracco (Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior) com ${name}: ${counts}.`,
    counts: ({ projects, jobs, articles }) => [projects && `${projects} ${projects === 1 ? "projeto" : "projetos"}`, jobs && `${jobs} ${jobs === 1 ? "experiência" : "experiências"}`, articles && `${articles} ${articles === 1 ? "artigo" : "artigos"}`].filter(Boolean).join(" · "),
    caseStudies: "Estudos de caso", otherProjects: "Outros projetos", jobs: "Experiência profissional", articles: "Artigos", related: "Usada junto com",
    ctaTitle: (name) => `Precisa de ${name} no seu time ou projeto?`, ctaText: "Estou aberto a vagas remotas e a projetos sob medida como Programador Sênior, Desenvolvedor Full Stack e Engenheiro de Software.", workWithMe: "Como trabalho", all: "Todas as tecnologias", skill: "Competência principal",
  },
  en: {
    indexTitle: "Technologies",
    indexIntro: "Technologies I work with as a Senior Software Engineer, Full-Stack Developer, and Programmer — each with the projects, jobs and articles it appears in. Only those with enough evidence are listed.",
    indexMeta: "The technologies Yago Lagrotti Bracco (Senior Software Engineer, Full-Stack Developer & Programmer) works with, each with projects, professional experience and articles.",
    title: (name) => `${name}: projects, experience and articles`,
    metaTitle: (name) => `${name} Developer & Software Engineer — projects and experience`,
    metaDescription: (name, counts) => `Real-world projects, architecture and professional experience by Yago Lagrotti Bracco (Senior Software Engineer, Full-Stack Developer & Programmer) with ${name}: ${counts}.`,
    counts: ({ projects, jobs, articles }) => [projects && `${projects} ${projects === 1 ? "project" : "projects"}`, jobs && `${jobs} ${jobs === 1 ? "job" : "jobs"}`, articles && `${articles} ${articles === 1 ? "article" : "articles"}`].filter(Boolean).join(" · "),
    caseStudies: "Case studies", otherProjects: "Other projects", jobs: "Professional experience", articles: "Articles", related: "Used together with",
    ctaTitle: (name) => `Need ${name} on your team or project?`, ctaText: "I am open to remote roles and custom projects as a Senior Software Engineer, Full-Stack Developer, and Programmer.", workWithMe: "How I work", all: "All technologies", skill: "Core skill",
  },
  es: {
    indexTitle: "Tecnologías",
    indexIntro: "Tecnologías con las que trabajo como Programador, Desarrollador Full Stack e Ingeniero de Software Sénior — cada una con los proyectos, los trabajos y los artículos en que aparece. Solo están las que tienen evidencia suficiente.",
    indexMeta: "Las tecnologías con las que trabaja Yago Lagrotti Bracco (Programador, Desarrollador Full Stack e Ingeniero de Software Sénior), cada una con proyectos, experiencia profesional y artículos.",
    title: (name) => `${name}: proyectos, experiencia y artículos`,
    metaTitle: (name) => `Programador y Desarrollador ${name} — proyectos y experiencia`,
    metaDescription: (name, counts) => `Proyectos reales, arquitectura y experiencia profesional de Yago Lagrotti Bracco (Programador, Desarrollador Full Stack e Ingeniero de Software Sénior) con ${name}: ${counts}.`,
    counts: ({ projects, jobs, articles }) => [projects && `${projects} ${projects === 1 ? "proyecto" : "proyectos"}`, jobs && `${jobs} ${jobs === 1 ? "experiencia" : "experiencias"}`, articles && `${articles} ${articles === 1 ? "artículo" : "artículos"}`].filter(Boolean).join(" · "),
    caseStudies: "Casos de estudio", otherProjects: "Otros proyectos", jobs: "Experiencia profesional", articles: "Artículos", related: "Se usa junto con",
    ctaTitle: (name) => `¿Necesitas ${name} en tu equipo o proyecto?`, ctaText: "Estoy disponible para puestos remotos y proyectos a medida como Programador Sénior, Desarrollador Full Stack e Ingeniero de Software.", workWithMe: "Cómo trabajo", all: "Todas las tecnologías", skill: "Competencia principal",
  },
}

/** What a technology page holds in one language. */
export function techPageData(entry: TechEntry, locale: Locale) {
  const projects = projectsUsing(entry)
  const caseStudies = projects.filter((project) => project.featured && project.caseStudy)
  const others = projects.filter((project) => !(project.featured && project.caseStudy))
  const jobs = jobsMentioning(entry).sort((a, b) => b.order - a.order)
  const articles = postsTagged(entry, getAllPosts(locale))
  return { caseStudies, others, jobs, articles, counts: { projects: projects.length, jobs: jobs.length, articles: articles.length } }
}

function Shell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
      <Navigation />
      <main id="main" className="pb-24 pt-28">
        <div className="container mx-auto max-w-5xl px-4">{children}</div>
      </main>
      <Footer />
    </div>
  )
}

export function StackIndexScreen({ locale }: { locale: Locale }) {
  const text = stackCopy[locale]
  const techs = publishedTechs(getAllPosts())
  const url = `${SITE_URL}${getStackPath(locale)}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url,
    name: text.indexTitle,
    description: text.indexMeta,
    inLanguage: localeTags[locale],
    author: { "@id": PERSON_ID },
    mainEntity: {
      "@type": "ItemList",
      name: text.indexTitle,
      itemListElement: techs.map((entry, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: techName(entry, locale),
        url: `${SITE_URL}${getStackPath(locale, entry.slug)}`,
      })),
    },
    isPartOf: { "@type": "WebSite", name: personalData.name, url: SITE_URL },
  }
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: personalData.name, item: `${SITE_URL}${getHomePath(locale)}` },
      { "@type": "ListItem", position: 2, name: text.indexTitle, item: url },
    ],
  }
  return (
    <Shell locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <header className="rise-in max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{text.indexTitle}</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{text.indexIntro}</p>
      </header>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {techs.map((entry) => {
          const { counts } = techPageData(entry, locale)
          return (
            <li key={entry.slug}>
              <Link href={getStackPath(locale, entry.slug)} className="group flex h-full flex-col rounded-2xl border border-hairline p-5 transition-colors hover:border-brand/40 hover:bg-surface">
                <span className="text-lg font-semibold group-hover:text-brand">{techName(entry, locale)}</span>
                <span className="mt-1 text-sm text-muted-foreground">{text.counts(counts)}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </Shell>
  )
}

export function StackScreen({ entry, locale }: { entry: TechEntry; locale: Locale }) {
  const text = stackCopy[locale]
  const name = techName(entry, locale)
  const { caseStudies, others, jobs, articles, counts } = techPageData(entry, locale)
  const related = relatedTechs(entry, publishedTechs(getAllPosts()))
  const skill = isListedSkill(entry)
  const heading = "flex items-center gap-2 text-xl font-bold tracking-tight"

  const url = `${SITE_URL}${getStackPath(locale, entry.slug)}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url,
    name: text.metaTitle(name),
    description: text.metaDescription(name, text.counts(counts)),
    inLanguage: localeTags[locale],
    about: { "@type": "Thing", name },
    author: { "@id": PERSON_ID },
    isPartOf: { "@type": "WebSite", name: personalData.name, url: SITE_URL },
  }
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: personalData.name, item: `${SITE_URL}${getHomePath(locale)}` },
      { "@type": "ListItem", position: 2, name: text.indexTitle, item: `${SITE_URL}${getStackPath(locale)}` },
      { "@type": "ListItem", position: 3, name, item: url },
    ],
  }

  return (
    <Shell locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <Link href={getStackPath(locale)} className="underline underline-offset-4">{text.all}</Link>
      </nav>
      <header className="rise-in mt-6 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{text.title(name)}</h1>
        <p className="mt-4 text-muted-foreground">
          {text.counts(counts)}
          {skill && <span className="ml-3 rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">{text.skill}</span>}
        </p>
      </header>

      {caseStudies.length > 0 && (
        <section aria-labelledby="stack-cases" className="mt-12">
          <h2 id="stack-cases" className={heading}><Layers className="h-5 w-5 text-brand" aria-hidden="true" />{text.caseStudies}</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {caseStudies.map((project) => (
              <li key={project.slug}>
                <Link href={getCaseStudyPath(locale, project.slug)} className="group flex h-full flex-col rounded-2xl border border-hairline p-5 transition-colors hover:border-brand/40 hover:bg-surface">
                  <span className="font-semibold group-hover:text-brand">{project.title[locale]}</span>
                  <span className="mt-1 text-sm text-muted-foreground">{project.tagline[locale]}</span>
                  {project.caseStudy?.metrics?.[0] && <span className="mt-3 text-sm font-medium text-brand">{localizeLabel(project.caseStudy.metrics[0], locale)}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {others.length > 0 && (
        <section aria-labelledby="stack-others" className="mt-12">
          <h2 id="stack-others" className={heading}>{text.otherProjects}</h2>
          <ul className="mt-5 space-y-3">
            {others.map((project) => (
              <li key={project.slug} className="rounded-xl border border-hairline p-4">
                <span className="font-semibold">{project.title[locale]}</span>
                <span className="block text-sm text-muted-foreground">{project.tagline[locale]}</span>
                {project.links[0] && (
                  <a href={project.links[0].url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm text-brand underline-offset-4 hover:underline">
                    {project.links[0].label[locale]}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {jobs.length > 0 && (
        <section aria-labelledby="stack-jobs" className="mt-12">
          <h2 id="stack-jobs" className={heading}><Briefcase className="h-5 w-5 text-brand" aria-hidden="true" />{text.jobs}</h2>
          <ul className="mt-5 space-y-4">
            {jobs.map((job) => (
              <li key={`${job.company}-${job.order}`} className="border-l-2 border-brand/40 pl-4">
                <p className="font-semibold">{job.position[locale]} · {localizeLabel(job.company, locale)}</p>
                <p className="text-sm text-muted-foreground">{job.period[locale]}</p>
                <p className="mt-1.5 text-sm leading-relaxed">{job.description[locale]}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {articles.length > 0 && (
        <section aria-labelledby="stack-articles" className="mt-12">
          <h2 id="stack-articles" className={heading}><FileText className="h-5 w-5 text-brand" aria-hidden="true" />{text.articles}</h2>
          <ul className="mt-5 space-y-3">
            {articles.map((post) => (
              <li key={post.slug}>
                <Link href={post.url} className="group block">
                  <span className="font-semibold group-hover:text-brand">{post.title}</span>
                  <span className="block text-sm text-muted-foreground">{post.excerpt}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="stack-related" className="mt-12">
          <h2 id="stack-related" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{text.related}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {related.map((other) => (
              <li key={other.slug}>
                <Link href={getStackPath(locale, other.slug)} className="inline-flex rounded-full border border-hairline px-3 py-1.5 text-sm hover:border-brand/40 hover:text-brand">{techName(other, locale)}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="stack-cta" className="mt-16 rounded-2xl border border-brand/25 bg-brand-soft p-6 sm:p-8">
        <h2 id="stack-cta" className="text-2xl font-bold tracking-tight">{text.ctaTitle(name)}</h2>
        <p className="mt-2 text-muted-foreground">{text.ctaText}</p>
        <ContactLinks locale={locale} placement={`stack:${entry.slug}`} channels={["calendly", "whatsapp", "linkedin"]} className="mt-6" />
        <Link href={getPagePath(locale, "trabalhe-comigo")} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline-offset-4 hover:underline">
          {text.workWithMe} <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </Shell>
  )
}

