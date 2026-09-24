import "server-only"

import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { createBlogIndex, type BlogPost } from "@/lib/blog-content"
import type { Locale } from "@/lib/i18n"

export type { BlogPost }

const contentDirectory = join(process.cwd(), "src", "content", "blog")
const index = createBlogIndex(
  readdirSync(contentDirectory)
    .filter(filename => /\.(md|mdx)$/.test(filename))
    .sort()
    .map(filename => ({ filename, source: readFileSync(join(contentDirectory, filename), "utf8") })),
)

export function getAllPosts(locale?: Locale): BlogPost[] { return index.getAllPosts(locale) }
export function getPostBySlug(slug: string): BlogPost | null { return index.getPostBySlug(slug) }
export function getPostTranslations(post: BlogPost): BlogPost[] { return index.getPostTranslations(post) }
