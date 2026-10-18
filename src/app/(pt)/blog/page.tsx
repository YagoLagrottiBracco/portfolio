import type { Metadata } from "next"
import { BlogIndex } from "@/components/blog/BlogIndex"
import { homeKeywords } from "@/lib/home-metadata"
import { SITE_URL } from "@/lib/site"

const title = "Blog de Engenharia de Software, Desenvolvimento Full Stack e Arquitetura"
const description = "Artigos técnicos de Yago Lagrotti Bracco (Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior) sobre arquitetura de sistemas, produtos digitais, IA e entrega de software."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: homeKeywords.pt,
  alternates: { canonical: "/blog", languages: { "pt-BR": "/blog", "en-US": "/en/blog", es: "/es/blog", "x-default": "/blog" }, types: { "application/rss+xml": "/blog/feed.xml" } },
  openGraph: { type: "website", url: "/blog", locale: "pt_BR", title, description, images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
}
export default function BlogPage() { return <BlogIndex locale="pt" /> }
