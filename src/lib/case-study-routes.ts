import { isLocale, type Locale } from "@/lib/i18n"

/**
 * Case study URLs. Portuguese is the canonical, unprefixed route; the other
 * locales live under their prefix, the same convention the blog index uses.
 */
export function getCaseStudyPath(locale: Locale, slug: string): string {
  return locale === "pt" ? `/projetos/${slug}` : `/${locale}/projetos/${slug}`
}

/** The locale and slug a case study URL points at, or `null` for any other path. */
export function parseCaseStudyPath(pathname: string): { locale: Locale; slug: string } | null {
  const match = /^(?:\/(en|es))?\/projetos\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(pathname)
  if (!match) return null
  return { locale: isLocale(match[1]) ? match[1] : "pt", slug: match[2] }
}
