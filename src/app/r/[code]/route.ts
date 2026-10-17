import { getShortDestination } from "@/lib/resource-discovery"
import { isLocale } from "@/lib/i18n"
export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const query = new URL(request.url).searchParams,
    locale = query.get("lang") ?? "pt"
  try {
    if (!isLocale(locale) || query.getAll("lang").length > 1)
      throw new Error("Invalid locale")
    const { code } = await params
    return new Response(null, {
      status: 307,
      headers: {
        Location: getShortDestination(code, locale),
        "Cache-Control": "public, max-age=300",
      },
    })
  } catch {
    return Response.json({ error: "Unknown short link" }, { status: 404 })
  }
}
