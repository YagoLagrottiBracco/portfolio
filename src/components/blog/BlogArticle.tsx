/* eslint-disable @next/next/no-img-element */
import React from "react"
import Link from "next/link"
import { Calendar, Clock, Tag } from "lucide-react"

import { BlogMarkdown } from "@/components/blog/BlogMarkdown"
import { personalData } from "@/data/personal"
import type { BlogPost } from "@/lib/blog-content"
import { getBlogIndexPath } from "@/lib/blog-routes"
import { getBlogOutline } from "@/lib/blog-outline"
import { localeNames, localeTags, type Locale } from "@/lib/i18n"

const copy: Record<Locale, { by: string; contents: string; minutes: string; updated: string; languages: string }> = {
  pt: { by: "Por", contents: "Neste artigo", minutes: "min de leitura", updated: "Atualizado em", languages: "Idiomas" },
  en: { by: "By", contents: "In this article", minutes: "min read", updated: "Updated on", languages: "Languages" },
  es: { by: "Por", contents: "En este artículo", minutes: "min de lectura", updated: "Actualizado el", languages: "Idiomas" },
}

export function BlogArticle({ post, translations, assetPreviews }: { post: BlogPost; translations: BlogPost[]; assetPreviews?: Record<string, string> }) {
  const labels = copy[post.locale]
  const outline = getBlogOutline(post.content)
  const formatter = new Intl.DateTimeFormat(localeTags[post.locale], { dateStyle: "long", timeZone: "UTC" })
  const published = formatter.format(new Date(post.date))

  return <article className="container mx-auto max-w-6xl px-4 pb-28 pt-32" lang={localeTags[post.locale]}>
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex min-w-0 gap-2"><li><Link href={getBlogIndexPath(post.locale)} className="underline underline-offset-4">Blog</Link></li><li aria-hidden="true">/</li><li aria-current="page" className="truncate">{post.title}</li></ol>
    </nav>

    <header className="mx-auto mt-10 max-w-3xl border-b border-border pb-10">
      <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">{post.title}</h1>
      <p className="mt-6 text-xl leading-8 text-muted-foreground">{post.excerpt}</p>
      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
        <span>{labels.by} <Link href="/#about" className="font-medium text-foreground underline underline-offset-4">{personalData.name}</Link></span>
        <time dateTime={post.date} className="inline-flex items-center gap-2"><Calendar className="h-4 w-4" aria-hidden="true" />{published}</time>
        <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden="true" />{post.readingMinutes} {labels.minutes}</span>
        {post.updatedAt && <time dateTime={post.updatedAt}>{labels.updated} {formatter.format(new Date(post.updatedAt))}</time>}
      </div>
      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
        {post.tags.map(tag => <li key={tag} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium"><Tag className="h-3 w-3" aria-hidden="true" />{tag}</li>)}
      </ul>
      {translations.length > 1 && <nav className="mt-7 flex flex-wrap gap-3 text-sm" aria-label={labels.languages}>
        {translations.map(translation => <Link key={translation.locale} href={translation.url} data-blog-locale={translation.locale} lang={localeTags[translation.locale]} aria-current={translation.slug === post.slug ? "page" : undefined} className="rounded-full border border-border px-3 py-1.5 font-medium text-foreground hover:bg-muted">{localeNames[translation.locale]}</Link>)}
      </nav>}
    </header>

    {post.image && <figure className="mx-auto mt-10 max-w-5xl"><img src={post.image.src} alt={post.image.alt} width={post.image.width} height={post.image.height} className="h-auto max-h-[35rem] w-full rounded-2xl border border-border object-cover" /></figure>}

    <div className="mx-auto mt-12 grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_15rem]">
      <div className="min-w-0"><BlogMarkdown content={post.content} locale={post.locale} assetPreviews={assetPreviews} /></div>
      {outline.length > 0 && <aside className="order-first lg:order-last">
        <nav aria-label={labels.contents} className="rounded-xl border border-border bg-muted/30 p-5 lg:sticky lg:top-24">
          <p className="mb-4 text-sm font-semibold text-foreground">{labels.contents}</p>
          <ol className="space-y-2 text-sm">{outline.map(heading => <li key={heading.id} className={heading.depth === 3 ? "pl-4" : ""}><a href={`#${heading.id}`} className="text-muted-foreground underline-offset-4 hover:text-brand hover:underline">{heading.text}</a></li>)}</ol>
        </nav>
      </aside>}
    </div>
  </article>
}
