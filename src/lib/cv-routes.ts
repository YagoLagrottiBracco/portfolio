import type { CvFocus } from "@/lib/cv-focus"
import type { Locale } from "@/lib/i18n"

/** Where the generated résumé for a locale, and optionally a focus, is served. */
export function getCvPath(locale: Locale, focus?: CvFocus): string {
  return focus ? `/cv/${locale}/${focus}` : `/cv/${locale}`
}

/** The name the browser saves it under. */
export function getCvFileName(locale: Locale, focus?: CvFocus): string {
  return `yago-lagrotti-bracco-cv-${locale}${focus ? `-${focus}` : ""}.pdf`
}

/** The same résumé as plain text and as JSON Resume. */
export const getCvTextPath = (locale: Locale) => `/cv/${locale}/plain.txt`
export const getCvJsonPath = (locale: Locale) => `/cv/${locale}/resume.json`

/** The contact card. */
export const VCARD_PATH = "/contato.vcf"
