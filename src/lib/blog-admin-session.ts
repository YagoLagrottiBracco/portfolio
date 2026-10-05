import "server-only"

import { forbidden, redirect } from "next/navigation"

import { auth } from "@/auth"
import { authorizeBlogAdmin } from "@/lib/blog-admin-auth"

export async function requireBlogAdminSession() {
  const session = await auth()
  const access = authorizeBlogAdmin(session, process.env.BLOG_ADMIN_GITHUB_ID ?? "")
  if (access === "unauthenticated") redirect("/api/auth/signin?callbackUrl=%2Fadmin%2Fblog")
  if (access === "forbidden") forbidden()
  return session!
}
