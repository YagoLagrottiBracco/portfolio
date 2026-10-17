/**
 * Picks the article sections worth handing to the model for a question:
 * term overlap weighted by how rare each term is across sections (a small
 * TF-IDF), at most two sections per article. Pure, so it is easy to test.
 */
import { normalizeSearch } from "@/lib/blog-search"

export interface Section {
  /** "Article title — section heading" */
  title: string
  url: string
  text: string
  /** Article title and tags, which count a little extra. */
  keywords: string
  article: string
}

/** Words that say nothing about the topic, in the three languages. */
const STOPWORDS = new Set(
  "que como para por com sem uma umas uns dos das nos nas num numa ele ela eles elas isso esse essa este esta qual quais quando onde porque sobre mais menos muito muita tem ter foi ser sao era sua seu suas seus voce yago ja ou the and for with without what which who whom when where why how does did has have had was were are his her him its this that these those from into about any some than then there their they them you your can could would should una unos las los del por con sin que como para cual cuales cuando donde porque sobre mas menos muy tiene tener fue son era sus usted esto este esta".split(" ")
)

export function queryTerms(text: string): string[] {
  return [...new Set(normalizeSearch(text).split(/[^a-z0-9.+#-]+/).filter((term) => term.length >= 3 && !STOPWORDS.has(term)))]
}

export function retrieveSections(question: string, sections: Section[], { limit = 4, perArticle = 2 }: { limit?: number; perArticle?: number } = {}): Section[] {
  const terms = queryTerms(question)
  if (terms.length === 0 || sections.length === 0) return []
  const texts = sections.map((section) => normalizeSearch(`${section.title} ${section.text}`))
  const keywords = sections.map((section) => normalizeSearch(section.keywords))
  const idf = new Map(terms.map((term) => {
    const containing = texts.filter((text) => text.includes(term)).length
    return [term, Math.log(1 + sections.length / (1 + containing))]
  }))

  const scored = sections.map((section, index) => {
    let score = 0
    for (const term of terms) {
      const occurrences = texts[index].split(term).length - 1
      if (occurrences > 0) score += idf.get(term)! * (1 + Math.log(occurrences))
      if (keywords[index].includes(term)) score += idf.get(term)! * 0.5
    }
    return { section, score }
  })

  const picked: Section[] = []
  const perArticleCount = new Map<string, number>()
  for (const { section } of scored.filter((entry) => entry.score > 0).sort((a, b) => b.score - a.score)) {
    const count = perArticleCount.get(section.article) ?? 0
    if (count >= perArticle) continue
    perArticleCount.set(section.article, count + 1)
    picked.push(section)
    if (picked.length >= limit) break
  }
  return picked
}
