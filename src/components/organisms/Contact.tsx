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

export function Contact() {
  const { t } = useTranslation()

  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-950/60 via-background to-background p-10 text-center shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)] sm:p-16"
        >
          {/* Decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-blue-500/10 blur-3xl"
          />

          <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            {t("contact.title")}
          </h2>

          <p className="relative mt-5 text-base text-muted-foreground sm:text-lg max-w-xl mx-auto leading-relaxed">
            {t("contact.subtitle")}
          </p>

          <div className="relative mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="gap-2 text-base font-semibold shadow-lg shadow-blue-500/20"
            >
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
              className="gap-2 text-base border-green-500/30 text-green-400 hover:bg-green-500/10 hover:border-green-500/60"
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
