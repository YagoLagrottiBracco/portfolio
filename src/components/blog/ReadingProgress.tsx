"use client"

/**
 * @file ReadingProgress.tsx
 * @description A thin bar at the top of the window and a "minutes left" chip,
 * both following how far the reader is through the article body.
 *
 * Purely visual — hidden from assistive technology, which already exposes the
 * reading time in the header — and left out of print.
 */
import React, { useEffect, useState } from "react"

import type { Locale } from "@/lib/i18n"

const left: Record<Locale, (minutes: number) => string> = {
  pt: (minutes) => (minutes <= 1 ? "1 min restante" : `${minutes} min restantes`),
  en: (minutes) => `${Math.max(1, minutes)} min left`,
  es: (minutes) => (minutes <= 1 ? "1 min restante" : `${minutes} min restantes`),
}

interface ReadingProgressProps {
  /** Id of the element holding the article body. */
  targetId: string
  minutes: number
  locale: Locale
}

export function ReadingProgress({ targetId, minutes, locale }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return
    let frame = 0

    const measure = () => {
      frame = 0
      const { top, height } = target.getBoundingClientRect()
      // Done when the end of the body reaches the bottom of the window.
      const scrollable = height - window.innerHeight
      const read = scrollable > 0 ? -top / scrollable : top < 0 ? 1 : 0
      setProgress(Math.min(1, Math.max(0, read)))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [targetId])

  const remaining = Math.ceil(minutes * (1 - progress))
  const showChip = progress > 0.02 && progress < 0.98 && minutes > 1

  return (
    <div aria-hidden="true" className="print:hidden">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5">
        <div className="h-full origin-left bg-brand" style={{ transform: `scaleX(${progress})` }} />
      </div>
      {showChip && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-40 rounded-full border border-hairline bg-background/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
          {left[locale](remaining)}
        </div>
      )}
    </div>
  )
}
