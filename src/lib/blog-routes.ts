import type { Locale } from "@/lib/i18n"

export function getBlogIndexPath(locale: Locale): string {
  return locale === "pt" ? "/blog" : `/${locale}/blog`
}

export function isBlogPath(pathname: string): boolean {
  return pathname === "/blog" || pathname.startsWith("/blog/") || /^\/(en|es)\/blog(?:\/|$)/.test(pathname)
}
