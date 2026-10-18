import { discoveryPages, discoverySlugs } from "@/data/discovery"
import { personalData } from "@/data/personal"
import { getAllPosts } from "@/lib/blog"
import { getBlogFeedPath } from "@/lib/blog-routes"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { getCvPath } from "@/lib/cv-routes"
import { getDiscoveryPath } from "@/lib/discovery-routes"
import { locales } from "@/lib/i18n"
import { buildLlmsTxt } from "@/lib/llms"
import { getPagePath } from "@/lib/page-routes"
import { getCaseStudyProjects } from "@/lib/projects"
import { resourceSections } from "@/lib/resource-catalog"
import { getResourcePath } from "@/lib/resource-routes"
import { SITE_URL } from "@/lib/site"
import enMessages from "@/messages/en.json"

export const dynamic = "force-static"

/** Markdown map of the site for language models; see src/lib/llms.ts. */
export function GET() {
  const body = buildLlmsTxt({
    siteUrl: SITE_URL,
    name: personalData.name,
    headline: `${personalData.headline} · Full-Stack Developer · Software Developer & Programmer`,
    summary: enMessages.about.summary,
    contact: {
      email: personalData.socialLinks.email,
      linkedin: personalData.socialLinks.linkedin,
      github: personalData.socialLinks.github,
      workWithMe: getPagePath("en", "trabalhe-comigo"),
    },
    caseStudies: getCaseStudyProjects().map((project) => ({
      title: `${project.title.en} — ${project.tagline.en}`,
      url: getCaseStudyPath("en", project.slug),
      summary: project.description.en,
    })),
    resources: resourceSections.map((section) => ({
      title: section.title.en,
      url: getResourcePath("en", section.slug),
      summary: section.description.en,
    })),
    discovery: discoverySlugs.map((slug) => ({
      title: discoveryPages[slug].title.en,
      url: getDiscoveryPath("en", slug),
      summary: discoveryPages[slug].description.en,
    })),
    posts: getAllPosts().map((post) => ({ title: post.title, url: post.url, excerpt: post.excerpt, locale: post.locale })),
    cv: Object.fromEntries(locales.map((locale) => [locale, getCvPath(locale)])) as Record<(typeof locales)[number], string>,
    feeds: Object.fromEntries(locales.map((locale) => [locale, getBlogFeedPath(locale)])) as Record<(typeof locales)[number], string>,
  })
  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } })
}
