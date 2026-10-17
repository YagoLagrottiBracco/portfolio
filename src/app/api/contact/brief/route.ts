import { createBriefHandler } from "@/lib/brief"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Module scope, so the rate limit counts across requests on the same instance. */
export const POST = createBriefHandler()
