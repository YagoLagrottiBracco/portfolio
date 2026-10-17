import { getCaseStudyBySlug } from "@/lib/projects"
import type { Locale } from "@/lib/i18n"
import { ecosystemEntries } from "@/data/resources/ecosystem"

export interface CommunitySubmission {
  slug: string
  title: Record<Locale, string>
  description: Record<Locale, string>
  authorName: string
  authorUrl: string
  demoUrl: string
  resourcePath: string
  consent: true
}
export interface ApprovedCommunityEntry extends CommunitySubmission {
  review: { reviewer: string; issueUrl: string; reviewedAt: string }
}
const ISSUE_ORIGIN =
  "https://github.com/YagoLagrottiBracco/portfolio/issues/new"
function text(input: unknown, max: number, min = 2): string {
  if (
    typeof input !== "string" ||
    input.trim().length < min ||
    input.length > max
  )
    throw new Error("Invalid or missing text")
  return input.trim()
}
function publicUrl(input: unknown): string {
  const value = text(input, 1500)
  const url = new URL(value)
  const host = url.hostname.toLowerCase()
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    host === "localhost" ||
    !host.includes(".") ||
    host.endsWith(".local") ||
    /^[\d.]+$/.test(host) ||
    host.includes(":")
  )
    throw new Error("Use a public HTTPS URL without credentials")
  return value
}
function localized(
  input: unknown,
  max: number,
  min: number
): Record<Locale, string> {
  if (!input || typeof input !== "object")
    throw new Error("Three languages are required")
  const obj = input as Record<string, unknown>
  return {
    pt: text(obj.pt, max, min),
    en: text(obj.en, max, min),
    es: text(obj.es, max, min),
  }
}
function knownResource(path: string): boolean {
  const match = /^(?:\/(?:en|es))?\/recursos\/([a-z-]+)\/([a-z0-9-]+)$/.exec(
    path
  )
  if (!match) return false
  const pair = `${match[1]}/${match[2]}`
  if (match[1] === "ecossistema")
    return ecosystemEntries.some((entry) => entry.slug === match[2])
  if (
    new Set([
      "ferramentas/json",
      "ferramentas/env",
      "demos/queue",
      "templates/worker",
      "templates/adr",
      "benchmarks/json-clone",
      "campanhas/oficina-arquitetura",
    ]).has(pair)
  )
    return true
  return (
    ["diagramas", "carrosseis", "curadoria"].includes(match[1]) &&
    Boolean(getCaseStudyBySlug(match[2]))
  )
}
export function validateCommunitySubmission(
  input: unknown
): CommunitySubmission {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new Error("Invalid proposal")
  const obj = input as Record<string, unknown>
  const slug = text(obj.slug, 80)
  if (
    ["worker-do-autor", "sua-aplicacao"].includes(slug) ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
  )
    throw new Error("Invalid slug")
  if (obj.consent !== true)
    throw new Error("Publication permission is required")
  const resourcePath = text(obj.resourcePath, 200)
  if (!knownResource(resourcePath))
    throw new Error("Select a known reusable resource")
  return {
    slug,
    title: localized(obj.title, 120, 3),
    description: localized(obj.description, 1500, 20),
    authorName: text(obj.authorName, 100),
    authorUrl: publicUrl(obj.authorUrl),
    demoUrl: publicUrl(obj.demoUrl),
    resourcePath,
    consent: true,
  }
}
export function approveCommunitySubmission(
  input: unknown,
  review: ApprovedCommunityEntry["review"]
): ApprovedCommunityEntry {
  const proposal = validateCommunitySubmission(input)
  if (
    !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(review.reviewer) ||
    !/^https:\/\/github\.com\/YagoLagrottiBracco\/portfolio\/issues\/[1-9]\d*$/.test(
      review.issueUrl
    )
  )
    throw new Error("Named reviewer and repository issue evidence are required")
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt) ||
    Number.isNaN(Date.parse(review.reviewedAt)) ||
    new Date(review.reviewedAt).toISOString().slice(0, 10) !== review.reviewedAt
  )
    throw new Error("Invalid review date")
  return { ...proposal, review: { ...review } }
}
export function extractCommunityProposal(body: string): CommunitySubmission {
  if (body.length > 100_000) throw new Error("Proposal exceeds 100KB")
  // GitHub issue forms put consent in its own section. Text inside the JSON
  // proposal (or another field) must never count as a checked permission box.
  const outsideCode = body.replace(/^```[^\n]*\n[\s\S]*?^```[ \t]*\r?$/gm, "")
  const authorization =
    /^### Autorização[ \t]*\r?\n([\s\S]*?)(?=^### |$(?![\s\S]))/m.exec(
      outsideCode
    )?.[1] ?? ""
  if (
    !/^- \[[xX]\] Sou responsável pelo material e autorizo sua publicação com os créditos enviados\.[ \t]*\r?$/m.test(
      authorization
    )
  )
    throw new Error("Explicit permission checkbox is required")
  const match = /```json\s*\n([\s\S]+?)\n```/.exec(body)
  if (!match) throw new Error("Missing JSON proposal")
  return validateCommunitySubmission(JSON.parse(match[1]))
}
export function buildCommunityIssueUrl(proposal: CommunitySubmission): string {
  const url = new URL(ISSUE_ORIGIN)
  url.searchParams.set("template", "community-use.yml")
  url.searchParams.set("title", `[Galeria] ${proposal.title.pt}`)
  url.searchParams.set("proposal", JSON.stringify(proposal, null, 2))
  if (url.toString().length > 7500) url.searchParams.delete("proposal")
  if (url.toString().length > 7500) url.searchParams.delete("profile")
  return url.toString()
}
export function buildCollaborationIssueUrl(
  name: string,
  profile: string,
  proposal: string
): string {
  const url = new URL(ISSUE_ORIGIN)
  url.searchParams.set("template", "collaboration.yml")
  url.searchParams.set("title", `[Colaboração] ${name.slice(0, 100)}`)
  url.searchParams.set("profile", profile)
  url.searchParams.set("proposal", proposal)
  if (url.toString().length > 7500) url.searchParams.delete("proposal")
  if (url.toString().length > 7500) url.searchParams.delete("profile")
  return url.toString()
}
