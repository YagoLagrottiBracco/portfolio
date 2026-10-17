import { createWorker } from './worker.mjs'
import { pathToFileURL } from 'node:url'

export async function runDemo() {
  const worker = createWorker({ maxAttempts: 3 })
  worker.enqueue('success', { example: true })
  worker.enqueue('transient', { example: true })
  worker.enqueue('permanent', { example: true })
  const duplicateAccepted = worker.enqueue('success', { example: true })
  const events = []
  while (worker.snapshot().pending) {
    events.push(await worker.process(async (_payload, { id, attempt }) => {
      if (id === 'permanent' || (id === 'transient' && attempt < 2)) throw new Error('Synthetic failure')
    }))
  }
  return { fictional: true, duplicateAccepted, events, totals: worker.snapshot() }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  console.log(JSON.stringify(await runDemo(), null, 2))
