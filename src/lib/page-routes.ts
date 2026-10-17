import { isLocale, type Locale } from "@/lib/i18n"

/**
 * Standalone pages that exist once per language under the same Portuguese
 * segment — the convention the case studies already follow (`/en/projetos/…`).
 */
export const localizedPages = ["trabalhe-comigo", "privacidade", "agora"] as const
export type LocalizedPage = (typeof localizedPages)[number]

export function getPagePath(locale: Locale, page: LocalizedPage): string {
  return locale === "pt" ? `/${page}` : `/${locale}/${page}`
}

/** The locale and page a URL points at, or `null` for any other path. */
export function parsePagePath(pathname: string): { locale: Locale; page: LocalizedPage } | null {
  const match = /^(?:\/(en|es))?\/([a-z-]+)\/?$/.exec(pathname)
  const page = localizedPages.find((candidate) => candidate === match?.[2])
  if (!match || !page) return null
  return { locale: isLocale(match[1]) ? match[1] : "pt", page }
}
