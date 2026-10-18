/**
 * @file CaseStudyScreen.tsx
 * @description Server shell shared by `/projetos/[slug]` and its `/en` and `/es`
 * counterparts: resolves the neighbours and the companion blog article, then
 * hands everything to the client view.
 *
 * The `lang` attribute sits here because the root `<html lang>` is fixed to
 * pt-BR for every route; without it the English and Spanish pages would be
 * announced to crawlers and screen readers as Portuguese.
 */
import { Testimonials } from "@/components/molecules/Testimonials"
import { CaseStudyView } from "@/components/organisms/CaseStudyView"
import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"
import { getAllPosts, getPostByTranslationKey } from "@/lib/blog"
import { personalData } from "@/data/personal"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { localeTags, type Locale } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"
import { getAdjacentCaseStudies, type CaseStudyProject } from "@/lib/projects"
import { getStackPath, publishedTechs, techFor } from "@/lib/stack"
import { PERSON_ID, SITE_URL } from "@/lib/site"

export function CaseStudyScreen({ project, locale }: { project: CaseStudyProject; locale: Locale }) {
  const { previous, next } = getAdjacentCaseStudies(project.slug)
  const post = project.caseStudy.articleKey
    ? getPostByTranslationKey(project.caseStudy.articleKey, locale)
    : null

  const published = publishedTechs(getAllPosts())
  const techLinks = Object.fromEntries(project.techStack.flatMap((name) => {
    const entry = techFor(name)
    return entry && published.includes(entry) ? [[name, getStackPath(locale, entry.slug)]] : []
  }))

  const url = `${SITE_URL}${getCaseStudyPath(locale, project.slug)}`
  const image = project.image.startsWith("/") ? `${SITE_URL}${project.image}` : project.image

  // No dates on purpose: the data only knows a year, and a made-up
  // `datePublished` would be worse than none.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: `${project.title[locale]} — ${project.tagline[locale]}`,
    description: project.description[locale],
    url,
    mainEntityOfPage: url,
    inLanguage: localeTags[locale],
    image: [image],
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    about: project.techStack.map((name) => ({ "@type": "Thing", name })),
    keywords: project.techStack.join(", "),
    isPartOf: { "@type": "WebSite", name: personalData.name, url: SITE_URL },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: personalData.name, item: `${SITE_URL}${getHomePath(locale)}` },
      { "@type": "ListItem", position: 2, name: project.title[locale], item: url },
    ],
  }

  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
      <script
        type="application/ld+json"
        // JSON-LD is data, not markup — this is the documented Next.js pattern.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Navigation />
      <main id="main">
        <CaseStudyView
          project={project}
          previous={previous}
          next={next}
          article={post ? { title: post.title, url: post.url, readingMinutes: post.readingMinutes } : undefined}
          techLinks={techLinks}
        />
        <Testimonials
          locale={locale}
          items={personalData.testimonials.filter((item) => item.project === project.slug)}
          className="container mx-auto max-w-4xl px-4 pt-0"
        />
      </main>
      <Footer />
    </div>
  )
}
