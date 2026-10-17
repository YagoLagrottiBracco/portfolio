/**
 * @file ArticleCta.tsx
 * @description The invitation at the end of an article: the article is what
 * brings people in, and this is where a reader becomes a conversation. Links
 * to the project's case study when the article tells one.
 */
import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { ContactLinks } from "@/components/molecules/ContactLinks"
import type { Locale } from "@/lib/i18n"
import { getPagePath } from "@/lib/page-routes"

const copy: Record<Locale, { title: string; text: string; caseStudy: string; workWithMe: string }> = {
  pt: {
    title: "Precisa de alguém para um desafio parecido?",
    text: "Atuo de ponta a ponta: arquitetura, desenvolvimento e operação em produção. Estou aberto a vagas remotas e a projetos sob medida.",
    caseStudy: "Ver o estudo de caso",
    workWithMe: "Como trabalho",
  },
  en: {
    title: "Need someone for a challenge like this one?",
    text: "I work end to end: architecture, development and running in production. I'm open to remote roles and custom projects.",
    caseStudy: "Read the case study",
    workWithMe: "How I work",
  },
  es: {
    title: "¿Necesitas a alguien para un desafío parecido?",
    text: "Trabajo de punta a punta: arquitectura, desarrollo y operación en producción. Estoy disponible para puestos remotos y proyectos a medida.",
    caseStudy: "Ver el caso de estudio",
    workWithMe: "Cómo trabajo",
  },
}

interface ArticleCtaProps {
  locale: Locale
  translationKey: string
  /** The case study of the project this article is about, if there is one. */
  caseStudy?: { title: string; url: string }
}

export function ArticleCta({ locale, translationKey, caseStudy }: ArticleCtaProps) {
  const text = copy[locale]
  const more = "inline-flex items-center gap-1.5 text-sm font-semibold text-brand underline-offset-4 hover:underline"

  return (
    <section aria-labelledby="article-cta-title" className="rounded-2xl border border-brand/25 bg-brand-soft p-6 sm:p-8 print:hidden">
      <h2 id="article-cta-title" className="text-2xl font-bold tracking-tight">{text.title}</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">{text.text}</p>
      <ContactLinks locale={locale} placement={`article:${translationKey}`} channels={["calendly", "whatsapp", "linkedin"]} className="mt-6" />
      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
        {caseStudy && (
          <Link href={caseStudy.url} className={more}>
            {text.caseStudy}: {caseStudy.title}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
        <Link href={getPagePath(locale, "trabalhe-comigo")} className={more}>
          {text.workWithMe}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  )
}
