"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTranslation } from "@/contexts/TranslationContext"
import { personalData } from "@/data/personal"

/** Keeps the generic portfolio title in the selected UI language. Blog pages own their server metadata. */
export function LocalizedMetadata() {
  const { t } = useTranslation()
  const pathname = usePathname()
  useEffect(() => {
    if (pathname.startsWith("/blog") || pathname.endsWith("/blog")) return
    document.title = `${personalData.name} — ${t("hero.headline")}`
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("hero.subtitle"))
  }, [pathname, t])
  return null
}
