import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"

import { audit as defaultAudit, clientIp, requestId, type AuditLog } from "@/lib/audit-log"
import { GitHubPublishError } from "@/lib/github-git-data"
import { parsePublishRequest, preparePublication, PublishError, type PreparedPublication } from "@/lib/blog-publishing"
import { createRateLimiter, type RateLimiter } from "@/lib/rate-limit"

/** What the commit can say about the request that caused it. */
export interface PublishContext { requestId?: string }

type Publish = (publication: PreparedPublication, context: PublishContext) => Promise<{ sha: string }>

function equalSecret(actual: string | null, expected: string): boolean {
  if (!actual || !expected) return false
  const received = Buffer.from(actual)
  const configured = Buffer.from(expected)
  return received.length === configured.length && timingSafeEqual(received, configured)
}

function error(status: number, code: string, message: string, headers?: HeadersInit) {
  return NextResponse.json({ error: { code, message } }, { status, headers })
}

interface PublishHandlerOptions {
  apiKey: string
  publish: Publish
  /** Per caller IP. Publishing is rare, so a burst is a runaway script or someone guessing the key. */
  limiter?: RateLimiter
  log?: AuditLog
}

export function createPublishHandler({ apiKey, publish, limiter = createRateLimiter({ limit: 10, windowMs: 10 * 60_000 }), log = defaultAudit }: PublishHandlerOptions) {
  return async function handler(request: Request) {
    const ip = clientIp(request)
    const context: PublishContext = { requestId: requestId(request) }
    const limit = limiter.hit(ip)
    if (!limit.allowed) {
      log("blog.publish", { outcome: "limited", ip, ...context })
      return error(429, "rate_limited", "Too many requests", { "Retry-After": String(limit.retryAfterSeconds) })
    }

    const authorization = request.headers.get("authorization")
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null
    if (!equalSecret(token, apiKey)) {
      log("blog.publish", { outcome: "denied", ip, ...context })
      return error(401, "unauthorized", "Invalid API key")
    }
    try {
      const publication = preparePublication(parsePublishRequest(await request.json()))
      const result = await publish(publication, context)
      log("blog.publish", { outcome: "ok", ip, ...context, commit: result.sha, urls: publication.urls })
      return NextResponse.json({ commitSha: result.sha, status: "deployment-pending", urls: publication.urls }, { status: 201 })
    } catch (caught) {
      const outcome = caught instanceof GitHubPublishError && caught.kind === "conflict" ? "conflict"
        : caught instanceof PublishError || caught instanceof SyntaxError ? "invalid" : "error"
      log("blog.publish", { outcome, ip, ...context, reason: caught instanceof Error ? caught.message : String(caught) })
      if (caught instanceof PublishError) return error(caught.status, caught.code, caught.message)
      if (caught instanceof GitHubPublishError) return error(caught.kind === "conflict" ? 409 : 502, caught.kind === "conflict" ? "publish_conflict" : "github_error", caught.message)
      if (caught instanceof SyntaxError) return error(400, "invalid_json", "Request body must be valid JSON")
      return error(502, "publish_error", "The article could not be published")
    }
  }
}
