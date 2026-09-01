import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Navigation } from "@/components/organisms/Navigation"
import { Footer } from "@/components/organisms/Footer"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Histórias sobre engenharia de software, arquitetura e lições aprendidas construindo produtos digitais.",
  alternates: { canonical: "/blog" },
}

/**
 * Blog layout.
 *
 * The providers it used to mount now live in the root layout — mounting them
 * twice forked the theme state between the blog and the rest of the site.
 */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main">{children}</main>
      <Footer />
    </div>
  )
}
