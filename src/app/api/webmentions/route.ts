import { getWebmentions } from "@/lib/webmentions"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const target = new URL(request.url).searchParams.get("target") ?? ""
  if (!target.startsWith("/blog/")) return Response.json({ error: "Unsupported target" }, { status: 400 })
  return Response.json(await getWebmentions(target))
}
