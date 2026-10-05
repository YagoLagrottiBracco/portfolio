import type { ReactNode } from "react"

import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"

/** Same shell as `/blog`: without it the English and Spanish indexes have no way out. */
export default function LocaleBlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main">{children}</main>
      <Footer />
    </div>
  )
}
