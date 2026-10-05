import { BlogEditorForm } from "@/components/blog-admin/BlogEditorForm"
import { requireBlogAdminSession } from "@/lib/blog-admin-session"

export default async function NewBlogAdminPage() {
  const session = await requireBlogAdminSession()
  return <><h1 className="mb-8 text-3xl font-bold">Novo artigo</h1><BlogEditorForm csrf={session?.editorCsrf ?? ""} /></>
}
