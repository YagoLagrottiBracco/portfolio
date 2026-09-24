import type { MetadataRoute } from "next"
import { getAllPosts, getPostTranslations } from "@/lib/blog"
import { localeTags } from "@/lib/i18n"
const SITE_URL = "https://lagrotti.dev"
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/en/blog`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/es/blog`, changeFrequency: "monthly", priority: 0.6 },
    ...posts.map(post => ({ url: `${SITE_URL}${post.url}`, lastModified: new Date(post.updatedAt ?? post.date), changeFrequency: "yearly" as const, priority: 0.7, alternates: { languages: Object.fromEntries(getPostTranslations(post).map(translation => [localeTags[translation.locale], `${SITE_URL}${translation.url}`])) } })),
  ]
}
