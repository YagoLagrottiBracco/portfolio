import type { Locale } from "@/lib/i18n"
import { SITE_URL } from "@/lib/site"

export const PARTICIPATION_REPOSITORY = "YagoLagrottiBracco/portfolio"
export const ROADMAP_LABEL = "resource-request"
export const INDEXNOW_KEY = "4f31dd50dbdb4c5d9f4eac94301d918a"
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow"
const issueBase = `https://github.com/${PARTICIPATION_REPOSITORY}/issues/new`
export function boundedParticipationText(input: unknown, max: number, required = true): string {
  if (typeof input !== "string" || input.length > max || (required && !input.trim())) throw new Error("Invalid or oversized text")
  return input.trim()
}
function checkedLocale(locale: unknown): Locale {
  if (locale !== "pt" && locale !== "en" && locale !== "es") throw new Error("Invalid locale")
  return locale
}
export function participationPageUrl(input: string): string {
  const url = new URL(boundedParticipationText(input, 1500))
  if (url.origin !== SITE_URL || url.username || url.password || url.search) throw new Error("Use an actual canonical page URL")
  return url.href
}
function issueDraft(template: string, fields: Record<string, string>): string {
  const url = new URL(issueBase)
  url.searchParams.set("template",template)
  for (const [key,value] of Object.entries(fields)) url.searchParams.set(key,value)
  if (url.href.length > 7500) throw new Error("Draft is too long; shorten the excerpt and suggestion")
  return url.href
}
export interface CorrectionProposal { pageUrl: string; locale: Locale; excerpt: string; suggestion: string }
export function buildCorrectionIssueUrl(proposal: CorrectionProposal): string {
  return issueDraft("contextual-correction.yml", { title:"[Correction] Page context",page:participationPageUrl(proposal.pageUrl),locale:checkedLocale(proposal.locale),excerpt:boundedParticipationText(proposal.excerpt,1500),suggestion:boundedParticipationText(proposal.suggestion,2000) })
}
export function buildRequestIssueUrl(locale: Locale, title: string, details: string): string {
  return issueDraft("resource-request.yml",{title:`[Resource] ${boundedParticipationText(title,120)}`,locale:checkedLocale(locale),details:boundedParticipationText(details,2000)})
}
export function buildReferenceIssueUrl(locale: Locale, source: string, target: string): string {
  const parsed = new URL(boundedParticipationText(source,1500))
  if (parsed.protocol !== "https:" || parsed.username || parsed.password) throw new Error("Use a public HTTPS source")
  return issueDraft("reference.yml",{title:"[Reference] Link verification",locale:checkedLocale(locale),source:parsed.href,target:participationPageUrl(target)})
}
export interface RoadmapIssue { number: number; title: string; url: string; status: "planned" | "in-progress" | "closed"; votes: number; updatedAt: string }
export function parseRoadmapIssues(input: unknown): RoadmapIssue[] {
  if (!Array.isArray(input)) throw new Error("Invalid GitHub response")
  return input.flatMap(value => {
    if (!value || typeof value !== "object") return []
    const issue = value as Record<string, unknown>
    const labels = Array.isArray(issue.labels) ? issue.labels.map(label => typeof label === "string" ? label : label?.name) : []
    const number = issue.number
    if (issue.pull_request || !Number.isSafeInteger(number) || Number(number) < 1 || !labels.includes(ROADMAP_LABEL) || typeof issue.title !== "string" || issue.title.length > 500 || issue.html_url !== `https://github.com/${PARTICIPATION_REPOSITORY}/issues/${number}` || typeof issue.updated_at !== "string" || Number.isNaN(Date.parse(issue.updated_at))) return []
    const reactions = issue.reactions as Record<string, unknown> | undefined
    const votes = reactions?.["+1"]
    return [{number:Number(number),title:issue.title,url:String(issue.html_url),status:issue.state === "closed" ? "closed" as const : labels.includes("in-progress") ? "in-progress" as const : "planned" as const,votes:Number.isSafeInteger(votes) && Number(votes) >= 0 ? Number(votes) : 0,updatedAt:issue.updated_at}]
  })
}
export interface VerifiedContribution { number: number; title: string; repository: string; url: string; status: "merged"; mergedAt: string; author: string }
export function selectVerifiedContributions(input: unknown): VerifiedContribution[] {
  if (!Array.isArray(input)) throw new Error("Expected pull requests")
  return input.flatMap(pr => {
    const repo = pr?.base?.repo
    if (!repo || repo.private !== false || !/^[\w.-]+\/[\w.-]+$/.test(repo.full_name ?? "") || String(repo.owner?.login).toLowerCase() === "yagolagrottibracco" || pr.user?.login !== "YagoLagrottiBracco" || !Number.isSafeInteger(pr.number) || pr.number < 1 || pr.state !== "closed" || typeof pr.merged_at !== "string" || Number.isNaN(Date.parse(pr.merged_at)) || pr.html_url !== `https://github.com/${repo.full_name}/pull/${pr.number}` || typeof pr.title !== "string") return []
    return [{number:pr.number,title:pr.title,repository:repo.full_name,url:pr.html_url,status:"merged" as const,mergedAt:pr.merged_at,author:pr.user.login}]
  }).sort((a,b)=>b.mergedAt.localeCompare(a.mergedAt))
}
export function buildIndexNowPayload(urls: string[]) {
  if (!Array.isArray(urls) || urls.length < 1 || urls.length > 10_000) throw new Error("Provide 1–10000 canonical URLs")
  const urlList = [...new Set(urls.map(value => {
    const url = new URL(boundedParticipationText(value,2000))
    if (url.origin !== SITE_URL || url.username || url.password || url.search || url.hash || (url.href !== value && value !== SITE_URL) || /\/api(?:\/|$)|\/admin(?:\/|$)|\/r\//.test(url.pathname)) throw new Error("Only same-site public canonical URLs are permitted")
    return value
  }))]
  return {host:new URL(SITE_URL).host,key:INDEXNOW_KEY,keyLocation:`${SITE_URL}/${INDEXNOW_KEY}.txt`,urlList}
}
