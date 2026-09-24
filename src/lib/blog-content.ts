import matter from "gray-matter"

import { isLocale, type Locale } from "@/lib/i18n"

export interface BlogImage {
  src: string
  alt: string
  width: number
  height: number
}

export interface BlogPost {
  translationKey: string
  title: string
  slug: string
  excerpt: string
  date: string
  updatedAt?: string
  tags: string[]
  locale: Locale
  content: string
  url: string
  image?: BlogImage
  readingMinutes: number
}

interface SourceFile { filename: string; source: string }
interface IndexOptions { now?: Date }

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const datePattern = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/

function fail(filename: string, message: string): never {
  throw new Error(`Invalid blog post ${filename}: ${message}`)
}

function dateValue(value: unknown, filename: string, field: string): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10)
  if (typeof value !== "string" || !datePattern.test(value) || Number.isNaN(Date.parse(value))) {
    fail(filename, `${field} must be an ISO date or timestamp with timezone`)
  }
  return value
}

function stringValue(value: unknown, filename: string, field: string): string {
  if (typeof value !== "string" || !value.trim()) fail(filename, `${field} is required`)
  return value.trim()
}

function parsePost({ filename, source }: SourceFile): BlogPost & { draft: boolean } {
  const parsed = matter(source)
  const data = parsed.data as Record<string, unknown>
  const slug = stringValue(data.slug, filename, "slug")
  if (!slugPattern.test(slug)) fail(filename, "slug must be lowercase kebab-case")
  const locale = data.locale
  if (!isLocale(locale)) fail(filename, "locale must be pt, en, or es")
  const tags = data.tags
  if (!Array.isArray(tags) || tags.length === 0 || !tags.every(tag => typeof tag === "string" && tag.trim())) {
    fail(filename, "tags must contain at least one string")
  }
  const content = parsed.content.trim()
  if (!content) fail(filename, "content is required")
  if (/^#(?!#)/m.test(content)) fail(filename, "do not use an H1 in the body; title supplies it")
  if (!/^##\s+\S/m.test(content)) fail(filename, "content must start its structure with an H2")
  let image: BlogImage | undefined
  if (data.image !== undefined) {
    const value = data.image as Record<string, unknown>
    const src = value?.src; const alt = value?.alt; const width = value?.width; const height = value?.height
    if (typeof src !== "string" || !src.startsWith("/") || src.includes("..") || typeof alt !== "string" || !alt.trim() ||
      typeof width !== "number" || !Number.isInteger(width) || width <= 0 || typeof height !== "number" || !Number.isInteger(height) || height <= 0) {
      fail(filename, "image requires safe local src, alt, width, and height")
    }
    image = { src, alt: alt.trim(), width, height }
  }
  const words = content.replace(/[`*_#[\]()]/g, " ").trim().split(/\s+/).filter(Boolean).length
  return {
    translationKey: stringValue(data.translationKey, filename, "translationKey"),
    title: stringValue(data.title, filename, "title"),
    slug,
    excerpt: stringValue(data.excerpt, filename, "excerpt"),
    date: dateValue(data.date, filename, "date"),
    updatedAt: data.updatedAt === undefined ? undefined : dateValue(data.updatedAt, filename, "updatedAt"),
    tags: tags.map(tag => (tag as string).trim()), locale, content, url: `/blog/${slug}`, image,
    readingMinutes: Math.max(1, Math.ceil(words / 220)), draft: data.draft === true,
  }
}

export function createBlogIndex(sources: SourceFile[], options: IndexOptions = {}) {
  const now = options.now ?? new Date()
  const all = sources.map(parsePost)
  const seenSlugs = new Set<string>()
  const seenTranslations = new Set<string>()
  for (const post of all) {
    if (seenSlugs.has(post.slug)) throw new Error(`Duplicate blog slug: ${post.slug}`)
    seenSlugs.add(post.slug)
    const key = `${post.translationKey}:${post.locale}`
    if (seenTranslations.has(key)) throw new Error(`Duplicate blog translation: ${key}`)
    seenTranslations.add(key)
    if (post.updatedAt && Date.parse(post.updatedAt) < Date.parse(post.date)) throw new Error(`Invalid blog post ${post.slug}: updatedAt precedes date`)
  }
  const published = all.filter(post => !post.draft && Date.parse(post.date) <= now.getTime())
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
  const publicPosts: BlogPost[] = published.map(post => ({ ...post }))
  return {
    getAllPosts: (locale?: Locale) => locale ? publicPosts.filter(post => post.locale === locale) : [...publicPosts],
    getPostBySlug: (slug: string) => publicPosts.find(post => post.slug === slug) ?? null,
    getPostTranslations: (post: BlogPost) => publicPosts.filter(candidate => candidate.translationKey === post.translationKey)
      .sort((a, b) => a.locale.localeCompare(b.locale)),
  }
}
