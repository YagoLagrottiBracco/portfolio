"use client"

/**
 * @file Providers.tsx
 * @description Client boundary holding every context the app needs.
 *
 * Lives in `RootDocument` so that layouts and pages can stay Server
 * Components — that is what lets the homepage ship real HTML (good for SEO and
 * LCP) instead of the client-side spinner the previous version rendered.
 */
import { LocalizedMetadata } from "@/components/atoms/LocalizedMetadata"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { TranslationProvider } from "@/contexts/TranslationContext"
import type { Locale } from "@/lib/i18n"

export function Providers({ children, pageLocale }: { children: ReactNode; pageLocale?: Locale }) {
  return (
    <TranslationProvider pageLocale={pageLocale}>
      <LocalizedMetadata />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </TranslationProvider>
  )
}
