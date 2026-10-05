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
import { localeTags, type Locale } from "@/lib/i18n"
import { getAdjacentCaseStudies, type CaseStudyProject } from "@/lib/projects"

export function CaseStudyScreen({ project, locale }: { project: CaseStudyProject; locale: Locale }) {
  const { previous, next } = getAdjacentCaseStudies(project.slug)
  const post = project.caseStudy.articleKey
    ? getPostByTranslationKey(project.caseStudy.articleKey, locale)
    : null

  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
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
