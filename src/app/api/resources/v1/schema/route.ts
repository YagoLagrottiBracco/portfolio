import { resourceCatalogueSchema } from "@/lib/resource-catalogue-api"
export function GET() {
  return Response.json(resourceCatalogueSchema, {
    headers: {
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/schema+json; charset=utf-8",
    },
  })
}
