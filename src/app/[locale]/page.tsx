import { notFound, permanentRedirect } from "next/navigation"

/**
 * Legacy `/pt` and `/en` routes.
 *
 * These used to render a second, drifting copy of the homepage, which meant
 * duplicate content for search engines — and, because `[locale]` matches *any*
 * single segment, every unknown path (`/foo`) rendered the homepage instead of
 * a 404. The canonical homepage is `/`; the language is chosen in the UI.
 *
 * This whole `[locale]` folder can be deleted outright; it only still exists
 * because the delete was blocked. Redirecting is the safe equivalent.
 */
export default async function LegacyLocalePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (locale === "pt" || locale === "en") {
    permanentRedirect("/")
  }

  notFound()
}
