/**
 * `/llms.txt` (https://llmstxt.org): a Markdown map of the site for language
 * models answering questions about Yago or his work. Built from the same data
 * as the pages, so it can never describe something the site does not say.
 */
import type { Locale } from "@/lib/i18n"

interface LlmsInput {
  siteUrl: string
  name: string
  headline: string
  summary: string
  contact: { email: string; linkedin: string; github: string; workWithMe: string }
  caseStudies: { title: string; url: string; summary: string }[]
  posts: { title: string; url: string; excerpt: string; locale: Locale }[]
  resources?: { title: string; url: string; summary: string }[]
  discovery?: { title: string; url: string; summary: string }[]
  cv: Record<Locale, string>
  feeds: Record<Locale, string>
}

const languageNames: Record<Locale, string> = { pt: "Português", en: "English", es: "Español" }

const line = (title: string, url: string, note: string) => `- [${title}](${url}): ${note.replace(/\s+/g, " ").trim()}`

export function buildLlmsTxt(input: LlmsInput): string {
  const absolute = (path: string) => (path.startsWith("http") ? path : `${input.siteUrl}${path}`)
  const sections = [
    `# ${input.name}`,
    "",
    `> ${`${input.headline}. ${input.summary}`.replace(/\s+/g, " ")}`,
    "",
    "The site exists in Portuguese (canonical, unprefixed), English (/en) and Spanish (/es). Every case study below is available in all three.",
    "",
    "## Contact",
    "",
    line("Work with me", absolute(input.contact.workWithMe), "open to remote senior engineering roles and custom projects"),
    `- Email: ${input.contact.email}`,
    line("LinkedIn", input.contact.linkedin, "professional profile"),
    line("GitHub", input.contact.github, "open source and project code"),
    "",
    "## Case studies",
    "",
    ...input.caseStudies.map((study) => line(study.title, absolute(study.url), study.summary)),
    "",
    ...(input.resources?.length
      ? ["## Engineering resources", "", ...input.resources.map((item) => line(item.title, absolute(item.url), item.summary)), ""]
      : []),
    ...(input.discovery?.length
      ? ["## Discovery & references", "", ...input.discovery.map((item) => line(item.title, absolute(item.url), item.summary)), ""]
      : []),
    ...(["pt", "en", "es"] as const).flatMap((locale) => {
      const posts = input.posts.filter((post) => post.locale === locale)
      if (posts.length === 0) return []
      return [`## Articles (${languageNames[locale]})`, "", ...posts.map((post) => line(post.title, absolute(post.url), post.excerpt)), ""]
    }),
    "## Optional",
    "",
    ...(["pt", "en", "es"] as const).map((locale) => line(`Résumé (${languageNames[locale]}, PDF)`, absolute(input.cv[locale]), "generated from the same data as the site")),
    ...(["pt", "en", "es"] as const).map((locale) => line(`Résumé (${languageNames[locale]}, plain text)`, absolute(`${input.cv[locale]}/plain.txt`), "the same résumé as text")),
    line("Résumé (JSON Resume)", absolute(`${input.cv.en}/resume.json`), "structured career data following jsonresume.org"),
    ...(["pt", "en", "es"] as const).map((locale) => line(`RSS feed (${languageNames[locale]})`, absolute(input.feeds[locale]), "every article in that language")),
    "",
  ]
  return sections.join("\n")
}
