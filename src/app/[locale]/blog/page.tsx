import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { BlogIndex } from "@/components/blog/BlogIndex"
import { getBlogFeedPath } from "@/lib/blog-routes"
import { homeKeywords } from "@/lib/home-metadata"
import { isLocale, localeTags, type Locale } from "@/lib/i18n"
import { SITE_URL } from "@/lib/site"

const copy: Record<Locale, { title: string; description: string }> = {
  pt: {
    title: "Blog de Engenharia de Software, Desenvolvimento Full Stack e Arquitetura",
    description: "Artigos técnicos de Yago Lagrotti Bracco (Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior) sobre arquitetura de sistemas, produtos digitais, IA e entrega de software.",
  },
  en: {
    title: "Software Engineering, Full-Stack Development & Architecture Blog",
    description: "Technical articles by Yago Lagrotti Bracco (Senior Software Engineer, Full-Stack Developer, and Programmer) on systems architecture, digital products, AI, and software delivery.",
  },
  es: {
    title: "Blog de Ingeniería de Software, Desarrollo Full Stack y Arquitectura",
    description: "Artículos técnicos de Yago Lagrotti Bracco (Programador, Desarrollador Full Stack e Ingeniero de Software Sénior) sobre arquitectura de sistemas, productos digitales, IA y entrega de software.",
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale
  if (locale === "pt") return {}
  if (!isLocale(locale)) return {}
  const text = copy[locale]
  return {
    metadataBase: new URL(SITE_URL),
    title: text.title,
    description: text.description,
    keywords: homeKeywords[locale],
    alternates: { canonical: `/${locale}/blog`, languages: { "pt-BR": "/blog", "en-US": "/en/blog", es: "/es/blog", "x-default": "/blog" }, types: { "application/rss+xml": getBlogFeedPath(locale) } },
    openGraph: { type: "website", url: `/${locale}/blog`, locale: localeTags[locale].replace("-", "_"), title: text.title, description: text.description, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: text.title }] },
    twitter: { card: "summary_large_image", title: text.title, description: text.description, images: ["/opengraph-image"] },
  }
}

export default async function LocaleBlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale
  if (!isLocale(locale)) notFound()
  if (locale === "pt") permanentRedirect("/blog")
  return <BlogIndex locale={locale} />
}

export function generateStaticParams() {
  return [{ locale: "pt" }, { locale: "en" }, { locale: "es" }]
}