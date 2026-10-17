export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Deliberately undiscoverable: the external bridge owns signed receipt and persistence. */
export async function POST() {
  return Response.json({ error: "Native ActivityPub receiving is not implemented; configure an external federation bridge" }, { status: 501 })
}
