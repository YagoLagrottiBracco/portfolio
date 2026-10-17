/**
 * The 1200×630 share card for pages that have no image of their own: case
 * studies, the standalone pages and the technology pages. Same look as the
 * site-wide card in `src/app/opengraph-image.tsx`: dark ground, a blue glow,
 * the domain as eyebrow.
 */
import { readFileSync } from "node:fs"
import { extname, join } from "node:path"
import { ImageResponse } from "next/og"
import React from "react"

import { personalData } from "@/data/personal"

export const OG_SIZE = { width: 1200, height: 630 }

export interface OgCard {
  /** Small line above the title, e.g. "Estudo de caso · Sistemas & Arquitetura". */
  eyebrow: string
  title: string
  subtitle?: string
  /** One number or claim worth reading at thumbnail size. */
  highlight?: string
  /** A local image under `public/`, shown on the right. */
  image?: string
}

const MIME: Record<string, string> = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" }

/** A local public image as a data URL, or `undefined` for remote or unsupported ones. */
function localImage(path: string | undefined): string | undefined {
  if (!path?.startsWith("/") || path.startsWith("//") || path.includes("..")) return undefined
  const mime = MIME[extname(path).toLowerCase()]
  if (!mime) return undefined
  try {
    return `data:${mime};base64,${readFileSync(join(process.cwd(), "public", path)).toString("base64")}`
  } catch {
    return undefined
  }
}

/** At most `max` characters, cut at a word boundary. */
function clamp(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(" ") > max / 2 ? cut.lastIndexOf(" ") : cut.length).replace(/[\s,;:.—-]+$/, "")}…`
}

/** Long titles step down so three lines still fit beside the image. */
function titleSize(title: string, withImage: boolean): number {
  const base = withImage ? 58 : 68
  if (title.length > 48) return base - 14
  if (title.length > 30) return base - 6
  return base
}

export function renderOgCard(card: OgCard): ImageResponse {
  const image = localImage(card.image)
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: "64px 72px",
          background: "#0a0a0a",
          backgroundImage: "radial-gradient(ellipse 80% 55% at 30% -10%, rgba(59,130,246,0.35), transparent)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: image ? 48 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: "#60a5fa" }}>
              {clamp(card.eyebrow, 60)}
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: titleSize(card.title, Boolean(image)), fontWeight: 700, lineHeight: 1.12, letterSpacing: -1.5 }}>
              {clamp(card.title, 70)}
            </div>
            {card.subtitle && (
              <div style={{ display: "flex", marginTop: 20, fontSize: 28, lineHeight: 1.3, color: "#a1a1aa" }}>{clamp(card.subtitle, 110)}</div>
            )}
            {card.highlight && (
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  marginTop: 28,
                  padding: "10px 22px",
                  borderRadius: 999,
                  border: "1px solid rgba(96,165,250,0.4)",
                  background: "rgba(96,165,250,0.12)",
                  fontSize: 26,
                  color: "#93c5fd",
                }}
              >
                {clamp(card.highlight, 50)}
              </div>
            )}
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "#71717a" }}>
            {personalData.name} · {personalData.socialLinks.domain}
          </div>
        </div>
        {image && (
          <div style={{ display: "flex", alignItems: "center", width: 440 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- rendered by Satori, not the browser */}
            <img src={image} alt="" width={440} height={248} style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.12)", objectFit: "cover" }} />
          </div>
        )}
      </div>
    ),
    OG_SIZE
  )
}
