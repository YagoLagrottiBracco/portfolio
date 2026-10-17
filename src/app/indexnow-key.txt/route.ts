import { isIndexNowKey } from "@/lib/indexnow"

export const dynamic = "force-static"

/**
 * The IndexNow key, which search engines fetch to confirm a ping came from
 * this site. Public by design; absent (404) until INDEXNOW_KEY is set.
 */
export function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!isIndexNowKey(key)) return new Response("Not found", { status: 404 })
  return new Response(key, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
