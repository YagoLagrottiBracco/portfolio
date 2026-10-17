import React from "react"
import Link from "next/link"
import { MessageSquare } from "lucide-react"

import type { Webmention } from "@/lib/webmentions"

const labels = {
  pt: { title: "Menções na web", empty: "Ainda não há menções públicas registradas para este artigo." },
  en: { title: "Web mentions", empty: "There are no public mentions recorded for this article yet." },
  es: { title: "Menciones en la web", empty: "Todavía no hay menciones públicas registradas para este artículo." },
} as const

export function WebmentionList({ mentions, locale }: { mentions: Webmention[]; locale: keyof typeof labels }) {
  const text = labels[locale]
  return (
    <section aria-label={text.title} className="mx-auto mt-16 max-w-3xl border-t border-border pt-10">
      <h2 className="flex items-center gap-2 text-2xl font-semibold"><MessageSquare className="h-5 w-5" aria-hidden="true" />{text.title}</h2>
      {mentions.length === 0 ? <p className="mt-4 text-sm text-muted-foreground">{text.empty}</p> : (
        <ol className="mt-6 space-y-4">
          {mentions.map(mention => (
            <li key={mention.url} className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="text-sm leading-7 text-foreground/90">{mention.text}</p>
              <p className="mt-3 text-sm">
                {mention.authorUrl ? <Link href={mention.authorUrl} className="font-medium text-brand underline-offset-4 hover:underline">{mention.author}</Link> : <span className="font-medium">{mention.author}</span>}
                {" · "}
                <Link href={mention.url} className="text-muted-foreground underline-offset-4 hover:underline">{mention.url.replace(/^https?:\/\//, "")}</Link>
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
