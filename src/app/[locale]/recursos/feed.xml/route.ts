import { resourceFeedResponse } from "@/lib/resource-feed-handler"
import { isLocale } from "@/lib/i18n"
export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params
  if (!isLocale(locale) || locale === "pt")
    return new Response("Not found", { status: 404 })
  return resourceFeedResponse(request, locale)
}
