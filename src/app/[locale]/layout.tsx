import type { ReactNode } from "react"

/**
 * Pass-through layout for the legacy `[locale]` routes, which now only redirect.
 *
 * It used to mount a second `TranslationProvider` + `ThemeProvider`; those live
 * in the root layout now, and nesting them again would fork the theme state.
 */
export default function LegacyLocaleLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
