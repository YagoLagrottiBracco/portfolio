import type { Metadata } from "next"
import type { ReactNode } from "react"

import { RootDocument } from "@/components/RootDocument"
import { isLocale } from "@/lib/i18n"
import { buildRootMetadata } from "@/lib/root-metadata"

interface LayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale } = await params
  return buildRootMetadata(isLocale(locale) ? locale : "pt")
}

/**
 * Root layout of `/en` and `/es`. `[locale]` also catches every unknown path,
 * which ends in this layout's 404; those fall back to a Portuguese document.
 */
export default async function LocaleRootLayout({ children, params }: LayoutProps) {
  const { locale } = await params

  return isLocale(locale) ? (
    <RootDocument lang={locale} pageLocale={locale}>{children}</RootDocument>
  ) : (
    <RootDocument lang="pt">{children}</RootDocument>
  )
}
