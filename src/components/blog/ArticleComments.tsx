"use client"

/**
 * @file ArticleComments.tsx
 * @description Comments on articles through giscus (GitHub Discussions): no
 * database here, and readers sign in with GitHub. One discussion per article,
 * shared by its translations (mapped by `translationKey`). The giscus script
 * loads only when the section scrolls near the viewport, and follows the
 * site's theme, also when the reader switches it.
 * Configuration: the NEXT_PUBLIC_GISCUS_* variables (docs/growth.md).
 */
import React, { useEffect, useRef, useState } from "react"
import { MessagesSquare } from "lucide-react"
import { useTheme } from "next-themes"

import { GISCUS_ORIGIN, type GiscusConfig } from "@/lib/giscus"
import type { Locale } from "@/lib/i18n"

const copy: Record<Locale, { title: string; note: string }> = {
  pt: { title: "Comentários", note: "Os comentários ficam nas Discussions do GitHub; para comentar, entre com a sua conta do GitHub." },
  en: { title: "Comments", note: "Comments live in GitHub Discussions; sign in with your GitHub account to comment." },
  es: { title: "Comentarios", note: "Los comentarios están en las Discussions de GitHub; para comentar, entra con tu cuenta de GitHub." },
}

const giscusTheme = (theme: string | undefined) => (theme === "light" ? "light" : "dark")

interface ArticleCommentsProps {
  config: GiscusConfig
  locale: Locale
  /** The article's translationKey: its discussion's title. */
  term: string
}

export function ArticleComments({ config, locale, term }: ArticleCommentsProps) {
  const text = copy[locale]
  const container = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const element = container.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: "400px" })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Inject giscus once the section is near; its script replaces itself with the iframe.
  useEffect(() => {
    const element = container.current
    if (!visible || !element || element.querySelector("script, iframe")) return
    const script = document.createElement("script")
    const attributes: Record<string, string> = {
      src: `${GISCUS_ORIGIN}/client.js`,
      "data-repo": config.repo,
      "data-repo-id": config.repoId,
      "data-category": config.category,
      "data-category-id": config.categoryId,
      "data-mapping": "specific",
      "data-term": term,
      "data-strict": "1",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": giscusTheme(resolvedTheme),
      "data-lang": locale,
      "data-loading": "lazy",
      crossorigin: "anonymous",
    }
    for (const [name, value] of Object.entries(attributes)) script.setAttribute(name, value)
    script.async = true
    element.append(script)
    // The theme at injection time is enough; later changes go through setConfig below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, config, locale, term])

  useEffect(() => {
    const frame = container.current?.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
    frame?.contentWindow?.postMessage({ giscus: { setConfig: { theme: giscusTheme(resolvedTheme) } } }, GISCUS_ORIGIN)
  }, [resolvedTheme])

  return (
    <section aria-labelledby="comments-title" className="mx-auto mt-20 max-w-3xl print:hidden">
      <h2 id="comments-title" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        <MessagesSquare className="h-5 w-5 text-brand" aria-hidden="true" />
        {text.title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{text.note}</p>
      <div ref={container} className="mt-6 min-h-24" />
    </section>
  )
}
