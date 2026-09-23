"use client"

import Link from "next/link"
import { useTranslation } from "@/contexts/TranslationContext"
import { Navigation } from "@/components/organisms/Navigation"
import { Footer } from "@/components/organisms/Footer"

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <>
      <Navigation />
      <main id="main" className="container mx-auto min-h-[70vh] px-4 py-32 text-center">
        <p className="text-sm text-muted-foreground">404</p>
        <h1 className="mt-4 text-3xl font-bold">{t("common.notFound")}</h1>
        <Link href="/" className="mt-6 inline-block text-brand underline">{t("common.backHome")}</Link>
      </main>
      <Footer />
    </>
  )
}
