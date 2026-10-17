import { personalData } from "@/data/personal"

type Json = null | boolean | number | string | Json[] | { [key: string]: Json }
export interface JsonChange {
  path: string
  kind: "added" | "removed" | "changed"
  before?: Json
  after?: Json
}
export interface JsonComparison {
  changes: JsonChange[]
  truncated: boolean
  error?: "invalid-json" | "too-large" | "too-deep" | "unsafe-number"
}
const MAX_INPUT = 200_000
const MAX_CHANGES = 500
function tooDeep(value: Json): boolean {
  const stack: [Json, number][] = [[value, 0]]
  while (stack.length) {
    const [item, depth] = stack.pop()!
    if (depth > 100) return true
    if (item && typeof item === "object")
      for (const child of Object.values(item)) stack.push([child, depth + 1])
  }
  return false
}
// Normalize decimal lexemes without rounding. Strings are skipped by the tokenizer.
function decimalKey(token: string): string {
  const [mantissa, exponent = "0"] = token.toLowerCase().split("e")
  const negative = mantissa.startsWith("-")
  const [whole, fraction = ""] = (
    negative ? mantissa.slice(1) : mantissa
  ).split(".")
  const digits = (whole + fraction).replace(/^0+/, "")
  if (!digits) return "0"
  const compact = digits.replace(/0+$/, "")
  return `${negative ? "-" : ""}${compact}e${Number(exponent) - fraction.length + digits.length - compact.length}`
}
function losesNumericPrecision(source: string): boolean {
  const tokens =
    /"(?:[^"\\]|\\.)*"|(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/g
  for (const match of source.matchAll(tokens)) {
    const token = match[1]
    if (!token) continue
    const value = Number(token)
    if (
      !Number.isFinite(value) ||
      (Number.isInteger(value) && !Number.isSafeInteger(value)) ||
      decimalKey(token) !== decimalKey(String(value))
    )
      return true
  }
  return false
}
export function compareJson(left: string, right: string): JsonComparison {
  const result: JsonComparison = { changes: [], truncated: false }
  if (left.length > MAX_INPUT || right.length > MAX_INPUT)
    return { ...result, error: "too-large" }
  let a: Json, b: Json
  try {
    a = JSON.parse(left)
    b = JSON.parse(right)
  } catch {
    return { ...result, error: "invalid-json" }
  }
  if (losesNumericPrecision(left) || losesNumericPrecision(right))
    return { ...result, error: "unsafe-number" }
  if (tooDeep(a) || tooDeep(b)) return { ...result, error: "too-deep" }
  function add(change: JsonChange) {
    if (result.changes.length < MAX_CHANGES) result.changes.push(change)
    else result.truncated = true
  }
  function visit(before: Json, after: Json, path: string) {
    if (result.truncated || before === after) return
    if (
      before === null ||
      after === null ||
      typeof before !== "object" ||
      typeof after !== "object" ||
      Array.isArray(before) !== Array.isArray(after)
    ) {
      add({ path, kind: "changed", before, after })
      return
    }
    const keys = [
      ...new Set([...Object.keys(before), ...Object.keys(after)]),
    ].sort((x, y) =>
      Array.isArray(before) ? Number(x) - Number(y) : x.localeCompare(y)
    )
    for (const key of keys) {
      const p = `${path}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`
      const x = (before as Record<string, Json>)[key],
        y = (after as Record<string, Json>)[key]
      if (!Object.hasOwn(before, key)) add({ path: p, kind: "added", after: y })
      else if (!Object.hasOwn(after, key))
        add({ path: p, kind: "removed", before: x })
      else visit(x, y, p)
      if (result.truncated) break
    }
  }
  visit(a, b, "")
  return result
}
export function inspectEnvKeys(reference: string, candidate: string) {
  function keys(text: string) {
    const found = new Set<string>(),
      duplicates = new Set<string>(),
      invalid: number[] = []
    text.split(/\r?\n/).forEach((line, i) => {
      if (!line.trim() || line.trimStart().startsWith("#")) return
      const match = /^\s*(?:export\s+)?([a-zA-Z_][a-zA-Z0-9_]*)\s*=/.exec(line)
      if (!match) {
        invalid.push(i + 1)
        return
      }
      if (found.has(match[1])) duplicates.add(match[1])
      found.add(match[1])
    })
    return { found, duplicates: [...duplicates].sort(), invalid }
  }
  if (reference.length > MAX_INPUT || candidate.length > MAX_INPUT)
    return {
      missing: [],
      extra: [],
      duplicates: [],
      referenceDuplicates: [],
      invalidLines: [],
      referenceInvalidLines: [],
      error: "too-large" as const,
    }
  const a = keys(reference),
    b = keys(candidate)
  return {
    missing: [...a.found].filter((k) => !b.found.has(k)).sort(),
    extra: [...b.found].filter((k) => !a.found.has(k)).sort(),
    duplicates: b.duplicates,
    referenceDuplicates: a.duplicates,
    invalidLines: b.invalid,
    referenceInvalidLines: a.invalid,
  }
}
export interface QueueState {
  tick: number
  nextId: number
  arrived: number
  completed: number
  dead: number
  dropped: number
  pending: { id: number; attempts: number }[]
}
export const initialQueue = (): QueueState => ({
  tick: 0,
  nextId: 1,
  arrived: 0,
  completed: 0,
  dead: 0,
  dropped: 0,
  pending: [],
})
const clamp = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.max(min, Math.min(max, Math.floor(value))) : min
export function advanceQueue(
  state: QueueState,
  config: { arrivals: number; workers: number; failurePercent: number }
): QueueState {
  const arrivals = clamp(config.arrivals, 0, 50),
    workers = clamp(config.workers, 1, 50),
    failures = clamp(config.failurePercent, 0, 100)
  const accepted = Math.min(arrivals, 5000 - state.pending.length)
  const pending = [
    ...state.pending,
    ...Array.from({ length: accepted }, (_, i) => ({
      id: state.nextId + i,
      attempts: 0,
    })),
  ]
  const batch = pending.splice(0, workers)
  let completed = state.completed,
    dead = state.dead
  for (const message of batch) {
    if ((message.id * 37) % 100 >= failures) completed++
    else if (message.attempts + 1 >= 3) dead++
    else pending.push({ id: message.id, attempts: message.attempts + 1 })
  }
  return {
    tick: state.tick + 1,
    nextId: state.nextId + arrivals,
    arrived: state.arrived + arrivals,
    completed,
    dead,
    dropped: state.dropped + arrivals - accepted,
    pending,
  }
}
export function buildProposalMailto(
  kind: string,
  name: string,
  url: string,
  body: string
): string {
  return `mailto:${personalData.socialLinks.email}?subject=${encodeURIComponent(`[${kind}] ${name.trim().slice(0, 120)}`)}&body=${encodeURIComponent(`${url.trim()}\n\n${body.trim()}\n\n${name.trim()}`)}`
}
