import { createHash } from "node:crypto"
import sharp, { type Metadata } from "sharp"
import { unified } from "unified"
import remarkParse from "remark-parse"

import type { PreparedFile, UploadImageInput } from "@/lib/blog-publishing"
import type { Locale } from "@/lib/i18n"

export interface StagedAsset {
  id: string
  filename: string
  contentType: string
  base64: string
  alt: string
  width: number
  height: number
}

const extensions: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif" }
const maxBytes = 5 * 1024 * 1024
type MarkdownNode = { type: string; url?: string; alt?: string; children?: MarkdownNode[]; position?: { start: { offset?: number }; end: { offset?: number } } }

function walk(node: MarkdownNode, visit: (node: MarkdownNode) => void): void {
  visit(node)
  for (const child of node.children ?? []) walk(child, visit)
}

function safeUrl(url: string, image: boolean): boolean {
  const value = url.trim()
  if (!value || /[\\\x00-\x1f]/.test(value) || value.startsWith("//")) return false
  if (value.startsWith("/")) return !value.includes("..")
  if (!image && value.startsWith("#")) return true
  try {
    const parsed = new URL(value)
    return parsed.protocol === "https:" || (!image && (parsed.protocol === "http:" || parsed.protocol === "mailto:"))
  } catch { return false }
}

export function validateBlogMarkdown(content: string): void {
  const root = unified().use(remarkParse).parse(content) as MarkdownNode
  walk(root, node => {
    if (node.type === "html") throw new Error("Raw HTML is not allowed in Markdown")
    if (node.type === "image" && !node.alt?.trim()) throw new Error("Image alt text is required")
    if ((node.type === "link" || node.type === "image" || node.type === "definition") && typeof node.url === "string" &&
      !safeUrl(node.url, node.type === "image") && !(node.type === "image" && /^blog-asset:\/\/[a-zA-Z0-9_-]+$/.test(node.url))) {
      throw new Error("Unsafe URL or protocol in Markdown")
    }
  })
}

export async function validateUploadImage(asset: Pick<StagedAsset, "contentType" | "base64" | "width" | "height">): Promise<Buffer> {
  if (!extensions[asset.contentType]) throw new Error("Unsupported image type")
  if (asset.base64.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(asset.base64)) throw new Error("Invalid image base64")
  const bytes = Buffer.from(asset.base64, "base64")
  if (!bytes.length || bytes.length > maxBytes) throw new Error("Image size must be at most 5 MB")
  let metadata: Metadata
  try { metadata = await sharp(bytes, { failOn: "error" }).metadata() }
  catch { throw new Error("Invalid image bytes") }
  if (metadata.mediaType !== asset.contentType) throw new Error("Image type does not match bytes")
  if (metadata.width !== asset.width || metadata.height !== asset.height || !asset.width || !asset.height) throw new Error("Image dimensions do not match bytes")
  if (metadata.width > 10000 || metadata.height > 10000) throw new Error("Image dimensions are too large")
  return bytes
}

export async function prepareBlogAssets(assets: StagedAsset[], markdownByLocale: Record<Locale, string>, translationKey: string): Promise<{ files: PreparedFile[]; markdownByLocale: Record<Locale, string> }> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(translationKey)) throw new Error("Invalid translation key")
  const resolved = new Map<string, string>()
  const files: PreparedFile[] = []
  for (const asset of assets) {
    if (!/^[a-zA-Z0-9_-]+$/.test(asset.id) || resolved.has(asset.id)) throw new Error("Duplicate or invalid asset ID")
    if (!asset.alt?.trim()) throw new Error("Image alt text is required")
    const bytes = await validateUploadImage(asset)
    const path = `/blog/${translationKey}-${createHash("sha256").update(bytes).digest("hex").slice(0, 12)}.${extensions[asset.contentType]}`
    resolved.set(asset.id, path)
    files.push({ path: `public${path}`, content: bytes, encoding: "base64" })
  }
  const output = {} as Record<Locale, string>
  const used = new Set<string>()
  for (const locale of ["pt", "en", "es"] as const) {
    const source = markdownByLocale[locale]
    validateBlogMarkdown(source)
    const root = unified().use(remarkParse).parse(source) as MarkdownNode
    const replacements: Array<{ start: number; end: number; value: string }> = []
    walk(root, node => {
      if (node.type !== "image" || !node.url?.startsWith("blog-asset://")) return
      const id = node.url.slice("blog-asset://".length)
      const path = resolved.get(id)
      if (!path) throw new Error(`Missing staged asset: ${id}`)
      used.add(id)
      const start = node.position?.start.offset
      const end = node.position?.end.offset
      if (start === undefined || end === undefined) throw new Error("Image position is missing")
      const raw = source.slice(start, end)
      const relative = raw.indexOf(node.url)
      if (relative < 0) throw new Error("Cannot resolve staged asset")
      replacements.push({ start: start + relative, end: start + relative + node.url.length, value: path })
    })
    output[locale] = replacements.sort((a, b) => b.start - a.start).reduce((text, item) => text.slice(0, item.start) + item.value + text.slice(item.end), source)
  }
  if (used.size !== resolved.size) throw new Error("Unused staged asset")
  return { files, markdownByLocale: output }
}

export async function validateCoverUpload(image: UploadImageInput): Promise<void> {
  await validateUploadImage(image)
}
