import { createNewsletterHandler } from "@/lib/newsletter"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Module scope, so the rate limit counts across requests on the same instance. */
export const POST = createNewsletterHandler({ apiKey: process.env.BUTTONDOWN_API_KEY })
