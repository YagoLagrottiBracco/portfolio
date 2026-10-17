export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Native inbox requires signed ActivityPub handling; use a bridge unless ACTIVITYPUB_MODE=native is fully provisioned. */
export async function POST() {
  return Response.json({ error: "Native ActivityPub inbox is not provisioned" }, { status: 501 })
}
