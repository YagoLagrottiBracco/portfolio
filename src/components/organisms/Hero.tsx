/**
 * @file Hero.tsx
 * @description Full-screen hero — Senior Software Engineer positioning across fullstack, architecture and DevOps.
 *
 * The background grid and glow are painted with theme tokens rather than fixed
 * white/blue values, so the section reads correctly in light mode too; the
 * previous version drew white-on-white lines that simply vanished.
 *
 * The entrance is the CSS `rise-in` animation, not a scroll reveal: this
 * is the first thing painted, and it must not sit invisible until hydration.
 *
 * A Server Component: no JavaScript of its own reaches the browser, so it
 * costs nothing to hydrate on a slow phone. Tracked links are `TrackedLink`.
 */
import type { CSSProperties } from "react"
import { ChevronDown, Download, Github, ArrowRight } from "lucide-react"

import { TrackedLink } from "@/components/atoms/TrackedLink"
import { buttonVariants } from "@/components/ui/button"
import { personalData } from "@/data/personal"
import { availabilityLabel } from "@/lib/availability"
import { getCvFileName, getCvPath } from "@/lib/cv-routes"
import type { Locale } from "@/lib/i18n"
import { translator } from "@/lib/translate"
import { cn } from "@/lib/utils"

const rise = (step: number) => ({ "--rise-step": step }) as CSSProperties

export function Hero({ locale }: { locale: Locale }) {
  const t = translator(locale)
  const availability = personalData.availability.status

  const stats = [
    { value: "10+", label: t("hero.statYears") },
    { value: t("hero.statDelivery"), label: t("hero.statDeliveryDescription") },
    { value: "Fullstack", label: t("hero.statFocus") },
  ]

  return (
    // Padding the height of the fixed bar, top and bottom: where the content is
    // taller than the screen (phones), it starts below the bar and ends above
    // the scroll hint; where it fits, it stays centred.
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden py-16">
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
          className={cn(
            "rise-in mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm",
            availability === "available" && "border-brand/30 bg-brand-soft text-brand",
            availability === "limited" && "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
            availability === "unavailable" && "border-hairline bg-surface text-muted-foreground"
          )}
        >
          <span className="relative flex h-2 w-2">
            {availability === "available" && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75 motion-reduce:animate-none" />
            )}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
          </span>
          {availabilityLabel[availability][locale]}
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
          <span className="sr-only">
            {locale === "pt"
              ? " Programador Sênior, Desenvolvedor Full Stack e Arquiteto de Software em São Paulo, Brasil."
              : locale === "en"
                ? " Senior Programmer, Full-Stack Developer, and Software Architect based in São Paulo, Brazil."
                : " Programador Sénior, Desarrollador Full Stack y Arquitecto de Software en São Paulo, Brasil."}
          </span>
        </p>

        <div style={rise(3)} className="rise-in mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href="#featured-projects" className={cn(buttonVariants({ size: "lg" }), "group gap-2 text-base font-semibold")}>
            {t("hero.viewProjects")}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              aria-hidden="true"
            />
          </a>
          <a
            href={personalData.socialLinks.github}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "gap-2 border-hairline text-base")}
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            {t("hero.github")}
          </a>
          <TrackedLink
            href={getCvPath(locale)}
            download={getCvFileName(locale)}
            event="cv_download"
            properties={{ placement: "hero", locale }}
            className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "gap-2 text-base")}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t("hero.downloadCv")}
          </TrackedLink>
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
