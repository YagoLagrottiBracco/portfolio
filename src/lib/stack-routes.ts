import type { Locale } from "@/lib/i18n"

/**
 * Addresses of the technology pages. Apart from `stack.ts`, which reads the
 * portfolio data, so links and the language switcher stay light in the browser.
 */
export function getStackPath(locale: Locale, slug?: string): string {
  const base = locale === "pt" ? "/stack" : `/${locale}/stack`
  return slug ? `${base}/${slug}` : base
}

export function parseStackPath(pathname: string): { locale: Locale; slug?: string } | null {
  const match = /^(?:\/(en|es))?\/stack(?:\/([a-z0-9-]+))?\/?$/.exec(pathname)
  if (!match) return null
  return { locale: (match[1] as Locale | undefined) ?? "pt", slug: match[2] }
}
