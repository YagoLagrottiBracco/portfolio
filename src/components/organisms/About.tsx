/**
 * @file About.tsx
 * @description "About me" section — Senior Engineer & AI Architect positioning.
 *
 * Title: "Mais de 10 anos transformando regras de negócio em código."
 * Shows professional summary text + skills cloud via shadcn Badge.
 * Skills fade in, staggered, as the section scrolls into view.
 * Data comes from `personalData.skills` in `@/data/personal`.
 *
 * A Server Component: no JavaScript of its own reaches the browser, so it
 * costs nothing to hydrate on a slow phone.
 */
import Link from "next/link"
import { localizeLabel } from "@/data/content-labels"
import { Badge, badgeVariants } from "@/components/ui/badge"
import { personalData } from "@/data/personal"
import type { Locale } from "@/lib/i18n"
import { reveal } from "@/lib/motion"
import { getStackPath, techFor } from "@/lib/stack"
import { translator } from "@/lib/translate"
import { cn } from "@/lib/utils"

export function About({ locale, techPages = [] }: { locale: Locale; techPages?: string[] }) {
  const t = translator(locale)
  const published = new Set(techPages)

  return (
    <section id="about" className="py-24 bg-muted/20 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Text block */}
          <div {...reveal()} className="mb-14 space-y-5">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t("about.title")}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {t("about.summary")}
              <span className="sr-only">
                {locale === "pt"
                  ? " Atuação como Programador Full Stack, Desenvolvedor de Software Sênior e Arquiteto de Software no Brasil (São Paulo)."
                  : locale === "en"
                    ? " Working as a Full-Stack Developer, Software Developer, Programmer, and Software Architect in Brazil."
                    : " Actuación como Programador Full Stack, Desarrollador de Software Sénior y Arquitecto de Software en Brasil."}
              </span>
            </p>
          </div>

          {/* Skills cloud */}
          <div {...reveal(1)} className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {t("about.skillsTitle")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {personalData.skills.map((skill, index) => {
                const entry = techFor(skill)
                const href = entry && published.has(entry.slug) ? getStackPath(locale, entry.slug) : null
                return (
                  <div key={skill} {...reveal(index)}>
                    {href ? (
                      <Link
                        href={href}
                        className={cn(
                          badgeVariants({ variant: "secondary" }),
                          "border border-hairline bg-surface text-sm underline-offset-4 transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand hover:underline"
                        )}
                      >
                        {localizeLabel(skill, locale)}
                      </Link>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="cursor-default border border-hairline bg-surface text-sm transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
                      >
                        {localizeLabel(skill, locale)}
                      </Badge>
                    )}
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
