import { isLocale, type Locale } from "@/lib/i18n"

/**
 * Addresses of the presentation mode. Apart from `presentation.ts`, which reads
 * the portfolio data, so links and the language switcher stay light in the browser.
 */
export function getPresentationPath(locale: Locale, slug: string): string {
  return locale === "pt" ? `/projetos/${slug}/apresentar` : `/${locale}/projetos/${slug}/apresentar`
}

export function parsePresentationPath(pathname: string): { locale: Locale; slug: string } | null {
  const match = /^(?:\/(en|es))?\/projetos\/([a-z0-9]+(?:-[a-z0-9]+)*)\/apresentar\/?$/.exec(pathname)
  if (!match) return null
  return { locale: isLocale(match[1]) ? match[1] : "pt", slug: match[2] }
}
