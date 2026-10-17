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
  return Object.hasOwn(pollDefinitions, id) ? pollDefinitions[id] : null
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function parseTally(value: unknown): InteractionTally {
  if (typeof value !== "string") throw new Error("Invalid interaction tally")
  let parsed: unknown = JSON.parse(value)
  // The previous REST /set client stored its literal request body. Accept
  // that one legacy envelope; the next atomic vote writes canonical JSON.
  if (isRecord(parsed) && !Object.hasOwn(parsed, "polls") && typeof parsed.value === "string") parsed = JSON.parse(parsed.value)
  if (!isRecord(parsed) || !isRecord(parsed.polls)) throw new Error("Invalid interaction tally")
  for (const poll of Object.values(parsed.polls)) {
    if (!isRecord(poll) || Object.values(poll).some(count => !Number.isSafeInteger(count) || (count as number) < 0)) {
      throw new Error("Invalid interaction tally")
    }
  }
  return parsed as unknown as InteractionTally
}

async function storeRequest(config: NonNullable<ReturnType<typeof storeConfig>>, path: string, init: RequestInit, fetcher: typeof fetch): Promise<unknown> {
  const response = await fetcher(`${config.url}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error("Interaction store request failed")
  const payload: unknown = await response.json()
  if (!isRecord(payload) || Object.hasOwn(payload, "error") || !Object.hasOwn(payload, "result")) {
    throw new Error("Interaction store request failed")
  }
  return payload.result
}

async function readStore(fetcher: typeof fetch = fetch): Promise<InteractionTally> {
  const config = storeConfig()
  if (!config) return { polls: {} }
  const result = await storeRequest(config, `/get/${encodeURIComponent(config.key)}`, {}, fetcher)
  return result === null ? { polls: {} } : parseTally(result)
}

// Redis runs the entire script atomically. Retain the original JSON key and
// other poll totals; malformed data fails before SET instead of being reset.
const VOTE_SCRIPT = `
local raw = redis.call('GET', KEYS[1])
local tally = { polls = {} }
if raw then
  if not string.match(raw, '^%s*{') then return redis.error_reply('Invalid interaction tally') end
  tally = cjson.decode(raw)
  if type(tally) == 'table' and tally.polls == nil and type(tally.value) == 'string' then
    if not string.match(tally.value, '^%s*{') then return redis.error_reply('Invalid interaction tally') end
    tally = cjson.decode(tally.value)
  end
end
if type(tally) ~= 'table' then return redis.error_reply('Invalid interaction tally') end
if type(tally.polls) ~= 'table' then return redis.error_reply('Invalid interaction tally') end
for id, poll in pairs(tally.polls) do
  if type(id) ~= 'string' or type(poll) ~= 'table' then return redis.error_reply('Invalid interaction tally') end
  for option, count in pairs(poll) do
    if type(option) ~= 'string' or type(count) ~= 'number' or count < 0 or count > 9007199254740991 or count ~= math.floor(count) then
      return redis.error_reply('Invalid interaction tally')
    end
  end
end
local poll = tally.polls[ARGV[1]] or {}
local count = poll[ARGV[2]] or 0
if count >= 9007199254740991 then return redis.error_reply('Vote count overflow') end
poll[ARGV[2]] = count + 1
tally.polls[ARGV[1]] = poll
local result = cjson.encode(tally)
-- Redis cjson uses limited number precision. Never overwrite an existing
-- integer with a rounded count, even for an unexpectedly large legacy tally.
local roundtrip = cjson.decode(result)
for id, votes in pairs(tally.polls) do
  for option, votesCount in pairs(votes) do
    if roundtrip.polls[id][option] ~= votesCount then return redis.error_reply('Vote count precision overflow') end
  end
end
redis.call('SET', KEYS[1], result)
return result
`

function pollResults(id: string, definition: PollDefinition, tally: InteractionTally) {
  const votes = tally.polls[id] ?? {}
  const options = definition.options.map(option => ({ id: option.id, label: option.label, votes: votes[option.id] ?? 0 }))
  const total = options.reduce((sum, option) => sum + option.votes, 0)
  if (!Number.isSafeInteger(total)) throw new Error("Invalid interaction tally")
  return {
    configured: interactionsConfigured(),
    options,
    total,
  }
}

export async function getPollResults(id: string, fetcher?: typeof fetch) {
  const definition = getPollDefinition(id)
  if (!definition) return null
  return pollResults(id, definition, await readStore(fetcher))
}

export async function voteInPoll(id: string, optionId: string, fetcher: typeof fetch = fetch) {
  const definition = getPollDefinition(id)
  if (!definition || !definition.options.some(option => option.id === optionId)) return null
  const config = storeConfig()
  if (!config) throw new Error("Interaction store is not configured")
  const result = await storeRequest(config, "", {
    method: "POST",
    body: JSON.stringify(["EVAL", VOTE_SCRIPT, 1, config.key, id, optionId]),
  }, fetcher)
  return pollResults(id, definition, parseTally(result))
}
