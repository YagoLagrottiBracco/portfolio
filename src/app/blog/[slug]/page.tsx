import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogArticle } from "@/components/blog/BlogArticle"
import { getAllPosts, getPostBySlug, getPostTranslations } from "@/lib/blog"
import { localeTags } from "@/lib/i18n"

const SITE_URL = "https://lagrotti.dev"
export function generateStaticParams() { return getAllPosts().map(post => ({ slug: post.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPostBySlug((await params).slug); if (!post) return {}
  const translations = getPostTranslations(post)
  const languages = Object.fromEntries(translations.map(item => [localeTags[item.locale], item.url]))
  const image = post.image?.src ?? `/blog/${post.slug}/opengraph-image`
  return {
    title: post.title, description: post.excerpt,
    alternates: { canonical: post.url, languages: { ...languages, "x-default": translations.find(item => item.locale === "pt")?.url ?? post.url } },
    openGraph: { type: "article", url: post.url, title: post.title, description: post.excerpt, locale: localeTags[post.locale].replace("-", "_"), images: [{ url: image, alt: post.image?.alt ?? post.title }], publishedTime: post.date, modifiedTime: post.updatedAt },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [image] },
  }
}
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPostBySlug((await params).slug); if (!post) notFound()
  const image = post.image?.src ?? `${SITE_URL}/blog/${post.slug}/opengraph-image`
  const jsonLd = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.excerpt, url: `${SITE_URL}${post.url}`, mainEntityOfPage: `${SITE_URL}${post.url}`, inLanguage: localeTags[post.locale],
    datePublished: post.date, ...(post.updatedAt ? { dateModified: post.updatedAt } : {}), image: [image],
    author: { "@type": "Person", name: "Yago Lagrotti Bracco", url: `${SITE_URL}/#about` },
    publisher: { "@type": "Person", name: "Yago Lagrotti Bracco", url: SITE_URL },
  }
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Blog", item: `${SITE_URL}/blog` }, { "@type": "ListItem", position: 2, name: post.title, item: `${SITE_URL}${post.url}` }] }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} /><BlogArticle post={post} /></>
}
