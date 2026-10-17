import { checkProjectStatus } from "@/lib/project-status"
import { isLocale } from "@/lib/i18n"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const locale = isLocale(new URL(request.url).searchParams.get("locale")) ? new URL(request.url).searchParams.get("locale") as "pt" | "en" | "es" : "pt"
  return Response.json(await checkProjectStatus(locale), { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } })
}
