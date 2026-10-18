/**
 * @file WorkWithMeScreen.tsx
 * @description `/trabalhe-comigo` and its `/en` and `/es` versions: the two ways
 * to work together, the areas already delivered (built from the case studies,
 * so the page cannot claim more than the portfolio shows), how a project
 * starts, and every contact channel.
 */
import Link from "next/link"
import { ArrowRight, Check, Download } from "lucide-react"

import { TrackedLink } from "@/components/atoms/TrackedLink"
import { BriefForm } from "@/components/molecules/BriefForm"
import { CalendlyEmbed } from "@/components/molecules/CalendlyEmbed"
import { ContactLinks } from "@/components/molecules/ContactLinks"
import { Testimonials } from "@/components/molecules/Testimonials"
import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"
import { personalData, projectCategories } from "@/data/personal"
import { screening, screeningCopy } from "@/data/screening"
import { workWithMe } from "@/data/work-with-me"
import { availabilityLabel } from "@/lib/availability"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { inboxConfig } from "@/lib/inbox"
import { askEnabled } from "@/lib/ask/config"
import { cvFocuses, cvFocusSpecs } from "@/lib/cv-focus"
import { getCvFileName, getCvJsonPath, getCvPath, getCvTextPath, VCARD_PATH } from "@/lib/cv-routes"
import { localeTags, type Locale } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"
import { getPagePath } from "@/lib/page-routes"
import { getCaseStudyProjects } from "@/lib/projects"
import { PERSON_ID, SITE_URL } from "@/lib/site"

const askLink: Record<Locale, string> = {
  pt: "Tem uma dúvida rápida? Pergunte ao meu portfólio",
  en: "A quick question? Ask my portfolio",
  es: "¿Una duda rápida? Pregúntale a mi portafolio",
}
const recommendLink: Record<Locale, string> = { pt: "Já trabalhou comigo?", en: "Worked with me before?", es: "¿Ya trabajaste conmigo?" }
const recommendCta: Record<Locale, string> = { pt: "Deixe um depoimento", en: "Leave a testimonial", es: "Deja un testimonio" }

const startNow: Record<Locale, string> = {
  pt: "Imediatamente.",
  en: "Right away.",
  es: "De inmediato.",
}

export function WorkWithMeScreen({ locale }: { locale: Locale }) {
  const labels = workWithMe.labels[locale]
  const caseStudies = getCaseStudyProjects()
  const areas = projectCategories
    .map((category) => ({ category, projects: caseStudies.filter((project) => project.category === category.id) }))
    .filter((area) => area.projects.length > 0)

  const screeningItems = [
    {
      id: "start",
      question: screeningCopy[locale].start,
      // Follows the availability status, so it cannot go stale.
      answer: personalData.availability.status === "available" ? startNow[locale] : availabilityLabel[personalData.availability.status][locale],
    },
    ...screening.flatMap((item) => (item.answer ? [{ id: item.id, question: item.question[locale], answer: item.answer[locale] }] : [])),
  ]

  const url = `${SITE_URL}${getPagePath(locale, "trabalhe-comigo")}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    name: workWithMe.metaTitle[locale],
    description: workWithMe.description[locale],
    inLanguage: localeTags[locale],
    about: { "@id": PERSON_ID },
    mainEntity: {
      "@type": "ProfessionalService",
      name: `${personalData.name} — ${workWithMe.metaTitle[locale]}`,
      url,
      description: workWithMe.description[locale],
      provider: { "@id": PERSON_ID },
      areaServed: ["BR", "US", "EU", "LATAM"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: labels.formats,
        itemListElement: workWithMe.formats.map((format) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: format.title[locale],
            description: format.description[locale],
          },
        })),
      },
    },
    isPartOf: { "@type": "WebSite", name: personalData.name, url: SITE_URL },
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${url}#triagem`,
    inLanguage: localeTags[locale],
    mainEntity: screeningItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: personalData.name, item: `${SITE_URL}${getHomePath(locale)}` },
      { "@type": "ListItem", position: 2, name: workWithMe.title[locale], item: url },
    ],
  }

  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
      <script
        type="application/ld+json"
        // JSON-LD is data, not markup — this is the documented Next.js pattern.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navigation />
      <main id="main" className="pb-24 pt-28">
        <div className="container mx-auto max-w-5xl px-4">
          <header className="rise-in max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">{personalData.name}</p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{workWithMe.title[locale]}</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{workWithMe.intro[locale]}</p>
            <p className="mt-3 text-sm text-muted-foreground">{workWithMe.languages[locale]}</p>
            {askEnabled() && (
              <p className="mt-3 text-sm">
                <Link href={getPagePath(locale, "perguntar")} className="font-medium text-brand underline underline-offset-4">{askLink[locale]}</Link>
              </p>
            )}
            <ContactLinks locale={locale} placement="work-with-me:top" channels={["calendly", "whatsapp", "linkedin"]} calendlyHref="#agendar" className="mt-8" />
          </header>

          <section aria-labelledby="formats-title" className="mt-20">
            <h2 id="formats-title" className="text-2xl font-bold tracking-tight sm:text-3xl">{labels.formats}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {workWithMe.formats.map((format) => (
                <article key={format.id} className="flex flex-col rounded-2xl border border-hairline bg-surface p-7">
                  <h3 className="text-xl font-semibold">{format.title[locale]}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{format.description[locale]}</p>
                  <ul className="mt-5 space-y-2.5 text-sm">
                    {format.points.map((point) => (
                      <li key={point.en} className="flex gap-2.5">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden="true" />
                        <span>{point[locale]}</span>
                      </li>
                    ))}
                  </ul>
                  {format.id === "role" && (
                    <div className="mt-auto pt-6 text-sm">
                      <TrackedLink
                        href={getCvPath(locale)}
                        download={getCvFileName(locale)}
                        event="cv_download"
                        properties={{ placement: "work-with-me", locale }}
                        className="inline-flex items-center gap-2 font-semibold text-brand underline-offset-4 hover:underline"
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        {labels.cv}
                      </TrackedLink>
                      <p className="mt-3 text-muted-foreground">
                        {labels.cvFocus}:{" "}
                        {cvFocuses.map((focus, index) => (
                          <span key={focus}>
                            {index > 0 && " · "}
                            <TrackedLink
                              href={getCvPath(locale, focus)}
                              download={getCvFileName(locale, focus)}
                              event="cv_download"
                              properties={{ placement: "work-with-me", locale, focus }}
                              className="text-foreground underline underline-offset-4 hover:text-brand"
                            >
                              {cvFocusSpecs[focus].label[locale]}
                            </TrackedLink>
                          </span>
                        ))}
                      </p>
                      <p className="mt-2 text-muted-foreground">
                        <a href={getCvTextPath(locale)} className="underline underline-offset-4 hover:text-foreground">{labels.cvText}</a>
                        {" · "}
                        <a href={getCvJsonPath(locale)} className="underline underline-offset-4 hover:text-foreground">{labels.cvJson}</a>
                        {" · "}
                        <TrackedLink href={VCARD_PATH} event="contact_save" properties={{ placement: "work-with-me" }} className="underline underline-offset-4 hover:text-foreground">
                          {labels.vcard}
                        </TrackedLink>
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="areas-title" className="mt-20">
            <h2 id="areas-title" className="text-2xl font-bold tracking-tight sm:text-3xl">{labels.areas}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {areas.map(({ category, projects }) => (
                <section key={category.id} aria-labelledby={`area-${category.id}`} className="rounded-2xl border border-hairline p-6">
                  <h3 id={`area-${category.id}`} className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {category.label[locale]}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {projects.map((project) => (
                      <li key={project.slug}>
                        <Link href={getCaseStudyPath(locale, project.slug)} className="group block">
                          <span className="inline-flex items-center gap-1.5 font-semibold group-hover:text-brand">
                            {project.title[locale]}
                            <ArrowRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                          </span>
                          <span className="block text-sm text-muted-foreground">{project.tagline[locale]}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>

          <section aria-labelledby="steps-title" className="mt-20">
            <h2 id="steps-title" className="text-2xl font-bold tracking-tight sm:text-3xl">{labels.steps}</h2>
            <ol className="mt-8 grid gap-6 md:grid-cols-3">
              {workWithMe.steps.map((step, index) => (
                <li key={step.title.en} className="rounded-2xl border border-hairline p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-sm font-bold text-brand" aria-hidden="true">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-semibold">{step.title[locale]}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text[locale]}</p>
                </li>
              ))}
            </ol>
          </section>

          <section id="triagem" aria-labelledby="screening-title" className="mt-20 scroll-mt-24">
            <h2 id="screening-title" className="text-2xl font-bold tracking-tight sm:text-3xl">{screeningCopy[locale].title}</h2>
            <p className="mt-3 text-muted-foreground">{screeningCopy[locale].intro}</p>
            <dl className="mt-8 grid gap-x-10 gap-y-6 md:grid-cols-2">
              {screeningItems.map((item) => (
                <div key={item.id} className="border-t border-hairline pt-4">
                  <dt className="font-semibold">{item.question}</dt>
                  <dd className="mt-1.5 leading-relaxed text-muted-foreground">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <Testimonials locale={locale} items={personalData.testimonials} className="mt-4" />
          <p className="mt-6 text-sm text-muted-foreground">
            {recommendLink[locale]}{" "}
            <Link href={getPagePath(locale, "recomendar")} className="font-medium text-brand underline underline-offset-4">
              {recommendCta[locale]}
            </Link>
          </p>

          <div className="mt-20">
            <CalendlyEmbed url={personalData.socialLinks.calendly} locale={locale} placement="work-with-me" />
          </div>

          {/* Only once Resend can deliver it; until then the channels below are the way in. */}
          {inboxConfig() && (
            <div className="mt-20">
              <BriefForm locale={locale} page={getPagePath(locale, "trabalhe-comigo")} />
            </div>
          )}

          <section aria-labelledby="cta-title" className="mt-20 rounded-3xl border border-brand/25 bg-gradient-to-br from-brand-soft via-background to-background p-8 text-center sm:p-12">
            <h2 id="cta-title" className="text-3xl font-bold tracking-tight">{labels.cta}</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{labels.ctaText}</p>
            <ContactLinks locale={locale} placement="work-with-me:bottom" className="mt-8 justify-center" />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
