import { federationBridge } from "@/lib/distribution-config"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const outbox = federationBridge()?.outbox
  return outbox ? Response.redirect(outbox, 307) : Response.json({ error: "No federation bridge outbox configured" }, { status: 404 })
}
