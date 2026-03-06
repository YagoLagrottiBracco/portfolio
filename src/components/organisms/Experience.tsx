"use client"

/**
 * @file Experience.tsx
 * @description Professional experience & academic background section.
 *
 * Layout: Two-column side-by-side (Experiência Profissional | Formação Acadêmica).
 * Each column renders its own vertical timeline with a connecting line.
 * The first (most recent) experience card is visually highlighted as the primary entry.
 *
 * Data sources:
 * - `personalData.experience` — sorted descending by `order`
 * - `personalData.education` — sorted descending by `order`
 */
import { motion } from "framer-motion"
import { Briefcase, GraduationCap, MapPin, Clock } from "lucide-react"
import { personalData } from "@/data/personal"
import { useTranslation } from "@/contexts/TranslationContext"
import { Badge } from "@/components/ui/badge"

type LocaleKey = "pt" | "en"

export function Experience() {
  const { t, locale } = useTranslation()
  const l = locale as LocaleKey

  const experience = [...personalData.experience].sort((a, b) => b.order - a.order)
  const education = [...personalData.education].sort((a, b) => b.order - a.order)

  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            {t("experience.subtitle")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("experience.title")}
          </h2>
        </motion.div>

        {/* Two-column grid */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2">
          {/* ── Column 1: Experience ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                <Briefcase className="h-4 w-4 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold">{t('experience.colExperience')}</h3>
            </div>

            <div className="relative space-y-6 pl-5">
              {/* Vertical line */}
              <div className="absolute left-0 top-2 bottom-0 w-px bg-border" />

              {experience.map((exp, index) => {
                const isPrimary = index === 0
                return (
                  <motion.div
                    key={`${exp.company}-${exp.order}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.45 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-5 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 ${isPrimary
                        ? "border-blue-400 bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                        : "border-muted-foreground bg-background"
                        }`}
                    />

                    <div
                      className={`rounded-xl border p-5 transition-colors ${isPrimary
                        ? "border-blue-500/30 bg-blue-500/5"
                        : "border-white/5 bg-muted/20"
                        }`}
                    >
                      {/* Header */}
                      <div className="mb-2 space-y-1">
                        <p className={`font-semibold leading-snug ${isPrimary ? "text-foreground" : ""}`}>
                          {exp.position[l]}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            {exp.company}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            {exp.period[l]}
                          </span>
                        </div>
                      </div>

                      {isPrimary && (
                        <Badge
                          variant="secondary"
                          className="mb-2 border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs"
                        >
                          {t('experience.highlight')}
                        </Badge>
                      )}

                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                        {exp.description[l]}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* ── Column 2: Education ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
                <GraduationCap className="h-4 w-4 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold">{t('experience.colEducation')}</h3>
            </div>

            <div className="relative space-y-6 pl-5">
              {/* Vertical line */}
              <div className="absolute left-0 top-2 bottom-0 w-px bg-border" />

              {education.map((edu, index) => {
                const isPrimary = index === 0
                return (
                  <motion.div
                    key={`${edu.institution}-${edu.order}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08, duration: 0.45 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-5 top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 ${isPrimary
                        ? "border-purple-400 bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                        : "border-muted-foreground bg-background"
                        }`}
                    />

                    <div
                      className={`rounded-xl border p-5 transition-colors ${isPrimary
                        ? "border-purple-500/30 bg-purple-500/5"
                        : "border-white/5 bg-muted/20"
                        }`}
                    >
                      {/* Header */}
                      <div className="mb-2 flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                        <div>
                          <p className="font-semibold leading-snug">{edu.degree[l]}</p>
                          <div className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            <span>{edu.institution}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{edu.period[l]}</span>
                        </div>
                      </div>

                      {isPrimary && (
                        <Badge
                          variant="secondary"
                          className="mb-2 border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs"
                        >
                          {t('experience.inProgress')}
                        </Badge>
                      )}

                      {edu.description && (
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          {edu.description[l]}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
