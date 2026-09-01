"use client"

/**
 * @file FeaturedProjects.tsx
 * @description The curated case-study section on the homepage.
 *
 * Reads the single project list from `@/data/personal` and renders only the
 * entries flagged `featured` — the grid below (`Projects.tsx`) renders the rest,
 * so no project is ever shown twice.
 *
 * Each card is a teaser: the challenge, the shape of the solution, and a link
 * into the full write-up at `/projetos/[slug]`.
 */
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { personalData, projectCategories } from "@/data/personal"
import { useTranslation } from "@/contexts/TranslationContext"
import { useReveal } from "@/lib/motion"

type LocaleKey = "pt" | "en"

/** Tech badges shown on a teaser card before collapsing into a "+N" chip. */
const MAX_VISIBLE_TECH = 5

export function FeaturedProjects() {
  const { t, locale } = useTranslation()
  const l = locale as LocaleKey
  const reveal = useReveal()

  const featured = personalData.projects.filter((project) => project.featured)

  return (
    <section id="featured-projects" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div {...reveal()} className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("featuredProjects.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("featuredProjects.subtitle")}
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
          {featured.map((project, index) => {
            const categoryLabel = projectCategories.find((c) => c.id === project.category)?.label[l]
            const visibleTech = project.techStack.slice(0, MAX_VISIBLE_TECH)
            const hiddenTechCount = project.techStack.length - visibleTech.length
            const caseStudyHref = `/projetos/${project.slug}`

            return (
              <motion.article
                key={project.slug}
                {...reveal(index)}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface transition-colors duration-200 hover:border-brand/40 focus-within:border-brand/40"
              >
                {/* Cover — the whole image is a link into the case study. */}
                <Link
                  href={caseStudyHref}
                  className="relative block aspect-video w-full overflow-hidden"
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
                    {categoryLabel && (
                      <Badge className="border-transparent bg-brand text-brand-contrast text-xs">
                        {categoryLabel}
                      </Badge>
                    )}
                    {project.year && (
                      <Badge variant="secondary" className="bg-black/50 text-xs text-white backdrop-blur-sm">
                        {project.year}
                      </Badge>
                    )}
                  </div>
                </Link>

                <div className="flex flex-1 flex-col gap-5 p-6">
                  <div>
                    <h3 className="text-xl font-bold leading-snug">
                      {/* Stretched link: the card is one big target, but the
                          accessible name stays on the title. */}
                      <Link
                        href={caseStudyHref}
                        className="after:absolute after:inset-0 after:content-[''] hover:text-brand transition-colors"
                      >
                        {project.title[l]}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{project.tagline[l]}</p>
                  </div>

                  {project.caseStudy && (
                    <div className="space-y-4">
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand">
                          {t("featuredProjects.challenge")}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {project.caseStudy.challenge[l]}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-accent2">
                          {t("featuredProjects.solution")}
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {project.caseStudy.solution[l]}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {visibleTech.map((tech) => (
                      <Badge key={tech} variant="outline" className="border-hairline text-xs text-muted-foreground">
                        {tech}
                      </Badge>
                    ))}
                    {hiddenTechCount > 0 && (
                      <Badge variant="outline" className="border-hairline text-xs text-muted-foreground">
                        +{hiddenTechCount}
                      </Badge>
                    )}
                  </div>

                  {/* Actions sit above the stretched link so they stay clickable. */}
                  <div className="relative z-10 mt-auto flex flex-wrap items-center gap-3 pt-1">
                    <Button size="sm" asChild className="gap-2 text-xs font-semibold">
                      <Link href={caseStudyHref}>
                        {t("featuredProjects.viewCase")}
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </Link>
                    </Button>

                    {project.links.map((link) => (
                      <Button
                        key={link.url}
                        variant="outline"
                        size="sm"
                        asChild
                        className="gap-2 border-hairline text-xs hover:border-brand/50"
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          {link.label[l]}
                          <span className="sr-only"> — {project.title[l]}</span>
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
