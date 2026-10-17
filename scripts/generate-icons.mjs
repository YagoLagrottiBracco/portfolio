/**
 * Renders the PNG icons the web app manifest and iOS need from the same
 * design as `public/ylb-icon.svg`. Run by hand after changing the mark:
 *
 *   node scripts/generate-icons.mjs
 *
 * The SVG names its fonts, and librsvg renders with whatever fontconfig finds,
 * so check the output after running it on another machine.
 */
import { mkdirSync } from "node:fs"
import sharp from "sharp"

const FONT = "'Plus Jakarta Sans', Inter, 'Noto Sans', 'Segoe UI', sans-serif"

/**
 * `rounded`: the regular icon, with the corners of the SVG.
 * `fullBleed`: maskable and Apple icons, which the system crops itself, so the
 * gradient fills the square and the letters stay inside the central safe zone.
 */
function svg({ size, fullBleed }) {
  const fontSize = fullBleed ? 92 : 122
  return `<svg width="${size}" height="${size}" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="40" y1="32" x2="216" y2="224" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#2563EB"/>
      <stop offset="1" stop-color="#9333EA"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="${fullBleed ? 0 : 64}" fill="url(#g)"/>
  <text x="128" y="${fullBleed ? 131 : 134}" fill="white" font-family="${FONT}" font-weight="700" font-size="${fontSize}" letter-spacing="${fullBleed ? -4 : -6}" text-anchor="middle" dominant-baseline="central">YLB</text>
</svg>`
}

const icons = [
  { file: "public/icons/icon-192.png", size: 192, fullBleed: false },
  { file: "public/icons/icon-512.png", size: 512, fullBleed: false },
  { file: "public/icons/icon-maskable-512.png", size: 512, fullBleed: true },
  { file: "public/apple-touch-icon.png", size: 180, fullBleed: true },
  // Podcast apps ask for a square cover of at least 1400 px (src/lib/podcast.ts).
  { file: "public/podcast-cover.png", size: 1400, fullBleed: true },
]

mkdirSync("public/icons", { recursive: true })
for (const icon of icons) {
  await sharp(Buffer.from(svg(icon))).png({ compressionLevel: 9 }).toFile(icon.file)
  console.log(icon.file)
}
