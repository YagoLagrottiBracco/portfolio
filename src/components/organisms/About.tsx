"use client"

/**
 * @file About.tsx
 * @description "About me" section — Senior Engineer & AI Architect positioning.
 *
 * Title: "Mais de 10 anos transformando regras de negócio em código."
 * Shows professional summary text + skills cloud via shadcn Badge.
 * Skills animate with staggered fade-in using whileInView.
 * Data comes from `personalData.skills` in `@/data/personal`.
 */
import { localizeLabel } from "@/data/content-labels"
import { motion } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import { Badge } from "@/components/ui/badge"
import { personalData } from "@/data/personal"
import { useReveal } from "@/lib/motion"

export function About() {
  const { t, locale } = useTranslation()
  const reveal = useReveal()

  return (
    <section id="about" className="py-24 bg-muted/20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Text block */}
          <motion.div {...reveal()} className="mb-14 space-y-5">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("about.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {t("about.summary")}
            </p>
          </motion.div>

          {/* Skills cloud */}
          <motion.div {...reveal(1)} className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {t("about.skillsTitle")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {personalData.skills.map((skill, index) => (
                <motion.div key={skill} {...reveal(index)}>
                  <Badge
                    variant="secondary"
                    className="cursor-default border border-hairline bg-surface text-sm transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                  >
                    {localizeLabel(skill, locale)}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
