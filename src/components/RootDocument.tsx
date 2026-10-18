/**
 * @file RootDocument.tsx
 * @description The `<html>` shell shared by the three root layouts.
 *
 * There is one root layout per way of knowing a page's language — `(pt)` for
 * the unprefixed Portuguese routes, `[locale]` for `/en` and `/es`, and one for
 * blog articles, whose language comes from the article — so that `<html lang>`
 * is right in the HTML the server sends, not patched in after hydration.
 */
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"
import type { ReactNode } from "react"

import "@/app/globals.css"
import { geistMono, geistSans } from "@/app/fonts"
import { AttributionCapture } from "@/components/atoms/AttributionCapture"
import { ErrorReporter } from "@/components/atoms/ErrorReporter"
import { SkipLink } from "@/components/atoms/SkipLink"
import { Providers } from "@/components/providers/Providers"
import { buildPersonJsonLd } from "@/lib/home-metadata"
import { localeTags, type Locale } from "@/lib/i18n"

/** Umami (cookieless, so no consent banner) counts visits by source and campaign, and the events. */
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
/** Uncaught browser errors go to Sentry when a DSN is set. */
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

interface RootDocumentProps {
  /** Language of the document. */
  lang: Locale
  /**
   * Set when the layout already knows the page's language and the path alone
   * would not say — an article, or anything under `/en` and `/es`.
   */
  pageLocale?: Locale
  /** Off for pages that are not for visitors, such as the blog admin. */
  measured?: boolean
  children: ReactNode
}

export function RootDocument({ lang, pageLocale, measured = true, children }: RootDocumentProps) {
  const personJsonLd = buildPersonJsonLd(lang)
  return (
    <html lang={localeTags[lang]} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          // JSON-LD is data, not markup — this is the documented Next.js pattern.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers pageLocale={pageLocale}>
          <SkipLink />
          {children}
        </Providers>
        {/* Here rather than on the homepage, so every page is measured. */}
        {measured && (
          <>
            <AttributionCapture />
            {SENTRY_DSN && <ErrorReporter dsn={SENTRY_DSN} release={process.env.VERCEL_GIT_COMMIT_SHA} />}
            <Analytics />
            <SpeedInsights />
            {UMAMI_WEBSITE_ID && (
              <Script
                src="https://cloud.umami.is/script.js"
                data-website-id={UMAMI_WEBSITE_ID}
                // Previews and localhost would otherwise pollute the numbers.
                data-domains="lagrotti.dev"
                strategy="afterInteractive"
              />
            )}
          </>
        )}
      </body>
    </html>
  )
}
