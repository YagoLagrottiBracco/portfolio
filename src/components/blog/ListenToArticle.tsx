"use client"

/**
 * @file ListenToArticle.tsx
 * @description "Listen to this article" with the browser's own speech
 * synthesis: no server, no cost, nothing leaves the device. It reads the body
 * block by block (code is skipped), highlights the block being read and lets
 * the reader pause and change speed. Hidden where speech synthesis is missing.
 * A recorded episode (src/data/podcast.ts) replaces it with an audio player.
 */
import React, { useEffect, useRef, useState } from "react"
import { Gauge, Headphones, Pause, Play, Square } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { localeTags, type Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const copy: Record<Locale, { listen: string; pause: string; resume: string; stop: string; speed: string }> = {
  pt: { listen: "Ouvir este artigo", pause: "Pausar", resume: "Continuar", stop: "Parar", speed: "Velocidade" },
  en: { listen: "Listen to this article", pause: "Pause", resume: "Resume", stop: "Stop", speed: "Speed" },
  es: { listen: "Escuchar este artículo", pause: "Pausar", resume: "Continuar", stop: "Detener", speed: "Velocidad" },
}

const SPEEDS = [1, 1.25, 1.5]
const READING = "speech-reading"

/** The blocks worth reading aloud, in order: headings, paragraphs, list items, quotes; never code. */
function readableBlocks(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>("h2, h3, p, li, blockquote")].filter(
    (element) => !element.closest("pre, table, figure") && !element.querySelector("p, li") && element.innerText.trim()
  )
}

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  const language = lang.split("-")[0]
  return voices.find((voice) => voice.lang === lang && voice.localService) ?? voices.find((voice) => voice.lang === lang) ?? voices.find((voice) => voice.lang.startsWith(language))
}

interface ListenToArticleProps {
  locale: Locale
  title: string
  /** Id of the element holding the article body. */
  targetId: string
  /** The article's translationKey, for the event. */
  article: string
}

export function ListenToArticle({ locale, title, targetId, article }: ListenToArticleProps) {
  const text = copy[locale]
  const [supported, setSupported] = useState(false)
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle")
  const [speed, setSpeed] = useState(1)
  const queue = useRef<{ blocks: HTMLElement[]; position: number }>({ blocks: [], position: 0 })
  // Read inside speech callbacks, which outlive the render that created them.
  const speedRef = useRef(1)

  // Known only in the browser; checked after hydration so both renders agree.
  useEffect(() => setSupported("speechSynthesis" in window && typeof SpeechSynthesisUtterance === "function"), [])

  // Never keep talking after the reader leaves the page.
  useEffect(() => () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel()
    document.querySelectorAll(`.${READING}`).forEach((element) => element.classList.remove(READING))
  }, [])

  function highlight(element: HTMLElement | undefined) {
    document.querySelectorAll(`.${READING}`).forEach((other) => other.classList.remove(READING))
    if (!element) return
    element.classList.add(READING)
    const { top, bottom } = element.getBoundingClientRect()
    if (top < 80 || bottom > window.innerHeight) element.scrollIntoView({ block: "center", behavior: "smooth" })
  }

  function speakFrom(position: number) {
    const { blocks } = queue.current
    queue.current.position = position
    if (position >= blocks.length) {
      highlight(undefined)
      setState("idle")
      return
    }
    const block = blocks[position]
    // Long text in one utterance stalls some engines; one block at a time does not.
    const utterance = new SpeechSynthesisUtterance(position === 0 ? `${title}. ${block.innerText}` : block.innerText)
    utterance.lang = localeTags[locale]
    utterance.voice = pickVoice(localeTags[locale]) ?? null
    utterance.rate = speedRef.current
    utterance.onstart = () => highlight(block)
    utterance.onend = () => {
      if (queue.current.position === position) speakFrom(position + 1)
    }
    window.speechSynthesis.speak(utterance)
  }

  function start() {
    const root = document.getElementById(targetId)
    if (!root) return
    window.speechSynthesis.cancel()
    queue.current = { blocks: readableBlocks(root), position: 0 }
    trackEvent("article_listen", { article })
    setState("playing")
    speakFrom(0)
  }

  function stop() {
    queue.current.position = Number.POSITIVE_INFINITY
    window.speechSynthesis.cancel()
    highlight(undefined)
    setState("idle")
  }

  function changeSpeed() {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length]
    setSpeed(next)
    speedRef.current = next
    // The rate of an utterance is fixed once spoken: restart the current block at the new speed.
    if (state === "playing") {
      const { position } = queue.current
      queue.current.position = -1
      window.speechSynthesis.cancel()
      speakFrom(position)
    }
  }

  if (!supported) return null
  const button = "inline-flex h-9 items-center gap-2 rounded-full border border-hairline px-3.5 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-surface"

  return (
    <div className="flex flex-wrap items-center gap-2 print:hidden">
      {state === "idle" ? (
        <button type="button" onClick={start} className={button}>
          <Headphones className="h-4 w-4" aria-hidden="true" />
          {text.listen}
        </button>
      ) : (
        <>
          <button
            type="button"
            onClick={() => {
              if (state === "playing") {
                window.speechSynthesis.pause()
                setState("paused")
              } else {
                window.speechSynthesis.resume()
                setState("playing")
              }
            }}
            className={button}
          >
            {state === "playing" ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
            {state === "playing" ? text.pause : text.resume}
          </button>
          <button type="button" onClick={stop} className={button}>
            <Square className="h-3.5 w-3.5" aria-hidden="true" />
            {text.stop}
          </button>
        </>
      )}
      <button type="button" onClick={changeSpeed} aria-label={`${text.speed}: ${speed}×`} className={cn(button, "px-3")}>
        <Gauge className="h-4 w-4" aria-hidden="true" />
        {speed}×
      </button>
    </div>
  )
}
