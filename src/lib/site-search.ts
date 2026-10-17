/**
 * Ranking for the site-wide search (Ctrl+K). Pure and client-side: the
 * index is fetched once from `/search-index/<locale>` (built by
 * `src/lib/site-search-index.ts`) and filtered in the browser.
 */
import { normalizeSearch } from "@/lib/blog-search"

export type SearchKind = "case" | "stack" | "page" | "article" | "resource"

export interface SearchItem {
  title: string
  description: string
  url: string
  kind: SearchKind
  /** Normalized title, description and keywords. */
  text: string
}

/** On ties, what a visitor most likely wants first. */
const kindWeight: Record<SearchKind, number> = { case: 5, stack: 4, page: 3, article: 2, resource: 1 }

export function rankSearch(items: SearchItem[], query: string, limit = 10): SearchItem[] {
  const terms = normalizeSearch(query).split(" ").filter(Boolean)
  if (terms.length === 0) return []
  return items
    .flatMap((item) => {
      if (!terms.every((term) => item.text.includes(term))) return []
      const title = normalizeSearch(item.title)
      const score =
        terms.filter((term) => title.includes(term)).length * 10 +
        (title.startsWith(terms[0]) ? 5 : 0) +
        terms.filter((term) => new RegExp(`(^|\\s)${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(title)).length * 3 +
        kindWeight[item.kind]
      return [{ item, score }]
    })
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map(({ item }) => item)
}
