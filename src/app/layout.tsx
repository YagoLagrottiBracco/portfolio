import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/ylb-icon.svg" type="image/svg+xml" />
        <title>Yago Lagrotti | Senior Backend Engineer · Node.js · TypeScript · PostgreSQL</title>
        <meta name="description" content="Senior Backend Engineer with 10+ years of experience designing distributed, event-driven backend systems. Specializes in Node.js, TypeScript, PostgreSQL, and Docker. Open to remote opportunities worldwide." />
        <meta name="keywords" content="Senior Backend Engineer, Node.js, TypeScript, PostgreSQL, Docker, Distributed Systems, Event-Driven Architecture, Microservices, Kafka, Remote Engineer" />
        <meta property="og:title" content="Yago Lagrotti | Senior Backend Engineer" />
        <meta property="og:description" content="Senior Backend Engineer · Node.js · TypeScript · PostgreSQL · Distributed Systems · Open to remote roles." />
        <meta name="robots" content="index, follow" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
