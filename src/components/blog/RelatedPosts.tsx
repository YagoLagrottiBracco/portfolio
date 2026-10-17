/**
 * @file RelatedPosts.tsx
 * @description "Keep reading": up to three articles in the same language,
 * chosen on the server by `getRelatedPosts`.
 */
import React from "react"
import Link from "next/link"

import type { Locale } from "@/lib/i18n"

export interface RelatedPost {
  url: string
  title: string
  excerpt: string
  date: string
  dateLabel: string
  readingMinutes: number
}

const copy: Record<Locale, { title: string; minutes: string }> = {
  pt: { title: "Continue lendo", minutes: "min de leitura" },
  en: { title: "Keep reading", minutes: "min read" },
  es: { title: "Sigue leyendo", minutes: "min de lectura" },
}

export function RelatedPosts({ locale, posts }: { locale: Locale; posts: RelatedPost[] }) {
  if (posts.length === 0) return null
  const text = copy[locale]

  return (
    <section aria-labelledby="related-title" className="mx-auto mt-20 max-w-5xl print:hidden">
      <h2 id="related-title" className="text-2xl font-bold tracking-tight">{text.title}</h2>
      <ul className="mt-6 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <li key={post.url}>
            <Link href={post.url} className="group flex h-full flex-col rounded-2xl border border-hairline p-5 transition-colors hover:border-brand/40 hover:bg-surface">
              <span className="text-xs text-muted-foreground">
                <time dateTime={post.date}>{post.dateLabel}</time> · {post.readingMinutes} {text.minutes}
              </span>
              <span className="mt-2 font-semibold leading-snug group-hover:text-brand">{post.title}</span>
              <span className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
