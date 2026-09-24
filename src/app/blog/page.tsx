import type { Metadata } from "next"
import { BlogIndex } from "@/components/blog/BlogIndex"

export const metadata: Metadata = {
  title: "Blog de engenharia de software",
  description: "Notas técnicas sobre arquitetura, produtos digitais, IA e entrega de software.",
  alternates: { canonical: "/blog", languages: { "pt-BR": "/blog", "en-US": "/en/blog", es: "/es/blog", "x-default": "/blog" } },
  openGraph: { type: "website", url: "/blog", title: "Blog de engenharia de software", description: "Notas técnicas sobre arquitetura, produtos digitais, IA e entrega de software." },
}
export default function BlogPage() { return <BlogIndex locale="pt" /> }
