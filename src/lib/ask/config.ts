import "server-only"

import { isPublishedPagePath } from "@/lib/publication"

/** The Ask page, its links and its sitemap entry exist only once Claude is configured. */
export function askEnabled(): boolean {
  return isPublishedPagePath("/perguntar")
}
