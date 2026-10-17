"use client"

import { useState } from "react"

import { BlogCopyCode } from "@/components/blog/BlogCopyCode"
import type { Locale } from "@/lib/i18n"

export interface CodeTabItem { label: string; language?: string; code: string }

export function CodeTabs({ items, locale }: { items: CodeTabItem[]; locale: Locale }) {
  const [active, setActive] = useState(0)
  const current = items[active]
  if (!current) return null

  return (
    <div className="my-8 overflow-hidden rounded-xl border border-border">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted/50 px-2 pt-2">
        {items.map((item, index) => (
          <button key={item.label} type="button" role="tab" aria-selected={index === active} onClick={() => setActive(index)} className={`rounded-t-lg px-3 py-2 text-xs font-semibold ${index === active ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {item.label}
          </button>
        ))}
        <span className="ml-auto pb-2 pr-2"><BlogCopyCode code={current.code} locale={locale} /></span>
      </div>
      <pre className="overflow-x-auto bg-background p-4 text-sm leading-6"><code className={`language-${current.language ?? "text"}`}>{current.code}</code></pre>
    </div>
  )
}
