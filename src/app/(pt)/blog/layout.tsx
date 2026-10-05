import type { Metadata } from "next"
import type { ReactNode } from "react"

import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"

export const metadata: Metadata = { title: { default: "Blog", template: "%s — Yago Lagrotti Bracco" } }

/** Shell of the Portuguese blog index. Articles have their own root layout. */
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main">{children}</main>
      <Footer />
    </div>
  )
}
