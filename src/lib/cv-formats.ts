/**
 * The résumé in the formats machines read: JSON Resume (jsonresume.org), plain
 * text for application forms and applicant-tracking systems, and a vCard to
 * save the contact on a phone. All built from `personalData`, like the PDF.
 */
import { localizeLabel } from "@/data/content-labels"
import { personalData } from "@/data/personal"
import { availabilityLabel } from "@/lib/availability"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import type { Locale } from "@/lib/i18n"
import { getCaseStudyProjects } from "@/lib/projects"
import { SITE_URL } from "@/lib/site"
import enMessages from "@/messages/en.json"
import esMessages from "@/messages/es.json"
import ptMessages from "@/messages/pt.json"

const messages = { pt: ptMessages, en: enMessages, es: esMessages }

const MONTHS: Record<string, string> = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" }

/**
 * ISO dates from the English period labels: "Feb 2023 - Aug 2023",
 * "Jan 2026 - present", "2015–2018". Anything else ("In progress") gives no dates.
 */
export function parsePeriod(period: string): { startDate?: string; endDate?: string } {
  const months = /^([A-Za-z]{3})\w* (\d{4})\s*[-–]\s*(?:([A-Za-z]{3})\w* (\d{4})|present)$/i.exec(period.trim())
  if (months) {
    const start = `${months[2]}-${MONTHS[months[1].toLowerCase()]}`
    return months[3] ? { startDate: start, endDate: `${months[4]}-${MONTHS[months[3].toLowerCase()]}` } : { startDate: start }
  }
  const years = /^(\d{4})\s*[-–]\s*(\d{4})$/.exec(period.trim())
  return years ? { startDate: years[1], endDate: years[2] } : {}
}

const profiles = () => [
  { network: "LinkedIn", url: personalData.socialLinks.linkedin, username: personalData.socialLinks.linkedin.replace(/\/$/, "").split("/").pop() },
  { network: "GitHub", url: personalData.socialLinks.github, username: personalData.socialLinks.github.replace(/\/$/, "").split("/").pop() },
]

/** https://jsonresume.org/schema — in the requested language. */
export function buildJsonResume(locale: Locale) {
  const text = messages[locale]
  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
    basics: {
      name: personalData.name,
      label: `${text.hero.headline} · ${text.hero.focus}`,
      email: personalData.socialLinks.email,
      phone: personalData.socialLinks.phone,
      url: SITE_URL,
      summary: text.about.summary,
      location: { city: "Embu-Guaçu", region: "SP", countryCode: "BR" },
      profiles: profiles(),
    },
    work: [...personalData.experience]
      .sort((a, b) => b.order - a.order)
      .map((job) => ({ name: localizeLabel(job.company, locale), position: job.position[locale], ...parsePeriod(job.period.en), summary: job.description[locale] })),
    education: [...personalData.education]
      .sort((a, b) => b.order - a.order)
      .map((entry) => ({ institution: entry.institution, studyType: entry.degree[locale], ...parsePeriod(entry.period.en) })),
    skills: personalData.skills.map((skill) => ({ name: localizeLabel(skill, locale) })),
    certificates: personalData.certifications.map((name) => ({ name })),
    projects: getCaseStudyProjects().map((project) => ({
      name: project.title[locale],
      description: `${project.tagline[locale]}. ${project.description[locale]}`,
      url: `${SITE_URL}${getCaseStudyPath(locale, project.slug)}`,
      keywords: project.techStack,
    })),
    // Portuguese is native; levels for the others are not stated anywhere on the site.
    languages: [{ language: "Portuguese", fluency: "Native speaker" }, { language: "English" }, { language: "Spanish" }],
    meta: { canonical: `${SITE_URL}/cv/${locale}/resume.json`, lastModified: personalData.availability.updatedAt },
  }
}

const plainLabels: Record<Locale, { summary: string; skills: string; experience: string; projects: string; education: string; certifications: string }> = {
  pt: { summary: "RESUMO", skills: "COMPETÊNCIAS", experience: "EXPERIÊNCIA", projects: "PROJETOS EM DESTAQUE", education: "FORMAÇÃO", certifications: "CERTIFICAÇÕES" },
  en: { summary: "SUMMARY", skills: "SKILLS", experience: "EXPERIENCE", projects: "SELECTED PROJECTS", education: "EDUCATION", certifications: "CERTIFICATIONS" },
  es: { summary: "RESUMEN", skills: "COMPETENCIAS", experience: "EXPERIENCIA", projects: "PROYECTOS DESTACADOS", education: "FORMACIÓN", certifications: "CERTIFICACIONES" },
}

/** Plain text with simple headings: what pastes cleanly into an application form. */
export function buildPlainTextCv(locale: Locale): string {
  const text = messages[locale]
  const label = plainLabels[locale]
  const section = (title: string, lines: string[]) => [title, ...lines, ""]
  return [
    personalData.name,
    `${text.hero.headline} · ${text.hero.focus}`,
    availabilityLabel[personalData.availability.status][locale],
    `${text.hero.location} · ${personalData.socialLinks.email} · ${personalData.socialLinks.phone}`,
    `${SITE_URL} · ${personalData.socialLinks.linkedin} · ${personalData.socialLinks.github}`,
    "",
    ...section(label.summary, [text.about.summary]),
    ...section(label.skills, [personalData.skills.map((skill) => localizeLabel(skill, locale)).join(", ")]),
    ...section(
      label.experience,
      [...personalData.experience]
        .sort((a, b) => b.order - a.order)
        .flatMap((job) => [`${job.position[locale]} — ${localizeLabel(job.company, locale)} (${job.period[locale]})`, job.description[locale], ""]),
    ),
    ...section(
      label.projects,
      getCaseStudyProjects().map((project) => `- ${project.title[locale]}: ${project.tagline[locale]} — ${SITE_URL}${getCaseStudyPath(locale, project.slug)}`),
    ),
    ...section(
      label.education,
      [...personalData.education].sort((a, b) => b.order - a.order).map((entry) => `- ${entry.degree[locale]} — ${entry.institution} (${entry.period[locale]})`),
    ),
    ...section(label.certifications, personalData.certifications.map((name) => `- ${name}`)),
  ].join("\n")
}

/** vCard 3.0 text values escape backslashes, commas, semicolons and newlines. */
const escapeVcard = (value: string) => value.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\r?\n/g, "\\n")

/** A contact card to save on a phone (RFC 2426), lines folded to CRLF as the format requires. */
export function buildVcard(locale: Locale = "pt"): string {
  const [first, ...rest] = personalData.name.split(" ")
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVcard(rest.join(" "))};${escapeVcard(first)};;;`,
    `FN:${escapeVcard(personalData.name)}`,
    `TITLE:${escapeVcard(messages[locale].hero.headline)}`,
    `EMAIL;TYPE=INTERNET,PREF:${personalData.socialLinks.email}`,
    `TEL;TYPE=CELL:${personalData.socialLinks.phone.replace(/[^+\d]/g, "")}`,
    `URL:${SITE_URL}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${personalData.socialLinks.linkedin}`,
    `X-SOCIALPROFILE;TYPE=github:${personalData.socialLinks.github}`,
    `ADR;TYPE=WORK:;;;Embu-Guaçu;SP;;${locale === "en" ? "Brazil" : "Brasil"}`,
    "END:VCARD",
  ]
  return lines.join("\r\n") + "\r\n"
}
