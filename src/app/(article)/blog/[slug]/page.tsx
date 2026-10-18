import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogArticle, type ArticleExtras } from "@/components/blog/BlogArticle"
import { WebmentionLoader } from "@/components/blog/WebmentionLoader"
import { getAllPosts, getPostBySlug, getPostTranslations, type BlogPost } from "@/lib/blog"
import { getRelatedPosts } from "@/lib/blog-related"
import { getBlogIndexPath } from "@/lib/blog-routes"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { homeKeywords } from "@/lib/home-metadata"
import { localeTags } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"
import { episodes } from "@/data/podcast"
import { giscusConfig } from "@/lib/giscus"
import { episodeFor } from "@/lib/podcast"
import { getCaseStudyProjects } from "@/lib/projects"
import { PERSON_ID } from "@/lib/site"

const SITE_URL = "https://lagrotti.dev"
export function generateStaticParams() { return getAllPosts().map(post => ({ slug: post.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPostBySlug((await params).slug); if (!post) return {}
  const translations = getPostTranslations(post)
  const languages = Object.fromEntries(translations.map(item => [localeTags[item.locale], item.url]))
  const image = post.image?.src ?? `/blog/${post.slug}/opengraph-image`
  return {
    metadataBase: new URL(SITE_URL),
    title: post.title,
    description: post.excerpt,
    keywords: [...post.tags, ...homeKeywords[post.locale]],
    alternates: { canonical: post.url, languages: { ...languages, "x-default": translations.find(item => item.locale === "pt")?.url ?? post.url } },
    openGraph: { type: "article", url: post.url, title: post.title, description: post.excerpt, locale: localeTags[post.locale].replace("-", "_"), images: [{ url: image, alt: post.image?.alt ?? post.title }], publishedTime: post.date, modifiedTime: post.updatedAt },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [image] },
  }
}

/** Everything around the article body: related reading, the project's case study, sharing, the newsletter. */
function articleExtras(post: BlogPost): ArticleExtras {
  const formatter = new Intl.DateTimeFormat(localeTags[post.locale], { dateStyle: "long", timeZone: "UTC" })
  const project = getCaseStudyProjects().find(candidate => candidate.caseStudy.articleKey === post.translationKey)
  const episode = episodeFor(post, episodes)
  return {
    url: `${SITE_URL}${post.url}`,
    related: getRelatedPosts(post, getAllPosts()).map(item => ({ url: item.url, title: item.title, excerpt: item.excerpt, date: item.date, dateLabel: formatter.format(new Date(item.date)), readingMinutes: item.readingMinutes })),
    caseStudy: project ? { title: project.title[post.locale], url: getCaseStudyPath(post.locale, project.slug) } : undefined,
    newsletter: Boolean(process.env.BUTTONDOWN_API_KEY),
    comments: giscusConfig() ?? undefined,
    audio: episode ? { url: episode.audioUrl, type: episode.audioUrl.endsWith(".m4a") ? "audio/mp4" : "audio/mpeg" } : undefined,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPostBySlug((await params).slug); if (!post) notFound()
  const cover = post.image?.src
  const image = cover ? (cover.startsWith("/") ? `${SITE_URL}${cover}` : cover) : `${SITE_URL}/blog/${post.slug}/opengraph-image`
  const author = { "@type": "Person", "@id": PERSON_ID, name: "Yago Lagrotti Bracco", url: SITE_URL }
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, url: `${SITE_URL}${post.url}`, mainEntityOfPage: `${SITE_URL}${post.url}`, inLanguage: localeTags[post.locale],
    datePublished: post.date, ...(post.updatedAt ? { dateModified: post.updatedAt } : {}), image: [image],
    // The same @id as the Person on every page, so search engines see one author, not one per article.
    author, publisher: author, keywords: post.tags.join(", "),
    isPartOf: { "@type": "Blog", name: "Blog — Yago Lagrotti Bracco", url: `${SITE_URL}${getBlogIndexPath(post.locale)}` },
  }
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Yago Lagrotti Bracco", item: `${SITE_URL}${getHomePath(post.locale)}` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}${getBlogIndexPath(post.locale)}` },
      { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}${post.url}` },
    ],
  }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} /><BlogArticle post={post} translations={getPostTranslations(post)} extras={articleExtras(post)} /><WebmentionLoader target={post.url} locale={post.locale} /></>
}
