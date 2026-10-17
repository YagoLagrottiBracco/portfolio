import { INDEXNOW_KEY } from "@/lib/indexnow"

export const dynamic = "force-static"

/** Compatibility alias; all submissions use the static /<key>.txt ownership file. */
export function GET() {
  return new Response(INDEXNOW_KEY, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
