import type { Locale } from "@/lib/i18n"

/** Where the generated résumé for a locale is served. */
export function getCvPath(locale: Locale): string {
  return `/cv/${locale}`
}

/** The name the browser saves it under. */
export function getCvFileName(locale: Locale): string {
  return `yago-lagrotti-bracco-cv-${locale}.pdf`
}
