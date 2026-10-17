/**
 * @file profile.ts
 * @description Who Yago is and how to reach him: the part of the portfolio data
 * that components on every page need (navigation, footer, contact buttons).
 *
 * It lives apart from `personal.ts` so the browser does not download every
 * case study, in three languages, just to render a footer link. `personalData`
 * includes all of it, so server code keeps reading one object.
 */
import type { AvailabilityStatus } from "@/lib/availability"

export const profile = {
  name: "Yago Lagrotti Bracco",
  socialLinks: {
    github: "https://github.com/YagoLagrottiBracco",
    linkedin: "https://www.linkedin.com/in/yago-lagrotti-bracco/",
    email: "yago.lagrotti@outlook.com",
    whatsapp: "https://wa.me/5517997642678",
    phone: "+55 17 99764-2678",
    domain: "lagrotti.dev",
    calendly: "https://calendly.com/yago-lagrotti/30min",
  },
  /**
   * Whether new work is welcome. Changing `status` updates the homepage badge,
   * the résumé and `/agora`; also review `contact.subtitle` in the messages and
   * the intro in `work-with-me.ts`, which say "available immediately".
   */
  availability: { status: "available" as AvailabilityStatus, updatedAt: "2026-10-17" },
}
