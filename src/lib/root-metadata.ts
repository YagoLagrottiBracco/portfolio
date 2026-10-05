import type { Metadata } from "next"

import { personalData } from "@/data/personal"
import { localeTags, type Locale } from "@/lib/i18n"
import { SITE_URL } from "@/lib/site"

const TITLE = "Yago Lagrotti | Senior Software Engineer · Fullstack · DevOps"

/**
 * The fallback for pages that set no metadata of their own. The homepages, the
 * case studies and the articles each declare theirs per language; this stays
 * in English because what is left — the 404, mostly — is shared by every audience.
 */
const DESCRIPTION =
  "Senior Software Engineer with 10+ years building products end to end across fullstack development, systems architecture, and DevOps. React, Next.js, Node.js, Python, Laravel, PostgreSQL, MySQL, MongoDB, Docker, and Terraform. Open to remote roles and custom projects."

/** Site-wide metadata, exported by each root layout. Pages may override any field. */
export function buildRootMetadata(locale: Locale): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: TITLE,
      template: `%s — ${personalData.name}`,
    },
    description: DESCRIPTION,
    keywords: [
      "Senior Software Engineer",
      "Fullstack Development",
      "DevOps",
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "Laravel",
      "Python",
      "Django",
      "FastAPI",
      "React",
      "Next.js",
      "Terraform",
      "Docker",
      "Distributed Systems",
      "Event-Driven Architecture",
      "Microservices",
      "Apache Kafka",
      "Golang",
      "Clean Architecture",
      "DDD",
      "Remote Engineer",
    ],
    authors: [{ name: personalData.name, url: SITE_URL }],
    creator: personalData.name,
    openGraph: {
      type: "website",
      locale: localeTags[locale].replace("-", "_"),
      url: SITE_URL,
      siteName: personalData.name,
      title: TITLE,
      description: DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    icons: {
      icon: "/ylb-icon.svg",
    },
    // Set GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION to claim the site in
    // Search Console and Bing Webmaster Tools without touching DNS.
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
    },
  }
}
