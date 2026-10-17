import "server-only"

import { localizeLabel } from "@/data/content-labels"
import { discoveryPages, discoverySlugs } from "@/data/discovery"
import { askCopy } from "@/components/organisms/AskScreen"
import { nowMeta } from "@/components/organisms/NowScreen"
import { isPublishedPagePath } from "@/lib/publication"
import { privacy } from "@/data/privacy"
import { workWithMe } from "@/data/work-with-me"
import { getAllPosts } from "@/lib/blog"
import { buildSearchText } from "@/lib/blog-search"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { getDiscoveryPath } from "@/lib/discovery-routes"
import type { Locale } from "@/lib/i18n"
import { getPagePath } from "@/lib/page-routes"
import { getCaseStudyProjects } from "@/lib/projects"
import { getResourceEntries, resourceSections } from "@/lib/resource-catalog"
import { getResourcePath } from "@/lib/resource-routes"
import type { SearchItem } from "@/lib/site-search"
import { stackCopy, techPageData } from "@/components/organisms/StackScreens"
import { getStackPath, publishedTechs, techName } from "@/lib/stack"

const item = (kind: SearchItem["kind"], title: string, description: string, url: string, keywords: string[] = []): SearchItem => ({
  kind,
  title,
  description,
  url,
  text: buildSearchText([title, description, ...keywords]),
})

/** Everything a visitor can search for in one language. */
export function buildSearchIndex(locale: Locale): SearchItem[] {
  const caseStudies = getCaseStudyProjects().map((project) =>
    item("case", project.title[locale], project.tagline[locale], getCaseStudyPath(locale, project.slug), [project.description[locale], ...project.techStack, ...(project.caseStudy.metrics ?? []).map((metric) => localizeLabel(metric, locale))])
  )
  const techs = publishedTechs(getAllPosts()).map((entry) =>
    item("stack", techName(entry, locale), stackCopy[locale].counts(techPageData(entry, locale).counts), getStackPath(locale, entry.slug), entry.aliases)
  )
  const pages = [
    item("page", workWithMe.title[locale], workWithMe.description[locale], getPagePath(locale, "trabalhe-comigo"), ["cv", "currículo", "résumé", "contato", "contact", "contacto"]),
    item("page", nowMeta[locale].title, nowMeta[locale].description, getPagePath(locale, "agora")),
    item("page", privacy.title[locale], privacy.description[locale], getPagePath(locale, "privacidade"), ["lgpd", "cookies"]),
    item("page", stackCopy[locale].indexTitle, stackCopy[locale].indexMeta, getStackPath(locale)),
    ...(isPublishedPagePath(getPagePath(locale, "perguntar")) ? [item("page", askCopy[locale].title, askCopy[locale].description, getPagePath(locale, "perguntar"), ["ia", "ai", "claude", "chat"])] : []),
    ...discoverySlugs.map((slug) =>
      item("page", discoveryPages[slug].title[locale], discoveryPages[slug].description[locale], getDiscoveryPath(locale, slug), [slug])
    ),
  ]
  const articles = getAllPosts(locale).map((post) => item("article", post.title, post.excerpt, post.url, post.tags))
  const resources = resourceSections.flatMap((section) => [
    item("resource", section.title[locale], section.description[locale], getResourcePath(locale, section.slug)),
    ...getResourceEntries(section.slug).map((entry) =>
      item("resource", entry.title[locale], entry.description[locale], getResourcePath(locale, section.slug, entry.slug), [section.title[locale], ...(entry.tags ?? [])])
    ),
  ])
  return [...caseStudies, ...techs, ...pages, ...articles, ...resources]
}
