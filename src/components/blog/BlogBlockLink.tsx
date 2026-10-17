"use client"
import React, { useState } from "react"
import type { Locale } from "@/lib/i18n"
export function BlogBlockLink({
  id,
  pageUrl,
  locale,
}: {
  id: string
  pageUrl: string
  locale: Locale
}) {
  const [copied, setCopied] = useState(false),
    [manual, setManual] = useState(false)
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  const href = pageUrl.split("#")[0] + "#" + id
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
      <a
        href={href}
        className="inline-flex min-h-8 items-center text-brand underline underline-offset-4"
        aria-label={copy(
          "Link permanente para este trecho",
          "Permanent link to this passage",
          "Enlace permanente a este fragmento"
        )}
      >
        {copy("Link deste trecho", "Passage link", "Enlace del fragmento")}
      </a>
      <button
        type="button"
        className="min-h-8 underline underline-offset-4"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(href)
            setCopied(true)
            setManual(false)
          } catch {
            setManual(true)
          }
        }}
      >
        {copy("Copiar link", "Copy link", "Copiar enlace")}
      </button>
      <span role="status">
        {copied ? copy("Copiado.", "Copied.", "Copiado.") : ""}
      </span>
      {manual && (
        <label className="block w-full">
          {copy("Copie o endereço", "Copy the address", "Copia la dirección")}
          <input
            readOnly
            value={href}
            onFocus={(event) => event.target.select()}
            className="mt-1 min-h-9 w-full rounded border border-hairline bg-background px-2"
          />
        </label>
      )}
    </div>
  )
}
