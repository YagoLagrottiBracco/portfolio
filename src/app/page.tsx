import { Navigation } from "@/components/organisms/Navigation"
import { Hero } from "@/components/organisms/Hero"
import { TechStack } from "@/components/organisms/TechStack"
import { FeaturedProjects } from "@/components/organisms/FeaturedProjects"
import { About } from "@/components/organisms/About"
import { Projects } from "@/components/organisms/Projects"
import { Experience } from "@/components/organisms/Experience"
import { Specializations } from "@/components/organisms/Specializations"
import { Contact } from "@/components/organisms/Contact"
import { Footer } from "@/components/organisms/Footer"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

/**
 * Homepage — a Server Component, so the HTML crawlers and link previews receive
 * is the real content. The interactive sections below are each `"use client"`.
 *
 * Project data lives in `@/data/personal`; the two project sections never repeat
 * an entry: `FeaturedProjects` renders the curated case studies and `Projects`
 * renders everything else.
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      <Analytics />
      <SpeedInsights />
      <Navigation />

      <main id="main">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Tech Stack Strip */}
        <TechStack />

        {/* 3. Featured Projects — case studies */}
        <FeaturedProjects />

        {/* 4. About */}
        <About />

        {/* 5. Remaining projects — filterable grid */}
        <Projects />

        {/* 6. Experience & Education */}
        <Experience />

        {/* 7. Specializations & Courses */}
        <Specializations />

        {/* 8. CTA / Contact */}
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
