import { federationBridge } from "@/lib/distribution-config"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** The external bridge owns actors, signatures, followers and delivery. */
export async function GET() {
  const actor = federationBridge()?.actor
  return actor ? Response.redirect(actor, 307) : Response.json({ error: "No federation bridge actor configured" }, { status: 404 })
}
