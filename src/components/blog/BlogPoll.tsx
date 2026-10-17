"use client"

import React, { useEffect, useState } from "react"

import type { Locale } from "@/lib/i18n"
import { trackEvent } from "@/lib/analytics"

type PollOption = { id: string; label: string; votes: number }
type PollResponse = { configured: boolean; options: PollOption[]; total: number }

const labels: Record<Locale, { title: string; vote: string; voted: string; unavailable: string; total: string }> = {
  pt: { title: "Qual assunto deve ir mais fundo?", vote: "Votar", voted: "Voto registrado", unavailable: "Resultados indisponíveis no momento", total: "votos" },
  en: { title: "Which topic should go deeper?", vote: "Vote", voted: "Vote recorded", unavailable: "Results are unavailable right now", total: "votes" },
  es: { title: "¿Qué tema debería profundizar?", vote: "Votar", voted: "Voto registrado", unavailable: "Resultados no disponibles por ahora", total: "votos" },
}

export function BlogPoll({ locale, pollId, options, title }: { locale: Locale; pollId: string; options: { id: string; label: string }[]; title?: string }) {
  const text = labels[locale]
  const heading = title ?? text.title
  const [data, setData] = useState<PollResponse | null>(null)
  const [selected, setSelected] = useState(options[0]?.id ?? "")
  const [message, setMessage] = useState("")

  useEffect(() => {
    let alive = true
    fetch(`/api/interactions/polls/${encodeURIComponent(pollId)}?locale=${locale}`, { cache: "no-store" })
      .then(async response => alive && setData(response.ok ? await response.json() as PollResponse : { configured: false, options: [], total: 0 }))
      .catch(() => alive && setData({ configured: false, options: [], total: 0 }))
    return () => { alive = false }
  }, [pollId, locale])

  async function vote() {
    if (!selected) return
    const response = await fetch(`/api/interactions/polls/${encodeURIComponent(pollId)}?locale=${locale}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ option: selected }),
    })
    if (!response.ok) { setMessage(text.unavailable); return }
    setData(await response.json() as PollResponse)
    setMessage(text.voted)
    trackEvent("poll_vote", { poll: pollId, option: selected, locale })
  }

  return (
    <section aria-label={heading} className="my-12 rounded-2xl border border-border bg-muted/25 p-6">
      <h2 className="text-xl font-semibold">{heading}</h2>
      {!data?.configured ? <p className="mt-4 text-sm text-muted-foreground">{text.unavailable}</p> : (
        <>
          <div className="mt-5 space-y-3">
            {data.options.map(option => (
              <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-3 text-sm">
                <input type="radio" name={`poll-${pollId}`} value={option.id} checked={selected === option.id} onChange={() => setSelected(option.id)} className="accent-brand" />
                <span className="min-w-0 flex-1">{option.label}</span>
                {data.total > 0 && <span className="text-xs text-muted-foreground">{Math.round((option.votes / data.total) * 100)}%</span>}
              </label>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => void vote()} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-contrast">{text.vote}</button>
            <span className="text-sm text-muted-foreground">{data.total} {text.total}</span>
            {message && <span role="status" className="text-sm text-muted-foreground">{message}</span>}
          </div>
        </>
      )}
    </section>
  )
}
