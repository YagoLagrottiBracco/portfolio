"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useTranslation } from "@/contexts/TranslationContext"
import { personalData } from "@/data/personal"
import { getPostBySlug } from "@/lib/blog"

/** Keep the browser tab and description in the reader's selected language. */
export function LocalizedMetadata() {
  const { locale, t } = useTranslation()
  const pathname = usePathname()
  let title = `${personalData.name} — ${t("hero.headline")}`
  let description = t("hero.subtitle")

  if (pathname.startsWith("/projetos/")) {
    const project = personalData.projects.find(project => project.slug === pathname.split("/")[2])
    if (project) {
      title = `${project.title[locale]} — ${personalData.name}`
      description = project.description[locale]
    }
  } else if (pathname.startsWith("/blog")) {
    const post = getPostBySlug(pathname.split("/")[2] ?? "", locale)
    title = `${post?.title ?? t("blog.title")} — ${personalData.name}`
    description = post?.excerpt ?? t("blog.heroDescription")
  }

  useEffect(() => {
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute("content", description)
  }, [title, description, pathname])

  return null
}
