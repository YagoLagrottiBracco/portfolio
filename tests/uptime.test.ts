import assert from "node:assert/strict"
import test from "node:test"

import { checks, firstArticlePath, verdict } from "../scripts/uptime-check.mjs"

const check = (name: string) => checks.find((entry) => entry.name === name)!

test("the uptime check finds the newest article in the feed", () => {
  const feed = "<rss><channel><link>https://lagrotti.dev/blog</link><item><title>A</title><link>https://lagrotti.dev/blog/novo</link></item><item><link>https://lagrotti.dev/blog/velho</link></item></channel></rss>"
  assert.equal(firstArticlePath(feed, "http://127.0.0.1:3000"), "/blog/novo")
  assert.equal(firstArticlePath("<rss></rss>", "https://lagrotti.dev"), null)
})

test("the uptime check says what is wrong with an answer", () => {
  const ok = { status: 200, type: "text/html; charset=utf-8", body: "<html></html>", ms: 120 }
  assert.equal(verdict(check("Home"), ok), null)
  assert.equal(verdict(check("Home"), { ...ok, status: 500 }), "HTTP 500, esperado 200")
  assert.equal(verdict(check("Home"), { ...ok, ms: 9_000 }), "lento: 9000 ms")
  assert.equal(verdict(check("Currículo (PDF)"), { ...ok, type: "application/pdf", body: "<html>" }), 'resposta não começa com "%PDF"')
  assert.equal(verdict(check("API da newsletter"), { ...ok, status: 400, type: "application/json", body: "{}" }), null, "refusing a bad address means it runs")
  assert.equal(verdict(check("API da newsletter"), { ...ok, status: 500 }), "HTTP 500, esperado 400 ou 429")
})
