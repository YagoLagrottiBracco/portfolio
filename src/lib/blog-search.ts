/**
 * Search over the blog index, entirely in the browser. Each post contributes
 * its title, excerpt, tags and section headings — enough to find an article by
 * what it covers, without shipping every article body to every reader.
 */

/** Lower case, accents removed, whitespace collapsed: "Arquitetura " and "arquitetura" match. */
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim()
}

/** The searchable text of one post, normalized once on the server. */
export function buildSearchText(parts: string[]): string {
  return normalizeSearch(parts.join(" "))
}

/** True when every word of the query appears somewhere in the post. */
export function matchesSearch(searchText: string, query: string): boolean {
  const terms = normalizeSearch(query).split(" ").filter(Boolean)
  return terms.every((term) => searchText.includes(term))
}
