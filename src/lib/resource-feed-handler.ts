import { buildResourceFeed } from "./resource-discovery"
import { type Locale } from "./i18n"
export function resourceFeedResponse(request: Request, locale: Locale) {
  try {
    const query = new URL(request.url).searchParams
    for (const key of query.keys())
      if (
        !["resource", "section"].includes(key) ||
        query.getAll(key).length !== 1
      )
        throw new Error("Invalid filter")
    return new Response(
      buildResourceFeed(
        locale,
        query.get("resource") ?? undefined,
        query.get("section") ?? undefined
      ),
      {
        headers: {
          "Content-Type": "application/rss+xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
          "X-Content-Type-Options": "nosniff",
        },
      }
    )
  } catch {
    return Response.json(
      { error: "Use an existing resource or section filter." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    )
  }
}
