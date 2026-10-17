import { redirect } from "next/navigation"

import { SITE_URL } from "@/lib/site"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const username = process.env.ACTIVITYPUB_USERNAME ?? "blog"

export async function GET() {
  const bridge = process.env.ACTIVITYPUB_WEBFINGER_URL
  if (bridge) redirect(bridge)

  if (process.env.ACTIVITYPUB_MODE !== "native") return Response.json({ error: "ActivityPub is not configured" }, { status: 404 })
  const actorUrl = `${SITE_URL}/fediverse/actor`
  return Response.json({
    subject: `acct:${username}@lagrotti.dev`,
    aliases: [actorUrl],
    links: [
      { rel: "self", type: "application/activity+json", href: actorUrl },
      { rel: "http://webfinger.net/rel/profile-page", type: "text/html", href: SITE_URL },
    ],
  })
}
