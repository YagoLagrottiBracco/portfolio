"use client"

/**
 * @file Experience.tsx
 * @description Professional experience & academic background section.
 *
 * Layout: two side-by-side timelines (experience | education), each with a
 * connecting line; the most recent entry in each column is highlighted.
 *
 * Colours come from theme tokens (or explicit light/dark pairs) rather than
 * fixed `blue-400` / `white/5` values, which were invisible or below the 4.5:1
 * contrast floor in light mode.
 *
 * Data comes from the homepage (a Server Component) as props, so the browser
 * does not download `@/data/personal` whole:
 * - `jobs` — `personalData.experience`, sorted here descending by `order`,
 *   each with the technologies it mentions (`jobTechs`), as chips;
 * - `education` — `personalData.education`, sorted the same way.
 *
 * The technologies become filter chips; one with a page of its own
 * (`techPages`) also gets a link to everything about it.
 */
import { useState } from "react"
import Link from "next/link"
import { localizeLabel } from "@/data/content-labels"
import { ArrowRight, Briefcase, GraduationCap, MapPin, Clock } from "lucide-react"

import type { personalData } from "@/data/personal"
import { useTranslation } from "@/contexts/TranslationContext"
import { Badge } from "@/components/ui/badge"
import { reveal } from "@/lib/motion"
import { getStackPath } from "@/lib/stack-routes"
import { cn } from "@/lib/utils"

/** A technology a job mentions: its page slug and its name in the page's language. */
export interface TechChip {
  slug: string
  name: string
}

type Job = (typeof personalData.experience)[number] & { techs: TechChip[] }
type Course = (typeof personalData.education)[number]

export function Experience({ jobs, education: courses, techPages = [] }: { jobs: Job[]; education: Course[]; techPages?: string[] }) {
  const { t, locale } = useTranslation()
  const l = locale
  const [activeTech, setActiveTech] = useState<string | null>(null)

  const allJobs = [...jobs].sort((a, b) => b.order - a.order)
  const counts = new Map<string, { chip: TechChip; jobs: number }>()
  for (const job of allJobs) {
    for (const chip of job.techs) counts.set(chip.slug, { chip, jobs: (counts.get(chip.slug)?.jobs ?? 0) + 1 })
  }
  const filters = [...counts.values()].sort((a, b) => b.jobs - a.jobs || a.chip.name.localeCompare(b.chip.name)).map((item) => item.chip)
  const active = filters.find((chip) => chip.slug === activeTech)
  const experience = active ? allJobs.filter((job) => job.techs.some((chip) => chip.slug === active.slug)) : allJobs
  const education = [...courses].sort((a, b) => b.order - a.order)

  return (
    <section id="experience" className="py-24 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div {...reveal()} className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("experience.subtitle")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("experience.title")}</h2>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Experience */}
          <div {...reveal()}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-soft">
                <Briefcase className="h-4 w-4 text-brand" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold">{t("experience.colExperience")}</h3>
            </div>

            {filters.length > 1 && (
              <div className="mb-6">
                <div role="group" aria-label={t("experience.filterLabel")} className="flex flex-wrap gap-2">
                  {[null, ...filters].map((entry) => {
                    const selected = (entry?.slug ?? null) === activeTech
                    return (
                      <button
                        key={entry?.slug ?? "all"}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setActiveTech(entry?.slug ?? null)}
                        className={cn(
                          "inline-flex h-8 items-center rounded-full border px-3 text-xs font-medium transition-colors",
                          selected ? "border-transparent bg-primary text-primary-foreground" : "border-hairline text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {entry ? entry.name : t("experience.allTechs")}
                      </button>
                    )
                  })}
                </div>
                {active && techPages.includes(active.slug) && (
                  <Link href={getStackPath(locale, active.slug)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline-offset-4 hover:underline">
                    {t("experience.seeAllAbout")} {active.name}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
              </div>
            )}

            <div className="relative space-y-6 pl-5">
              <div aria-hidden="true" className="absolute bottom-0 left-0 top-2 w-px bg-border" />

              {experience.map((exp, index) => {
                // The current job keeps its highlight even when a filter hides the jobs around it.
                const isPrimary = exp === allJobs[0]
                const techs = exp.techs
                return (
                  <div key={`${exp.company}-${exp.order}`} {...reveal(index)} className="relative">
                    <div
                      aria-hidden="true"
                      className={cn(
                        "absolute -left-5 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2",
                        isPrimary ? "border-brand bg-brand" : "border-muted-foreground bg-background"
                      )}
                    />

                    <div
                      className={cn(
                        "rounded-xl border p-5 transition-colors",
                        isPrimary ? "border-brand/30 bg-brand-soft" : "border-hairline bg-surface"
                      )}
                    >
                      <div className="mb-2 space-y-1">
                        <p className="font-semibold leading-snug">{exp.position[l]}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                            {localizeLabel(exp.company, locale)}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                            {exp.period[l]}
                          </span>
                        </div>
                      </div>

                      {isPrimary && (
                        <Badge
                          variant="secondary"
                          className="mb-2 border-brand/30 bg-brand-soft text-xs text-brand"
                        >
                          {t("experience.highlight")}
                        </Badge>
                      )}

                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {exp.description[l]}
                      </p>
                      {techs.length > 0 && (
                        <p className="mt-3 text-xs font-medium text-foreground/80">{techs.map((chip) => chip.name).join(" · ")}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Education */}
          <div {...reveal(1)}>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
                <GraduationCap
                  className="h-4 w-4 text-violet-600 dark:text-violet-400"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-lg font-semibold">{t("experience.colEducation")}</h3>
            </div>

            <div className="relative space-y-6 pl-5">
              <div aria-hidden="true" className="absolute bottom-0 left-0 top-2 w-px bg-border" />

              {education.map((edu, index) => {
                const isPrimary = index === 0
                return (
                  <div key={`${edu.institution}-${edu.order}`} {...reveal(index)} className="relative">
                    <div
                      aria-hidden="true"
                      className={cn(
                        "absolute -left-5 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2",
                        isPrimary
                          ? "border-violet-500 bg-violet-500"
                          : "border-muted-foreground bg-background"
                      )}
                    />

                    <div
                      className={cn(
                        "rounded-xl border p-5 transition-colors",
                        isPrimary ? "border-violet-500/30 bg-violet-500/5" : "border-hairline bg-surface"
                      )}
                    >
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                        <div>
                          <p className="font-semibold leading-snug">{edu.degree[l]}</p>
                          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                            <span>{edu.institution}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                          <span>{edu.period[l]}</span>
                        </div>
                      </div>

                      {isPrimary && (
                        <Badge
                          variant="secondary"
                          className="mb-2 border-violet-500/30 bg-violet-500/10 text-xs text-violet-700 dark:text-violet-300"
                        >
                          {t("experience.inProgress")}
                        </Badge>
                      )}

                      {edu.description && (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {edu.description[l]}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
