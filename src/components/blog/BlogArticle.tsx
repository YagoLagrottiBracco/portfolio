/* eslint-disable @next/next/no-img-element */
import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, Tag } from "lucide-react"

import { ArticleComments } from "@/components/blog/ArticleComments"
import { ArticleCta } from "@/components/blog/ArticleCta"
import { ArticleShare } from "@/components/blog/ArticleShare"
import { BlogMarkdown } from "@/components/blog/BlogMarkdown"
import { BlogPoll } from "@/components/blog/BlogPoll"
import { ListenToArticle } from "@/components/blog/ListenToArticle"
import { NewsletterSignup } from "@/components/blog/NewsletterSignup"
import { ReadingModeToggle } from "@/components/blog/ReadingModeToggle"
import { ReadingProgress } from "@/components/blog/ReadingProgress"
import { RelatedPosts, type RelatedPost } from "@/components/blog/RelatedPosts"
import { CitationGenerator } from "@/components/ecosystem/CitationGenerator"
import { CorrectionProposal } from "@/components/ecosystem/CorrectionProposal"
import { ReferencesForTarget } from "@/components/ecosystem/ReferencesForTarget"
import { articlePoll } from "@/data/discovery"
import { profile } from "@/data/profile"
import type { BlogImage, BlogPost } from "@/lib/blog-content"
import { getBlogOutline } from "@/lib/blog-outline"
import { getBlogIndexPath } from "@/lib/blog-routes"
import type { GiscusConfig } from "@/lib/giscus"
import { localeNames, localeTags, type Locale } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"
import { SITE_URL } from "@/lib/site"

const copy: Record<
  Locale,
  {
    by: string
    contents: string
    minutes: string
    updated: string
    languages: string
    compare: string
  }
> = {
  pt: {
    by: "Por",
    contents: "Neste artigo",
    minutes: "min de leitura",
    updated: "Atualizado em",
    languages: "Idiomas",
    compare: "Comparar idiomas",
  },
  en: {
    by: "By",
    contents: "In this article",
    minutes: "min read",
    updated: "Updated on",
    languages: "Languages",
    compare: "Compare languages",
  },
  es: {
    by: "Por",
    contents: "En este artículo",
    minutes: "min de lectura",
    updated: "Actualizado el",
    languages: "Idiomas",
    compare: "Comparar idiomas",
  },
}

/**
 * What only the public page has: the editor's preview renders the article
 * alone, and runs in the browser, where none of this can be computed.
 */
export interface ArticleExtras {
  /** Absolute URL of the article, the base of every shared link. */
  url: string
  related: RelatedPost[]
  /** The case study of the project the article is about, if any. */
  caseStudy?: { title: string; url: string }
  /** True when Buttondown is configured; otherwise there is no form. */
  newsletter: boolean
  /** A recorded reading of the article; without one, the browser's speech synthesis reads it. */
  audio?: { url: string; type: string }
  /** giscus settings, when comments are configured. */
  comments?: GiscusConfig
}

/** Local covers go through the image optimizer; remote and preview ones (data URLs) stay plain. */
function Cover({ image }: { image: BlogImage }) {
  const className = "h-auto max-h-[35rem] w-full rounded-2xl border border-border object-cover"
  if (image.src.startsWith("/") && !image.src.startsWith("//")) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority
        sizes="(min-width: 1024px) 64rem, 100vw"
        className={className}
      />
    )
  }
  return <img src={image.src} alt={image.alt} width={image.width} height={image.height} className={className} />
}

export function BlogArticle({
  post,
  translations,
  assetPreviews,
  extras,
}: {
  post: BlogPost
  translations: BlogPost[]
  assetPreviews?: Record<string, string>
  extras?: ArticleExtras
}) {
  const labels = copy[post.locale]
  const outline = getBlogOutline(post.content)
  const formatter = new Intl.DateTimeFormat(localeTags[post.locale], {
    dateStyle: "long",
    timeZone: "UTC",
  })
  const published = formatter.format(new Date(post.date))

  return (
    <article
      className="container mx-auto max-w-6xl px-4 pb-28 pt-32 print:pt-0 h-entry"
      lang={localeTags[post.locale]}
    >
      {extras && (
        <ReadingProgress
          targetId="article-body"
          minutes={post.readingMinutes}
          locale={post.locale}
        />
      )}
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground print:hidden">
        <ol className="flex min-w-0 gap-2">
          <li>
            <Link
              href={getBlogIndexPath(post.locale)}
              className="underline underline-offset-4"
            >
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="truncate">
            {post.title}
          </li>
        </ol>
      </nav>

      <header className="mx-auto mt-10 max-w-3xl border-b border-border pb-10 print:mt-0">
        <h1 className="p-name text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        <p className="p-summary mt-6 text-xl leading-8 text-muted-foreground">
          {post.excerpt}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-muted-foreground">
          <span className="p-author">
            {labels.by}{" "}
            <Link
              rel="author"
              href={`${getHomePath(post.locale)}#about`}
              className="font-medium text-foreground underline underline-offset-4"
            >
              {profile.name}
            </Link>
          </span>
          <time
            dateTime={post.date}
            className="dt-published inline-flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {published}
          </time>
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {post.readingMinutes} {labels.minutes}
          </span>
          {post.updatedAt && (
            <time dateTime={post.updatedAt}>
              {labels.updated} {formatter.format(new Date(post.updatedAt))}
            </time>
          )}
        </div>
        {extras && (
          <div className="mt-6">
            {extras.audio ? (
              <audio controls preload="none" className="w-full max-w-md print:hidden">
                <source src={extras.audio.url} type={extras.audio.type} />
              </audio>
            ) : (
              <ListenToArticle
                locale={post.locale}
                title={post.title}
                targetId="article-body"
                article={post.translationKey}
              />
            )}
          </div>
        )}
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium"
            >
              <Tag className="h-3 w-3" aria-hidden="true" />
              {tag}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 print:hidden">
          {translations.length > 1 ? (
            <nav
              className="flex flex-wrap gap-3 text-sm"
              aria-label={labels.languages}
            >
              {translations.map((translation) => (
                <Link
                  key={translation.locale}
                  href={translation.url}
                  data-blog-locale={translation.locale}
                  lang={localeTags[translation.locale]}
                  aria-current={
                    translation.slug === post.slug ? "page" : undefined
                  }
                  className="rounded-full border border-border px-3 py-1.5 font-medium text-foreground hover:bg-muted"
                >
                  {localeNames[translation.locale]}
                </Link>
              ))}
              {translations
                .filter((translation) => translation.locale !== post.locale)
                .slice(0, 1)
                .map((translation) => (
                  <Link
                    key={`compare-${translation.locale}`}
                    href={`/comparar/${post.slug}/${translation.locale}`}
                    className="rounded-full border border-border px-3 py-1.5 font-medium text-brand hover:bg-muted"
                  >
                    {labels.compare}
                  </Link>
                ))}
            </nav>
          ) : (
            <div />
          )}
          <ReadingModeToggle locale={post.locale} />
        </div>
      </header>

      {post.image && (
        <figure className="cover-brand mx-auto mt-10 max-w-5xl overflow-hidden rounded-2xl">
          <Cover image={post.image} />
        </figure>
      )}

      <div className="mx-auto mt-12 grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] print:block">
        <div id="article-body" className="min-w-0 e-content">
          <BlogMarkdown
            content={post.content}
            locale={post.locale}
            assetPreviews={assetPreviews}
            pageUrl={SITE_URL + post.url}
          />
          <CitationGenerator
            locale={post.locale}
            items={[
              {
                id: post.slug,
                title: post.title,
                author: profile.name,
                url: SITE_URL + post.url,
                publishedAt: post.date,
                updatedAt: post.updatedAt,
                kind: "article",
              },
            ]}
          />
          <ReferencesForTarget
            target={SITE_URL + post.url}
            locale={post.locale}
          />
          <CorrectionProposal
            locale={post.locale}
            pageUrl={SITE_URL + post.url}
            title={post.title}
          />
          <BlogPoll
            locale={post.locale}
            pollId={articlePoll.id}
            options={articlePoll.options.map((opt) => ({
              id: opt.id,
              label: opt.label[post.locale],
            }))}
          />
        </div>
        {outline.length > 0 && (
          <aside className="order-first lg:order-last print:hidden">
            <nav
              aria-label={labels.contents}
              className="rounded-xl border border-border bg-muted/30 p-5 lg:sticky lg:top-24"
            >
              <p className="mb-4 text-sm font-semibold text-foreground">
                {labels.contents}
              </p>
              <ol className="space-y-2 text-sm">
                {outline.map((heading) => (
                  <li
                    key={heading.id}
                    className={heading.depth === 3 ? "pl-4" : ""}
                  >
                    <a
                      href={`#${heading.id}`}
                      className="text-muted-foreground underline-offset-4 hover:text-brand hover:underline"
                    >
                      {heading.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>

      {extras && (
        <>
          <div className="mx-auto mt-16 max-w-5xl print:hidden">
            <div
              className={`space-y-10 border-t border-border pt-10 ${
                outline.length > 0 ? "lg:max-w-[calc(100%-18rem)]" : ""
              }`}
            >
              <ArticleShare
                url={extras.url}
                title={post.title}
                locale={post.locale}
                campaign={post.translationKey}
              />
              <ArticleCta
                locale={post.locale}
                translationKey={post.translationKey}
                caseStudy={extras.caseStudy}
              />
              {extras.newsletter && (
                <NewsletterSignup
                  locale={post.locale}
                  page={post.url}
                  placement={`article:${post.translationKey}`}
                />
              )}
            </div>
          </div>
          {extras.comments && (
            <ArticleComments
              config={extras.comments}
              locale={post.locale}
              term={post.translationKey}
            />
          )}
          <RelatedPosts locale={post.locale} posts={extras.related} />
        </>
      )}
    </article>
  )
}
