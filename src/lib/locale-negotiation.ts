import { isLocale, type Locale } from "@/lib/i18n"

/** Cookie the language switcher writes so the server can honour the choice. */
export const LOCALE_COOKIE = "locale"

/**
 * Picks the homepage language for a request to `/`.
 *
 * An explicit choice wins. Otherwise the browser's `Accept-Language` decides,
 * and a visitor whose languages are all unsupported gets English rather than
 * Portuguese. A request without the header — which is how search engine
 * crawlers arrive — is served Portuguese, the canonical page.
 */
export function negotiateLocale(saved: string | undefined, acceptLanguage: string | null): Locale {
  if (isLocale(saved)) return saved
  if (!acceptLanguage) return "pt"

  const preferences = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";")
      const weight = params.map((param) => param.trim()).find((param) => param.startsWith("q="))
      const quality = weight === undefined ? 1 : Number(weight.slice(2))
      return { language: tag.trim().toLowerCase().split("-")[0], quality: Number.isFinite(quality) ? quality : 0 }
    })
    .filter((preference) => preference.language && preference.quality > 0)
    .sort((a, b) => b.quality - a.quality)

  if (preferences.length === 0 || preferences.every((preference) => preference.language === "*")) return "pt"

  return preferences.map((preference) => preference.language).find(isLocale) ?? "en"
}
