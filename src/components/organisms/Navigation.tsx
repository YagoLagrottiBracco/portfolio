"use client"

/**
 * @file Navigation.tsx
 * @description Fixed top navbar with scroll-aware background and an active-section indicator.
 *
 * Items are real anchors, not buttons: they deep-link, they open in a new tab
 * with a modifier key, and they still work before hydration. Smooth scrolling
 * comes from `scroll-behavior` in globals.css, and `scroll-padding-top` keeps
 * the target clear of this bar.
 *
 * Add a section by putting it in `navItems` and giving the `<section>` a
 * matching `id`.
 */
import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { useTranslation } from "@/contexts/TranslationContext"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/atoms/ThemeToggle"
import { LanguageSwitcher } from "@/components/atoms/LanguageSwitcher"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "featured-projects", labelKey: "navigation.work" },
  { id: "about", labelKey: "navigation.about" },
  { id: "projects", labelKey: "navigation.projects" },
  { id: "experience", labelKey: "navigation.experience" },
  { id: "contact", labelKey: "navigation.contact" },
]

export function Navigation() {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const pathname = usePathname()
  const prefersReduced = useReducedMotion()

  // Anchors only resolve on the homepage; elsewhere they need to go home first.
  const isHome = pathname === "/"
  const hrefFor = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Highlight whichever section currently owns the upper part of the viewport.
  useEffect(() => {
    if (!isHome) {
      setActiveId(null)
      return
    }

    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible[0]) setActiveId(visible[0].target.id)
      },
      // Focus on the band just under the navbar, so the highlight matches
      // whatever the reader is actually looking at.
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [isHome])

  return (
    <motion.nav
      initial={prefersReduced ? false : { y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-200",
        isScrolled ? "border-b border-hairline bg-background/80 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="rounded-md text-xl font-bold transition-opacity hover:opacity-80"
            aria-label={t("navigation.home")}
          >
            YL
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => {
              const isActive = activeId === item.id
              return (
                <a
                  key={item.id}
                  href={hrefFor(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative py-1 text-sm transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t(item.labelKey)}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-brand"
                    />
                  )}
                </a>
              )
            })}
            <LanguageSwitcher />
            <ThemeToggle />
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
              aria-label={isOpen ? t("navigation.closeMenu") : t("navigation.openMenu")}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            initial={prefersReduced ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-hairline bg-background md:hidden"
          >
            <div className="container mx-auto space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={hrefFor(item.id)}
                  onClick={() => setIsOpen(false)}
                  aria-current={activeId === item.id ? "true" : undefined}
                  className={cn(
                    "flex h-11 items-center rounded-md px-2 transition-colors",
                    activeId === item.id
                      ? "bg-surface text-foreground"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground"
                  )}
                >
                  {t(item.labelKey)}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
