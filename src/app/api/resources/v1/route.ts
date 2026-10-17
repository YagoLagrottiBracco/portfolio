import { createHash } from "node:crypto"
import { buildResourceCatalogue } from "@/lib/resource-catalogue-api"

export function GET(request: Request) {
  try {
    const body = JSON.stringify(
      buildResourceCatalogue(new URL(request.url).searchParams),
      null,
      2
    )
    const etag = '"' + createHash("sha256").update(body).digest("hex") + '"'
    const headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
      ETag: etag,
    }
    if (request.headers.get("if-none-match")?.split(/,\s*/).includes(etag))
      return new Response(null, { status: 304, headers })
    return new Response(body, { headers })
  } catch {
    return Response.json(
      {
        error:
          "Use locale=pt|en|es and an existing section; each filter may appear only once.",
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "*",
        },
      }
    )
  }
}
