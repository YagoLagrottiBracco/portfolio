"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import type { Locale } from "@/lib/i18n"

export interface PopularPost { path: string; title: string; locale: Locale; views: number }

const labels: Record<Locale, { unavailable: string; views: string; popular: string; updated: string; period: string }> = {
  pt: { unavailable: "As métricas públicas ainda não estão configuradas.", views: "visualizações", popular: "Conteúdos mais lidos", updated: "Atualizado", period: "últimos 30 dias" },
  en: { unavailable: "Public metrics are not configured yet.", views: "views", popular: "Most-read content", updated: "Updated", period: "last 30 days" },
  es: { unavailable: "Las métricas públicas todavía no están configuradas.", views: "visualizaciones", popular: "Contenido más leído", updated: "Actualizado", period: "últimos 30 días" },
}

export function AnalyticsDashboard({ locale }: { locale: Locale }) {
  const text = labels[locale]
  const [posts, setPosts] = useState<PopularPost[] | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetch("/api/analytics/popular", { cache: "no-store" })
      .then(async response => {
        if (!alive || !response.ok) { if (alive) setPosts(null); return }
        const payload = await response.json() as { posts: PopularPost[]; generatedAt: string }
        if (alive) { setPosts(payload.posts); setUpdatedAt(payload.generatedAt) }
      })
      .catch(() => alive && setPosts(null))
    return () => { alive = false }
  }, [])

  if (!posts) return <p className="rounded-xl border border-border bg-muted/25 p-5 text-sm text-muted-foreground">{text.unavailable}</p>

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-semibold">{text.popular}</h2>
        {updatedAt && <p className="text-sm text-muted-foreground">{text.updated} {new Date(updatedAt).toLocaleString(locale === "pt" ? "pt-BR" : locale === "es" ? "es" : "en")} · {text.period}</p>}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {posts.map(post => (
          <Link key={post.path} href={post.path} hrefLang={post.locale === "pt" ? "pt-BR" : post.locale} className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-brand/50">
            <span className="block text-lg font-semibold leading-snug">{post.title}</span>
            <span className="mt-3 block text-sm text-muted-foreground">{post.views.toLocaleString(locale === "pt" ? "pt-BR" : locale)} {text.views}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
