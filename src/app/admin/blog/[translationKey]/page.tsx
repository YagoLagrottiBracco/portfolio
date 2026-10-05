import { notFound } from "next/navigation"

import { auth } from "@/auth"
import { BlogEditorForm } from "@/components/blog-admin/BlogEditorForm"
import { listBlogBundles } from "@/lib/blog-admin-repository"
import { blogAdminConfig } from "@/lib/blog-admin-server"

export default async function EditBlogAdminPage({ params }: { params: Promise<{ translationKey: string }> }) {
  const { translationKey } = await params
  const bundle = (await listBlogBundles(blogAdminConfig())).find(item => item.translationKey === translationKey)
  if (!bundle) notFound()
  const session = await auth()
  return <><p className="mb-2 text-sm text-muted-foreground">Editando {bundle.translationKey}</p><h1 className="mb-8 text-3xl font-bold">{bundle.articles.pt?.title ?? bundle.articles.en?.title}</h1><BlogEditorForm bundle={bundle} csrf={session?.editorCsrf ?? ""} /></>
}
