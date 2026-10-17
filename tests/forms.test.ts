import assert from "node:assert/strict"
import test from "node:test"
import { briefEmail, createBriefHandler, parseBrief } from "../src/lib/brief"
import { inboxConfig, sendToInbox } from "../src/lib/inbox"
import { createRateLimiter } from "../src/lib/rate-limit"
import { createRecommendationHandler, parseRecommendation, recommendationEmail, testimonialSnippet } from "../src/lib/recommendation"

const brief = {
  name: "Ana Souza", email: "ana@example.com", company: "Loja X", kind: "project", timeline: "soon",
  message: "Precisamos de um checkout com aprovação de arte e produção.", link: "https://loja.example/vaga",
  consent: "on", locale: "pt", page: "/trabalhe-comigo", source: "linkedin", campaign: "blog-mcp", first_source: "google.com", website: "",
}

test("a brief needs a name, a valid email, a real message, a kind and consent", () => {
  const parsed = parseBrief(brief)!
  assert.equal(parsed.kind, "project")
  assert.deepEqual(parsed.attribution, { source: "linkedin", campaign: "blog-mcp", first_source: "google.com" })
  for (const broken of [{ email: "nope" }, { message: "curta" }, { kind: "consulting" }, { consent: undefined }, { name: " " }]) {
    assert.equal(parseBrief({ ...brief, ...broken }), null, JSON.stringify(broken))
  }
  assert.equal(parseBrief({ ...brief, link: "javascript:alert(1)" })?.link, undefined, "only http(s) links")
  assert.equal(parseBrief({ ...brief, page: "//evil.example" })?.page, "/")
})

test("the brief email says who wrote, what for and where they came from", () => {
  const email = briefEmail(parseBrief(brief)!)
  assert.equal(email.subject, "[lagrotti.dev] Projeto: Ana Souza (Loja X)")
  assert.equal(email.replyTo, "ana@example.com")
  assert.match(email.text, /Prazo: Em 1 a 3 meses/)
  assert.match(email.text, /Origem da visita: linkedin \/ blog-mcp/)
  assert.match(email.text, /Origem da primeira visita: google\.com/)
  assert.match(email.idempotencyKey, /^[0-9a-f]{64}$/)
})

test("mail goes only to the configured inbox, through Resend", async () => {
  assert.equal(inboxConfig({}), null)
  assert.equal(inboxConfig({ RESEND_API_KEY: "re_x" }), null, "needs a destination too")
  const config = inboxConfig({ RESEND_API_KEY: "re_x", CONTACT_TO: "yago@example.com" })!
  assert.equal(config.from, "lagrotti.dev <onboarding@resend.dev>")

  let sent: { url: string; init: RequestInit } | undefined
  const fetcher = (async (url: string, init: RequestInit) => {
    sent = { url, init }
    return Response.json({ id: "email-1" })
  }) as unknown as typeof fetch
  assert.equal(await sendToInbox({ subject: "Oi\r\nBcc: x@y", text: "corpo", replyTo: "ana@example.com", idempotencyKey: "k" }, config, fetcher), true)
  const body = JSON.parse(String(sent!.init.body))
  assert.equal(sent!.url, "https://api.resend.com/emails")
  assert.deepEqual(body.to, ["yago@example.com"])
  assert.equal(body.subject, "Oi Bcc: x@y", "no header injection through the subject")
  assert.equal(body.reply_to, "ana@example.com")
  const headers = sent!.init.headers as Record<string, string>
  assert.equal(headers.Authorization, "Bearer re_x")
  assert.equal(headers["Idempotency-Key"], "k")
})

test("the brief endpoint delivers, or says it cannot, and never mails the visitor", async () => {
  const requests: string[] = []
  const fetcher = (async (url: string, init: RequestInit) => {
    requests.push(JSON.parse(String(init.body)).to[0])
    return Response.json({ id: "1" })
  }) as unknown as typeof fetch
  const post = (handler: (request: Request) => Promise<Response>) => handler(new Request("https://lagrotti.dev/api/contact/brief", {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json", origin: "https://lagrotti.dev" },
    body: JSON.stringify(brief),
  }))

  const configured = createBriefHandler({ inbox: { apiKey: "re_x", from: "a <a@lagrotti.dev>", to: "yago@example.com" }, fetch: fetcher, log: () => {} })
  assert.deepEqual(await (await post(configured)).json(), { status: "sent" })
  assert.deepEqual(requests, ["yago@example.com"])

  const unconfigured = createBriefHandler({ inbox: null, log: () => {}, limiter: createRateLimiter({ limit: 5, windowMs: 1000 }) })
  const response = await post(unconfigured)
  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { status: "unavailable" })
})

const recommendation = {
  name: "Bruno Lima", email: "bruno@example.com", role: "CTO", company: "Pulse", relationship: "client", project: "pulsewatch",
  quote: "O Yago entregou o monitoramento multi-tenant com alertas confiáveis \"sem ruído\".", results: "500+ lojas monitoradas",
  link: "https://www.linkedin.com/in/bruno", consent: "on", translate: "on", locale: "pt", page: "/recomendar", website: "",
}

test("a testimonial needs explicit permission to publish, and only real projects stick", () => {
  assert.equal(parseRecommendation({ ...recommendation, consent: undefined }, ["pulsewatch"]), null)
  assert.equal(parseRecommendation({ ...recommendation, quote: "Curto demais." }, ["pulsewatch"]), null)
  assert.equal(parseRecommendation(recommendation, ["vmageste"])?.project, undefined)
  assert.equal(parseRecommendation({ ...recommendation, translate: undefined }, ["pulsewatch"])?.translate, false)
})

test("the testimonial email carries the consent and a ready-to-paste entry", () => {
  const parsed = parseRecommendation(recommendation, ["pulsewatch"])!
  const email = recommendationEmail(parsed)
  assert.equal(email.subject, "[lagrotti.dev] Depoimento: Bruno Lima (Pulse)")
  assert.match(email.text, /Publicar com nome, cargo e empresa no lagrotti\.dev: sim/)
  assert.match(email.text, /Traduzir para os outros idiomas do site: sim/)

  const snippet = testimonialSnippet(parsed)
  // The snippet must be valid TypeScript/JSON-ish object syntax with escaped quotes.
  const entry = new Function(`return (${snippet.replace(/,\s*$/, "")})`)() as { quote: Record<string, string>; author: string; project: string }
  assert.equal(entry.quote.pt, recommendation.quote)
  assert.equal(entry.quote.en, `TODO(en) ${recommendation.quote}`)
  assert.equal(entry.author, "Bruno Lima")
  assert.equal(entry.project, "pulsewatch")
})

test("the recommendation endpoint redirects plain forms back with the result", async () => {
  const handler = createRecommendationHandler({ projectSlugs: ["pulsewatch"], inbox: null, log: () => {} })
  const response = await handler(new Request("https://lagrotti.dev/api/contact/recommendation", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded", origin: "https://lagrotti.dev" },
    body: new URLSearchParams({ ...recommendation, page: "/en/recomendar" }),
  }))
  assert.equal(response.status, 303)
  assert.equal(response.headers.get("location"), "/en/recomendar#recommendation-unavailable")
})
