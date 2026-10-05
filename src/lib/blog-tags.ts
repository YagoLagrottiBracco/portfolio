export interface TagCount {
  tag: string
  count: number
}

/**
 * The tags worth offering as filters: those shared by at least `minPosts`
 * posts, most used first. A tag used once would only ever return its own post.
 */
export function getFilterTags(posts: { tags: string[] }[], minPosts = 2): TagCount[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const tag of new Set(post.tags)) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }

  return [...counts]
    .filter(([, count]) => count >= minPosts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}
