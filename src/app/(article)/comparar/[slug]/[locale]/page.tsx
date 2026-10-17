import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { BlogMarkdown } from "@/components/blog/BlogMarkdown"
import { Navigation } from "@/components/organisms/Navigation"
import { Footer } from "@/components/organisms/Footer"
import { getPostBySlug, getPostTranslations } from "@/lib/blog"
import { isLocale, localeNames, localeTags } from "@/lib/i18n"

interface PageProps { params: Promise<{ slug: string; locale: string }> }

export const metadata: Metadata = { robots: { index: false, follow: true } }

export default async function CompareBlogPostPage({ params }: PageProps) {
  const { slug, locale } = await params
  const primary = getPostBySlug(slug)
  if (!primary || !isLocale(locale) || locale === primary.locale) notFound()
  const secondary = getPostTranslations(primary).find(post => post.locale === locale)
  if (!secondary) notFound()

  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main" className="container mx-auto px-4 pb-24 pt-28">
        <p className="text-sm text-muted-foreground"><Link href={primary.url} className="underline underline-offset-4">← {primary.title}</Link></p>
        <h1 className="mt-6 text-4xl font-bold tracking-tight">{primary.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{localeNames[primary.locale]} ↔ {localeNames[secondary.locale]}</p>
        <div className="mt-10 grid gap-10 xl:grid-cols-2">
          <section lang={localeTags[primary.locale]} aria-label={`${primary.title} — ${localeNames[primary.locale]}`} className="min-w-0 rounded-2xl border border-border p-6"><BlogMarkdown content={primary.content} locale={primary.locale} /></section>
          <section lang={localeTags[secondary.locale]} aria-label={`${secondary.title} — ${localeNames[secondary.locale]}`} className="min-w-0 rounded-2xl border border-border p-6"><BlogMarkdown content={secondary.content} locale={secondary.locale} /></section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
