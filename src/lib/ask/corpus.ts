import "server-only"

/**
 * What "Ask my portfolio" knows, built from the same data as the pages:
 * a profile (summary, experience, education, skills, screening answers) and
 * one document per case study — stable, cached — plus article sections,
 * retrieved per question.
 */
import { localizeLabel } from "@/data/content-labels"
import { personalData } from "@/data/personal"
import { screening } from "@/data/screening"
import type { AskDocument } from "@/lib/ask/request"
import type { Section } from "@/lib/ask/retrieval"
import { availabilityLabel } from "@/lib/availability"
import { getAllPosts } from "@/lib/blog"
import { getBlogOutline } from "@/lib/blog-outline"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import type { Locale } from "@/lib/i18n"
import { getPagePath } from "@/lib/page-routes"
import { getCaseStudyProjects } from "@/lib/projects"
import { SITE_URL } from "@/lib/site"
import enMessages from "@/messages/en.json"
import esMessages from "@/messages/es.json"
import ptMessages from "@/messages/pt.json"

const messages = { pt: ptMessages, en: enMessages, es: esMessages }

const profileTitle: Record<Locale, string> = { pt: "Perfil e experiência", en: "Profile and experience", es: "Perfil y experiencia" }

function profileDocument(locale: Locale): AskDocument {
  const text = messages[locale]
  const answered = screening.flatMap((item) => (item.answer ? [`- ${item.question[locale]} ${item.answer[locale]}`] : []))
  return {
    title: profileTitle[locale],
    url: `${SITE_URL}${getPagePath(locale, "trabalhe-comigo")}`,
    text: [
      `${personalData.name} — ${text.hero.headline} (${text.hero.focus})`,
      `${text.hero.location}. ${availabilityLabel[personalData.availability.status][locale]}.`,
      text.about.summary,
      text.contact.subtitle,
      `Skills: ${personalData.skills.join(", ")}.`,
      "",
      "Experience:",
      ...[...personalData.experience].sort((a, b) => b.order - a.order).map((job) => `- ${job.position[locale]}, ${localizeLabel(job.company, locale)} (${job.period[locale]}): ${job.description[locale]}`),
      "",
      "Education:",
      ...[...personalData.education].sort((a, b) => b.order - a.order).map((entry) => `- ${entry.degree[locale]}, ${entry.institution} (${entry.period[locale]})`),
      `Certifications: ${personalData.certifications.join("; ")}.`,
      "",
      "Answers to common recruiter questions:",
      ...answered,
      "",
      `Contact: ${personalData.socialLinks.email} · ${personalData.socialLinks.linkedin} · ${SITE_URL}${getPagePath(locale, "trabalhe-comigo")}`,
    ].join("\n"),
  }
}

function caseStudyDocuments(locale: Locale): AskDocument[] {
  return getCaseStudyProjects().map((project) => {
    const study = project.caseStudy
    return {
      title: `${project.title[locale]} — ${project.tagline[locale]}`,
      url: `${SITE_URL}${getCaseStudyPath(locale, project.slug)}`,
      text: [
        project.description[locale],
        `Status: ${project.status[locale]}${project.year ? ` · ${project.year}` : ""}`,
        `Context: ${study.context[locale]}`,
        `Challenge: ${study.challenge[locale]}`,
        `Solution: ${study.solution[locale]}`,
        ...(study.architecture ? [`Code organisation: ${study.architecture[locale]}`] : []),
        "Engineering decisions:",
        ...study.highlights.map((item) => `- ${item.title[locale]}: ${item.description[locale]}`),
        ...(study.metrics?.length ? [`Numbers: ${study.metrics.map((metric) => localizeLabel(metric, locale)).join("; ")}`] : []),
        `Stack: ${project.techStack.join(", ")}`,
      ].join("\n"),
    }
  })
}

const stable = new Map<Locale, AskDocument[]>()

/** The cached prefix: identical for every question in a language, built once per instance. */
export function stableDocuments(locale: Locale): AskDocument[] {
  if (!stable.has(locale)) stable.set(locale, [profileDocument(locale), ...caseStudyDocuments(locale)])
  return stable.get(locale)!
}

const sectionsByLocale = new Map<Locale, Section[]>()

/** Every H2 section of every article in a language, with a link to its heading. */
export function articleSections(locale: Locale): Section[] {
  if (!sectionsByLocale.has(locale)) {
    sectionsByLocale.set(locale, getAllPosts(locale).flatMap((post) => {
      const headings = getBlogOutline(post.content).filter((heading) => heading.depth === 2)
      return post.content.split(/^## /m).slice(1).map((chunk, index) => {
        const [heading, ...body] = chunk.split("\n")
        return {
          title: `${post.title} — ${heading.trim()}`,
          url: `${SITE_URL}${post.url}${headings[index] ? `#${headings[index].id}` : ""}`,
          // Long sections are cut: enough to answer from, bounded in cost.
          text: body.join("\n").trim().slice(0, 2500),
          keywords: `${post.title} ${post.tags.join(" ")}`,
          article: post.translationKey,
        }
      })
    }))
  }
  return sectionsByLocale.get(locale)!
}
