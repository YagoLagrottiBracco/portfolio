"use client"

/**
 * @file Navigation.tsx
 * @description Fixed top navbar with scroll-aware background blur.
 *
 * Behavior:
 * - Transparent when at the top of the page; gains `bg-background/80 backdrop-blur`
 *   after the user scrolls past 50px.
 * - Desktop: inline nav links + LanguageSwitcher + ThemeToggle
 * - Mobile: hamburger menu that slides down a full-width nav panel
 * - Clicking the logo scrolls back to the top
 *
 * Nav items are defined in the `navItems` constant. Add new sections there
 * and give the corresponding `<section>` an `id` matching the href.
 */
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useTranslation } from '@/contexts/TranslationContext';
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/atoms/ThemeToggle"
import { LanguageSwitcher } from "@/components/atoms/LanguageSwitcher"
import { useRouter } from "next/navigation"

/**
 * Navigation items for the main menu.
 * `href` values starting with `#` are handled via smooth scroll.
 * Other values are passed to `router.push()`.
 */
const navItems = [
  { href: "#about", labelKey: "navigation.about" },
  { href: "#projects", labelKey: "navigation.projects" },
  { href: "#experience", labelKey: "navigation.experience" },
  { href: "#contact", labelKey: "navigation.contact" },
]

export function Navigation() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()

  // Listen to window scroll to toggle the nav background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /**
   * Handles navigation for both in-page anchors and external routes.
   * - `"#"` → scrolls to the top of the page
   * - `"#section"` → smooth scrolls to the matching element
   * - anything else → `router.push(href)`
   */
  const scrollToSection = (href: string) => {
    if (!href) {
      setIsOpen(false)
      return
    }

    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" })
      setIsOpen(false)
      return
    }

    if (href.startsWith("#")) {
      const element = document.querySelector<HTMLElement>(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
      setIsOpen(false)
      return
    }

    router.push(href)
    setIsOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors ${isScrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            onClick={() => scrollToSection("#")}
            className="text-xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            YL
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t(item.labelKey)}
              </button>
            ))}
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-b"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {t(item.labelKey)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
