import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { SkipLink } from "@/components/atoms/SkipLink";
import { Providers } from "@/components/providers/Providers";
import { personalData } from "@/data/personal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://lagrotti.dev";

const TITLE = "Yago Lagrotti | Senior Software Engineer · Fullstack · DevOps";

/**
 * Written in English on purpose, even though the page itself is pt-BR: the
 * audience for this metadata is recruiters searching in English for remote
 * software engineers.
 */
const DESCRIPTION =
  "Senior Software Engineer with 10+ years building products end to end across fullstack development, systems architecture, and DevOps. React, Next.js, Node.js, Python, Laravel, PostgreSQL, MySQL, MongoDB, Docker, and Terraform. Open to remote roles and custom projects.";

/**
 * Site-wide metadata via the Next.js Metadata API.
 * Page-level files may override any of these fields.
 */
export const metadata: Metadata = {
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
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
};

/** JSON-LD so search engines can model the site as a real person, not a generic page. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personalData.name,
  url: SITE_URL,
  jobTitle: personalData.headline,
  description: personalData.summary,
  email: `mailto:${personalData.socialLinks.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Embu-Guaçu",
    addressRegion: "SP",
    addressCountry: "BR",
  },
  sameAs: [personalData.socialLinks.github, personalData.socialLinks.linkedin],
  knowsAbout: personalData.skills,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The manual <head> the other branch used is gone on purpose: those same
    // tags are now generated from the `metadata` export above, which also adds
    // canonical, OG image and Twitter card. Declaring both would duplicate them.
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          // JSON-LD is data, not markup — this is the documented Next.js pattern.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers><SkipLink />{children}</Providers>
      </body>
    </html>
  );
}
