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
import { CaseStudyView } from "@/components/organisms/CaseStudyView"
import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"
import { getPostByTranslationKey } from "@/lib/blog"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { localeTags, type Locale } from "@/lib/i18n"
import { getAdjacentCaseStudies, type CaseStudyProject } from "@/lib/projects"
import { PERSON_ID, SITE_URL } from "@/lib/site"

export function CaseStudyScreen({ project, locale }: { project: CaseStudyProject; locale: Locale }) {
  const { previous, next } = getAdjacentCaseStudies(project.slug)
  const post = project.caseStudy.articleKey
    ? getPostByTranslationKey(project.caseStudy.articleKey, locale)
    : null

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
    keywords: project.techStack.join(", "),
  }

  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
      <script
        type="application/ld+json"
        // JSON-LD is data, not markup — this is the documented Next.js pattern.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navigation />
      <main id="main">
        <CaseStudyView
          project={project}
          previous={previous}
          next={next}
          article={post ? { title: post.title, url: post.url, readingMinutes: post.readingMinutes } : undefined}
        />
      </main>
      <Footer />
    </div>
  )
}
