"use client"

/**
 * A read-only field with a copy button. On its own module so pages that only
 * need it (an article's citation) do not download the resource forms, the
 * community validation and their data along with it.
 */
import React, { useState } from "react"

import type { Locale } from "@/lib/i18n"

export function CopyField({
  value,
  label,
  locale,
}: {
  value: string
  label: string
  locale: Locale
}) {
  const [status, setStatus] = useState("")
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  return (
    <div className="mt-5">
      <label className="block text-sm font-medium">
        {label}
        <textarea
          readOnly
          rows={3}
          value={value}
          onFocus={(e) => e.target.select()}
          className="mt-2 w-full rounded-xl border border-hairline bg-background p-3 font-mono text-xs leading-relaxed"
        />
      </label>
      <button
        type="button"
        className="mt-2 min-h-11 rounded-lg border border-hairline px-4 text-sm hover:bg-surface"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value)
            setStatus(copy("Copiado.", "Copied.", "Copiado."))
          } catch {
            setStatus(
              copy(
                "Selecione o campo e copie manualmente.",
                "Select the field and copy manually.",
                "Selecciona el campo y copia manualmente."
              )
            )
          }
        }}
      >
        {copy("Copiar", "Copy", "Copiar")}
      </button>
      <span className="ml-3 text-sm" role="status">
        {status}
      </span>
    </div>
  )
}
