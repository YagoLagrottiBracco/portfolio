import { getBlogIndexPath } from "@/lib/blog-routes"
import { getCaseStudyPath, parseCaseStudyPath } from "@/lib/case-study-routes"
import { getDiscoveryPath, parseDiscoveryPath } from "@/lib/discovery-routes"
import { getResourcePath, parseResourcePath, getEmbedPath, parseEmbedPath } from "@/lib/resource-routes"
import { type Locale } from "@/lib/i18n"
import { getPagePath, parsePagePath } from "@/lib/page-routes"
import { getPresentationPath, parsePresentationPath } from "@/lib/presentation-routes"
import { getStackPath, parseStackPath } from "@/lib/stack-routes"

/**
 * Which language a URL is written in.
 *
 * The homepage, the case studies and the blog index each exist once per
 * language: Portuguese unprefixed, English and Spanish under `/en` and `/es`.
 * A blog article keeps its language in its slug, so its path alone does not
 * say; that, like any unknown path, is `undefined`.
 */
export function getRouteLocale(pathname: string): Locale | undefined {
  const page = parsePagePath(pathname) ?? parseStackPath(pathname) ?? parsePresentationPath(pathname)
  if (page) return page.locale
  const prefixed = /^\/(en|es)(?:\/|$)/.exec(pathname)
  if (prefixed) return prefixed[1] as Locale
  if (pathname === "/" || pathname === "/blog" || parseDiscoveryPath(pathname) || parseCaseStudyPath(pathname) || parseResourcePath(pathname) || parseEmbedPath(pathname)) return "pt"
  return undefined
}

export function getHomePath(locale: Locale): string {
  return locale === "pt" ? "/" : `/${locale}`
}

export function isHomePath(pathname: string): boolean {
  return /^\/(?:(?:en|es)\/?)?$/.test(pathname)
}

/** The same page in another language, or `null` when the path has no counterpart. */
export function getLocalizedPath(pathname: string, locale: Locale): string | null {
  if (isHomePath(pathname)) return getHomePath(locale)

  const discovery = parseDiscoveryPath(pathname)
  if (discovery) return getDiscoveryPath(locale, discovery.slug)

  const resource = parseResourcePath(pathname)
  if (resource) return getResourcePath(locale, resource.section, resource.slug)
  const embed = parseEmbedPath(pathname)
  if (embed) return getEmbedPath(locale, embed.tool)

  const caseStudy = parseCaseStudyPath(pathname)
  if (caseStudy) return getCaseStudyPath(locale, caseStudy.slug)

  const page = parsePagePath(pathname)
  if (page) return getPagePath(locale, page.page)

  const stack = parseStackPath(pathname)
  if (stack) return getStackPath(locale, stack.slug)

  const presentation = parsePresentationPath(pathname)
  if (presentation) return getPresentationPath(locale, presentation.slug)

  if (/^(?:\/(?:en|es))?\/blog\/?$/.test(pathname)) return getBlogIndexPath(locale)

  return null
}
