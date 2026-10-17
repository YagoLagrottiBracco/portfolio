import type { Metadata } from "next"
import { BlogIndex } from "@/components/blog/BlogIndex"
import { SITE_URL } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Blog de engenharia de software",
  description: "Notas técnicas sobre arquitetura, produtos digitais, IA e entrega de software.",
  alternates: { canonical: "/blog", languages: { "pt-BR": "/blog", "en-US": "/en/blog", es: "/es/blog", "x-default": "/blog" }, types: { "application/rss+xml": "/blog/feed.xml" } },
  openGraph: { type: "website", url: "/blog", title: "Blog de engenharia de software", description: "Notas técnicas sobre arquitetura, produtos digitais, IA e entrega de software." },
}
export default function BlogPage() { return <BlogIndex locale="pt" /> }
