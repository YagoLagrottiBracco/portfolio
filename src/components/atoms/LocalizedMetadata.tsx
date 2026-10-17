"use client"
import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTranslation } from "@/contexts/TranslationContext"
import { profile } from "@/data/profile"
import { getRouteLocale } from "@/lib/locale-routes"

/** Keeps the generic portfolio title in the selected UI language on pages without metadata of their own, such as the 404. */
export function LocalizedMetadata() {
  const { t } = useTranslation()
  const pathname = usePathname()
  useEffect(() => {
    if (pathname.startsWith("/blog") || getRouteLocale(pathname)) return
    document.title = `${profile.name} — ${t("hero.headline")}`
    document.querySelector('meta[name="description"]')?.setAttribute("content", t("hero.subtitle"))
  }, [pathname, t])
  return null
}
