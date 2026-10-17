import assert from "node:assert/strict"
import test from "node:test"
import { getRelatedPosts } from "../src/lib/blog-related"
import { buildSearchText, matchesSearch, normalizeSearch } from "../src/lib/blog-search"
import type { Locale } from "../src/lib/i18n"
import { createNewsletterHandler, parseSubscription, subscribe } from "../src/lib/newsletter"
import { createRateLimiter } from "../src/lib/rate-limit"
import { sharedArticleUrl, shareLinks } from "../src/lib/share-links"

const post = (translationKey: string, tags: string[], date: string, locale: Locale = "pt") => ({ translationKey, tags, date, locale })

test("suggests articles that share the rarest tags first", () => {
  const current = post("kafka-pipeline", ["kafka", "architecture"], "2026-05-01")
  const all = [
    current,
    post("kafka-pipeline", ["kafka"], "2026-05-01", "en"), // its own translation
    post("event-sourcing", ["kafka", "architecture"], "2026-01-01"),
    post("ddd-basics", ["architecture"], "2026-09-01"),
    post("clean-code", ["architecture"], "2026-08-01"),
    post("react-hooks", ["react"], "2026-10-01"),
    post("english-only", ["kafka"], "2026-10-01", "en"),
  ]
  assert.deepEqual(getRelatedPosts(current, all).map((item) => item.translationKey), ["event-sourcing", "ddd-basics", "clean-code"])
})

test("fills with the newest articles when too few share a tag", () => {
  const current = post("lonely", ["unique"], "2026-01-01")
  const all = [current, post("old", ["x"], "2025-01-01"), post("new", ["y"], "2026-09-01")]
  assert.deepEqual(getRelatedPosts(current, all).map((item) => item.translationKey), ["new", "old"])
})

test("tags shared links with the network and the article as campaign", () => {
  const url = "https://lagrotti.dev/blog/artigo"
  assert.equal(sharedArticleUrl(url, "copy", "artigo-key"), "https://lagrotti.dev/blog/artigo?utm_source=copy&utm_medium=share&utm_campaign=artigo-key")

  const links = shareLinks({ url, title: "Kafka & ClickHouse", campaign: "artigo-key" })
  const linkedinTarget = new URL(links.linkedin).searchParams.get("url")!
  assert.equal(new URL(linkedinTarget).searchParams.get("utm_source"), "linkedin")
  assert.match(decodeURIComponent(links.whatsapp), /^https:\/\/wa\.me\/\?text=Kafka & ClickHouse https:\/\/lagrotti\.dev\/blog\/artigo\?utm_source=whatsapp/)
  assert.equal(new URL(links.x).searchParams.get("text"), "Kafka & ClickHouse")
  assert.match(links.email, /^mailto:\?subject=Kafka%20%26%20ClickHouse&body=/)
})

test("search ignores case and accents and needs every word", () => {
  assert.equal(normalizeSearch("  Arquitetura   ÉTICA "), "arquitetura etica")
  const text = buildSearchText(["Flora: site de psicologia", "SEO, ética e LGPD", "next.js", "Agendamento online"])
  assert.equal(matchesSearch(text, "psicologia lgpd"), true)
  assert.equal(matchesSearch(text, "Ética"), true)
  assert.equal(matchesSearch(text, "psicologia kafka"), false)
  assert.equal(matchesSearch(text, "   "), true, "an empty query keeps everything")
})

test("accepts a usable signup and drops anything it should not trust", () => {
  const parsed = parseSubscription({ email: " ana@example.com ", locale: "es", page: "/blog/artigo", source: "LinkedIn", campaign: "<script>", website: "" })
  assert.deepEqual(parsed, { email: "ana@example.com", locale: "es", page: "/blog/artigo", source: "linkedin", medium: undefined, campaign: undefined, firstSource: undefined, firstCampaign: undefined, trap: "" })
  assert.equal(parseSubscription({ email: "not-an-email" }), null)
  assert.equal(parseSubscription({ email: "a@b.co", page: "//evil.example" })?.page, "/", "no protocol-relative redirect")
  assert.equal(parseSubscription({ email: "a@b.co", page: "/x\r\nSet-Cookie: y" })?.page, "/", "no header injection")
  assert.equal(parseSubscription({ email: "a@b.co", locale: "fr" })?.locale, "pt")
})

const buttondown = (status: number, body: unknown = {}) => {
  const calls: { url: string; init: RequestInit }[] = []
  const fetcher = (async (url: string, init: RequestInit) => {
    calls.push({ url, init })
    return new Response(JSON.stringify(body), { status })
  }) as unknown as typeof fetch
  return { calls, fetcher }
}

test("creates the subscriber with its source and never reveals an existing one", async () => {
  const signup = parseSubscription({ email: "ana@example.com", page: "/blog/artigo", source: "linkedin", medium: "social", first_source: "google.com" })!
  const created = buttondown(201)
  assert.equal(await subscribe(signup, { apiKey: "key", ip: "203.0.113.7", fetch: created.fetcher }), "pending")
  const sent = JSON.parse(String(created.calls[0].init.body))
  assert.equal(created.calls[0].url, "https://api.buttondown.com/v1/subscribers")
  assert.equal((created.calls[0].init.headers as Record<string, string>).Authorization, "Token key")
  assert.deepEqual(sent, {
    email_address: "ana@example.com",
    referrer_url: "https://lagrotti.dev/blog/artigo",
    utm_source: "linkedin",
    utm_medium: "social",
    metadata: { locale: "pt", page: "/blog/artigo", first_source: "google.com" },
    ip_address: "203.0.113.7",
  })

  assert.equal(await subscribe(signup, { apiKey: "key", fetch: buttondown(400, { code: "email_already_exists" }).fetcher }), "pending")
  assert.equal(await subscribe(signup, { apiKey: "key", fetch: buttondown(400, { code: "email_invalid" }).fetcher }), "invalid")
  assert.equal(await subscribe(signup, { apiKey: "key", fetch: buttondown(429).fetcher }), "unavailable")
})

test("the endpoint answers JSON to scripts and redirects plain forms back to their page", async () => {
  const silent = () => {}
  const { calls, fetcher } = buttondown(201)
  const handler = createNewsletterHandler({ apiKey: "key", fetch: fetcher, log: silent })

  const json = await handler(new Request("https://lagrotti.dev/api/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", origin: "https://lagrotti.dev" },
    body: JSON.stringify({ email: "ana@example.com", page: "/blog/artigo" }),
  }))
  assert.equal(json.status, 200)
  assert.deepEqual(await json.json(), { status: "pending" })

  const form = await handler(new Request("https://lagrotti.dev/api/newsletter", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", origin: "https://lagrotti.dev" },
    body: new URLSearchParams({ email: "nope", page: "/blog/artigo" }),
  }))
  assert.equal(form.status, 303)
  assert.equal(form.headers.get("location"), "/#newsletter-invalid")

  const valid = await handler(new Request("https://lagrotti.dev/api/newsletter", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", origin: "https://lagrotti.dev" },
    body: new URLSearchParams({ email: "bia@example.com", page: "/blog/artigo" }),
  }))
  assert.equal(valid.headers.get("location"), "/blog/artigo#newsletter-pending")
  assert.equal(calls.length, 2)
})

test("the endpoint turns away bots, other sites and bursts without calling Buttondown", async () => {
  const { calls, fetcher } = buttondown(201)
  const outcomes: string[] = []
  const handler = createNewsletterHandler({ apiKey: "key", fetch: fetcher, limiter: createRateLimiter({ limit: 2, windowMs: 60_000 }), log: (_action, fields) => outcomes.push(fields.outcome) })
  const request = (body: Record<string, string>, origin = "https://lagrotti.dev") => new Request("https://lagrotti.dev/api/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", origin, "x-forwarded-for": "198.51.100.9" },
    body: JSON.stringify(body),
  })

  assert.equal((await handler(request({ email: "x@example.com" }, "https://evil.example"))).status, 403)
  const trapped = await handler(request({ email: "bot@example.com", website: "https://spam.example" }))
  assert.deepEqual(await trapped.json(), { status: "pending" })
  assert.equal((await handler(request({ email: "ok@example.com" }))).status, 200)
  assert.equal((await handler(request({ email: "again@example.com" }))).status, 429)
  assert.equal(calls.length, 1)
  assert.deepEqual(outcomes, ["denied", "denied", "ok", "limited"])

  const unconfigured = createNewsletterHandler({ apiKey: undefined, log: () => {} })
  assert.equal((await unconfigured(request({ email: "ok@example.com" }))).status, 503)
})
