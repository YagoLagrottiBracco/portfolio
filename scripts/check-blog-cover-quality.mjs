import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { join, resolve } from "node:path"
import matter from "gray-matter"
import sharp from "sharp"

const root = process.cwd()
const postDir = join(root, "src/content/blog")
const base = process.env.GITHUB_BASE_REF ? `origin/${process.env.GITHUB_BASE_REF}` : "HEAD^"
const changed = new Set(execFileSync("git", ["diff", "--name-only", base, "HEAD"], { cwd: root, encoding: "utf8" }).trim().split("\n").filter(Boolean))
const assetChanged = [...changed].some(path => path.startsWith("public/blog/"))
const affected = readdirSync(postDir).filter(filename => filename.endsWith(".mdx")).map(filename => {
  const path = `src/content/blog/${filename}`
  const { data } = matter(readFileSync(join(postDir, filename), "utf8"))
  return { path, data }
}).filter(({path, data}) => changed.has(path) || (assetChanged && typeof data.image?.src === "string" && changed.has(`public${data.image.src}`)))

if (affected.length === 0) {
  console.log("Blog cover QA: no changed articles or referenced local covers.")
  process.exit(0)
}

const checked = new Set()
const problems = []
const error = (file, reason) => problems.push(`${file}: ${reason}`)

for (const {path, data} of affected) {
  const image = data.image
  if (!image || typeof image !== "object") { error(path, "missing cover image"); continue }
  if (typeof image.alt !== "string" || image.alt.trim().length < 12) error(path, "descriptive alt text required")
  if (!Number.isInteger(image.width) || !Number.isInteger(image.height)) error(path, "image dimensions must be positive integers")
  const src = image.src ?? image.url
  if (typeof src !== "string" || !src) { error(path, "missing image URL or path"); continue }
  if (src.startsWith("https://")) continue // Remote artwork requires editorial visual review before publish.
  if (!/^\/blog\/[a-zA-Z0-9._-]+\.(?:png|jpg|jpeg|webp|avif)$/.test(src)) { error(path, "local cover needs an approved /blog/ image path"); continue }
  if (checked.has(src)) continue
  checked.add(src)
  const full = resolve(root, `public${src}`)
  if (!full.startsWith(resolve(root, "public/blog") + "/")) { error(path, "cover path escapes public/blog"); continue }
  if (!existsSync(full)) { error(path, `cover does not exist: ${src}`); continue }
  if (statSync(full).size > 5 * 1024 * 1024) { error(path, "cover exceeds 5 MB"); continue }
  try {
    const info = await sharp(full).metadata()
    if (info.width !== image.width || info.height !== image.height) error(path, "declared cover dimensions do not match asset")
    if (info.width < 1000 || info.height < 500) error(path, "cover is too small for a feature image")
    const aspect = info.width / info.height
    if (aspect < 1.7 || aspect > 2.1) error(path, "cover aspect ratio must be approximately 1200:630")
    const { data: pixels, info: small } = await sharp(full).resize(240, 126, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
    const hist = new Map()
    let edges = 0, totalEdges = 0
    const stride = small.channels
    for (let y = 0; y < small.height; y++) for (let x = 0; x < small.width; x++) {
      const i = (y * small.width + x) * stride
      const r = pixels[i], g = pixels[i+1], b = pixels[i+2]
      const bucket = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5)
      hist.set(bucket, (hist.get(bucket) ?? 0) + 1)
      if (x > 0) {
        const j = i - stride
        const d = Math.abs(.2126 * (r-pixels[j]) + .7152 * (g-pixels[j+1]) + .0722 * (b-pixels[j+2]))
        if (d > 22) edges++
        totalEdges++
      }
    }
    const dominant = Math.max(...hist.values()) / (small.width * small.height)
    const edgeDensity = edges / totalEdges
    if (hist.size < 8 || dominant > .90 || edgeDensity < .015) {
      error(path, `cover looks visually empty (color groups=${hist.size}, largest group=${(dominant*100).toFixed(1)}%, edge density=${(edgeDensity*100).toFixed(1)}%). Regenerate and inspect actual rendered image.`)
    }
    console.log(`Cover QA: ${src}: ${info.width}x${info.height}, ${hist.size} color groups, ${(edgeDensity*100).toFixed(1)}% edges`)
  } catch (e) { error(path, `could not decode cover: ${e.message}`) }
}
if (problems.length) {
  console.error(`Blog cover QA FAILED:\n${problems.map(msg => " - " + msg).join("\n")}`)
  process.exit(1)
}
console.log(`Blog cover QA OK: checked ${affected.length} affected article(s) and ${checked.size} distinct local cover(s).`)
