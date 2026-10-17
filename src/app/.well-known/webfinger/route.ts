import { federationBridge } from "@/lib/distribution-config"
import { SITE_URL } from "@/lib/site"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const resources = new URL(request.url).searchParams.getAll("resource")
  if (resources.length !== 1 || !resources[0]) return Response.json({ error: "Provide exactly one resource" }, { status: 400 })
  const bridge = federationBridge()
  const username = process.env.ACTIVITYPUB_USERNAME ?? "blog"
  if (resources[0] !== `acct:${username}@${new URL(SITE_URL).hostname}`) return Response.json({ error: "Unknown resource" }, { status: 404 })
  if (!bridge) return Response.json({ error: "Federation requires a configured HTTPS bridge" }, { status: 404 })
  const destination = new URL(bridge.webfinger)
  destination.searchParams.set("resource", resources[0])
  return Response.redirect(destination, 307)
}
