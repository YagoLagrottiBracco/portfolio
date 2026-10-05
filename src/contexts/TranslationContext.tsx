"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import ptTranslations from "@/messages/pt.json"
import enTranslations from "@/messages/en.json"
import esTranslations from "@/messages/es.json"
import { parseCaseStudyPath } from "@/lib/case-study-routes"
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
  const [savedLocale, setLocaleState] = useState<Locale>(initialLocale ?? "pt")

  // A case study URL names its own language, so it wins over the saved choice:
  // the server and the browser must render `/en/projetos/...` in English alike.
  const routeLocale = parseCaseStudyPath(usePathname() ?? "")?.locale
  const locale = routeLocale ?? savedLocale

  useEffect(() => {
    let saved: string | null = null
    try { saved = localStorage.getItem("locale") } catch { /* Storage may be disabled. */ }
    setLocaleState(resolveLocale(saved, initialLocale, navigator.language))
  }, [initialLocale])

  // Keeps the rest of the visit in the language the reader arrived in.
  useEffect(() => {
    if (routeLocale) setLocaleState(routeLocale)
  }, [routeLocale])

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
