import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
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

const TITLE = "Yago Lagrotti | Senior Backend Engineer · Node.js · TypeScript · PostgreSQL";

/**
 * Written in English on purpose, even though the page itself is pt-BR: the
 * audience for this metadata is recruiters searching in English for remote
 * backend engineers.
 */
const DESCRIPTION =
  "Senior Backend Engineer with 10+ years of experience designing distributed, event-driven backend systems. Specializes in Node.js, TypeScript, PostgreSQL, and Docker. Open to remote roles worldwide and to end-to-end product work.";

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
    "Senior Backend Engineer",
    "Node.js",
    "TypeScript",
    "PostgreSQL",
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:shadow-lg"
        >
          Pular para o conteúdo
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
