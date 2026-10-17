/**
 * @file AskScreen.tsx
 * @description `/perguntar` and its `/en`, `/es` versions: "Ask my portfolio",
 * answered by Claude from the site's own content, with citations. Built only
 * when ANTHROPIC_API_KEY is configured (`askEnabled`).
 */
import React from "react"

import { AskPortfolio } from "@/components/molecules/AskPortfolio"
import { ContactLinks } from "@/components/molecules/ContactLinks"
import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"
import { localeTags, type Locale } from "@/lib/i18n"

export const askCopy: Record<Locale, { title: string; description: string; intro: string; contact: string }> = {
  pt: {
    title: "Pergunte ao meu portfólio",
    description: "Pergunte sobre a experiência, os projetos e a forma de trabalho de Yago Lagrotti Bracco; a resposta cita as páginas do site.",
    intro: "Pergunte sobre experiência, projetos, tecnologias ou forma de trabalho. A resposta sai do conteúdo deste site e cita as páginas de onde veio.",
    contact: "Prefere falar direto comigo?",
  },
  en: {
    title: "Ask my portfolio",
    description: "Ask about Yago Lagrotti Bracco's experience, projects and way of working; the answer cites the site's pages.",
    intro: "Ask about experience, projects, technologies or how I work. The answer comes from this site's content and cites the pages it used.",
    contact: "Rather talk to me directly?",
  },
  es: {
    title: "Pregúntale a mi portafolio",
    description: "Pregunta sobre la experiencia, los proyectos y la forma de trabajar de Yago Lagrotti Bracco; la respuesta cita las páginas del sitio.",
    intro: "Pregunta sobre experiencia, proyectos, tecnologías o forma de trabajar. La respuesta sale del contenido de este sitio y cita las páginas de donde viene.",
    contact: "¿Prefieres hablar directamente conmigo?",
  },
}

export function AskScreen({ locale }: { locale: Locale }) {
  const text = askCopy[locale]
  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
      <Navigation />
      <main id="main" className="pb-24 pt-28">
        <div className="container mx-auto max-w-3xl px-4">
          <header className="rise-in">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{text.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{text.intro}</p>
          </header>
          <div className="mt-10">
            <AskPortfolio locale={locale} />
          </div>
          <section aria-label={text.contact} className="mt-16 border-t border-hairline pt-8">
            <p className="font-semibold">{text.contact}</p>
            <ContactLinks locale={locale} placement="ask" channels={["calendly", "whatsapp", "linkedin"]} className="mt-4" />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
