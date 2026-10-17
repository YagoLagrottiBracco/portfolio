import type { Locale } from "@/lib/i18n"
type LocalizedText = Record<Locale, string>

export const tr = (pt: string, en: string, es: string): LocalizedText => ({
  pt,
  en,
  es,
})
export interface ResourceSection {
  slug: string
  title: LocalizedText
  description: LocalizedText
}
export interface ResourceBlock {
  title: LocalizedText
  body: LocalizedText
}
export interface ResourceEntry {
  slug: string
  title: LocalizedText
  description: LocalizedText
  blocks?: ResourceBlock[]
  projects?: string[]
  tags?: string[]
  tool?: "json" | "env" | "queue"
  download?: string
  source?: string
  date?: string
}
