import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yago Lagrotti Bracco | Fullstack Developer",
  description: "Portfolio of Yago Lagrotti Bracco, a Fullstack Software Developer specializing in Node.js, PHP, and Vue.js with over 8 years of experience.",
  keywords: ["Fullstack Developer", "Node.js", "NestJS", "PHP", "Laravel", "Vue.js", "React", "Next.js", "TypeScript"],
  authors: [{ name: "Yago Lagrotti Bracco" }],
  openGraph: {
    title: "Yago Lagrotti Bracco | Fullstack Developer",
    description: "Portfolio of Yago Lagrotti Bracco, a Fullstack Software Developer specializing in Node.js, PHP, and Vue.js with over 8 years of experience.",
    url: "https://lagrotti.dev",
    siteName: "Yago Lagrotti Bracco Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yago Lagrotti Bracco | Fullstack Developer",
    description: "Portfolio of Yago Lagrotti Bracco, a Fullstack Software Developer specializing in Node.js, PHP, and Vue.js with over 8 years of experience.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
