/**
 * @file Testimonials.tsx
 * @description Recommendations from people Yago worked with. Renders nothing
 * while `personalData.testimonials` is empty, so the section appears the day
 * the first real one is added. No hooks: it works in server and client trees.
 */
import { ExternalLink, Quote } from "lucide-react"

import type { Testimonial } from "@/data/personal"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const copy: Record<Locale, { title: string; source: string }> = {
  pt: { title: "Quem trabalhou comigo", source: "Ver a recomendação original" },
  en: { title: "From people I worked with", source: "Read the original recommendation" },
  es: { title: "Quienes trabajaron conmigo", source: "Ver la recomendación original" },
}

interface TestimonialsProps {
  locale: Locale
  items: Testimonial[]
  /** Heading level of the section title, so it fits the page outline. */
  headingLevel?: "h2" | "h3"
  className?: string
}

export function Testimonials({ locale, items, headingLevel: Heading = "h2", className }: TestimonialsProps) {
  if (items.length === 0) return null
  const text = copy[locale]

  return (
    <section aria-labelledby="testimonials-title" className={cn("py-16", className)}>
      <Heading id="testimonials-title" className="text-2xl font-bold tracking-tight sm:text-3xl">
        {text.title}
      </Heading>
      <ul className="mt-8 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <li key={`${item.author}-${item.quote.pt.slice(0, 24)}`}>
            <figure className="flex h-full flex-col rounded-2xl border border-hairline bg-surface p-6">
              <Quote className="h-5 w-5 text-brand" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 leading-relaxed text-foreground">{item.quote[locale]}</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold text-foreground">{item.author}</span>
                <span className="block text-muted-foreground">
                  {item.role[locale]}
                  {item.company ? ` · ${item.company}` : ""}
                </span>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline"
                  >
                    {text.source}
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  )
}
