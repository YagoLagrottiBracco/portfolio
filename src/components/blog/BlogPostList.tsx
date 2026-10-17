"use client"
/* eslint-disable @next/next/no-img-element */

/**
 * @file BlogPostList.tsx
 * @description The blog index grid with a search box and a tag filter on top.
 *
 * Every post is in the server-rendered HTML; searching and filtering only hide
 * cards in the browser, so crawlers and readers without JavaScript still get
 * the full list. The search lives in `?q=`, so a search can be linked to.
 */
import React, { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Search, Tag } from "lucide-react"

import type { TagCount } from "@/lib/blog-tags"
import type { BlogImage } from "@/lib/blog-content"
import { matchesSearch } from "@/lib/blog-search"
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
  /** Title, excerpt, tags and headings, normalized on the server by `buildSearchText`. */
  searchText: string
}

interface BlogPostListProps {
  posts: BlogListItem[]
  filterTags: TagCount[]
  copy: { read: string; all: string; filterLabel: string; clear: string; search: string; searchPlaceholder: string; results: string; noResults: string; reset: string }
}

/** Local covers through the optimizer; remote ones as they are. */
function Cover({ image }: { image: BlogImage }) {
  const className = "h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
  if (image.src.startsWith("/") && !image.src.startsWith("//")) {
    return <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1280px) 24rem, (min-width: 768px) 50vw, 100vw" className={className} />
  }
  return <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" className={className} />
}

const chip =
  "inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors duration-200"
const chipIdle = "border-border/60 bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
const chipActive = "border-transparent bg-primary text-primary-foreground"

export function BlogPostList({ posts, filterTags, copy }: BlogPostListProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [query, setQuery] = useState("")

  // Read after mounting: the server render has no query, and both renders must agree.
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q")
    if (initial) setQuery(initial)
  }, [])

  function search(value: string) {
    setQuery(value)
    const url = new URL(window.location.href)
    if (value.trim()) url.searchParams.set("q", value)
    else url.searchParams.delete("q")
    window.history.replaceState(window.history.state, "", url)
  }

  const visible = useMemo(
    () => posts.filter((post) => (!activeTag || post.tags.includes(activeTag)) && matchesSearch(post.searchText, query)),
    [activeTag, posts, query]
  )
  const narrowed = Boolean(activeTag || query.trim())

  // A tag picked from a card may not be one of the offered filters; show it
  // anyway so the reader can see, and undo, what is narrowing the list.
  const extraTag = activeTag && !filterTags.some((item) => item.tag === activeTag) ? activeTag : null

  return (
    <>
      <div role="search" className="relative mb-6 max-w-xl">
        <label htmlFor="blog-search" className="sr-only">{copy.search}</label>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          id="blog-search"
          type="search"
          value={query}
          onChange={(event) => search(event.target.value)}
          placeholder={copy.searchPlaceholder}
          autoComplete="off"
          className="h-11 w-full rounded-full border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-brand"
        />
      </div>
      <p aria-live="polite" className="mb-6 text-sm text-muted-foreground empty:hidden">
        {narrowed && visible.length > 0 ? copy.results.replace("{count}", String(visible.length)) : ""}
      </p>

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
            {post.image && <Link href={post.url} className="block aspect-[16/9] overflow-hidden bg-muted"><Cover image={post.image} /></Link>}
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

      {visible.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-muted-foreground">{copy.noResults.replace("{query}", query.trim() || activeTag || "")}</p>
          <button
            type="button"
            onClick={() => {
              search("")
              setActiveTag(null)
            }}
            className="mt-4 text-sm font-semibold text-brand underline underline-offset-4"
          >
            {copy.reset}
          </button>
        </div>
      )}
    </>
  )
}
