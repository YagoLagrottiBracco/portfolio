"use client"

/**
 * @file Hero.tsx
 * @description Full-screen hero — Senior Software Engineer & AI Architect positioning.
 *
 * The background grid and glow are painted with theme tokens rather than fixed
 * white/blue values, so the section reads correctly in light mode too; the
 * previous version drew white-on-white lines that simply vanished.
 */
import { motion } from "framer-motion"
import { ChevronDown, Github, ArrowRight } from "lucide-react"

import { useTranslation } from "@/contexts/TranslationContext"
import { Button } from "@/components/ui/button"
import { personalData } from "@/data/personal"
import { useReveal } from "@/lib/motion"

export function Hero() {
  const { t } = useTranslation()
  const reveal = useReveal()

  const stats = [
    { value: "10+", label: t("hero.statYears") },
    { value: "~3M", label: t("hero.statScale") },
    { value: "Node.js", label: t("hero.statStack") },
  ]

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,var(--brand-soft),transparent)]"
      />
      {/* Grid — drawn from the foreground colour at low alpha, so it survives
          both themes instead of being hard-coded white. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:60px_60px] dark:opacity-[0.08]"
      />

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          {...reveal()}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-4 py-1.5 text-sm text-brand"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          {t("hero.available")}
        </motion.div>

        <motion.h1
          {...reveal(1)}
          className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {t("hero.h1a")}{" "}
          <span className="bg-gradient-to-r from-brand via-brand to-accent2 bg-clip-text text-transparent">
            {t("hero.h1b")}
          </span>{" "}
          {t("hero.h1c")}
        </motion.h1>

        <motion.p
          {...reveal(2)}
          className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          {...reveal(3)}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button size="lg" asChild className="group gap-2 text-base font-semibold">
            <a href="#featured-projects">
              {t("hero.viewProjects")}
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                aria-hidden="true"
              />
            </a>
          </Button>
          <Button variant="outline" size="lg" asChild className="gap-2 border-hairline text-base">
            <a href={personalData.socialLinks.github} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" aria-hidden="true" />
              {t("hero.github")}
            </a>
          </Button>
        </motion.div>

        <motion.div
          {...reveal(4)}
          className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-xl font-bold text-foreground">{stat.value}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div aria-hidden="true" className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDown className="h-6 w-6 animate-bounce text-muted-foreground motion-reduce:animate-none" />
      </div>
    </section>
  )
}
