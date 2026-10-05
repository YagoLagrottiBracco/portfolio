"use client"

import Link from "next/link"

import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"
import { useTranslation } from "@/contexts/TranslationContext"
import { getHomePath } from "@/lib/locale-routes"

/** The 404 page. Each root layout has a `not-found.tsx` that renders it. */
export function NotFoundScreen() {
  const { t, locale } = useTranslation()
  return (
    <>
      <Navigation />
      <main id="main" className="container mx-auto min-h-[70vh] px-4 py-32 text-center">
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="mt-4 text-3xl font-bold">{t("common.notFound")}</h1>
        <Link href={getHomePath(locale)} className="mt-6 inline-block text-brand underline">{t("common.backHome")}</Link>
      </main>
      <Footer />
    </>
  )
}
