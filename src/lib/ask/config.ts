import "server-only"

/** The Ask page, its links and its sitemap entry exist only once Claude is configured. */
export function askEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}
