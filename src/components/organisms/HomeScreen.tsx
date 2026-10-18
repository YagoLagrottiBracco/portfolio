/**
 * @file HomeScreen.tsx
 * @description The homepage, shared by `/` and its `/en` and `/es` versions.
 *
 * A Server Component, so the HTML crawlers and link previews receive is the
 * real content, already in the language of the URL. Most sections are Server
 * Components too; only the ones with state (the project filter, the timeline
 * filter, the navigation) are `"use client"`, and they receive their data as
 * props so the browser never downloads `@/data/personal` whole.
 *
 * Project data lives in `@/data/personal`; the two project sections never
 * repeat an entry: `FeaturedProjects` renders the curated case studies and
 * `Projects` renders everything else.
 */
import { ResourceHomeSection } from "@/components/resources/ResourceHomeSection"
import { About } from "@/components/organisms/About"
import { Contact } from "@/components/organisms/Contact"
import { Experience } from "@/components/organisms/Experience"
import { FeaturedProjects } from "@/components/organisms/FeaturedProjects"
import { Footer } from "@/components/organisms/Footer"
import { Hero } from "@/components/organisms/Hero"
import { Navigation } from "@/components/organisms/Navigation"
import { Projects } from "@/components/organisms/Projects"
import { Specializations } from "@/components/organisms/Specializations"
import { TechStack } from "@/components/organisms/TechStack"
import { Testimonials } from "@/components/molecules/Testimonials"
import { personalData } from "@/data/personal"
import { getAllPosts } from "@/lib/blog"
import { homeCopy, homeKeywords } from "@/lib/home-metadata"
import { jobTechs, publishedTechs, techName } from "@/lib/stack"
import { localeTags, type Locale } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"
import { PERSON_ID, SITE_URL } from "@/lib/site"

export function HomeScreen({ locale }: { locale: Locale }) {
  const url = `${SITE_URL}${getHomePath(locale)}`
  const jobs = personalData.experience.map((job) => ({
    ...job,
    techs: jobTechs(job).map((entry) => ({ slug: entry.slug, name: techName(entry, locale) })),
  }))

  /** Tells search engines this page is the author's profile, in this language. */
  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url,
    name: homeCopy[locale].title,
    description: homeCopy[locale].description,
    keywords: homeKeywords[locale].join(", "),
    inLanguage: localeTags[locale],
    mainEntity: { "@id": PERSON_ID },
    about: { "@id": PERSON_ID },
    isPartOf: { "@type": "WebSite", name: personalData.name, url: SITE_URL },
  }

  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
      <script
        type="application/ld+json"
        // JSON-LD is data, not markup — this is the documented Next.js pattern.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <Navigation />

      <main id="main">
        <Hero locale={locale} />
        <TechStack locale={locale} />
        <FeaturedProjects locale={locale} />
        <ResourceHomeSection locale={locale} />
        <About locale={locale} />
        <Projects projects={personalData.projects.filter((project) => !project.featured)} />
        <Experience jobs={jobs} education={personalData.education} techPages={publishedTechs(getAllPosts()).map((entry) => entry.slug)} />
        <Specializations locale={locale} />
        <Testimonials locale={locale} items={personalData.testimonials} className="container mx-auto px-4" />
        <Contact locale={locale} />
      </main>

      <Footer />
    </div>
  )
}
