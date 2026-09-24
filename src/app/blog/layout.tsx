import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Navigation } from "@/components/organisms/Navigation"
import { Footer } from "@/components/organisms/Footer"
export const metadata: Metadata = { title: { default: "Blog", template: "%s — Yago Lagrotti Bracco" } }
export default function BlogLayout({ children }: { children: ReactNode }) { return <div className="min-h-screen"><Navigation /><main id="main">{children}</main><Footer /></div> }
