import { notFound } from "next/navigation"

import { BlogEditorForm } from "@/components/blog-admin/BlogEditorForm"
import { listBlogBundles } from "@/lib/blog-admin-repository"
import { blogAdminConfig } from "@/lib/blog-admin-server"
import { requireBlogAdminSession } from "@/lib/blog-admin-session"

export default async function EditBlogAdminPage({ params }: { params: Promise<{ translationKey: string }> }) {
  const session = await requireBlogAdminSession()
  const { translationKey } = await params
  const bundle = (await listBlogBundles(blogAdminConfig())).find(item => item.translationKey === translationKey)
  if (!bundle) notFound()
  return <><p className="mb-2 text-sm text-muted-foreground">Editando {bundle.translationKey}</p><h1 className="mb-8 text-3xl font-bold">{bundle.articles.pt?.title ?? bundle.articles.en?.title}</h1><BlogEditorForm bundle={bundle} csrf={session?.editorCsrf ?? ""} /></>
}
