"use client"

import { useEffect, useState } from "react"

import { WebmentionList } from "@/components/blog/WebmentionList"
import type { Webmention } from "@/lib/webmentions"
import type { Locale } from "@/lib/i18n"

export function WebmentionLoader({ target, locale }: { target: string; locale: Locale }) {
  const [mentions, setMentions] = useState<Webmention[] | null>(null)

  useEffect(() => {
    let alive = true
    fetch(`/api/webmentions?target=${encodeURIComponent(target)}`, { cache: "no-store" })
      .then(async response => alive && setMentions(response.ok ? await response.json() as Webmention[] : []))
      .catch(() => alive && setMentions([]))
    return () => { alive = false }
  }, [target])

  if (mentions === null || mentions.length === 0) return null
  return <WebmentionList mentions={mentions} locale={locale} />
}
