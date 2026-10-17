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
 *
 * A Server Component: no JavaScript of its own reaches the browser, so it
 * costs nothing to hydrate on a slow phone. Tracked links are `TrackedLink`.
 */
import { Calendar, Contact as ContactIcon, Download, Linkedin, MessageCircle } from "lucide-react"
import { TrackedLink } from "@/components/atoms/TrackedLink"
import { buttonVariants } from "@/components/ui/button"
import { personalData } from "@/data/personal"
import { getCvFileName, getCvPath, VCARD_PATH } from "@/lib/cv-routes"
import type { Locale } from "@/lib/i18n"
import { reveal } from "@/lib/motion"
import { translator } from "@/lib/translate"
import { cn } from "@/lib/utils"

export function Contact({ locale }: { locale: Locale }) {
  const t = translator(locale)

  return (
    <section id="contact" className="py-24 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div
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
            <TrackedLink
              href={personalData.socialLinks.calendly}
              target="_blank"
              rel="noopener noreferrer"
              event="contact_click"
              properties={{ channel: "calendly", placement: "contact" }}
              className={cn(buttonVariants({ size: "lg" }), "gap-2 text-base font-semibold")}
            >
              <Calendar className="w-5 h-5" />
              {t("contact.cta")}
            </TrackedLink>

            <TrackedLink
              href={personalData.socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              event="contact_click"
              properties={{ channel: "whatsapp", placement: "contact" }}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2 border-emerald-500/40 text-base text-emerald-700 hover:border-emerald-500/60 hover:bg-emerald-500/10 dark:text-emerald-400"
              )}
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </TrackedLink>

            <TrackedLink
              href={personalData.socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              event="contact_click"
              properties={{ channel: "linkedin", placement: "contact" }}
              className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "gap-2 text-base")}
            >
              <Linkedin className="w-5 h-5" />
              {t("contact.linkedin")}
            </TrackedLink>
          </div>

          <TrackedLink
            href={getCvPath(locale)}
            download={getCvFileName(locale)}
            event="cv_download"
            properties={{ placement: "contact", locale }}
            className="relative mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {t("contact.cv")}
          </TrackedLink>
          <TrackedLink
            href={VCARD_PATH}
            event="contact_save"
            properties={{ placement: "contact" }}
            className="relative mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            <ContactIcon className="h-4 w-4" aria-hidden="true" />
            {t("contact.saveContact")}
          </TrackedLink>
        </div>
      </div>
    </section>
  )
}
