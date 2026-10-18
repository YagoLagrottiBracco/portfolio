/**
 * The discovery pages' addresses, apart from their texts in `discovery.ts`
 * (which re-exports this). Route helpers loaded on every page, such as the
 * language switcher's, need only the slugs, not 17 KB of copy.
 */
export const discoverySlugs = [
  "links",
  "blogroll",
  "radar",
  "leitura",
  "principios",
  "ia",
  "habilidades",
  "status",
  "analytics",
  "cartao",
  "curriculo",
  "participar",
] as const

export type DiscoverySlug = (typeof discoverySlugs)[number]

export function isDiscoverySlug(value: string): value is DiscoverySlug {
  return discoverySlugs.some(slug => slug === value)
}
