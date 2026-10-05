import { NextResponse, type NextRequest } from "next/server"

import { LOCALE_COOKIE, negotiateLocale } from "@/lib/locale-negotiation"
import { getHomePath } from "@/lib/locale-routes"

/** Only the bare homepage negotiates a language; every other URL already names one. */
export const config = { matcher: "/" }

export function middleware(request: NextRequest) {
  const locale = negotiateLocale(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get("accept-language"))
  if (locale === "pt") return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = getHomePath(locale)
  const response = NextResponse.redirect(url, 307)
  response.headers.set("Vary", "Accept-Language, Cookie")
  return response
}
