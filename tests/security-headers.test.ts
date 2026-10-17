import assert from "node:assert/strict"
import test from "node:test"
import { contentSecurityPolicy, securityHeaders } from "../src/lib/security-headers"

const directive = (policy: string, name: string) =>
  policy.split("; ").find((entry) => entry.startsWith(`${name} `))?.split(" ").slice(1) ?? []

test("pins scripts and requests to this origin and Umami", () => {
  const policy = contentSecurityPolicy()
  assert.deepEqual(directive(policy, "script-src"), ["'self'", "'unsafe-inline'", "https://cloud.umami.is"])
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
