"use client"

/**
 * @file ContactLinks.tsx
 * @description The contact buttons outside the homepage's contact section —
 * the "work with me" page and the end of each article — each click counted
 * with where it happened.
 */
import React from "react"
import { Calendar, Linkedin, Mail, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { profile } from "@/data/profile"
import { trackEvent } from "@/lib/analytics"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export type ContactChannel = "calendly" | "whatsapp" | "linkedin" | "email"

const labels: Record<Locale, Record<ContactChannel, string>> = {
  pt: { calendly: "Agendar uma conversa", whatsapp: "WhatsApp", linkedin: "LinkedIn", email: "E-mail" },
  en: { calendly: "Book a call", whatsapp: "WhatsApp", linkedin: "LinkedIn", email: "Email" },
  es: { calendly: "Agendar una llamada", whatsapp: "WhatsApp", linkedin: "LinkedIn", email: "Correo" },
}

const links: Record<ContactChannel, { href: string; Icon: typeof Calendar }> = {
  calendly: { href: profile.socialLinks.calendly, Icon: Calendar },
  whatsapp: { href: profile.socialLinks.whatsapp, Icon: MessageCircle },
  linkedin: { href: profile.socialLinks.linkedin, Icon: Linkedin },
  email: { href: `mailto:${profile.socialLinks.email}`, Icon: Mail },
}

interface ContactLinksProps {
  locale: Locale
  /** Recorded with each click, e.g. `work-with-me` or `article:<key>`. */
  placement: string
  channels?: ContactChannel[]
  /** Where "book a call" points; the work-with-me page sends it to its own embed. */
  calendlyHref?: string
  className?: string
}

export function ContactLinks({ locale, placement, channels = ["calendly", "whatsapp", "linkedin", "email"], calendlyHref, className }: ContactLinksProps) {
  return (
    <div className={cn("flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center", className)}>
      {channels.map((channel, index) => {
        const { Icon } = links[channel]
        const href = channel === "calendly" && calendlyHref ? calendlyHref : links[channel].href
        const external = channel !== "email" && !href.startsWith("#")
        return (
          <Button key={channel} asChild size="lg" variant={index === 0 ? "default" : "outline"} className="gap-2 font-semibold">
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              onClick={() => trackEvent("contact_click", { channel, placement })}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {labels[locale][channel]}
            </a>
          </Button>
        )
      })}
    </div>
  )
}
