import type { Metadata } from "next"

import { personalData } from "@/data/personal"
import { locales, localeTags, type Locale } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"
import { PERSON_ID, SITE_URL } from "@/lib/site"

/**
 * Each homepage is written for the people searching in its language: the
 * Portuguese one for the Brazilian market, the English one for remote roles
 * abroad, the Spanish one for Latin America and Spain.
 */
export const homeCopy: Record<Locale, { title: string; description: string }> = {
  pt: {
    title: "Yago Lagrotti | Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior",
    description:
      "Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior com mais de 10 anos construindo produtos de ponta a ponta no Brasil: desenvolvimento web e backend, arquitetura de sistemas e DevOps. React, Next.js, Node.js, TypeScript, Python, PHP/Laravel, PostgreSQL, MySQL, MongoDB, Docker e Terraform. Aberto a vagas remotas e a projetos de software sob medida.",
  },
  en: {
    title: "Yago Lagrotti | Senior Software Engineer, Full-Stack Developer & Programmer",
    description:
      "Senior Software Engineer, Full-Stack Developer, and Programmer with 10+ years building products end to end across web and backend development, systems architecture, and DevOps. React, Next.js, Node.js, TypeScript, Python, PHP/Laravel, PostgreSQL, MySQL, MongoDB, Docker, and Terraform. Open to remote roles and custom software projects.",
  },
  es: {
    title: "Yago Lagrotti | Programador, Desarrollador Full Stack e Ingeniero de Software Sénior",
    description:
      "Programador, Desarrollador Full Stack e Ingeniero de software sénior con más de 10 años creando productos de principio a fin: desarrollo web y backend, arquitectura de sistemas y DevOps. React, Next.js, Node.js, TypeScript, Python, PHP/Laravel, PostgreSQL, MySQL, MongoDB, Docker y Terraform. Abierto a puestos remotos y proyectos de software a medida.",
  },
}

export const homeKeywords: Record<Locale, string[]> = {
  pt: [
    "programador",
    "programador full stack",
    "programador sênior",
    "programador freelancer",
    "programador web",
    "programador brasil",
    "programador são paulo",
    "contratar programador",
    "desenvolvedor de software",
    "desenvolvedor full stack",
    "desenvolvedor sênior",
    "desenvolvedor backend",
    "desenvolvedor frontend",
    "desenvolvedor web",
    "engenheiro de software sênior",
    "arquiteto de software",
    "programador node.js",
    "programador react",
    "programador typescript",
    "programador python",
    "programador php",
    "programador laravel",
    "programador next.js",
    "desenvolvimento de software sob medida",
    "consultoria de software",
    "DevOps",
    "Yago Lagrotti",
    "Yago Lagrotti Bracco",
  ],
  en: [
    "Senior Software Engineer",
    "Full-Stack Developer",
    "Software Developer",
    "Programmer",
    "Computer Programmer",
    "Freelance Programmer",
    "Web Developer",
    "Backend Developer",
    "Frontend Developer",
    "Hire Software Developer",
    "Remote Software Engineer",
    "Node.js Developer",
    "TypeScript Developer",
    "React Developer",
    "Next.js Developer",
    "Python Developer",
    "Laravel Developer",
    "Software Architect",
    "DevOps Engineer",
    "Custom Software Development",
    "Yago Lagrotti",
    "Yago Lagrotti Bracco",
  ],
  es: [
    "programador",
    "programador full stack",
    "programador sénior",
    "programador freelance",
    "programador web",
    "contratar programador",
    "desarrollador de software",
    "desarrollador full stack",
    "desarrollador sénior",
    "desarrollador backend",
    "desarrollador frontend",
    "desarrollador web",
    "ingeniero de software sénior",
    "arquitecto de software",
    "programador node.js",
    "programador react",
    "programador typescript",
    "programador python",
    "programador php",
    "programador laravel",
    "desarrollo de software a medida",
    "DevOps",
    "Yago Lagrotti",
    "Yago Lagrotti Bracco",
  ],
}

export function getHomeAlternates(): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((locale) => [localeTags[locale], getHomePath(locale)])),
    "x-default": getHomePath("pt"),
  }
}

export function buildHomeMetadata(locale: Locale): Metadata {
  const { title, description } = homeCopy[locale]
  const path = getHomePath(locale)
  // Named explicitly: a page that sets its own `openGraph` does not inherit the
  // generated card from the root segment, and `/en` and `/es` would ship without one.
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: title }

  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    keywords: homeKeywords[locale],
    alternates: { canonical: path, languages: getHomeAlternates() },
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
      locale: localeTags[locale].replace("-", "_"),
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  }
}

export const personRoles: Record<Locale, string[]> = {
  pt: [
    "Engenheiro de Software Sênior",
    "Programador Full Stack",
    "Desenvolvedor de Software Sênior",
    "Arquiteto de Software",
  ],
  en: [
    "Senior Software Engineer",
    "Full-Stack Developer",
    "Software Developer",
    "Programmer",
    "Software Architect",
  ],
  es: [
    "Ingeniero de Software Sénior",
    "Programador Full Stack",
    "Desarrollador de Software Sénior",
    "Arquitecto de Software",
  ],
}

/** JSON-LD so search engines can model the site as a real person and professional across all search intents. */
export function buildPersonJsonLd(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: personalData.name,
    alternateName: ["Yago Lagrotti", "Yago Bracco"],
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    jobTitle: personRoles[lang],
    description: homeCopy[lang].description,
    email: `mailto:${personalData.socialLinks.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Embu-Guaçu",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    hasOccupation: personRoles[lang].map((role) => ({
      "@type": "Occupation",
      name: role,
      occupationLocation: {
        "@type": "Country",
        name: lang === "en" ? "Brazil" : "Brasil",
      },
      skills: personalData.skills.join(", "),
    })),
    sameAs: [personalData.socialLinks.github, personalData.socialLinks.linkedin],
    knowsAbout: Array.from(new Set([...personalData.skills, ...homeKeywords[lang]])),
    knowsLanguage: ["pt-BR", "en", "es"],
  }
}

