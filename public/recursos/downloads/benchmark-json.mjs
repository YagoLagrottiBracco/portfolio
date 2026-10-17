import { performance } from "node:perf_hooks"
import { cpus, platform, arch } from "node:os"
import { mkdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import assert from "node:assert/strict"

// Standalone: node benchmark-json.mjs ./output (no dependencies).
const output = process.argv[2] || "./benchmark-results"
mkdirSync(output, { recursive: true })
const methods = {
  json: (value) => JSON.parse(JSON.stringify(value)),
  structured: (value) => structuredClone(value),
}
const samples = []
const batch = 10
for (const size of [100, 1000, 5000]) {
  const data = Array.from({ length: size }, (_, id) => ({
    id,
    type: "order.created",
    tenant: `tenant-${id % 10}`,
    payload: {
      total: id * 7,
      currency: "BRL",
      items: [id, id + 1],
      active: true,
    },
  }))
  for (const fn of Object.values(methods)) {
    assert.deepEqual(fn(data), data)
    for (let warmup = 0; warmup < 20; warmup++) fn(data)
  }
  for (let sample = 0; sample < 30; sample++) {
    const order = sample % 2 ? ["structured", "json"] : ["json", "structured"]
    for (const method of order) {
      const start = performance.now()
      let copy
      for (let i = 0; i < batch; i++) copy = methods[method](data)
      const ms = (performance.now() - start) / batch
      assert.equal(copy.length, size)
      samples.push({ size, method, sample: sample + 1, msPerCopy: ms })
    }
  }
}
const median = (values) => {
  const a = [...values].sort((x, y) => x - y)
  return (a[14] + a[15]) / 2
}
const summary = [100, 1000, 5000].flatMap((size) =>
  Object.keys(methods).map((method) => {
    const values = samples
      .filter((s) => s.size === size && s.method === method)
      .map((s) => s.msPerCopy)
    return {
      size,
      method,
      medianMs: median(values),
      minMs: Math.min(...values),
      maxMs: Math.max(...values),
    }
  })
)
const result = {
  generatedAt: new Date().toISOString(),
  node: process.version,
  platform: platform(),
  arch: arch(),
  cpu: cpus()[0]?.model || "unknown",
  logicalCpus: cpus().length,
  warmup: 20,
  samplesPerMethod: 30,
  copiesPerSample: batch,
  summary,
  samples,
}
writeFileSync(
  join(output, "json-clone.json"),
  JSON.stringify(result, null, 2) + "\n"
)
writeFileSync(
  join(output, "json-clone.csv"),
  "size,method,sample,ms_per_copy\n" +
    samples
      .map((s) => [s.size, s.method, s.sample, s.msPerCopy].join(","))
      .join("\n") +
    "\n"
)
console.log(
  JSON.stringify({ output, samples: samples.length, summary }, null, 2)
)
