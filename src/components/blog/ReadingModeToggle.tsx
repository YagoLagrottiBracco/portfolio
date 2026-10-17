"use client"

import React, { useEffect, useState } from "react"
import { Focus } from "lucide-react"

import type { Locale } from "@/lib/i18n"

const labels: Record<Locale, { on: string; off: string }> = {
  pt: { on: "Sair do modo leitura", off: "Modo leitura" },
  en: { on: "Exit reading mode", off: "Reading mode" },
  es: { on: "Salir del modo lectura", off: "Modo lectura" },
}

export function ReadingModeToggle({ locale }: { locale: Locale }) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(document.body.classList.contains("reading-focus"))
  }, [])

  function toggle() {
    const next = !active
    document.body.classList.toggle("reading-focus", next)
    setActive(next)
  }

  return (
    <button type="button" onClick={toggle} aria-pressed={active} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
      <Focus className="h-4 w-4" aria-hidden="true" />
      {active ? labels[locale].on : labels[locale].off}
    </button>
  )
}
