import Anthropic from "@anthropic-ai/sdk"

import { articleSections, stableDocuments } from "@/lib/ask/corpus"
import { createAskHandler } from "@/lib/ask/handler"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Credentials come from ANTHROPIC_API_KEY; without it the endpoint answers 503 and the page is not built.
const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null

/** Module scope, so the rate limits count across requests on the same instance. */
export const POST = createAskHandler({
  stream: client ? (params, signal) => client.beta.messages.create(params, { signal }) : null,
  model: process.env.ASK_MODEL || undefined,
  stableDocuments,
  sections: articleSections,
})
