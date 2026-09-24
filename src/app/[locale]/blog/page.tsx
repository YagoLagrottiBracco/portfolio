import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { BlogIndex } from "@/components/blog/BlogIndex"
import { isLocale, type Locale } from "@/lib/i18n"

const copy: Record<Locale, { title: string; description: string }> = {
  pt: { title: "Blog de engenharia de software", description: "Notas tÃ©cnicas sobre arquitetura, produtos digitais, IA e entrega de software." },
  en: { title: "Software engineering blog", description: "Technical notes on architecture, digital products, AI, and software delivery." },
  es: { title: "Blog de ingenierÃƒÆ’Ã‚Â­a de software", description: "Notas tÃƒÆ’Ã‚Â©cnicas sobre arquitectura, productos digitales, IA y entrega de software." },
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const locale = (await params).locale
  if (locale === "pt") return {}
  if (!isLocale(locale)) return {}
  const text = copy[locale]
  return { title: text.title, description: text.description, alternates: { canonical: `/${locale}/blog`, languages: { "pt-BR": "/blog", "en-US": "/en/blog", es: "/es/blog", "x-default": "/blog" } }, openGraph: { type: "website", url: `/${locale}/blog`, title: text.title, description: text.description } }
}
export default async function LocaleBlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = (await params).locale
  if (!isLocale(locale)) notFound()
  if (locale === "pt") permanentRedirect("/blog")
  return <BlogIndex locale={locale} />
}
export function generateStaticParams() { return [{ locale: "pt" }, { locale: "en" }, { locale: "es" }] }
