/**
 * The project/role brief: for people who would rather write than book a call.
 * It arrives by email with where the person came from, so a lead can be traced
 * back to the post or link that brought them.
 */
import { createHash } from "node:crypto"

import type { AuditLog } from "@/lib/audit-log"
import { createFormEndpoint, localPage, type FormSubmission } from "@/lib/form-endpoint"
import { isLocale, type Locale } from "@/lib/i18n"
import { fieldLines, inboxConfig, sendToInbox, type InboxConfig } from "@/lib/inbox"
import { createRateLimiter, type RateLimiter } from "@/lib/rate-limit"
import { SITE_URL } from "@/lib/site"

export const briefKinds = ["role", "project", "other"] as const
export type BriefKind = (typeof briefKinds)[number]
export const briefTimelines = ["now", "soon", "later", "exploring"] as const
export type BriefTimeline = (typeof briefTimelines)[number]

export type FormStatus = "sent" | "invalid" | "unavailable"

export interface Brief extends FormSubmission {
  name: string
  email: string
  company?: string
  kind: BriefKind
  timeline?: BriefTimeline
  message: string
  link?: string
  locale: Locale
  attribution: Record<string, string>
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const ATTRIBUTION = ["source", "medium", "campaign", "content", "first_source", "first_campaign"]
const TAG = /^[a-z0-9][a-z0-9._-]{0,99}$/

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "")

/** The attribution properties of the visit, as `src/lib/attribution.ts` stores them. */
export function readAttribution(fields: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(ATTRIBUTION.flatMap((key) => {
    const value = text(fields[key], 100).toLowerCase()
    return TAG.test(value) ? [[key, value]] : []
  }))
}

/** An `http(s)` URL, or nothing. */
export function safeLink(value: unknown): string | undefined {
  const candidate = text(value, 300)
  if (!candidate) return undefined
  try {
    const url = new URL(candidate)
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : undefined
  } catch {
    return undefined
  }
}

export function parseBrief(fields: Record<string, unknown>): Brief | null {
  const name = text(fields.name, 100)
  const email = text(fields.email, 254)
  const message = text(fields.message, 4000)
  const kind = briefKinds.find((value) => value === fields.kind)
  const consent = fields.consent === true || fields.consent === "on" || fields.consent === "true"
  if (!name || !EMAIL.test(email) || message.length < 20 || !kind || !consent) return null
  return {
    name,
    email,
    company: text(fields.company, 100) || undefined,
    kind,
    timeline: briefTimelines.find((value) => value === fields.timeline),
    message,
    link: safeLink(fields.link),
    locale: isLocale(fields.locale) ? fields.locale : "pt",
    page: localPage(fields.page),
    attribution: readAttribution(fields),
    trap: text(fields.website, 200),
  }
}

const kindLabel: Record<BriefKind, string> = { role: "Vaga", project: "Projeto", other: "Outro assunto" }
const timelineLabel: Record<BriefTimeline, string> = { now: "Agora", soon: "Em 1 a 3 meses", later: "Daqui a mais de 3 meses", exploring: "Ainda explorando" }

/** The email Yago receives, in Portuguese whatever the form's language. */
export function briefEmail(brief: Brief) {
  return {
    subject: `[lagrotti.dev] ${kindLabel[brief.kind]}: ${brief.name}${brief.company ? ` (${brief.company})` : ""}`,
    replyTo: brief.email,
    text: [
      fieldLines([
        ["Nome", brief.name],
        ["E-mail", brief.email],
        ["Empresa", brief.company],
        ["Tipo", kindLabel[brief.kind]],
        ["Prazo", brief.timeline && timelineLabel[brief.timeline]],
        ["Link", brief.link],
      ]),
      "",
      brief.message,
      "",
      "---",
      fieldLines([
        ["Página", `${SITE_URL}${brief.page}`],
        ["Idioma", brief.locale],
        ["Origem da visita", [brief.attribution.source, brief.attribution.medium, brief.attribution.campaign].filter(Boolean).join(" / ")],
        ["Origem da primeira visita", [brief.attribution.first_source, brief.attribution.first_campaign].filter(Boolean).join(" / ")],
      ]),
    ].join("\n"),
    idempotencyKey: createHash("sha256").update(`${brief.email}\n${brief.message}`).digest("hex"),
  }
}

interface BriefHandlerOptions {
  inbox?: InboxConfig | null
  fetch?: typeof fetch
  limiter?: RateLimiter
  log?: AuditLog
}

export function createBriefHandler({ inbox = inboxConfig(), fetch: fetcher, limiter = createRateLimiter({ limit: 3, windowMs: 60 * 60_000 }), log }: BriefHandlerOptions = {}) {
  return createFormEndpoint<Brief, FormStatus>({
    action: "contact.brief",
    fragment: "brief",
    statuses: { ok: "sent", invalid: "invalid", unavailable: "unavailable" },
    httpStatus: { sent: 200, invalid: 400, unavailable: 503 },
    limiter,
    log,
    maxBytes: 20_000,
    parse: parseBrief,
    describe: (brief) => ({ kind: brief.kind, locale: brief.locale, source: brief.attribution.source }),
    handle: async (brief) => (inbox && (await sendToInbox(briefEmail(brief), inbox, fetcher)) ? "sent" : "unavailable"),
  })
}
