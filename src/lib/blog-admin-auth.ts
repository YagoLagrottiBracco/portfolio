import { timingSafeEqual } from "node:crypto"
import type { Session } from "next-auth"

export type AdminAccess = "ok" | "unauthenticated" | "forbidden"

export function authorizeBlogAdmin(session: Pick<Session, "githubId"> | null, allowedGithubId: string): AdminAccess {
  if (!session) return "unauthenticated"
  if (!/^\d+$/.test(allowedGithubId) || session.githubId !== allowedGithubId) return "forbidden"
  return "ok"
}

export interface AdminMutationInput {
  origin: string | null
  expectedOrigin: string
  contentType: string | null
  csrfHeader: string | null
  csrfSession: string
}

export function verifyAdminMutation(input: AdminMutationInput): boolean {
  if (!input.origin || input.origin !== input.expectedOrigin) return false
  if (!input.contentType || !/^application\/json(?:\s*;|$)/i.test(input.contentType)) return false
  if (!input.csrfHeader || !input.csrfSession) return false
  const received = Buffer.from(input.csrfHeader)
  const expected = Buffer.from(input.csrfSession)
  return received.length === expected.length && timingSafeEqual(received, expected)
}
