import { Navigation } from "@/components/organisms/Navigation"
import { Hero } from "@/components/organisms/Hero"
import { TechStack } from "@/components/organisms/TechStack"
import { FeaturedProjects } from "@/components/organisms/FeaturedProjects"
import { About } from "@/components/organisms/About"
import { Projects } from "@/components/organisms/Projects"
import { Experience } from "@/components/organisms/Experience"
import { Specializations } from "@/components/organisms/Specializations"
import { Contact } from "@/components/organisms/Contact"
import { personalData } from "@/data/personal"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* 1. Hero */}
      <Hero />

      {/* 2. Tech Stack Strip */}
      <TechStack />

      {/* 3. Featured Projects */}
      <FeaturedProjects />

      {/* 4. About */}
      <About />

      {/* 5. Full Projects Grid */}
      <Projects />

      {/* 6. Experience & Education */}
      <Experience />

      {/* 7. Specializations & Courses */}
      <Specializations />

      {/* 8. CTA / Contact */}
      <Contact />

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 bg-muted/20">
        <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Yago Lagrotti Bracco. Built with Next.js &amp; Tailwind CSS.
          </p>
          <a
            href={personalData.socialLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  )
}
