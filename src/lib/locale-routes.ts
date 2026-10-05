import { getBlogIndexPath } from "@/lib/blog-routes"
import { getCaseStudyPath, parseCaseStudyPath } from "@/lib/case-study-routes"
import { type Locale } from "@/lib/i18n"

/**
 * Which language a URL is written in.
 *
 * The homepage, the case studies and the blog index each exist once per
 * language: Portuguese unprefixed, English and Spanish under `/en` and `/es`.
 * A blog article keeps its language in its slug, so its path alone does not
 * say; that, like any unknown path, is `undefined`.
 */
export function getRouteLocale(pathname: string): Locale | undefined {
  const prefixed = /^\/(en|es)(?:\/|$)/.exec(pathname)
  if (prefixed) return prefixed[1] as Locale
  if (pathname === "/" || pathname === "/blog" || parseCaseStudyPath(pathname)) return "pt"
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

  const caseStudy = parseCaseStudyPath(pathname)
  if (caseStudy) return getCaseStudyPath(locale, caseStudy.slug)

  if (/^(?:\/(?:en|es))?\/blog\/?$/.test(pathname)) return getBlogIndexPath(locale)

  return null
}
