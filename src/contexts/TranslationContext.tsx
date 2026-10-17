"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import { LOCALE_COOKIE } from "@/lib/locale-negotiation"
import { getRouteLocale } from "@/lib/locale-routes"
import { localeTags, resolveLocale, type Locale } from "@/lib/i18n"
import { translator } from "@/lib/translate"

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export function TranslationProvider({ children, initialLocale, pageLocale }: {
  children: ReactNode
  initialLocale?: Locale
  /** The page's own language, when the layout knows it — an article's, for one. */
  pageLocale?: Locale
}) {
  const [savedLocale, setLocaleState] = useState<Locale>(pageLocale ?? initialLocale ?? "pt")

  // A page that has a language of its own wins over the saved choice: the
  // server and the browser must both render `/en` and `/en/projetos/...` in
  // English, and an article's surroundings in the article's language.
  const pathLocale = getRouteLocale(usePathname() ?? "")
  const routeLocale = pageLocale ?? pathLocale
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
    // The cookie is what lets the server send a returning visitor to their language.
    document.cookie = `${LOCALE_COOKIE}=${newLocale}; path=/; max-age=31536000; samesite=lax`
  }

  const t = translator(locale)

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
