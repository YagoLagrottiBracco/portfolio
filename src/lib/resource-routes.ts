import type { Locale } from "@/lib/i18n"

const segment = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export function getResourcePath(
  locale: Locale,
  section?: string,
  slug?: string
): string {
  if (
    (section && !segment.test(section)) ||
    (slug && (!section || !segment.test(slug)))
  )
    throw new Error("Invalid resource segment")
  return `${locale === "pt" ? "" : `/${locale}`}/recursos${section ? `/${section}` : ""}${slug ? `/${slug}` : ""}`
}
export function parseResourcePath(
  path: string
): { locale: Locale; section?: string; slug?: string } | null {
  const match =
    /^(?:\/(en|es))?\/recursos(?:\/([a-z0-9]+(?:-[a-z0-9]+)*))?(?:\/([a-z0-9]+(?:-[a-z0-9]+)*))?\/?$/.exec(
      path
    )
  if (!match) return null
  return {
    locale: (match[1] ?? "pt") as Locale,
    ...(match[2] ? { section: match[2] } : {}),
    ...(match[3] ? { slug: match[3] } : {}),
  }
}
export function getEmbedPath(locale: Locale, tool: string): string {
  if (!segment.test(tool)) throw new Error("Invalid embed tool")
  return `${locale === "pt" ? "" : `/${locale}`}/incorporar/${tool}`
}
export function parseEmbedPath(
  path: string
): { locale: Locale; tool: string } | null {
  const match = /^(?:\/(en|es))?\/incorporar\/(json|env|queue)\/?$/.exec(path)
  return match ? { locale: (match[1] ?? "pt") as Locale, tool: match[2] } : null
}
