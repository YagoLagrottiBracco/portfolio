import assert from "node:assert/strict"
import test from "node:test"

import { authorizeBlogAdmin, verifyAdminMutation } from "../src/lib/blog-admin-auth"

test("authorizes only the configured GitHub account ID", () => {
  assert.equal(authorizeBlogAdmin(null, "42"), "unauthenticated")
  assert.equal(authorizeBlogAdmin({ githubId: "43" }, "42"), "forbidden")
  assert.equal(authorizeBlogAdmin({ githubId: "42" }, "42"), "ok")
  assert.equal(authorizeBlogAdmin({ githubId: "42" }, ""), "forbidden")
})

test("rejects forged admin mutations", () => {
  const valid = {
    origin: "https://lagrotti.dev", expectedOrigin: "https://lagrotti.dev",
    contentType: "application/json; charset=utf-8", csrfHeader: "session-token", csrfSession: "session-token",
  }
  assert.equal(verifyAdminMutation(valid), true)
  assert.equal(verifyAdminMutation({ ...valid, origin: "https://evil.example" }), false)
  assert.equal(verifyAdminMutation({ ...valid, origin: null }), false)
  assert.equal(verifyAdminMutation({ ...valid, contentType: "text/plain" }), false)
  assert.equal(verifyAdminMutation({ ...valid, csrfHeader: "wrong-token" }), false)
  assert.equal(verifyAdminMutation({ ...valid, csrfHeader: null }), false)
})
