import type { Metadata } from "next"
import Link from "next/link"
import { forbidden, redirect } from "next/navigation"

import { auth } from "@/auth"
import { authorizeBlogAdmin } from "@/lib/blog-admin-auth"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Editor do blog", robots: { index: false, follow: false } }

export default async function BlogAdminLayout({ children }: { children: React.ReactNode }) {
  const access = authorizeBlogAdmin(await auth(), process.env.BLOG_ADMIN_GITHUB_ID ?? "")
  if (access === "unauthenticated") redirect("/api/auth/signin?callbackUrl=%2Fadmin%2Fblog")
  if (access === "forbidden") forbidden()
  return <div className="blog-admin-shell min-h-screen bg-background text-foreground">
    <header className="border-b border-border"><nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5" aria-label="Administração do blog"><Link href="/admin/blog" className="font-semibold">Editor do blog</Link><Link href="/blog" className="text-sm underline underline-offset-4">Ver blog público</Link></nav></header>
    <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
  </div>
}
