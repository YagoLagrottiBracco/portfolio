import type { MetadataRoute } from "next"

import { getAllPosts } from "@/lib/blog"
import { getCaseStudyProjects } from "@/lib/projects"

const SITE_URL = "https://lagrotti.dev"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const caseStudies = getCaseStudyProjects().map((project) => ({
    url: `${SITE_URL}/projetos/${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const posts = getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }))

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    ...caseStudies,
    ...posts,
  ]
}
