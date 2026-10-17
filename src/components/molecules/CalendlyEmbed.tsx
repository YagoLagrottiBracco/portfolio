"use client"

/**
 * @file CalendlyEmbed.tsx
 * @description Calendly's scheduling page inside the site, so a booking —
 * not just a click on a link — is counted. Nothing from Calendly loads until
 * the visitor asks for it. Then its widget script reports
 * `calendly.date_and_time_selected` and `calendly.event_scheduled` to this
 * window (developer.calendly.com/api-docs/overview/embedding/notifying-the-parent-window),
 * which become the `meeting_slot_selected` and `meeting_booked` events, and
 * the visit's UTM source travels with the booking into Calendly.
 */
import React, { useEffect, useRef, useState } from "react"
import { CalendarCheck, ExternalLink } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { attributionProperties, browserStorages } from "@/lib/attribution"
import type { Locale } from "@/lib/i18n"

export const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js"
const CALENDLY_ORIGIN = "https://calendly.com"

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(options: { url: string; parentElement: HTMLElement; utm?: Record<string, string | undefined> }): void
    }
  }
}

let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = CALENDLY_SCRIPT
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      reject(new Error("Calendly did not load"))
    }
    document.head.append(script)
  })
  return scriptPromise
}

const copy: Record<Locale, { title: string; text: string; open: string; external: string; failed: string }> = {
  pt: {
    title: "Escolha um horário aqui mesmo",
    text: "Uma conversa de 30 minutos. A agenda do Calendly só carrega quando você pedir.",
    open: "Ver horários disponíveis",
    external: "Abrir no Calendly",
    failed: "A agenda não carregou. Abra direto no Calendly:",
  },
  en: {
    title: "Pick a time right here",
    text: "A 30-minute conversation. Calendly's schedule only loads when you ask for it.",
    open: "See available times",
    external: "Open in Calendly",
    failed: "The schedule did not load. Open it in Calendly:",
  },
  es: {
    title: "Elige un horario aquí mismo",
    text: "Una conversación de 30 minutos. La agenda de Calendly solo carga cuando la pides.",
    open: "Ver horarios disponibles",
    external: "Abrir en Calendly",
    failed: "La agenda no cargó. Ábrela directamente en Calendly:",
  },
}

interface CalendlyEmbedProps {
  url: string
  locale: Locale
  /** Recorded with the booking events, e.g. `work-with-me`. */
  placement: string
}

export function CalendlyEmbed({ url, locale, placement }: CalendlyEmbedProps) {
  const text = copy[locale]
  const [state, setState] = useState<"idle" | "loading" | "open" | "failed">("idle")
  const container = useRef<HTMLDivElement>(null)

  const active = state === "loading" || state === "open"

  // Listen for as long as the widget is up: the booking comes minutes later.
  useEffect(() => {
    if (!active) return
    function onMessage(event: MessageEvent) {
      if (event.origin !== CALENDLY_ORIGIN || typeof event.data?.event !== "string") return
      if (event.data.event === "calendly.date_and_time_selected") trackEvent("meeting_slot_selected", { placement })
      if (event.data.event === "calendly.event_scheduled") trackEvent("meeting_booked", { placement })
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [active, placement])

  useEffect(() => {
    if (state !== "loading") return
    let cancelled = false
    const { local, session } = browserStorages()
    const visit = attributionProperties(local, session)
    loadScript()
      .then(() => {
        if (cancelled) return
        if (!container.current || !window.Calendly) throw new Error("Calendly is not available")
        window.Calendly.initInlineWidget({
          url: `${url}?hide_gdpr_banner=1`,
          parentElement: container.current,
          // Where the visitor came from, stored by Calendly with the booking.
          utm: { utmSource: visit.source ?? "lagrotti.dev", utmMedium: visit.medium ?? "website", utmCampaign: visit.campaign ?? placement, utmContent: visit.content },
        })
        setState("open")
      })
      .catch(() => {
        if (!cancelled) setState("failed")
      })
    return () => {
      cancelled = true
    }
  }, [state, url, placement])

  return (
    <section id="agendar" aria-labelledby="calendly-title" className="scroll-mt-24 rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <CalendarCheck className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <div>
          <h2 id="calendly-title" className="text-2xl font-bold tracking-tight">{text.title}</h2>
          <p className="mt-1.5 text-muted-foreground">{text.text}</p>
        </div>
      </div>

      {state === "idle" && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => {
              trackEvent("contact_click", { channel: "calendly-embed", placement })
              setState("loading")
            }}
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {text.open}
          </button>
          <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            {text.external}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      )}

      {state === "failed" && (
        <p role="status" className="mt-6 text-sm">
          {text.failed}{" "}
          <a href={url} target="_blank" rel="noopener noreferrer" className="font-medium text-brand underline underline-offset-4">{url.replace(/^https:\/\//, "")}</a>
        </p>
      )}

      {/* Calendly sizes its own iframe inside; 700px fits the date and time steps. */}
      <div ref={container} aria-busy={state === "loading"} className={state === "loading" || state === "open" ? "mt-6 h-[700px] min-w-[320px] overflow-hidden rounded-xl bg-background" : "hidden"} />
    </section>
  )
}
