"use client"

/**
 * @file Projects.tsx
 * @description The filterable grid of everything that is not a featured case study.
 *
 * Data source: `personalData.projects` in `@/data/personal` — this section takes
 * the entries *without* `featured`, so it never repeats what the case-study
 * section above already showed.
 *
 * Add new projects in the data file only, never inline here.
 */
import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { personalData, projectCategories, type ProjectCategoryId } from "@/data/personal"
import { useTranslation } from "@/contexts/TranslationContext"
import { useReveal } from "@/lib/motion"
import { cn } from "@/lib/utils"

type LocaleKey = "pt" | "en"
type Filter = ProjectCategoryId | "all"

export function Projects() {
  const { t, locale } = useTranslation()
  const l = locale as LocaleKey
  const reveal = useReveal()
  const [filter, setFilter] = useState<Filter>("all")

  const gridProjects = useMemo(
    () => personalData.projects.filter((project) => !project.featured),
    []
  )

  // Only offer filters that would actually return something.
  const availableFilters = useMemo(() => {
    const present = new Set(gridProjects.map((p) => p.category))
    return projectCategories.filter((c) => present.has(c.id))
  }, [gridProjects])

  const visible = useMemo(
    () => (filter === "all" ? gridProjects : gridProjects.filter((p) => p.category === filter)),
    [filter, gridProjects]
  )

  return (
    <section id="projects" className="py-24 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div {...reveal()} className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("projects.title")}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            {t("projects.subtitle")}
          </p>
        </motion.div>

        {/* Filters */}
        <div
          role="group"
          aria-label={t("projects.filterLabel")}
          className="mb-10 flex flex-wrap items-center justify-center gap-2"
        >
          {[{ id: "all" as const, label: { pt: "Todos", en: "All" } }, ...availableFilters].map(
            (option) => {
              const isActive = filter === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setFilter(option.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "inline-flex h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "border-transparent bg-brand text-brand-contrast"
                      : "border-hairline bg-surface text-muted-foreground hover:border-brand/40 hover:text-foreground"
                  )}
                >
                  {option.label[l]}
                </button>
              )
            }
          )}
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, index) => (
            <motion.article
              // Keying by filter as well restarts the reveal when the list changes.
              key={`${filter}-${project.slug}`}
              {...reveal(index)}
              className="group flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface transition-colors duration-200 hover:border-brand/40"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/40 to-transparent" />
                <Image
                  src={project.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute left-3 top-3 z-20">
                  <Badge variant="secondary" className="bg-black/50 text-xs text-white backdrop-blur-sm">
                    {project.status[l]}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold">{project.title[l]}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{project.tagline[l]}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {project.description[l]}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="outline" className="border-hairline text-xs text-muted-foreground">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="mt-auto flex flex-wrap gap-4 pt-5">
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-brand underline-offset-4 hover:underline"
                    >
                      {link.label[l]}
                      <span className="sr-only"> — {project.title[l]}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
