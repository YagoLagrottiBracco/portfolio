import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"
import { RootDocument } from "@/components/RootDocument"
import { getPostBySlug } from "@/lib/blog"
import { buildRootMetadata } from "@/lib/root-metadata"

interface LayoutProps {
  children: ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  return buildRootMetadata(getPostBySlug((await params).slug)?.locale ?? "pt")
}

/**
 * Root layout of an article. Every article lives at `/blog/[slug]` whatever its
 * language, so the language of the document has to come from the article.
 */
export default async function ArticleRootLayout({ children, params }: LayoutProps) {
  const post = getPostBySlug((await params).slug)

  return (
    <RootDocument lang={post?.locale ?? "pt"} pageLocale={post?.locale}>
      <div className="min-h-screen">
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
      </div>
    </RootDocument>
  )
}
