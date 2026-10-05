"use client"

import { useMemo, useState } from "react"
import Link from "next/link"

import type { BlogAdminBundle } from "@/lib/blog-admin-document"
import { locales } from "@/lib/i18n"

export function BlogAdminList({ bundles }: { bundles: BlogAdminBundle[] }) {
  const [query, setQuery] = useState("")
  const visible = useMemo(() => bundles.filter(bundle => {
    const terms = [bundle.translationKey, ...locales.flatMap(locale => [bundle.articles[locale]?.title, bundle.articles[locale]?.slug])].join(" ").toLowerCase()
    return terms.includes(query.toLowerCase().trim())
  }), [bundles, query])
  return <div>
    <label className="block max-w-md text-sm font-medium">Buscar artigo
      <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Título, slug ou chave" className="blog-admin-input mt-2" />
    </label>
    <ul className="mt-7 grid gap-4">
      {visible.map(bundle => <li key={bundle.translationKey} className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold"><Link href={`/admin/blog/${bundle.translationKey}`} className="underline underline-offset-4">{bundle.articles.pt?.title ?? bundle.articles.en?.title ?? bundle.translationKey}</Link></h2><p className="mt-1 text-xs text-muted-foreground">{bundle.translationKey}</p></div><span className="text-sm text-muted-foreground">{bundle.articles.pt?.date ?? bundle.articles.en?.date}</span></div>
        <ul className="mt-4 flex flex-wrap gap-2">{locales.map(locale => <li key={locale} className="rounded-full border border-border px-3 py-1 text-xs"><span className="font-semibold uppercase">{locale}</span> · {!bundle.articles[locale] ? "ausente" : bundle.articles[locale]?.draft ? "rascunho" : "publicado"}</li>)}</ul>
      </li>)}
    </ul>
    {visible.length === 0 && <p className="mt-7 text-muted-foreground">Nenhum artigo encontrado.</p>}
  </div>
}
