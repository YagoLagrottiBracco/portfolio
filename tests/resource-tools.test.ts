import assert from "node:assert/strict"
import test from "node:test"
import {
  compareJson,
  inspectEnvKeys,
  initialQueue,
  advanceQueue,
  buildProposalMailto,
} from "../src/lib/resource-tools"

test("JSON comparison distinguishes missing, null, scalar and ordered arrays", () => {
  assert.equal(compareJson('{"b":2,"a":1}', '{"a":1,"b":2}').changes.length, 0)
  const r = compareJson(
    '{"a":null,"x/y~":1,"list":[1,2]}',
    '{"a":false,"list":[2],"new":null}'
  )
  assert.deepEqual(
    r.changes.map((c) => [c.path, c.kind]),
    [
      ["/a", "changed"],
      ["/list/0", "changed"],
      ["/list/1", "removed"],
      ["/new", "added"],
      ["/x~1y~0", "removed"],
    ]
  )
  assert.equal(compareJson("null", "[]").changes[0].path, "")
  assert.equal(compareJson('{"__proto__":1}', "{}").changes[0].kind, "removed")
})
test("malformed, oversized and deeply nested JSON fail predictably; large diffs are capped", () => {
  assert.equal(compareJson("{", "{}").error, "invalid-json")
  assert.equal(compareJson(" ".repeat(200_001), "{}").error, "too-large")
  assert.equal(
    compareJson("[".repeat(110) + "0" + "]".repeat(110), "{}").error,
    "too-deep"
  )
  const big = Object.fromEntries(Array.from({ length: 600 }, (_, i) => [i, i]))
  const result = compareJson("{}", JSON.stringify(big))
  assert.equal(result.changes.length, 500)
  assert.equal(result.truncated, true)
})
test("env report contains names and line numbers only, supports export and catches duplicates", () => {
  const report = inspectEnvKeys(
    "export API_KEY=\nPORT=3000\n# comment\nOPTIONAL=",
    "API_KEY=super-secret\nAPI_KEY=another-secret\nEXTRA=x\nnot valid"
  )
  assert.deepEqual(report.missing, ["OPTIONAL", "PORT"])
  assert.deepEqual(report.extra, ["EXTRA"])
  assert.deepEqual(report.duplicates, ["API_KEY"])
  assert.deepEqual(report.invalidLines, [4])
  assert.ok(!JSON.stringify(report).includes("secret"))
})
test("queue preserves message accounting, bounded retries and immutable state", () => {
  const start = initialQueue()
  const first = advanceQueue(start, {
    arrivals: 2,
    workers: 1,
    failurePercent: 100,
  })
  assert.equal(start.pending.length, 0)
  assert.equal(first.pending.length, 2)
  let state = first
  for (let i = 0; i < 5; i++)
    state = advanceQueue(state, {
      arrivals: 0,
      workers: 1,
      failurePercent: 100,
    })
  assert.equal(state.dead, 2)
  assert.equal(state.pending.length, 0)
  for (let i = 0; i < 10; i++)
    state = advanceQueue(state, { arrivals: 20, workers: 2, failurePercent: 0 })
  assert.equal(state.pending.length, 180)
  assert.equal(
    state.arrived,
    state.pending.length + state.completed + state.dead + state.dropped
  )
})
test("queue clamps bad numeric inputs and caps memory under overload", () => {
  let state = initialQueue()
  for (let i = 0; i < 120; i++)
    state = advanceQueue(state, {
      arrivals: 50,
      workers: 1,
      failurePercent: 100,
    })
  assert.ok(state.pending.length <= 5000)
  assert.ok(state.dropped > 0)
  assert.equal(
    state.arrived,
    state.pending.length + state.completed + state.dead + state.dropped
  )
  assert.doesNotThrow(() =>
    advanceQueue(state, {
      arrivals: NaN,
      workers: -1,
      failurePercent: Infinity,
    })
  )
})
test("proposal is a draft and safely encodes multiline untrusted input", () => {
  const uri = buildProposalMailto(
    "colaboracoes",
    "A & B",
    "https://example.com/?x=1&y=2",
    "Line 1\nLine 2?subject=hack"
  )
  assert.ok(uri.startsWith("mailto:yago.lagrotti@outlook.com?subject="))
  assert.equal(new URLSearchParams(uri.split("?")[1]).size, 2)
  assert.ok(decodeURIComponent(uri).includes("Line 1\nLine 2?subject=hack"))
})

test("JSON refuses numeric precision loss instead of claiming changed IDs are equal", () => {
  for (const [a, b] of [
    ['{"id":9007199254740992}', '{"id":9007199254740993}'],
    ["1e999", "2e999"],
    ["1e-999", "2e-999"],
    ["1.0000000000000001", "1"],
  ])
    assert.equal(compareJson(a, b).error, "unsafe-number")
  assert.equal(
    compareJson('{"id":"9007199254740993"}', '{"id":"9007199254740992"}')
      .changes.length,
    1
  )
  for (const text of ["1.25", "1e-5", "0.30000000000000004", "0e9999", "-0"])
    assert.equal(compareJson(text, text).error, undefined)
})
