import assert from "node:assert/strict"
import test from "node:test"
import { BodyTooLargeError, readBoundedBody } from "../src/lib/bounded-body"

function streamed(chunks: Uint8Array[], headers: Record<string, string> = {}) {
  let cancelled = false
  let reads = 0
  const body = new ReadableStream<Uint8Array>({
    pull(controller) {
      const chunk = chunks[reads++]
      if (chunk) controller.enqueue(chunk)
      else controller.close()
    },
    cancel() { cancelled = true },
  }, { highWaterMark: 0 })
  const request = new Request("https://lagrotti.dev/api/test", { method: "POST", headers, body, duplex: "half" } as RequestInit)
  return { request, cancelled: () => cancelled, reads: () => reads }
}

test("counts UTF-8 bytes across chunks and cancels without reading the rest", async () => {
  const encoder = new TextEncoder()
  const input = streamed([encoder.encode("é"), encoder.encode("é"), encoder.encode("private body")], { "content-length": "1" })
  await assert.rejects(readBoundedBody(input.request, 3), BodyTooLargeError)
  assert.equal(input.reads(), 2)
  assert.equal(input.cancelled(), true)
})

test("accepts the exact byte boundary across chunks", async () => {
  const input = streamed([new Uint8Array([1, 2]), new Uint8Array([3, 4])])
  assert.deepEqual(await readBoundedBody(input.request, 4), new Uint8Array([1, 2, 3, 4]))
  assert.equal(input.cancelled(), false)
})

test("a declared oversize body is cancelled before reading any chunks", async () => {
  const input = streamed([new Uint8Array([1])], { "content-length": "100" })
  await assert.rejects(readBoundedBody(input.request, 4), BodyTooLargeError)
  assert.equal(input.reads(), 0)
  assert.equal(input.cancelled(), true)
})
