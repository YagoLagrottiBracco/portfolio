import { ImageResponse } from "next/og"

import { personalData } from "@/data/personal"

export const alt = `${personalData.name} — Engenheiro de Software Sênior — Fullstack, Arquitetura e DevOps`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * The card that shows up when the site is shared on LinkedIn, WhatsApp or X.
 * Generated at build time — previously there was none, so shared links rendered
 * as a bare URL.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.35), transparent)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#60a5fa",
          }}
        >
          {personalData.socialLinks.domain}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -2,
          }}
        >
          {personalData.name}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 38,
            lineHeight: 1.3,
            color: "#a1a1aa",
          }}
        >
          Engenheiro de Software Sênior
        </div>

        <div style={{ display: "flex", marginTop: 56, gap: 16, flexWrap: "wrap" }}>
          {["Fullstack", "Arquitetura", "DevOps"].map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                padding: "10px 24px",
                borderRadius: 999,
                border: "1px solid rgba(96,165,250,0.4)",
                background: "rgba(96,165,250,0.12)",
                fontSize: 26,
                color: "#93c5fd",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  )
}
