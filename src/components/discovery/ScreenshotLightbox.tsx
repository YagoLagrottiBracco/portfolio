"use client"

import { useState } from "react"

export interface Screenshot { src: string; alt: string; width: number; height: number; label: string }

export function ScreenshotLightbox({ screenshots }: { screenshots: Screenshot[] }) {
  const [open, setOpen] = useState<string | null>(null)
  const selected = screenshots.find(item => item.src === open)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {screenshots.map(item => (
          <button key={item.src} type="button" onClick={() => setOpen(item.src)} className="group overflow-hidden rounded-xl border border-border bg-background text-left">
            {/* eslint-disable-next-line @next/next/no-img-element -- the source may be a remote GitHub cover */}
            <img src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" className="aspect-video w-full object-cover transition-transform group-hover:scale-[1.02]" />
            <span className="block p-3 text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      {selected && (
        <div role="dialog" aria-modal="true" aria-label={selected.alt} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-4" onClick={() => setOpen(null)}>
          <figure className="max-h-full max-w-6xl overflow-auto rounded-xl bg-background p-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- the source may be a remote GitHub cover */}
            <img src={selected.src} alt={selected.alt} width={selected.width} height={selected.height} className="h-auto max-h-[80vh] w-full object-contain" />
            <figcaption className="p-3 text-sm text-muted-foreground">{selected.label}</figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
