import { podcastResponse } from "@/lib/podcast-route"

export const dynamic = "force-static"

/** Portuguese podcast feed; `/en` and `/es` live under `[locale]`. */
export function GET() {
  return podcastResponse("pt")
}
