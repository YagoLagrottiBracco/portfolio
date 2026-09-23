"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import ptTranslations from "@/messages/pt.json"
import enTranslations from "@/messages/en.json"
import esTranslations from "@/messages/es.json"
import { localeTags, resolveLocale, type Locale } from "@/lib/i18n"

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)
const translations: Record<Locale, Record<string, unknown>> = {
  pt: ptTranslations,
  en: enTranslations,
  es: esTranslations,
}

export function TranslationProvider({ children, initialLocale }: {
  children: ReactNode
  initialLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? "pt")

  useEffect(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem("locale") } catch { /* Storage may be disabled. */ }
    setLocaleState(resolveLocale(saved, initialLocale, navigator.language))
  }, [initialLocale])

  useEffect(() => {
    document.documentElement.lang = localeTags[locale]
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    try { localStorage.setItem("locale", newLocale) } catch { /* Keep switching without storage. */ }
  }

  const t = (key: string): string => {
    let value: unknown = translations[locale]
    for (const part of key.split(".")) {
      if (typeof value !== "object" || value === null || !(part in value)) return key
      value = (value as Record<string, unknown>)[part]
    }
    return typeof value === "string" ? value : key
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) throw new Error("useTranslation must be used within a TranslationProvider")
  return context
}
