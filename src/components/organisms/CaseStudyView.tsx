"use client"

/**
 * @file CaseStudyView.tsx
 * @description Renders one project's long-form write-up at `/projetos/[slug]`.
 *
 * Client-side because the copy is bilingual and the active locale lives in
 * `TranslationContext`. The page shell around it stays a Server Component, so
 * the metadata and the first paint still come from the server.
 */
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Calendar, ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { projectCategories } from "@/data/personal"
import { useTranslation } from "@/contexts/TranslationContext"
import { useReveal } from "@/lib/motion"
import type { CaseStudyProject } from "@/lib/projects"

type LocaleKey = "pt" | "en"

interface CaseStudyViewProps {
  project: CaseStudyProject
  previous?: CaseStudyProject
  next?: CaseStudyProject
}

export function CaseStudyView({ project, previous, next }: CaseStudyViewProps) {
  const { t, locale } = useTranslation()
  const l = locale as LocaleKey
  const reveal = useReveal()

  const { caseStudy } = project
  const categoryLabel = projectCategories.find((c) => c.id === project.category)?.label[l]

  /** The narrative blocks, in reading order. `architecture` is optional. */
  const sections = [
    { key: "context", label: t("caseStudy.context"), body: caseStudy.context[l] },
    { key: "challenge", label: t("caseStudy.challenge"), body: caseStudy.challenge[l] },
    { key: "solution", label: t("caseStudy.solution"), body: caseStudy.solution[l] },
    ...(caseStudy.architecture
      ? [{ key: "architecture", label: t("caseStudy.architecture"), body: caseStudy.architecture[l] }]
      : []),
  ]

  return (
    <article className="pb-24 pt-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Back */}
          <Link
            href="/#featured-projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t("caseStudy.back")}
          </Link>

          {/* Header */}
          <motion.header {...reveal()} className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              {categoryLabel && (
                <Badge className="border-transparent bg-brand text-brand-contrast">{categoryLabel}</Badge>
              )}
              <Badge variant="outline" className="border-hairline text-muted-foreground">
                {project.status[l]}
              </Badge>
              {project.year && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {project.year}
                </span>
              )}
            </div>

            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{project.title[l]}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{project.tagline[l]}</p>

            {project.links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <Button key={link.url} asChild className="gap-2">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      {link.label[l]}
                    </a>
                  </Button>
                ))}
              </div>
            )}
          </motion.header>

          {/* Cover */}
          <motion.div
            {...reveal(1)}
            className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl border border-hairline"
          >
            <Image
              src={project.image}
              alt={`${project.title[l]} — ${project.tagline[l]}`}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          </motion.div>

          {/* Narrative */}
          <div className="mt-14 space-y-12">
            {sections.map((section, index) => (
              <motion.section key={section.key} {...reveal(index)}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-brand">
                  {section.label}
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-foreground/90">{section.body}</p>
              </motion.section>
            ))}
          </div>

          {/* Highlights */}
          <motion.section {...reveal()} className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight">{t("caseStudy.highlights")}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {caseStudy.highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title[l]}
                  {...reveal(index)}
                  className="rounded-xl border border-hairline bg-surface p-5"
                >
                  <h3 className="font-semibold">{highlight.title[l]}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {highlight.description[l]}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Stack */}
          <motion.section {...reveal()} className="mt-16">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t("caseStudy.stack")}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge key={tech} variant="outline" className="border-hairline text-sm text-muted-foreground">
                  {tech}
                </Badge>
              ))}
            </div>
          </motion.section>

          {/* Prev / next */}
          {(previous || next) && (
            <nav
              aria-label={t("caseStudy.otherProjects")}
              className="mt-16 grid grid-cols-1 gap-4 border-t border-hairline pt-8 sm:grid-cols-2"
            >
              {previous && (
                <Link
                  href={`/projetos/${previous.slug}`}
                  className="group rounded-xl border border-hairline bg-surface p-5 transition-colors hover:border-brand/40"
                >
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("caseStudy.previous")}
                  </span>
                  <span className="mt-2 block font-semibold group-hover:text-brand">
                    {previous.title[l]}
                  </span>
                </Link>
              )}
              {next && (
                <Link
                  href={`/projetos/${next.slug}`}
                  className="group rounded-xl border border-hairline bg-surface p-5 text-right transition-colors hover:border-brand/40 sm:col-start-2"
                >
                  <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                    {t("caseStudy.next")}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="mt-2 block font-semibold group-hover:text-brand">{next.title[l]}</span>
                </Link>
              )}
            </nav>
          )}

          {/* CTA */}
          <motion.aside
            {...reveal()}
            className="mt-16 rounded-2xl border border-brand/25 bg-brand-soft p-8 text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight">{t("caseStudy.ctaTitle")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{t("caseStudy.ctaText")}</p>
            <Button asChild size="lg" className="mt-6 gap-2 font-semibold">
              <Link href="/#contact">
                {t("caseStudy.ctaButton")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </motion.aside>
        </div>
      </div>
    </article>
  )
}
