"use client"

/**
 * @file Contact.tsx
 * @description High-contrast CTA section replacing the old email form.
 *
 * Displays:
 * - Title: "Vamos construir algo complexo juntos?"
 * - Supporting copy about architecture/SaaS/AI challenges
 * - Primary CTA button → Calendly scheduling link
 * - LinkedIn link
 *
 * The `id="contact"` is preserved so the Navigation scroll-to still works.
 */
import { motion } from "framer-motion"
import { Calendar, Linkedin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { personalData } from "@/data/personal"
import { useTranslation } from "@/contexts/TranslationContext"
import { useReveal } from "@/lib/motion"

export function Contact() {
  const { t } = useTranslation()
  const reveal = useReveal()

  return (
    <section id="contact" className="py-24 scroll-mt-20">
      <div className="container mx-auto px-4">
        <motion.div
          {...reveal()}
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-brand/25 bg-gradient-to-br from-brand-soft via-background to-background p-10 text-center sm:p-16"
        >
          {/* Decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-brand-soft blur-3xl"
          />

          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("contact.title")}
          </h2>

          <p className="relative mt-5 text-base text-muted-foreground sm:text-lg max-w-xl mx-auto leading-relaxed">
            {t("contact.subtitle")}
          </p>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="gap-2 text-base font-semibold">
              <a
                href="https://calendly.com/yago-lagrotti/30min"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar className="w-5 h-5" />
                {t("contact.cta")}
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="gap-2 border-emerald-500/40 text-base text-emerald-700 hover:border-emerald-500/60 hover:bg-emerald-500/10 dark:text-emerald-400"
            >
              <a
                href={personalData.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </Button>

            <Button variant="ghost" size="lg" asChild className="gap-2 text-base">
              <a
                href={personalData.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-5 h-5" />
                {t("contact.linkedin")}
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
