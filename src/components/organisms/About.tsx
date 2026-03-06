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
import { motion } from "framer-motion"
import { useTranslation } from "@/contexts/TranslationContext"
import { Badge } from "@/components/ui/badge"
import { personalData } from "@/data/personal"

export function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Text block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-14 space-y-5"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("about.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {t("about.summary")}
            </p>
          </motion.div>

          {/* Skills cloud */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {t("about.skillsTitle")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {personalData.skills.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Badge
                    variant="secondary"
                    className="border border-white/8 bg-white/5 text-sm hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-300 transition-colors cursor-default"
                  >
                    {skill}
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
