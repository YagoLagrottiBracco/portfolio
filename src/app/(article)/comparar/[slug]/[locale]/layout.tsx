import type { ReactNode } from "react"

import { RootDocument } from "@/components/RootDocument"
import { getPostBySlug } from "@/lib/blog"

interface LayoutProps { children: ReactNode; params: Promise<{ slug: string; locale: string }> }

export default async function CompareRootLayout({ children, params }: LayoutProps) {
  const { slug } = await params
  const primary = getPostBySlug(slug)
  return <RootDocument lang={primary?.locale ?? "pt"} pageLocale={primary?.locale}>{children}</RootDocument>
}
