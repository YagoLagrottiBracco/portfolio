/* eslint-disable @typescript-eslint/no-require-imports -- Isolated server-only modules with fake provider boundaries. */
const assert = require("node:assert/strict")
const { test } = require("node:test")
const fs = require("node:fs")
const path = require("node:path")
const ts = require("typescript")

// Run the real server modules with an isolated configuration, cache and fetch.
// Only server-only's client-import guard is omitted; no application dependency is mocked.
function runtime({ env = {}, fetcher = async () => { throw new Error("Unexpected provider request") }, clock = Date, schedule = setTimeout, cancel = clearTimeout } = {}) {
  const modules = new Map()
  function load(file) {
    const filename = path.resolve(file)
    if (modules.has(filename)) return modules.get(filename).exports
    const compiled = { exports: {} }
    modules.set(filename, compiled)
    const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
    }).outputText
    function localRequire(id) {
      if (id === "server-only") return {}
      if (id.startsWith("@/")) return load(`src/${id.slice(2)}.ts`)
      if (id.startsWith(".")) return load(path.resolve(path.dirname(filename), `${id}.ts`))
      return require(id)
    }
    new Function("require", "module", "exports", "process", "fetch", "Date", "setTimeout", "clearTimeout", source)(localRequire, compiled, compiled.exports, { env, cwd: () => process.cwd() }, fetcher, clock, schedule, cancel)
    return compiled.exports
  }
  return load
}

const analyticsEnv = { UMAMI_WEBSITE_ID: "public-site", UMAMI_API_KEY: "test-key" }
const storeEnv = { UPSTASH_REDIS_REST_URL: "https://redis.example", UPSTASH_REDIS_REST_TOKEN: "test-token", INTERACTIONS_KEY: "existing:polls" }
const pollId = "engenharia-2026"
const pollContext = { params: Promise.resolve({ pollId }) }
const request = (option = "agentes", ip = "203.0.113.1") => new Request("https://site.example/api/interactions/polls/engenharia-2026?locale=en", {
  method: "POST", headers: { "x-forwarded-for": ip }, body: JSON.stringify({ option }),
})

test("public analytics uses Cloud ranked paths, authenticates and publishes only known article aggregates", async () => {
  const calls = []
  const load = runtime({ env: analyticsEnv, fetcher: async (input, init) => {
    calls.push({ url: new URL(input), init })
    return Response.json([
      { x: "/admin?email=private@example.com", y: 5000 },
      { x: "/blog/missing-article", y: 800 },
      { x: "/blog/chatgpt-apps-sdk", y: 1 },
      { x: null, y: 30 },
    ])
  } })
  const post = load("src/lib/blog.ts").getAllPosts()[0]
  const analytics = load("src/lib/public-analytics.ts")
  const fetcher = async () => Response.json([{ x: post.url, y: 4 }, { x: post.url, y: 3 }, { x: "/admin?email=private@example.com", y: 5000 }, { x: "/blog/missing-article", y: 800 }, { x: post.url, y: "9" }, { x: post.url, y: -1 }])
  // First exercise the default provider boundary and its request contract.
  await analytics.getPublicAnalytics()
  assert.equal(calls[0].url.origin + calls[0].url.pathname, "https://api.umami.is/v1/websites/public-site/metrics")
  assert.equal(calls[0].url.searchParams.get("type"), "path")
  assert.ok(Number(calls[0].url.searchParams.get("limit")) <= 1000)
  assert.ok(Number(calls[0].url.searchParams.get("startAt")) < Number(calls[0].url.searchParams.get("endAt")))
  assert.equal(new Headers(calls[0].init.headers).get("authorization"), "Bearer test-key")
  const result = await analytics.getPublicAnalytics(fetcher)
  assert.equal(result.pageviews, 7)
  assert.deepEqual(result.posts, [{ path: post.url, title: post.title, locale: post.locale, views: 7 }])
  assert.ok(!JSON.stringify(result).includes("private@example.com"))
})

test("explicit self-hosted API bases are preserved without adding a second /api", async () => {
  const urls = []
  const load = runtime({ env: { ...analyticsEnv, UMAMI_API_URL: "https://analytics.example/api/" }, fetcher: async input => {
    urls.push(String(input))
    return Response.json([])
  } })
  assert.equal((await load("src/lib/public-analytics.ts").getPublicAnalytics()).pageviews, 0)
  assert.equal(new URL(urls[0]).pathname, "/api/websites/public-site/metrics")
})

test("analytics coalesces concurrent reads and caches them for five minutes", async () => {
  let calls = 0
  let now = 1000
  class Clock extends Date { static now() { return now } }
  const load = runtime({ env: analyticsEnv, clock: Clock, fetcher: async () => { calls++; return Response.json([]) } })
  const { getPublicAnalytics } = load("src/lib/public-analytics.ts")
  await Promise.all(Array.from({ length: 20 }, () => getPublicAnalytics()))
  await getPublicAnalytics()
  assert.equal(calls, 1)
  now += 300001
  await getPublicAnalytics()
  assert.equal(calls, 2)
})

test("analytics errors and malformed provider payloads become bounded unavailable responses", async () => {
  for (const response of [() => new Response("no", { status: 401 }), () => Response.json({ pageviews: [{ x: "2026-10-01", y: 5 }] }), () => new Response("not JSON"), () => { throw new Error("private provider detail") }]) {
    let calls = 0
    const load = runtime({ env: analyticsEnv, fetcher: async () => { calls++; return response() } })
    const route = load("src/app/api/analytics/popular/route.ts")
    const result = await route.GET()
    assert.equal(result.status, 503)
    assert.deepEqual(await result.json(), { configured: false, posts: [] })
    await route.GET()
    assert.equal(calls, 1, "failures also have a cooldown")
  }
})

test("analytics times out a stalled provider and releases concurrent readers", async () => {
  let expire
  let signal
  const load = runtime({ env: analyticsEnv, schedule: callback => { expire = callback; return 1 }, cancel: () => {}, fetcher: async (_input, init) => {
    signal = init.signal
    return new Promise(() => {})
  } })
  const { getPublicAnalytics } = load("src/lib/public-analytics.ts")
  const first = getPublicAnalytics()
  const second = getPublicAnalytics()
  assert.equal(typeof expire, "function", "a timeout must bound provider work")
  expire()
  assert.equal(await first, null)
  assert.equal(await second, null)
  assert.equal(signal.aborted, true)
})

test("optional analytics and polls do not contact providers without configuration", async () => {
  const load = runtime()
  assert.equal(await load("src/lib/public-analytics.ts").getPublicAnalytics(), null)
  const polls = load("src/lib/interactions.ts")
  const results = await polls.getPollResults(pollId)
  assert.equal(results.configured, false)
  assert.equal(results.total, 0)
  assert.equal((await load("src/app/api/interactions/polls/[pollId]/route.ts").POST(request(), pollContext)).status, 503)
})

// Model the REST store's scheduling boundary: GET snapshots can interleave;
// EVAL applies one mutation before yielding, as Redis guarantees server-side.
function redisStore(seed = { polls: {} }) {
  let value = JSON.stringify(seed)
  const commands = []
  const fetcher = async (input, init) => {
    const url = new URL(input)
    const command = init?.body ? JSON.parse(init.body) : null
    if (Array.isArray(command)) {
      commands.push(command)
      assert.equal(command[0].toUpperCase(), "EVAL")
      assert.equal(command[2], 1)
      assert.equal(command[3], "existing:polls", "legacy key must be retained")
      assert.equal(new Headers(init.headers).get("authorization"), "Bearer test-token")
      const tally = JSON.parse(value)
      tally.polls[command[4]] ??= {}
      tally.polls[command[4]][command[5]] = (tally.polls[command[4]][command[5]] ?? 0) + 1
      value = JSON.stringify(tally)
      return Response.json({ result: value })
    }
    if (url.pathname.startsWith("/get/")) {
      const snapshot = value
      await new Promise(resolve => setImmediate(resolve))
      return Response.json({ result: snapshot })
    }
    if (url.pathname.startsWith("/set/")) {
      value = command.value
      return Response.json({ result: "OK" })
    }
    throw new Error("Unexpected Redis command")
  }
  return { fetcher, commands, snapshot: () => JSON.parse(value) }
}

test("simultaneous poll votes are atomic and preserve existing votes and other polls", async () => {
  const store = redisStore({ polls: { [pollId]: { agentes: 7, arquitetura: 2 }, "proximas-pautas": { legacy: 3 } } })
  const load = runtime({ env: storeEnv, fetcher: store.fetcher })
  const polls = load("src/lib/interactions.ts")
  await Promise.all(Array.from({ length: 30 }, (_, index) => polls.voteInPoll(pollId, index % 2 ? "agentes" : "arquitetura")))
  const result = await polls.getPollResults(pollId)
  assert.equal(result.total, 39)
  assert.equal(result.options.find(option => option.id === "agentes").votes, 22)
  assert.equal(result.options.find(option => option.id === "arquitetura").votes, 17)
  assert.equal(store.snapshot().polls["proximas-pautas"].legacy, 3)
  assert.equal(store.commands.length, 30)
})

test("poll results only count valid defined options", async () => {
  const store = redisStore({ polls: { [pollId]: { agentes: 3, arquitetura: 2, deletedOption: 100 } } })
  const load = runtime({ env: storeEnv, fetcher: store.fetcher })
  const result = await load("src/lib/interactions.ts").getPollResults(pollId)
  assert.equal(result.total, 5)
})

test("poll definitions reject inherited object property names before provider access", async () => {
  const load = runtime({ env: storeEnv })
  const polls = load("src/lib/interactions.ts")
  for (const id of ["__proto__", "constructor", "toString", "missing"]) {
    assert.equal(polls.getPollDefinition(id), null)
    assert.equal(await polls.voteInPoll(id, "agentes"), null)
  }
  assert.equal(await polls.voteInPoll(pollId, "__proto__"), null)
})

test("poll APIs return sanitized unavailable responses for store failures and corrupt tallies", async () => {
  for (const response of [() => new Response("error", { status: 500 }), () => Response.json({ error: "private error" }), () => Response.json({ result: "not json" }), () => Response.json({ result: JSON.stringify({ polls: { [pollId]: { agentes: -5 } } }) }), () => { throw new Error("private token detail") }]) {
    const load = runtime({ env: storeEnv, fetcher: async () => response() })
    const route = load("src/app/api/interactions/polls/[pollId]/route.ts")
    for (const result of [await route.GET(request(), pollContext), await route.POST(request(), pollContext)]) {
      assert.equal(result.status, 503)
      assert.deepEqual(await result.json(), { error: "Interaction store unavailable" })
    }
  }
})

test("poll APIs keep option validation, localize votes and return rate-limit retry timing", async () => {
  const store = redisStore()
  const load = runtime({ env: storeEnv, fetcher: store.fetcher })
  const route = load("src/app/api/interactions/polls/[pollId]/route.ts")
  assert.equal((await route.POST(request(42), pollContext)).status, 400)
  assert.equal((await route.POST(request("missing"), pollContext)).status, 404)
  const accepted = await route.POST(request("agentes", "203.0.113.2"), pollContext)
  assert.equal(accepted.status, 200)
  const result = await accepted.json()
  assert.equal(result.total, 1)
  assert.equal(result.options.find(option => option.id === "agentes").label, "Agents and AI tools")
  for (let index = 1; index < 20; index++) assert.equal((await route.POST(request("agentes", "203.0.113.2"), pollContext)).status, 200)
  const limited = await route.POST(request("agentes", "203.0.113.2"), pollContext)
  assert.equal(limited.status, 429)
  assert.ok(Number(limited.headers.get("retry-after")) > 0)
  assert.equal(store.snapshot().polls[pollId].agentes, 20)
})

test("poll request limiter stays bounded under caller churn", async () => {
  const load = runtime({ env: storeEnv, fetcher: redisStore().fetcher })
  const route = load("src/app/api/interactions/polls/[pollId]/route.ts")
  for (let index = 0; index < 20; index++) await route.POST(request(42, "first-caller"), pollContext)
  assert.equal((await route.POST(request(42, "first-caller"), pollContext)).status, 429)
  for (let index = 0; index < 1001; index++) await route.POST(request(42, `caller-${index}`), pollContext)
  assert.equal((await route.POST(request(42, "first-caller"), pollContext)).status, 400, "oldest caller is evicted to cap per-process memory")
})
