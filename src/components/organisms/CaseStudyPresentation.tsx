"use client"

/**
 * @file CaseStudyPresentation.tsx
 * @description A case study as full-screen slides (`/projetos/[slug]/apresentar`),
 * for screen-sharing in an interview. Arrow keys, Page Up/Down, Space, Home/End
 * and swipes move between slides; F toggles full screen; the slide number lives
 * in the URL hash, so a reload stays put. Printing gives one slide per
 * landscape page — a PDF of the deck.
 */
import React, { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize } from "lucide-react"

import { ArchitectureFlow } from "@/components/molecules/ArchitectureFlow"
import type { Locale } from "@/lib/i18n"
import type { Slide } from "@/lib/presentation"
import { cn } from "@/lib/utils"

const copy: Record<Locale, { back: string; fullscreen: string; previous: string; next: string; of: string; hint: string; label: string }> = {
  pt: { back: "Voltar ao estudo de caso", fullscreen: "Tela cheia (F)", previous: "Slide anterior", next: "Próximo slide", of: "de", hint: "← → navegam · F tela cheia · Ctrl+P salva em PDF", label: "Apresentação" },
  en: { back: "Back to the case study", fullscreen: "Full screen (F)", previous: "Previous slide", next: "Next slide", of: "of", hint: "← → to move · F for full screen · Ctrl+P saves a PDF", label: "Presentation" },
  es: { back: "Volver al caso de estudio", fullscreen: "Pantalla completa (F)", previous: "Diapositiva anterior", next: "Siguiente diapositiva", of: "de", hint: "← → para moverte · F pantalla completa · Ctrl+P guarda en PDF", label: "Presentación" },
}

function SlideBody({ slide, locale }: { slide: Slide; locale: Locale }) {
  switch (slide.kind) {
    case "cover":
      return (
        <div className="flex flex-col items-start">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand sm:text-base">{slide.meta.join(" · ")}</p>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">{slide.title}</h1>
          <p className="mt-6 text-xl text-muted-foreground sm:text-3xl">{slide.subtitle}</p>
        </div>
      )
    case "text":
      return (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-brand sm:text-base">{slide.title}</h2>
          <p className="mt-6 text-xl leading-relaxed sm:text-3xl sm:leading-snug">{slide.body}</p>
        </div>
      )
    case "diagram":
      return (
        <div>
          <h2 className="mb-8 text-sm font-semibold uppercase tracking-widest text-brand sm:text-base">{slide.title}</h2>
          <ArchitectureFlow stages={slide.stages} locale={locale} label={slide.title} />
        </div>
      )
    case "points":
      return (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-brand sm:text-base">{slide.title}</h2>
          <ul className="mt-8 space-y-6">
            {slide.points.map((point) => (
              <li key={point.title}>
                <p className="text-xl font-semibold sm:text-2xl">{point.title}</p>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground sm:text-lg">{point.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )
    case "metrics":
      return (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-brand sm:text-base">{slide.title}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {slide.metrics.map((metric) => (
              <li key={metric} className="rounded-2xl border border-brand/30 bg-brand-soft p-6 text-xl font-semibold sm:text-2xl">{metric}</li>
            ))}
          </ul>
        </div>
      )
    case "stack":
      return (
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-brand sm:text-base">{slide.title}</h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {slide.items.map((item) => (
              <li key={item} className="rounded-full border border-hairline px-4 py-2 text-lg sm:text-xl">{item}</li>
            ))}
          </ul>
        </div>
      )
    case "contact":
      return (
        <div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">{slide.title}</h2>
          <ul className="mt-8 space-y-2 text-xl text-muted-foreground sm:text-2xl">
            {slide.lines.map((line) => <li key={line}>{line}</li>)}
          </ul>
        </div>
      )
  }
}

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen()
  else void document.documentElement.requestFullscreen?.()
}

interface CaseStudyPresentationProps {
  slides: Slide[]
  locale: Locale
  backHref: string
}

export function CaseStudyPresentation({ slides, locale, backHref }: CaseStudyPresentationProps) {
  const text = copy[locale]
  const [index, setIndex] = useState(0)
  const swipeStart = useRef<number | null>(null)
  const last = slides.length - 1

  const go = useCallback((target: number) => {
    const next = Math.min(last, Math.max(0, target))
    setIndex(next)
    window.history.replaceState(window.history.state, "", `#${next + 1}`)
  }, [last])

  // Follow the URL: on load (after hydration, so both renders agree) and when the hash is edited.
  useEffect(() => {
    function fromHash() {
      const slide = Number(window.location.hash.slice(1))
      if (Number.isInteger(slide) && slide >= 1) setIndex(Math.min(last, slide - 1))
    }
    fromHash()
    window.addEventListener("hashchange", fromHash)
    return () => window.removeEventListener("hashchange", fromHash)
  }, [last])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey) return
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(event.key)) go(index + 1)
      else if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) go(index - 1)
      else if (event.key === "Home") go(0)
      else if (event.key === "End") go(last)
      else if (event.key.toLowerCase() === "f") toggleFullscreen()
      else return
      event.preventDefault()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, index, last])

  const control = "inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline text-foreground transition-colors hover:bg-surface disabled:opacity-40"

  return (
    <div
      className="flex min-h-dvh flex-col bg-background text-foreground print:block print:min-h-0"
      onPointerDown={(event) => (swipeStart.current = event.clientX)}
      onPointerUp={(event) => {
        if (swipeStart.current === null) return
        const distance = event.clientX - swipeStart.current
        swipeStart.current = null
        if (Math.abs(distance) > 60) go(index + (distance < 0 ? 1 : -1))
      }}
    >
      {/* One landscape page per slide when printing. */}
      <style>{"@media print { @page { size: landscape; margin: 12mm } }"}</style>

      <header className="flex items-center justify-between gap-4 px-4 py-3 sm:px-8 print:hidden">
        <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {text.back}
        </Link>
        <div className="flex items-center gap-3">
          <p aria-live="polite" className="text-sm tabular-nums text-muted-foreground">{index + 1} {text.of} {slides.length}</p>
          <button type="button" onClick={toggleFullscreen} aria-label={text.fullscreen} title={text.fullscreen} className={control}>
            <Maximize className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="main" aria-roledescription="carousel" aria-label={text.label} className="flex flex-1 print:block">
        {slides.map((slide, position) => (
          <section
            key={position}
            aria-roledescription="slide"
            aria-label={`${position + 1} ${text.of} ${slides.length}`}
            className={cn(
              "mx-auto w-full max-w-5xl flex-1 flex-col justify-center px-6 py-10 sm:px-12",
              position === index ? "flex" : "hidden",
              "print:flex print:min-h-[calc(100vh-24mm)] print:break-after-page"
            )}
          >
            <SlideBody slide={slide} locale={locale} />
          </section>
        ))}
      </main>

      <footer className="px-4 pb-4 sm:px-8 print:hidden">
        <div className="flex items-center justify-between gap-4">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label={text.previous} className={control}>
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <p className="hidden text-xs text-muted-foreground sm:block">{text.hint}</p>
          <button type="button" onClick={() => go(index + 1)} disabled={index === last} aria-label={text.next} className={control}>
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div aria-hidden="true" className="mt-3 h-1 overflow-hidden rounded-full bg-surface">
          <div className="h-full bg-brand transition-[width]" style={{ width: `${((index + 1) / slides.length) * 100}%` }} />
        </div>
      </footer>
    </div>
  )
}
