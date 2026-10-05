"use client"
/* eslint-disable @next/next/no-img-element */

/**
 * @file BlogPostList.tsx
 * @description The blog index grid with a tag filter on top.
 *
 * Every post is in the server-rendered HTML; filtering only hides cards in the
 * browser, so crawlers and readers without JavaScript still get the full list.
 */
import React, { useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, Tag } from "lucide-react"

import type { TagCount } from "@/lib/blog-tags"
import type { BlogImage } from "@/lib/blog-content"
import { cn } from "@/lib/utils"

export interface BlogListItem {
  slug: string
  url: string
  title: string
  excerpt: string
  date: string
  /** Formatted on the server so both renders print the same string. */
  dateLabel: string
  tags: string[]
  image?: BlogImage
}

interface BlogPostListProps {
  posts: BlogListItem[]
  filterTags: TagCount[]
  copy: { read: string; all: string; filterLabel: string; clear: string }
}

const chip =
  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors duration-200"
const chipIdle = "border-border/60 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
const chipActive = "border-transparent bg-primary text-primary-foreground"

export function BlogPostList({ posts, filterTags, copy }: BlogPostListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const visible = useMemo(
    () => (activeTag ? posts.filter((post) => post.tags.includes(activeTag)) : posts),
    [activeTag, posts]
  )

  // A tag picked from a card may not be one of the offered filters; show it
  // anyway so the reader can see, and undo, what is narrowing the list.
  const extraTag = activeTag && !filterTags.some((item) => item.tag === activeTag) ? activeTag : null

  return (
    <>
      {filterTags.length > 0 && (
        <div role="group" aria-label={copy.filterLabel} className="mb-10 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            aria-pressed={activeTag === null}
            className={cn(chip, activeTag === null ? chipActive : chipIdle)}
          >
            {copy.all}
            <span className="text-xs opacity-70">{posts.length}</span>
          </button>
          {filterTags.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              aria-pressed={activeTag === tag}
              className={cn(chip, activeTag === tag ? chipActive : chipIdle)}
            >
              {tag}
              <span className="text-xs opacity-70">{count}</span>
            </button>
          ))}
          {extraTag && (
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              aria-pressed="true"
              aria-label={`${copy.clear}: ${extraTag}`}
              className={cn(chip, chipActive)}
            >
              {extraTag}
              <span aria-hidden="true" className="text-xs opacity-70">×</span>
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((post) => (
          <article key={post.slug} className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm transition-shadow hover:shadow-md">
            {post.image && <Link href={post.url} className="block aspect-[16/9] overflow-hidden bg-muted"><img src={post.image.src} alt={post.image.alt} width={post.image.width} height={post.image.height} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]" /></Link>}
            <div className="flex flex-1 flex-col p-6">
            <time dateTime={post.date} className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {post.dateLabel}
            </time>
            <h2 className="mt-4 text-2xl font-semibold leading-snug">
              <Link href={post.url} className="hover:text-primary">{post.title}</Link>
            </h2>
            <p className="mt-3 text-muted-foreground">{post.excerpt}</p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <button
                    type="button"
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    aria-pressed={activeTag === tag}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      activeTag === tag ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/70"
                    )}
                  >
                    <Tag className="h-3 w-3" aria-hidden="true" />
                    {tag}
                  </button>
                </li>
              ))}
            </ul>
            <Link href={post.url} className="mt-auto pt-6 text-sm font-semibold text-primary underline underline-offset-4">
              {copy.read}
            </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
