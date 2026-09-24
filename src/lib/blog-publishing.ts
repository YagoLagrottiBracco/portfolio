import { createHash } from "node:crypto"
import matter from "gray-matter"

import { createBlogIndex } from "@/lib/blog-content"

const locales = ["pt", "en", "es"] as const
type Locale = (typeof locales)[number]
const maxUploadBytes = 5 * 1024 * 1024
const imageTypes = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
} as const

export class PublishError extends Error {
  constructor(public readonly code: string, public readonly status: 400 | 413, message: string) {
    super(message)
  }
}

export interface ArticleInput {
  title: string
  slug: string
  excerpt: string
  date: string
  updatedAt?: string
  tags: string[]
  content: string
  draft?: boolean
}

export interface RemoteImageInput {
  kind: "remote"
  url: string
  alt: string
  width: number
  height: number
}

export interface UploadImageInput {
  kind: "upload"
  filename: string
  contentType: keyof typeof imageTypes
  base64: string
  alt: string
  width: number
  height: number
}

export interface PublishRequest {
  translationKey: string
  articles: Record<Locale, ArticleInput>
  image?: RemoteImageInput | UploadImageInput
  commitMessage?: string
}

export interface PreparedFile {
  path: string
  content: string | Uint8Array
  encoding: "utf8" | "base64"
}

export interface PreparedPublication {
  files: PreparedFile[]
  urls: string[]
  commitMessage: string
}

function fail(code: string, message: string, status: 400 | 413 = 400): never {
  throw new PublishError(code, status, message)
}

function record(value: unknown, name: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) fail("invalid_request", name + " must be an object")
  return value as Record<string, unknown>
}

function text(value: unknown, name: string): string {
  if (typeof value !== "string" || !value.trim()) fail("invalid_request", name + " is required")
  return value.trim()
}

function integer(value: unknown, name: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) fail("invalid_request", name + " must be a positive integer")
  return value
}

function article(value: unknown, locale: Locale): ArticleInput {
  const input = record(value, "articles." + locale)
  if (!Array.isArray(input.tags) || input.tags.length === 0 || !input.tags.every(tag => typeof tag === "string" && tag.trim())) {
    fail("invalid_request", "articles." + locale + ".tags must contain text")
  }
  if (input.draft !== undefined && typeof input.draft !== "boolean") fail("invalid_request", "articles." + locale + ".draft must be boolean")
  return {
    title: text(input.title, "articles." + locale + ".title"),
    slug: text(input.slug, "articles." + locale + ".slug"),
    excerpt: text(input.excerpt, "articles." + locale + ".excerpt"),
    date: text(input.date, "articles." + locale + ".date"),
    ...(input.updatedAt === undefined ? {} : { updatedAt: text(input.updatedAt, "articles." + locale + ".updatedAt") }),
    tags: input.tags.map(tag => (tag as string).trim()),
    content: text(input.content, "articles." + locale + ".content"),
    ...(input.draft === undefined ? {} : { draft: input.draft as boolean }),
  }
}

function image(value: unknown): RemoteImageInput | UploadImageInput | undefined {
  if (value === undefined) return undefined
  const input = record(value, "image")
  const kind = text(input.kind, "image.kind")
  const common = { alt: text(input.alt, "image.alt"), width: integer(input.width, "image.width"), height: integer(input.height, "image.height") }
  if (kind === "remote") {
    const url = text(input.url, "image.url")
    try {
      if (new URL(url).protocol !== "https:") fail("invalid_image", "image.url must use HTTPS")
    } catch (error) {
      if (error instanceof PublishError) throw error
      fail("invalid_image", "image.url must use HTTPS")
    }
    return { kind, url, ...common }
  }
  if (kind === "upload") {
    const contentType = text(input.contentType, "image.contentType")
    if (!(contentType in imageTypes)) fail("invalid_image", "image.contentType is unsupported")
    const filename = text(input.filename, "image.filename")
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(filename)) fail("invalid_image", "image.filename is unsafe")
    const base64 = text(input.base64, "image.base64")
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64) || base64.length % 4 !== 0) fail("invalid_image", "image.base64 is invalid")
    const bytes = Buffer.from(base64, "base64")
    if (!bytes.length || bytes.length > maxUploadBytes) fail("image_too_large", "image upload must be at most 5 MB", 413)
    return { kind, filename, contentType: contentType as keyof typeof imageTypes, base64, ...common }
  }
  fail("invalid_image", "image.kind must be remote or upload")
}

export function parsePublishRequest(input: unknown): PublishRequest {
  const body = record(input, "request")
  const articles = record(body.articles, "articles")
  const keys = Object.keys(articles).sort()
  if (keys.join(",") !== [...locales].sort().join(",")) fail("invalid_locales", "articles must include exactly pt, en, and es")
  return {
    translationKey: text(body.translationKey, "translationKey"),
    articles: { pt: article(articles.pt, "pt"), en: article(articles.en, "en"), es: article(articles.es, "es") },
    ...(body.image === undefined ? {} : { image: image(body.image) }),
    ...(body.commitMessage === undefined ? {} : { commitMessage: text(body.commitMessage, "commitMessage") }),
  }
}

export function preparePublication(request: PublishRequest): PreparedPublication {
  const imageData = request.image
  const upload = imageData?.kind === "upload" ? Buffer.from(imageData.base64, "base64") : undefined
  const imageFrontmatter = imageData
    ? imageData.kind === "remote"
      ? { url: imageData.url, alt: imageData.alt, width: imageData.width, height: imageData.height }
      : { src: "/blog/" + request.translationKey + "-" + createHash("sha256").update(upload!).digest("hex").slice(0, 12) + "." + imageTypes[imageData.contentType], alt: imageData.alt, width: imageData.width, height: imageData.height }
    : undefined
  const sources = locales.map(locale => {
    const item = request.articles[locale]
    const data = { title: item.title, slug: item.slug, translationKey: request.translationKey, excerpt: item.excerpt, date: item.date, tags: item.tags, locale, ...(item.updatedAt ? { updatedAt: item.updatedAt } : {}), ...(item.draft ? { draft: true } : {}), ...(imageFrontmatter ? { image: imageFrontmatter } : {}) }
    return { filename: item.slug + "." + locale + ".mdx", source: matter.stringify(item.content + "\n", data) }
  })
  createBlogIndex(sources, { now: new Date("2100-01-01T00:00:00Z") })
  const files: PreparedFile[] = sources.map((source, index) => ({ path: "src/content/blog/" + source.filename, content: source.source, encoding: "utf8" }))
  if (upload && imageData?.kind === "upload") {
    files.push({ path: "public" + imageFrontmatter!.src, content: upload, encoding: "base64" })
  }
  return { files, urls: locales.map(locale => "/blog/" + request.articles[locale].slug), commitMessage: request.commitMessage ?? "feat(blog): publish " + request.translationKey }
}