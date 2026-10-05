/**
 * Requests every project link in `personalData` and reports the ones that no
 * longer answer. External sites come and go, so this is run by hand
 * (`npm run check:links`) rather than gating the build.
 */
import { personalData } from "../src/data/personal"

const links = personalData.projects.flatMap((project) => project.links.map((link) => ({ slug: project.slug, url: link.url })))

async function check(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; lagrotti.dev link check)" },
    })
    return response.ok ? null : `HTTP ${response.status}`
  } catch (error) {
    const cause = error instanceof Error ? (error.cause as { code?: string } | undefined) : undefined
    return cause?.code ?? (error instanceof Error ? error.message : String(error))
  }
}

async function main() {
  const results = await Promise.all(links.map(async (link) => ({ ...link, problem: await check(link.url) })))
  const broken = results.filter((result) => result.problem)

  for (const result of broken) console.log(`${result.problem!.padEnd(28)} ${result.slug.padEnd(30)} ${result.url}`)
  console.log(`${results.length - broken.length} of ${results.length} project links answer.`)
  process.exitCode = broken.length > 0 ? 1 : 0
}

void main()
