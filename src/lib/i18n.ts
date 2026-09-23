/** Shared locale definitions for UI, portfolio data and blog posts. */
export const locales = ["pt", "en", "es"] as const
export type Locale = (typeof locales)[number]

export const localeTags: Record<Locale, string> = { pt: "pt-BR", en: "en-US", es: "es" }
export const localeNames: Record<Locale, string> = { pt: "Português", en: "English", es: "Español" }

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.some((locale) => locale === value)
}

export function resolveLocale(saved: unknown, initial?: Locale, browserLanguage?: string): Locale {
  if (isLocale(saved)) return saved
  if (initial) return initial
  const language = browserLanguage?.toLowerCase().split("-")[0]
  return isLocale(language) ? language : "pt"
}
