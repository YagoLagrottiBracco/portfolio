import { Navigation } from "@/components/organisms/Navigation"
import { Hero } from "@/components/organisms/Hero"
import { About } from "@/components/organisms/About"
import { Projects } from "@/components/organisms/Projects"
import { Experience } from "@/components/organisms/Experience"
import { Contact } from "@/components/organisms/Contact"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Contact />

      {/* Footer */}
      <footer className="py-8 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Yago Lagrotti Bracco. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  )
}
