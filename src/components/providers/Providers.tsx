"use client"

/**
 * @file Providers.tsx
 * @description Client boundary holding every context the app needs.
 *
 * Lives in the root layout so that `layout.tsx` and `page.tsx` can stay Server
 * Components — that is what lets the homepage ship real HTML (good for SEO and
 * LCP) instead of the client-side spinner the previous version rendered.
 */
import { LocalizedMetadata } from "@/components/atoms/LocalizedMetadata"
import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { TranslationProvider } from "@/contexts/TranslationContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
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
