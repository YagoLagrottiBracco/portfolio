import QRCode from "qrcode"
import { getShortResourceUrl } from "@/lib/resource-discovery"
import { isLocale } from "@/lib/i18n"
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams,
    locale = params.get("locale") ?? "pt"
  try {
    if (
      !isLocale(locale) ||
      params.getAll("code").length !== 1 ||
      params.getAll("locale").length > 1
    )
      throw new Error("Invalid request")
    const url = getShortResourceUrl(params.get("code") ?? "", locale)
    const svg = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 4,
      width: 320,
    })
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch {
    return Response.json(
      { error: "Unknown short link or locale" },
      { status: 404 }
    )
  }
}
