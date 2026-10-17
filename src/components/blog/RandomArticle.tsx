"use client"

import React, { useMemo, useState } from "react"
import Link from "next/link"
import { Shuffle } from "lucide-react"

interface RandomItem { title: string; url: string }

const labels = {
  pt: { button: "Artigo aleatório", chosen: "Sugerido para você" },
  en: { button: "Random article", chosen: "Suggested for you" },
  es: { button: "Artículo aleatorio", chosen: "Sugerido para ti" },
} as const

export function RandomArticle({ locale, posts }: { locale: keyof typeof labels; posts: RandomItem[] }) {
  const [slug, setSlug] = useState<string | null>(null)
  const chosen = useMemo(() => posts.find(post => post.url === slug) ?? null, [posts, slug])

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => setSlug(posts[Math.floor(Math.random() * posts.length)]?.url ?? null)} disabled={posts.length === 0} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50">
        <Shuffle className="h-4 w-4" aria-hidden="true" />
        {labels[locale].button}
      </button>
      {chosen && <Link href={chosen.url} className="text-sm font-medium text-brand underline underline-offset-4">{labels[locale].chosen}: {chosen.title}</Link>}
    </div>
  )
}
