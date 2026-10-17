import { articlePoll, topicProposals } from "@/data/discovery"

export interface InteractionTally { polls: Record<string, Record<string, number>> }

export interface PollDefinition {
  readonly id: string
  readonly options: readonly { readonly id: string; readonly label: Record<string, string> }[]
}

const pollDefinitions: Record<string, PollDefinition> = {
  [articlePoll.id]: articlePoll,
  "proximas-pautas": {
    id: "proximas-pautas",
    options: topicProposals.map(proposal => ({ id: proposal.id, label: proposal.title })),
  },
}

export function getPollDefinition(id: string): PollDefinition | null {
  return pollDefinitions[id] ?? null
}

function storeConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return { url: url.replace(/\/$/, ""), token, key: process.env.INTERACTIONS_KEY ?? "lagrotti:interactions" }
}

export function interactionsConfigured(): boolean {
  return storeConfig() !== null
}

async function readStore(fetcher: typeof fetch = fetch): Promise<InteractionTally> {
  const config = storeConfig()
  if (!config) return { polls: {} }
  const response = await fetcher(`${config.url}/get/${encodeURIComponent(config.key)}`, {
    headers: { Authorization: `Bearer ${config.token}` },
    cache: "no-store",
  })
  if (!response.ok) throw new Error("Interaction store read failed")
  const payload = await response.json() as { result?: string | null }
  if (!payload.result) return { polls: {} }
  try {
    const parsed = JSON.parse(payload.result) as InteractionTally
    return { polls: parsed.polls ?? {} }
  } catch {
    return { polls: {} }
  }
}

async function writeStore(tally: InteractionTally, fetcher: typeof fetch = fetch): Promise<void> {
  const config = storeConfig()
  if (!config) throw new Error("Interaction store is not configured")
  const response = await fetcher(`${config.url}/set/${encodeURIComponent(config.key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ value: JSON.stringify(tally) }),
    cache: "no-store",
  })
  if (!response.ok) throw new Error("Interaction store write failed")
}

export async function getPollResults(id: string, fetcher?: typeof fetch) {
  const definition = getPollDefinition(id)
  if (!definition) return null
  const tally = await readStore(fetcher)
  const votes = tally.polls[id] ?? {}
  return {
    configured: interactionsConfigured(),
    options: definition.options.map(option => ({ id: option.id, label: option.label, votes: votes[option.id] ?? 0 })),
    total: Object.values(votes).reduce((sum, count) => sum + count, 0),
  }
}

export async function voteInPoll(id: string, optionId: string, fetcher?: typeof fetch) {
  const definition = getPollDefinition(id)
  if (!definition || !definition.options.some(option => option.id === optionId)) return null
  const tally = await readStore(fetcher)
  const poll = tally.polls[id] ?? {}
  poll[optionId] = (poll[optionId] ?? 0) + 1
  tally.polls[id] = poll
  await writeStore(tally, fetcher)
  return getPollResults(id, fetcher)
}
