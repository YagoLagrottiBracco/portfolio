/**
 * Testimonials from people Yago worked with, collected at `/recomendar`. The
 * submission arrives by email with the consent given and a ready-to-paste
 * entry for `personalData.testimonials`; nothing is published until Yago adds
 * it by hand, so every testimonial on the site is one he reviewed.
 */
import { createHash } from "node:crypto"

import type { AuditLog } from "@/lib/audit-log"
import { readAttribution, safeLink, type FormStatus } from "@/lib/brief"
import { createFormEndpoint, localPage, type FormSubmission } from "@/lib/form-endpoint"
import { isLocale, locales, type Locale } from "@/lib/i18n"
import { fieldLines, inboxConfig, sendToInbox, type InboxConfig } from "@/lib/inbox"
import { createRateLimiter, type RateLimiter } from "@/lib/rate-limit"

export const relationships = ["client", "manager", "colleague", "report", "other"] as const
export type Relationship = (typeof relationships)[number]

export interface Recommendation extends FormSubmission {
  name: string
  email: string
  role: string
  company?: string
  relationship: Relationship
  /** Case study slug, when it is about one project. */
  project?: string
  quote: string
  /** Numbers the person can vouch for, which may feed a case study's metrics. */
  results?: string
  link?: string
  /** Consent to translate the quote into the site's other languages. */
  translate: boolean
  locale: Locale
  attribution: Record<string, string>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "")
const checked = (value: unknown) => value === true || value === "on" || value === "true"

export function parseRecommendation(fields: Record<string, unknown>, projectSlugs: string[]): Recommendation | null {
  const name = text(fields.name, 100)
  const email = text(fields.email, 254)
  const role = text(fields.role, 100)
  const quote = text(fields.quote, 1500)
  const relationship = relationships.find((value) => value === fields.relationship)
  const project = text(fields.project, 60)
  // Publishing needs explicit consent; without it the form is only feedback, which belongs in an email.
  if (!name || !EMAIL.test(email) || !role || quote.length < 40 || !relationship || !checked(fields.consent)) return null
  return {
    name,
    email,
    role,
    company: text(fields.company, 100) || undefined,
    relationship,
    project: SLUG.test(project) && projectSlugs.includes(project) ? project : undefined,
    quote,
    results: text(fields.results, 600) || undefined,
    link: safeLink(fields.link),
    translate: checked(fields.translate),
    locale: isLocale(fields.locale) ? fields.locale : "pt",
    page: localPage(fields.page),
    attribution: readAttribution(fields),
    trap: text(fields.website, 200),
  }
}

const relationshipLabel: Record<Relationship, string> = { client: "Cliente", manager: "Gestor(a)", colleague: "Colega", report: "Liderado(a)", other: "Outro" }

/** The entry to paste into `personalData.testimonials`; untranslated languages carry a TODO. */
export function testimonialSnippet(recommendation: Recommendation): string {
  const localized = (value: string) =>
    `{ ${locales.map((locale) => `${locale}: ${JSON.stringify(locale === recommendation.locale ? value : `TODO(${locale}) ${value}`)}`).join(", ")} }`
  return [
    "{",
    `  quote: ${localized(recommendation.quote)},`,
    `  author: ${JSON.stringify(recommendation.name)},`,
    `  role: ${localized(recommendation.role)},`,
    ...(recommendation.company ? [`  company: ${JSON.stringify(recommendation.company)},`] : []),
    ...(recommendation.link ? [`  url: ${JSON.stringify(recommendation.link)},`] : []),
    ...(recommendation.project ? [`  project: ${JSON.stringify(recommendation.project)},`] : []),
    "},",
  ].join("\n")
}

export function recommendationEmail(recommendation: Recommendation) {
  return {
    subject: `[lagrotti.dev] Depoimento: ${recommendation.name}${recommendation.company ? ` (${recommendation.company})` : ""}`,
    replyTo: recommendation.email,
    text: [
      fieldLines([
        ["Nome", recommendation.name],
        ["E-mail", recommendation.email],
        ["Cargo", recommendation.role],
        ["Empresa", recommendation.company],
        ["Relação", relationshipLabel[recommendation.relationship]],
        ["Projeto", recommendation.project],
        ["Link público", recommendation.link],
        ["Idioma do texto", recommendation.locale],
      ]),
      "",
      "Depoimento:",
      recommendation.quote,
      ...(recommendation.results ? ["", "Resultados que pode confirmar:", recommendation.results] : []),
      "",
      "Consentimento:",
      "- Publicar com nome, cargo e empresa no lagrotti.dev: sim",
      `- Traduzir para os outros idiomas do site: ${recommendation.translate ? "sim" : "não (publique só no idioma original ou peça autorização)"}`,
      "",
      "Para publicar, cole em personalData.testimonials (src/data/personal.ts) e complete as traduções marcadas com TODO:",
      "",
      testimonialSnippet(recommendation),
    ].join("\n"),
    idempotencyKey: createHash("sha256").update(`${recommendation.email}\n${recommendation.quote}`).digest("hex"),
  }
}

interface RecommendationHandlerOptions {
  projectSlugs: string[]
  inbox?: InboxConfig | null
  fetch?: typeof fetch
  limiter?: RateLimiter
  log?: AuditLog
}

export function createRecommendationHandler({ projectSlugs, inbox = inboxConfig(), fetch: fetcher, limiter = createRateLimiter({ limit: 3, windowMs: 60 * 60_000 }), log }: RecommendationHandlerOptions) {
  return createFormEndpoint<Recommendation, FormStatus>({
    action: "contact.recommendation",
    fragment: "recommendation",
    statuses: { ok: "sent", invalid: "invalid", unavailable: "unavailable" },
    httpStatus: { sent: 200, invalid: 400, unavailable: 503 },
    limiter,
    log,
    maxBytes: 20_000,
    parse: (fields) => parseRecommendation(fields, projectSlugs),
    describe: (recommendation) => ({ relationship: recommendation.relationship, project: recommendation.project, locale: recommendation.locale }),
    handle: async (recommendation) => (inbox && (await sendToInbox(recommendationEmail(recommendation), inbox, fetcher)) ? "sent" : "unavailable"),
  })
}
