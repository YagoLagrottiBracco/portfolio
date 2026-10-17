/**
 * Creates in Umami the funnels defined in `src/lib/umami.ts`, skipping any
 * that already exist by name, so it is safe to run again after adding one.
 *
 *   UMAMI_API_KEY=… UMAMI_WEBSITE_ID=… npm run umami:funnels
 */
import { createUmamiClient, funnels } from "../src/lib/umami"

const apiKey = process.env.UMAMI_API_KEY
const websiteId = process.env.UMAMI_WEBSITE_ID
if (!apiKey || !websiteId) {
  console.error("Set UMAMI_API_KEY and UMAMI_WEBSITE_ID (see docs/utm.md).")
  process.exit(1)
}

// UMAMI_API_URL points elsewhere for a self-hosted Umami (its `/api` root).
const umami = createUmamiClient({ apiKey, websiteId, baseUrl: process.env.UMAMI_API_URL })

async function main() {
  const existing = new Set((await umami.get<{ data: { name: string }[] }>("/funnels", { pageSize: 100 })).data.map((funnel) => funnel.name))

  for (const funnel of funnels) {
    if (existing.has(funnel.name)) {
      console.log(`exists   ${funnel.name}`)
      continue
    }
    await umami.post("/funnels", { name: funnel.name, description: funnel.description, parameters: { steps: funnel.steps, window: funnel.window } })
    console.log(`created  ${funnel.name}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
