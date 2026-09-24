import { timingSafeEqual } from "node:crypto"
import { NextResponse } from "next/server"

import { GitHubPublishError } from "@/lib/github-git-data"
import { parsePublishRequest, preparePublication, PublishError, type PreparedPublication } from "@/lib/blog-publishing"



type Publish = (publication: PreparedPublication) => Promise<{ sha: string }>

function equalSecret(actual: string | null, expected: string): boolean {
  if (!actual || !expected) return false
  const received = Buffer.from(actual)
  const configured = Buffer.from(expected)
  return received.length === configured.length && timingSafeEqual(received, configured)
}

function error(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status })
}

export function createPublishHandler({ apiKey, publish }: { apiKey: string; publish: Publish }) {
  return async function handler(request: Request) {
    const authorization = request.headers.get("authorization")
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : null
    if (!equalSecret(token, apiKey)) return error(401, "unauthorized", "Invalid API key")
    try {
      const publication = preparePublication(parsePublishRequest(await request.json()))
      const result = await publish(publication)
      return NextResponse.json({ commitSha: result.sha, status: "deployment-pending", urls: publication.urls }, { status: 201 })
    } catch (caught) {
      if (caught instanceof PublishError) return error(caught.status, caught.code, caught.message)
      if (caught instanceof GitHubPublishError) return error(caught.kind === "conflict" ? 409 : 502, caught.kind === "conflict" ? "publish_conflict" : "github_error", caught.message)
      if (caught instanceof SyntaxError) return error(400, "invalid_json", "Request body must be valid JSON")
      return error(502, "publish_error", "The article could not be published")
    }
  }
}