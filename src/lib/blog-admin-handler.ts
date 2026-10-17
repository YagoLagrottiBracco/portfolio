import type { Session } from "next-auth"

import { audit as defaultAudit, clientIp, requestId, type AuditLog, type AuditOutcome } from "@/lib/audit-log"
import { authorizeBlogAdmin, verifyAdminMutation } from "@/lib/blog-admin-auth"
import type { BlogAdminBundle } from "@/lib/blog-admin-document"
import { prepareAdminSave, type AdminSaveInput, type PreparedAdminSave } from "@/lib/blog-admin-save"
import { PublishError } from "@/lib/blog-publishing"
import { GitHubPublishError } from "@/lib/github-git-data"
import { locales, type Locale } from "@/lib/i18n"
import type { RateLimiter } from "@/lib/rate-limit"

type AdminSession = Pick<Session, "githubId" | "editorCsrf">

/** Who saved, for the commit trailers. */
export interface AdminCommitContext { githubId?: string; requestId?: string }

interface Dependencies {
  allowedGithubId: string
  expectedOrigin: string
  getSession: () => Promise<AdminSession | null>
  listBundles: () => Promise<BlogAdminBundle[]>
  commit: (prepared: PreparedAdminSave, context: AdminCommitContext) => Promise<{ sha: string }>
  /**
   * Caps saves per editor. The handlers are rebuilt for every request, so the
   * limiter has to be created by the caller and outlive them.
   */
  limiter?: RateLimiter
  log?: AuditLog
}

function error(status: number, code: string, message: string): Response {
  return Response.json({ error: { code, message } }, { status })
}

function requestError(cause: unknown): Response {
  if (cause instanceof GitHubPublishError) return error(cause.kind === "conflict" ? 409 : 502, cause.kind, cause.message)
  if (cause instanceof PublishError) return error(cause.status, cause.code, cause.message)
  if (cause instanceof SyntaxError) return error(400, "invalid_json", "JSON inválido")
  if (cause instanceof Error && /image size|too large/i.test(cause.message)) return error(413, "image_too_large", cause.message)
  if (cause instanceof Error && /github/i.test(cause.message)) return error(502, "upstream", "Não foi possível ler o repositório")
  if (cause instanceof Error) return error(400, "invalid_article", cause.message)
  return error(502, "upstream", "Não foi possível concluir a operação")
}

function versionsMatch(value: unknown, bundle: BlogAdminBundle): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const versions = value as Record<string, unknown>
  return locales.every(locale => {
    const actual = bundle.articles[locale]
    const expected = versions[locale]
    if (!actual) return expected === null
    if (!expected || typeof expected !== "object") return false
    const entry = expected as Record<string, unknown>
    return entry.path === actual.sourcePath && entry.sha === actual.blobSha
  })
}

function outcomeOf(status: number): AuditOutcome {
  if (status < 400) return "ok"
  if (status === 401 || status === 403) return "denied"
  if (status === 409) return "conflict"
  if (status === 429) return "limited"
  return status >= 500 ? "error" : "invalid"
}

export function createBlogAdminHandlers(deps: Dependencies) {
  const log = deps.log ?? defaultAudit

  async function access(): Promise<{ response?: Response; session: AdminSession | null }> {
    const session = await deps.getSession()
    const verdict = authorizeBlogAdmin(session, deps.allowedGithubId)
    if (verdict !== "ok") return { session, response: error(verdict === "unauthenticated" ? 401 : 403, verdict, verdict === "unauthenticated" ? "Entre com GitHub" : "Acesso negado") }
    return { session }
  }

  async function list(): Promise<Response> {
    const guard = await access(); if (guard.response) return guard.response
    try { return Response.json({ bundles: await deps.listBundles() }, { headers: { "Cache-Control": "no-store" } }) }
    catch (cause) { return requestError(cause) }
  }

  async function detail(translationKey: string): Promise<Response> {
    const guard = await access(); if (guard.response) return guard.response
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(translationKey)) return error(400, "invalid_key", "Chave inválida")
    try {
      const bundle = (await deps.listBundles()).find(item => item.translationKey === translationKey)
      return bundle ? Response.json({ bundle }, { headers: { "Cache-Control": "no-store" } }) : error(404, "not_found", "Artigo não encontrado")
    } catch (cause) { return requestError(cause) }
  }

  async function mutate(request: Request, translationKey?: string): Promise<Response> {
    const context: AdminCommitContext = { requestId: requestId(request) }
    const response = await save(request, context, translationKey)
    log("blog.admin.save", { outcome: outcomeOf(response.status), status: response.status, ip: clientIp(request), translationKey, ...context })
    return response
  }

  async function save(request: Request, context: AdminCommitContext, translationKey?: string): Promise<Response> {
    const guard = await access(); if (guard.response) return guard.response
    context.githubId = guard.session?.githubId
    const limit = deps.limiter?.hit(guard.session?.githubId ?? clientIp(request))
    if (limit && !limit.allowed) return Response.json({ error: { code: "rate_limited", message: "Muitas gravações seguidas. Tente de novo em instantes." } }, { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } })
    if (!verifyAdminMutation({ origin: request.headers.get("origin"), expectedOrigin: deps.expectedOrigin, contentType: request.headers.get("content-type"), csrfHeader: request.headers.get("x-blog-csrf"), csrfSession: guard.session?.editorCsrf ?? "" })) return error(403, "csrf", "Origem ou sessão inválida")
    if (Number(request.headers.get("content-length")) > 32 * 1024 * 1024) return error(413, "request_too_large", "Envio muito grande")
    try {
      const text = await request.text()
      if (Buffer.byteLength(text) > 32 * 1024 * 1024) return error(413, "request_too_large", "Envio muito grande")
      const body = JSON.parse(text) as AdminSaveInput & { versions?: Partial<Record<Locale, { path: string; sha: string } | null>> }
      if (!body || typeof body !== "object") return error(400, "invalid_article", "Envio inválido")
      if (translationKey && body.translationKey !== translationKey) return error(400, "invalid_key", "Chave divergente")
      const bundles = await deps.listBundles()
      const existing = bundles.find(item => item.translationKey === body.translationKey) ?? null
      if (!translationKey && existing) return error(409, "conflict", "Este artigo já existe")
      if (translationKey && !existing) return error(404, "not_found", "Artigo não encontrado")
      if (translationKey && !body.versions) return error(400, "missing_versions", "Versões dos arquivos são obrigatórias")
      if (translationKey && !versionsMatch(body.versions, existing!)) return error(409, "conflict", "O artigo mudou desde que foi aberto. Seu texto permanece no editor.")
      const allSlugs = bundles.flatMap(item => locales.map(locale => item.articles[locale]?.slug).filter((slug): slug is string => !!slug))
      const prepared = await prepareAdminSave(body, existing, allSlugs)
      const result = await deps.commit(prepared, context)
      return Response.json({ commitSha: result.sha, status: "deployment-pending", urls: prepared.urls }, { status: translationKey ? 200 : 201, headers: { "Cache-Control": "no-store" } })
    } catch (cause) { return requestError(cause) }
  }

  return { list, detail, create: (request: Request) => mutate(request), update: (request: Request, translationKey: string) => mutate(request, translationKey) }
}
