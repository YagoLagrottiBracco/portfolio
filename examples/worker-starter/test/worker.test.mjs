import test from 'node:test'
import assert from 'node:assert/strict'

test('worker retries transient errors, deduplicates IDs and exhausts permanent failures', async () => {
  const { createWorker } = await import('../worker.mjs')
  const worker = createWorker({ maxAttempts: 3, maxJobs: 10 })
  assert.equal(worker.enqueue('ok', { value: 1 }), true)
  assert.equal(worker.enqueue('ok', { value: 2 }), false)
  worker.enqueue('retry', {})
  worker.enqueue('dead', {})
  const handled = []
  while (worker.snapshot().pending) {
    await worker.process(async (_payload, { id, attempt }) => {
      if (id === 'dead' || (id === 'retry' && attempt < 2)) throw new Error('synthetic failure')
      handled.push(id)
    })
  }
  assert.deepEqual(handled, ['ok', 'retry'])
  assert.deepEqual(worker.snapshot(), { pending: 0, completed: 2, dead: 1, accepted: 3 })
  assert.equal(worker.enqueue('ok', {}), false)
})

test('worker enforces bounded retention and prevents concurrent consumption', async () => {
  const { createWorker } = await import('../worker.mjs')
  const worker = createWorker({ maxJobs: 1 })
  worker.enqueue('first', {})
  assert.throws(() => worker.enqueue('second', {}), /capacity/)
  let complete
  const pending = worker.process(() => new Promise((resolve) => { complete = resolve }))
  await assert.rejects(worker.process(async () => {}), /processing/)
  complete()
  await pending
  assert.equal(worker.snapshot().completed, 1)
})
