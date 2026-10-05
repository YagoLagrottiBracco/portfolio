"use client"

import React, { useState } from "react"
import type { Locale } from "@/lib/i18n"

const labels: Record<Locale, { copy: string; copied: string }> = {
  pt: { copy: "Copiar código", copied: "Copiado" },
  en: { copy: "Copy code", copied: "Copied" },
  es: { copy: "Copiar código", copied: "Copiado" },
}

export function BlogCopyCode({ code, locale }: { code: string; locale: Locale }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return <button type="button" onClick={copy} className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground hover:bg-muted" aria-label={labels[locale].copy}>{copied ? labels[locale].copied : labels[locale].copy}</button>
}
