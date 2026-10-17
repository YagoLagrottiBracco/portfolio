/**
 * The interface strings (`src/messages/<locale>.json`) as a `t(key)` function.
 * Server Components call `translator(locale)`; client components get the same
 * function from `useTranslation()`.
 */
import en from "@/messages/en.json"
import es from "@/messages/es.json"
import pt from "@/messages/pt.json"
import type { Locale } from "@/lib/i18n"

export const messages: Record<Locale, Record<string, unknown>> = { pt, en, es }

/** Dotted keys (`hero.title`); a missing key comes back as itself, so it shows in review. */
export function translator(locale: Locale): (key: string) => string {
  return (key) => {
    let value: unknown = messages[locale]
    for (const part of key.split(".")) {
      if (typeof value !== "object" || value === null || !(part in value)) return key
      value = (value as Record<string, unknown>)[part]
    }
    return typeof value === "string" ? value : key
  }
}
