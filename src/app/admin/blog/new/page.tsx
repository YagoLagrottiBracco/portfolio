import { auth } from "@/auth"
import { BlogEditorForm } from "@/components/blog-admin/BlogEditorForm"

export default async function NewBlogAdminPage() {
  const session = await auth()
  return <><h1 className="mb-8 text-3xl font-bold">Novo artigo</h1><BlogEditorForm csrf={session?.editorCsrf ?? ""} /></>
}
