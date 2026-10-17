import type { MetadataRoute } from "next"

import { getAllPosts, getPostTranslations } from "@/lib/blog"
import { getCaseStudyAlternates } from "@/lib/case-study-metadata"
import { getHomeAlternates } from "@/lib/home-metadata"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { locales, localeTags } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"
import { getCaseStudyProjects } from "@/lib/projects"
import { getResourceEntries, resourceSections, RESOURCE_RELEASE_DATE } from "@/lib/resource-catalog"
import { getResourcePath } from "@/lib/resource-routes"
import { SITE_URL } from "@/lib/site"


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

  const homes = locales.map((locale) => ({
    url: `${SITE_URL}${getHomePath(locale) === "/" ? "" : getHomePath(locale)}`,
    changeFrequency: "monthly" as const,
    priority: locale === "pt" ? 1 : 0.9,
    alternates: { languages: absolute(getHomeAlternates()) },
  }))

  return [
    ...homes,
    ...locales.flatMap(locale => [undefined, ...resourceSections.map(s => s.slug)].flatMap(section => [undefined, ...(section ? getResourceEntries(section).map(e => e.slug) : [])].map(slug => ({
      url: `${SITE_URL}${getResourcePath(locale, section, slug)}`,
      lastModified: new Date(RESOURCE_RELEASE_DATE),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: absolute(Object.fromEntries(locales.map(l => [localeTags[l], getResourcePath(l, section, slug)]))) },
    })))),
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
