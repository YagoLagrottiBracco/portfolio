import assert from "node:assert/strict"
import test from "node:test"
import { projectDemos } from "../src/data/resources/project-demos"
import { contentSecurityPolicy, PROJECT_DEMO_ORIGINS, securityHeaders } from "../src/lib/security-headers"

const directive = (policy: string, name: string) =>
  policy.split("; ").find((entry) => entry.startsWith(`${name} `))?.split(" ").slice(1) ?? []

test("pins scripts and requests to this origin and Umami", () => {
  const policy = contentSecurityPolicy()
  assert.deepEqual(directive(policy, "script-src"), ["'self'", "'unsafe-inline'", "https://cloud.umami.is", "https://assets.calendly.com", "https://giscus.app"])
  assert.deepEqual(directive(policy, "connect-src"), ["'self'", "https://gateway.umami.is"])
  assert.deepEqual(directive(policy, "frame-ancestors"), ["'none'"])
  assert.deepEqual(directive(policy, "object-src"), ["'none'"])
  assert.ok(directive(policy, "form-action").includes("https://github.com"), "GitHub sign-in redirect")
})

test("loosens only what the dev server needs", () => {
  const production = contentSecurityPolicy()
  const dev = contentSecurityPolicy({ dev: true })
  assert.doesNotMatch(production, /unsafe-eval|ws:/)
  assert.ok(directive(dev, "script-src").includes("'unsafe-eval'"))
  assert.ok(directive(dev, "connect-src").includes("ws:"))
})

test("sends the hardening headers on every response", () => {
  const names = securityHeaders().map((header) => header.key)
  for (const name of ["Content-Security-Policy", "X-Content-Type-Options", "X-Frame-Options", "Referrer-Policy", "Permissions-Policy"]) {
    assert.ok(names.includes(name), name)
  }
  const referrer = securityHeaders().find((header) => header.key === "Referrer-Policy")
  assert.equal(referrer?.value, "strict-origin-when-cross-origin")
})

test("frames only this site and the opt-in project demos", () => {
  assert.deepEqual(directive(contentSecurityPolicy(), "frame-src"), ["'self'", "https://calendly.com", "https://giscus.app", ...PROJECT_DEMO_ORIGINS])
  for (const demo of projectDemos) assert.ok(PROJECT_DEMO_ORIGINS.includes(new URL(demo.url).origin), `${demo.slug}: add ${new URL(demo.url).origin}`)
})

test("only the embeddable tools may be framed by other sites", () => {
  const embeddable = securityHeaders({ embeddable: true })
  assert.deepEqual(directive(contentSecurityPolicy({ embeddable: true }), "frame-ancestors"), ["*"])
  assert.equal(embeddable.some((header) => header.key === "X-Frame-Options"), false)
  assert.deepEqual(directive(contentSecurityPolicy(), "frame-ancestors"), ["'none'"])
})

test("a Sentry DSN allows its reports and receives CSP violations", async () => {
  const { buildEnvelope, isNoise, parseDsn } = await import("../src/lib/sentry")
  const dsn = "https://abc123@o42.ingest.us.sentry.io/4507"
  assert.deepEqual(parseDsn(dsn), {
    origin: "https://o42.ingest.us.sentry.io",
    envelopeUrl: "https://o42.ingest.us.sentry.io/api/4507/envelope/?sentry_key=abc123&sentry_version=7",
    securityUrl: "https://o42.ingest.us.sentry.io/api/4507/security/?sentry_key=abc123",
    dsn,
  })
  for (const bad of [undefined, "", "http://k@host/1", "https://host/1", "https://k@host/abc"]) assert.equal(parseDsn(bad), null, String(bad))

  const policy = contentSecurityPolicy({ sentryDsn: dsn })
  assert.ok(directive(policy, "connect-src").includes("https://o42.ingest.us.sentry.io"))
  assert.deepEqual(directive(policy, "report-uri"), ["https://o42.ingest.us.sentry.io/api/4507/security/?sentry_key=abc123"])
  assert.deepEqual(directive(contentSecurityPolicy(), "report-uri"), [], "no DSN, no reports")

  const lines = buildEnvelope({ type: "TypeError", message: "x is undefined", url: "https://lagrotti.dev/blog?q=1", userAgent: "UA", locale: "pt-BR" }, dsn, new Date("2026-10-17T12:00:00Z"), "0".repeat(32)).split("\n").map((line) => JSON.parse(line))
  assert.deepEqual(lines[0], { event_id: "0".repeat(32), sent_at: "2026-10-17T12:00:00.000Z", dsn })
  assert.deepEqual(lines[1], { type: "event" })
  assert.equal(lines[2].exception.values[0].value, "x is undefined")
  assert.equal(lines[2].tags.path, "/blog")
  assert.equal(isNoise("Script error."), true)
  assert.equal(isNoise("boom", "chrome-extension://abc/x.js"), true)
  assert.equal(isNoise("boom", "https://lagrotti.dev/_next/x.js"), false)
})
