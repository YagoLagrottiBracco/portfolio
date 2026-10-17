/**
 * @file RecommendScreen.tsx
 * @description `/recomendar` and its `/en` and `/es` versions: where people who
 * worked with Yago leave a testimonial. Not linked from the navigation and not
 * indexed: Yago sends the link to the people he asks.
 */
import React from "react"
import { Mail } from "lucide-react"

import { RecommendationForm } from "@/components/molecules/RecommendationForm"
import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"
import { personalData } from "@/data/personal"
import { localeTags, type Locale } from "@/lib/i18n"
import { inboxConfig } from "@/lib/inbox"
import { getPagePath } from "@/lib/page-routes"
import { getCaseStudyProjects } from "@/lib/projects"

export const recommendCopy: Record<Locale, { title: string; description: string; intro: string; why: string; email: string }> = {
  pt: {
    title: "Recomende meu trabalho",
    description: "Trabalhou com Yago Lagrotti Bracco? Deixe um depoimento.",
    intro: "Se trabalhamos juntos, um depoimento seu ajuda quem está decidindo se conversa comigo. Leva uns dois minutos.",
    why: "Eu reviso cada texto e confirmo com você antes de publicar. Nada aparece no site sem a sua autorização.",
    email: "Prefere e-mail? Escreva para",
  },
  en: {
    title: "Recommend my work",
    description: "Worked with Yago Lagrotti Bracco? Leave a testimonial.",
    intro: "If we worked together, a testimonial from you helps whoever is deciding whether to talk to me. It takes about two minutes.",
    why: "I review every text and check with you before publishing. Nothing appears on the site without your permission.",
    email: "Rather use email? Write to",
  },
  es: {
    title: "Recomienda mi trabajo",
    description: "¿Trabajaste con Yago Lagrotti Bracco? Deja un testimonio.",
    intro: "Si trabajamos juntos, un testimonio tuyo ayuda a quien está decidiendo si conversar conmigo. Lleva unos dos minutos.",
    why: "Reviso cada texto y lo confirmo contigo antes de publicarlo. Nada aparece en el sitio sin tu autorización.",
    email: "¿Prefieres correo? Escribe a",
  },
}

export function RecommendScreen({ locale }: { locale: Locale }) {
  const text = recommendCopy[locale]
  // The form needs somewhere to deliver; until Resend is set up, email is the way in.
  const formEnabled = inboxConfig() !== null

  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
      <Navigation />
      <main id="main" className="pb-24 pt-28">
        <article className="container mx-auto max-w-3xl px-4">
          <header className="rise-in">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{text.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{text.intro}</p>
            <p className="mt-3 text-sm text-muted-foreground">{text.why}</p>
          </header>

          {formEnabled && (
            <div className="mt-10 rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
              <RecommendationForm
                locale={locale}
                page={getPagePath(locale, "recomendar")}
                projects={getCaseStudyProjects().map((project) => ({ slug: project.slug, title: project.title[locale] }))}
              />
            </div>
          )}

          <p className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {text.email}{" "}
            <a href={`mailto:${personalData.socialLinks.email}`} className="font-medium text-brand underline underline-offset-4">
              {personalData.socialLinks.email}
            </a>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  )
}
