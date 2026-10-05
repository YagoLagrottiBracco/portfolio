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
import type { ReactNode } from "react"

import "@/app/globals.css"
import { geistMono, geistSans } from "@/app/fonts"
import { SkipLink } from "@/components/atoms/SkipLink"
import { Providers } from "@/components/providers/Providers"
import { personalData } from "@/data/personal"
import { localeTags, type Locale } from "@/lib/i18n"
import { PERSON_ID, SITE_URL } from "@/lib/site"

/** JSON-LD so search engines can model the site as a real person, not a generic page. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: personalData.name,
  alternateName: "Yago Lagrotti",
  url: SITE_URL,
  jobTitle: personalData.headline,
  description: personalData.summary,
  email: `mailto:${personalData.socialLinks.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Embu-Guaçu",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  sameAs: [personalData.socialLinks.github, personalData.socialLinks.linkedin],
  knowsAbout: personalData.skills,
  knowsLanguage: ["pt-BR", "en", "es"],
}

interface RootDocumentProps {
  /** Language of the document. */
  lang: Locale
  /**
   * Set when the layout already knows the page's language and the path alone
   * would not say — an article, or anything under `/en` and `/es`.
   */
  pageLocale?: Locale
  children: ReactNode
}

export function RootDocument({ lang, pageLocale, children }: RootDocumentProps) {
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
