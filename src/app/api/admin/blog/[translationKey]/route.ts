import { blogAdminHandlers } from "@/lib/blog-admin-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(_request: Request, context: { params: Promise<{ translationKey: string }> }) { return blogAdminHandlers().detail((await context.params).translationKey) }
export async function PUT(request: Request, context: { params: Promise<{ translationKey: string }> }) { return blogAdminHandlers().update(request, (await context.params).translationKey) }
