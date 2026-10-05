import type { MetadataRoute } from "next"

import { getAllPosts, getPostTranslations } from "@/lib/blog"
import { getCaseStudyAlternates } from "@/lib/case-study-metadata"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { locales, localeTags } from "@/lib/i18n"
import { getCaseStudyProjects } from "@/lib/projects"

const SITE_URL = "https://lagrotti.dev"

const absolute = (paths: Record<string, string>) =>
  Object.fromEntries(Object.entries(paths).map(([tag, path]) => [tag, `${SITE_URL}${path}`]))

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()

  // One entry per language, each pointing at its siblings.
  const caseStudies = getCaseStudyProjects().flatMap((project) =>
    locales.map((locale) => ({
      url: `${SITE_URL}${getCaseStudyPath(locale, project.slug)}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: { languages: absolute(getCaseStudyAlternates(project.slug)) },
    }))
  )

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    ...caseStudies,
    { url: `${SITE_URL}/blog`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/en/blog`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/es/blog`, changeFrequency: "monthly", priority: 0.6 },
    ...posts.map((post) => ({
      url: `${SITE_URL}${post.url}`,
      lastModified: new Date(post.updatedAt ?? post.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          getPostTranslations(post).map((translation) => [localeTags[translation.locale], `${SITE_URL}${translation.url}`])
        ),
      },
    })),
  ]
}
