import Link from "next/link"

import { BlogAdminList } from "@/components/blog-admin/BlogAdminList"
import { listBlogBundles } from "@/lib/blog-admin-repository"
import { blogAdminConfig } from "@/lib/blog-admin-server"
import { requireBlogAdminSession } from "@/lib/blog-admin-session"

export default async function BlogAdminPage() {
  await requireBlogAdminSession()
  const bundles = await listBlogBundles(blogAdminConfig())
  return <><div className="mb-9 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold">Artigos</h1><p className="mt-2 text-muted-foreground">Rascunhos e posts publicados, nos três idiomas.</p></div><Link href="/admin/blog/new" className="blog-admin-primary">Novo artigo</Link></div><BlogAdminList bundles={bundles} /></>
}
