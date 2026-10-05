"use client"

/**
 * @file Hero.tsx
 * @description Full-screen hero — Senior Software Engineer positioning across fullstack, architecture and DevOps.
 *
 * The background grid and glow are painted with theme tokens rather than fixed
 * white/blue values, so the section reads correctly in light mode too; the
 * previous version drew white-on-white lines that simply vanished.
 *
 * The entrance is the CSS `rise-in` animation, not a Framer Motion reveal: this
 * is the first thing painted, and it must not sit invisible until hydration.
 */
import type { CSSProperties } from "react"
import { ChevronDown, Download, Github, ArrowRight } from "lucide-react"

import { useTranslation } from "@/contexts/TranslationContext"
import { Button } from "@/components/ui/button"
import { personalData } from "@/data/personal"
import { trackEvent } from "@/lib/analytics"
import { getCvFileName, getCvPath } from "@/lib/cv-routes"

const rise = (step: number) => ({ "--rise-step": step }) as CSSProperties

export function Hero() {
  const { t, locale } = useTranslation()

  const stats = [
    { value: "10+", label: t("hero.statYears") },
    { value: t("hero.statDelivery"), label: t("hero.statDeliveryDescription") },
    { value: "Fullstack", label: t("hero.statFocus") },
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
        <div
          style={rise(0)}
          className="rise-in mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-soft px-4 py-1.5 text-sm text-brand"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
          </span>
          {t("hero.available")}
        </div>

        {/* The name is part of the heading: it is what people search for. */}
        <h1 style={rise(1)} className="rise-in mx-auto max-w-4xl">
          <span className="mb-4 block text-xl font-semibold tracking-tight text-brand sm:text-2xl">
            {personalData.name}
          </span>
          <span className="block text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t("hero.h1a")}{" "}
            <span className="bg-gradient-to-r from-brand via-brand to-accent2 bg-clip-text text-transparent">
              {t("hero.h1b")}
            </span>{" "}
            {t("hero.h1c")}
          </span>
        </h1>

        <p style={rise(2)} className="rise-in mx-auto mt-4 text-sm font-semibold tracking-wide text-brand sm:text-base">
          {t("hero.focus")}
        </p>

        <p style={rise(2)} className="rise-in mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          {t("hero.subtitle")}
        </p>

        <div style={rise(3)} className="rise-in mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
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
          <Button variant="ghost" size="lg" asChild className="gap-2 text-base">
            <a
              href={getCvPath(locale)}
              download={getCvFileName(locale)}
              onClick={() => trackEvent("cv_download", { placement: "hero", locale })}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {t("hero.downloadCv")}
            </a>
          </Button>
        </div>

        <div style={rise(4)} className="rise-in mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-xl font-bold text-foreground">{stat.value}</span>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDown className="h-6 w-6 animate-bounce text-muted-foreground motion-reduce:animate-none" />
      </div>
    </section>
  )
}
