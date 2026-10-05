import { blogAdminHandlers } from "@/lib/blog-admin-server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() { return blogAdminHandlers().list() }
export async function POST(request: Request) { return blogAdminHandlers().create(request) }
