import type { Locale } from "@/lib/i18n"

interface RelatablePost {
  translationKey: string
  locale: Locale
  tags: string[]
  date: string
}

/**
 * The articles to suggest after `post`: same language, never one of its own
 * translations, ranked by shared tags. A shared tag counts for more the fewer
 * articles carry it — "kafka" says more than "architecture". When too few
 * share anything, the newest articles fill the remaining places.
 */
export function getRelatedPosts<T extends RelatablePost>(post: T, all: T[], limit = 3): T[] {
  const candidates = all.filter((other) => other.locale === post.locale && other.translationKey !== post.translationKey)
  const frequency = new Map<string, number>()
  for (const other of [post, ...candidates]) {
    for (const tag of new Set(other.tags)) frequency.set(tag, (frequency.get(tag) ?? 0) + 1)
  }

  const own = new Set(post.tags)
  const newestFirst = (a: T, b: T) => Date.parse(b.date) - Date.parse(a.date)
  const scored = candidates
    .map((other) => ({
      post: other,
      score: [...new Set(other.tags)].filter((tag) => own.has(tag)).reduce((sum, tag) => sum + 1 / (frequency.get(tag) ?? 1), 0),
    }))
    .sort((a, b) => b.score - a.score || newestFirst(a.post, b.post))

  const related = scored.filter((entry) => entry.score > 0).slice(0, limit).map((entry) => entry.post)
  const fill = candidates.filter((other) => !related.includes(other)).sort(newestFirst)
  return [...related, ...fill].slice(0, limit)
}
