import { notFound, permanentRedirect } from "next/navigation"

import { getAllPosts } from "@/lib/blog"
import { buildBlogFeed } from "@/lib/blog-feed"
import { getBlogFeedPath } from "@/lib/blog-routes"
import { isLocale, locales } from "@/lib/i18n"

const SITE_URL = "https://lagrotti.dev"

export const dynamic = "force-static"

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "pt").map((locale) => ({ locale }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  if (!isLocale(locale)) notFound()
  if (locale === "pt") permanentRedirect(getBlogFeedPath("pt"))

  return new Response(buildBlogFeed(getAllPosts(locale), locale, SITE_URL), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
