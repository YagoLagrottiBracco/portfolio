"use client"

/**
 * @file AskPortfolio.tsx
 * @description The question box of "Ask my portfolio". Sends one question to
 * `/api/ask` and renders the NDJSON answer as it streams: text blocks with
 * numbered citation links, then the list of sources (pages of this site).
 */
import React, { useRef, useState, type FormEvent } from "react"
import { ArrowUp, Sparkles } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import type { AskEvent } from "@/lib/ask/request"
import type { Locale } from "@/lib/i18n"

type Source = { n: number; title: string; url: string }
type Segment = { text: string; cites: number[] }
type Status = "idle" | "streaming" | "done" | "refused" | "limited" | "busy" | "unavailable" | "invalid"

const copy: Record<Locale, {
  label: string; placeholder: string; ask: string; suggestions: string[]; sources: string; thinking: string; disclaimer: string
  status: Record<Exclude<Status, "idle" | "streaming" | "done">, string>
}> = {
  pt: {
    label: "Sua pergunta", placeholder: "Ex.: Ele já usou Kafka em produção?", ask: "Perguntar",
    suggestions: ["Ele já usou Kafka em produção?", "Quais projetos de IA ele construiu?", "Ele já liderou times?", "Como ele resolve multi-tenancy?"],
    sources: "Fontes", thinking: "Lendo o portfólio…",
    disclaimer: "Respostas geradas por IA (Claude) a partir do conteúdo deste site. Confirme o que for decisivo comigo.",
    status: {
      refused: "Não consigo responder essa pergunta. Tente outra sobre o trabalho do Yago.",
      limited: "Muitas perguntas em pouco tempo. Tente de novo mais tarde.",
      busy: "O assistente está ocupado agora. Tente de novo em instantes.",
      unavailable: "O assistente não está disponível agora.",
      invalid: "Escreva uma pergunta de 3 a 300 caracteres.",
    },
  },
  en: {
    label: "Your question", placeholder: "E.g. Has he used Kafka in production?", ask: "Ask",
    suggestions: ["Has he used Kafka in production?", "Which AI projects has he built?", "Has he led teams?", "How does he handle multi-tenancy?"],
    sources: "Sources", thinking: "Reading the portfolio…",
    disclaimer: "AI-generated answers (Claude) from this site's content. Confirm anything decisive with me.",
    status: {
      refused: "I cannot answer that one. Try another question about Yago's work.",
      limited: "Too many questions in a short time. Please try again later.",
      busy: "The assistant is busy right now. Please try again in a moment.",
      unavailable: "The assistant is not available right now.",
      invalid: "Write a question of 3 to 300 characters.",
    },
  },
  es: {
    label: "Tu pregunta", placeholder: "Ej.: ¿Ya usó Kafka en producción?", ask: "Preguntar",
    suggestions: ["¿Ya usó Kafka en producción?", "¿Qué proyectos de IA construyó?", "¿Ha liderado equipos?", "¿Cómo resuelve el multi-tenancy?"],
    sources: "Fuentes", thinking: "Leyendo el portafolio…",
    disclaimer: "Respuestas generadas por IA (Claude) a partir del contenido de este sitio. Confirma conmigo lo que sea decisivo.",
    status: {
      refused: "No puedo responder esa pregunta. Prueba con otra sobre el trabajo de Yago.",
      limited: "Demasiadas preguntas en poco tiempo. Inténtalo más tarde.",
      busy: "El asistente está ocupado ahora. Inténtalo de nuevo en un momento.",
      unavailable: "El asistente no está disponible ahora.",
      invalid: "Escribe una pregunta de 3 a 300 caracteres.",
    },
  },
}

export function AskPortfolio({ locale }: { locale: Locale }) {
  const text = copy[locale]
  const [question, setQuestion] = useState("")
  const [segments, setSegments] = useState<Segment[]>([])
  const [sources, setSources] = useState<Source[]>([])
  const [status, setStatus] = useState<Status>("idle")
  const controller = useRef<AbortController | null>(null)

  async function ask(value: string) {
    const trimmed = value.trim()
    if (trimmed.length < 3 || trimmed.length > 300) {
      setStatus("invalid")
      return
    }
    controller.current?.abort()
    const abort = new AbortController()
    controller.current = abort
    setSegments([])
    setSources([])
    setStatus("streaming")

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: trimmed, locale }),
        signal: abort.signal,
      })
      if (!response.ok || !response.body) {
        setStatus(response.status === 429 ? "limited" : response.status === 400 ? "invalid" : "unavailable")
        return
      }
      const blocks = new Map<number, Segment>()
      const render = () => setSegments([...blocks.entries()].sort((a, b) => a[0] - b[0]).map(([, segment]) => ({ ...segment })))
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
      let buffer = ""
      for (;;) {
        const { value: chunk, done } = await reader.read()
        if (done) break
        buffer += chunk
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""
        for (const line of lines) {
          if (!line.trim()) continue
          const event = JSON.parse(line) as AskEvent
          if (event.t === "text") {
            const segment = blocks.get(event.block) ?? { text: "", cites: [] }
            segment.text += event.text
            blocks.set(event.block, segment)
            render()
          } else if (event.t === "cite") {
            const segment = blocks.get(event.block) ?? { text: "", cites: [] }
            if (!segment.cites.includes(event.source)) segment.cites.push(event.source)
            blocks.set(event.block, segment)
            render()
          } else if (event.t === "done") {
            setSources(event.sources)
            setStatus("done")
            trackEvent("portfolio_ask", { locale, sources: String(event.sources.length) })
          } else if (event.t === "refusal") {
            // The whole fallback chain declined: nothing streamed so far stands.
            setSegments([])
            setStatus("refused")
          } else if (event.t === "error") {
            setStatus(event.code)
          }
        }
      }
    } catch {
      if (!abort.signal.aborted) setStatus("unavailable")
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void ask(question)
  }

  const message = status in text.status ? text.status[status as keyof typeof text.status] : null

  return (
    <div>
      <form onSubmit={submit} className="relative">
        <label htmlFor="ask-question" className="sr-only">{text.label}</label>
        <textarea
          id="ask-question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              void ask(question)
            }
          }}
          rows={2}
          maxLength={300}
          placeholder={text.placeholder}
          className="w-full resize-none rounded-2xl border border-input bg-background py-4 pl-4 pr-16 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-brand"
        />
        <button
          type="submit"
          disabled={status === "streaming"}
          aria-label={text.ask}
          className="absolute bottom-3 right-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </button>
      </form>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label={text.label}>
        {text.suggestions.map((suggestion) => (
          <li key={suggestion}>
            <button
              type="button"
              onClick={() => {
                setQuestion(suggestion)
                void ask(suggestion)
              }}
              className="rounded-full border border-hairline px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-brand/40 hover:text-foreground"
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>

      <section aria-live="polite" aria-busy={status === "streaming"} className="mt-8 min-h-16">
        {status === "streaming" && segments.length === 0 && (
          <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 animate-pulse text-brand motion-reduce:animate-none" aria-hidden="true" />
            {text.thinking}
          </p>
        )}
        {segments.length > 0 && (
          <p className="text-lg leading-relaxed">
            {segments.map((segment, index) => (
              <React.Fragment key={index}>
                {segment.text}
                {segment.cites.map((n) => {
                  const source = sources.find((item) => item.n === n)
                  return source ? (
                    <a key={n} href={source.url} title={source.title} className="ml-0.5 align-super text-xs font-semibold text-brand no-underline hover:underline">[{n}]</a>
                  ) : (
                    <sup key={n} className="ml-0.5 text-xs font-semibold text-brand">[{n}]</sup>
                  )
                })}
              </React.Fragment>
            ))}
          </p>
        )}
        {message && <p role="status" className="text-sm font-medium text-foreground">{message}</p>}
        {sources.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{text.sources}</h2>
            <ol className="mt-2 space-y-1.5 text-sm">
              {sources.map((source) => (
                <li key={source.n}>
                  <span className="mr-1.5 font-semibold text-brand">[{source.n}]</span>
                  <a href={source.url} className="underline underline-offset-4 hover:text-brand">{source.title}</a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      <p className="mt-8 text-xs text-muted-foreground">{text.disclaimer}</p>
    </div>
  )
}
