"use client"

import { useEffect, useState } from "react"

import type { Locale } from "@/lib/i18n"

type StatusItem = { slug: string; title: string; url: string; ok: boolean; status: number | null; checkedAt: string }

const labels: Record<Locale, { unavailable: string; online: string; offline: string; unknown: string; checked: string; note: string }> = {
  pt: { unavailable: "A verificação de status ainda não está disponível.", online: "No ar", offline: "Fora do ar", unknown: "Sem resposta", checked: "Verificado", note: "Verificação pontual, sem promessa de uptime histórico." },
  en: { unavailable: "Status checking is not available yet.", online: "Online", offline: "Offline", unknown: "No response", checked: "Checked", note: "Point-in-time checks, not a historical uptime SLA." },
  es: { unavailable: "La comprobación de estado todavía no está disponible.", online: "En línea", offline: "Caído", unknown: "Sin respuesta", checked: "Comprobado", note: "Comprobación puntual, no un SLA histórico de disponibilidad." },
}

export function StatusBoard({ locale }: { locale: Locale }) {
  const text = labels[locale]
  const [items, setItems] = useState<StatusItem[] | null>(null)

  useEffect(() => {
    let alive = true
    fetch(`/api/status?locale=${locale}`, { cache: "no-store" })
      .then(async response => alive && setItems(response.ok ? await response.json() as StatusItem[] : null))
      .catch(() => alive && setItems(null))
    return () => { alive = false }
  }, [locale])

  if (!items) return <p className="rounded-xl border border-border bg-muted/25 p-5 text-sm text-muted-foreground">{text.unavailable}</p>

  return (
    <div className="mt-10">
      <p className="text-sm text-muted-foreground">{text.note}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {items.map(item => (
          <a key={item.slug} href={item.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-brand/50">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-semibold">{item.title}</h2>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${item.ok ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-destructive/10 text-destructive"}`}>
                <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />
                {item.ok ? text.online : item.status === null ? text.unknown : text.offline}
              </span>
            </div>
            <p className="mt-3 break-all text-sm text-muted-foreground">{item.url}</p>
            <p className="mt-3 text-xs text-muted-foreground">{text.checked}: {new Date(item.checkedAt).toLocaleString(locale === "pt" ? "pt-BR" : locale === "es" ? "es" : "en")}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
