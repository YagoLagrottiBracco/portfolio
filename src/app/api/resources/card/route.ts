import { buildResourceCard } from "@/lib/resource-discovery"
import { isLocale } from "@/lib/i18n"
export function GET(request: Request) {
  const params = new URL(request.url).searchParams,
    locale = params.get("locale") ?? "pt"
  try {
    if (
      !isLocale(locale) ||
      params.getAll("id").length !== 1 ||
      params.getAll("locale").length > 1
    )
      throw new Error("Invalid request")
    return new Response(buildResourceCard(params.get("id") ?? "", locale), {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
        "Content-Security-Policy":
          "default-src 'none'; style-src 'unsafe-inline'; sandbox",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return Response.json(
      { error: "Unknown resource or locale" },
      { status: 404 }
    )
  }
}
