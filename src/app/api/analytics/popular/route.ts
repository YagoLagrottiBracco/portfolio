import { getPublicAnalytics } from "@/lib/public-analytics"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const analytics = await getPublicAnalytics()
  if (!analytics) return Response.json({ configured: false, posts: [] }, { status: 503 })
  return Response.json(analytics)
}
