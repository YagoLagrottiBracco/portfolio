import { SITE_URL } from "@/lib/site"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  if (process.env.ACTIVITYPUB_MODE !== "native") return Response.json({ error: "ActivityPub is not configured" }, { status: 404 })
  const username = process.env.ACTIVITYPUB_USERNAME ?? "blog"
  const actorUrl = `${SITE_URL}/fediverse/actor`
  return Response.json({
    "@context": ["https://www.w3.org/ns/activitystreams", "https://w3id.org/security/v1"],
    type: "Service",
    id: actorUrl,
    preferredUsername: username,
    name: "Yago Lagrotti Bracco — Engineering blog",
    summary: "Artigos e estudos de caso de engenharia de software.",
    url: SITE_URL,
    inbox: process.env.ACTIVITYPUB_INBOX_URL ?? `${SITE_URL}/api/activitypub/inbox`,
    outbox: process.env.ACTIVITYPUB_OUTBOX_URL ?? `${SITE_URL}/api/activitypub/outbox`,
    followers: `${actorUrl}/followers`,
    publicKey: process.env.ACTIVITYPUB_PUBLIC_KEY
      ? { id: `${actorUrl}#main-key`, owner: actorUrl, publicKeyPem: process.env.ACTIVITYPUB_PUBLIC_KEY }
      : undefined,
  }, { headers: { "Content-Type": "application/activity+json" } })
}
