import { personalData } from "@/data/personal"
import { isLocale, localeTags, type Locale } from "@/lib/i18n"
import { getCaseStudyProjects } from "@/lib/projects"
import { SITE_URL } from "@/lib/site"

export const runtime = "nodejs"
export const dynamic = "force-static"

export function generateStaticParams() { return [{ locale: "pt" }, { locale: "en" }, { locale: "es" }] }

export async function GET(_request: Request, context: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await context.params
  if (!isLocale(raw)) return Response.json({ error: "Unsupported locale" }, { status: 404 })
  const locale: Locale = raw

  return Response.json({
    basics: {
      name: personalData.name,
      label: personalData.headline,
      summary: personalData.summary,
      location: { address: personalData.location },
      profiles: [
        { network: "GitHub", url: personalData.socialLinks.github, username: "YagoLagrottiBracco" },
        { network: "LinkedIn", url: personalData.socialLinks.linkedin, username: "yago-lagrotti-bracco" },
        { network: "Website", url: SITE_URL, username: "lagrotti.dev" },
      ],
      email: personalData.socialLinks.email,
      phone: personalData.socialLinks.phone,
    },
    work: personalData.experience.map(job => ({
      name: job.company,
      position: job.position[locale],
      summary: job.description[locale],
      startDate: job.period[locale],
    })).sort((a, b) => a.name.localeCompare(b.name)),
    education: personalData.education.map(entry => ({
      institution: entry.institution,
      area: entry.degree[locale],
      studyType: entry.degree[locale],
      startDate: entry.period[locale],
    })),
    skills: personalData.skills.map(name => ({ name, keywords: [name] })),
    projects: getCaseStudyProjects().map(project => ({
      name: project.title[locale],
      description: project.tagline[locale],
      url: `${SITE_URL}/${locale === "pt" ? "" : `${locale}/`}projetos/${project.slug}`,
      highlights: project.techStack,
    })),
    meta: { canonical: `${SITE_URL}/api/resume/${locale}`, language: localeTags[locale], version: "jsonresume:1.0" },
  }, { headers: { "Content-Type": "application/json; charset=utf-8" } })
}
