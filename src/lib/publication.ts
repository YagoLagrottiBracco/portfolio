import { parsePagePath, unlistedPages } from "@/lib/page-routes"

/** Shared publication gate for discovered pages; route handlers still enforce availability. */
export function isPublishedPagePath(pathname: string): boolean {
  const page = parsePagePath(pathname)
  if (!page) return true
  return !unlistedPages.has(page.page) && (page.page !== "perguntar" || Boolean(process.env.ANTHROPIC_API_KEY))
}
