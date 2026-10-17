/** Teaching worker: bounded in-memory state, sequential execution, no external services. */
export function createWorker({ maxAttempts = 3, maxJobs = 1000 } = {}) {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 10 || !Number.isInteger(maxJobs) || maxJobs < 1 || maxJobs > 10000)
    throw new RangeError('Invalid worker limits')
  const queue = [], known = new Set()
  let completed = 0, dead = 0, processing = false
  return {
    enqueue(id, payload) {
      if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,80}$/.test(id)) throw new TypeError('Invalid job id')
      if (known.has(id)) return false
      if (known.size >= maxJobs) throw new RangeError('Worker capacity reached')
      known.add(id)
      queue.push({ id, payload, attempts: 0 })
      return true
    },
    snapshot() { return { pending: queue.length, completed, dead, accepted: known.size } },
    async process(handler) {
      if (processing) throw new Error('Worker is already processing')
      if (typeof handler !== 'function') throw new TypeError('A handler is required')
      const job = queue.shift()
      if (!job) return { status: 'idle' }
      processing = true
      job.attempts++
      try {
        await handler(job.payload, { id: job.id, attempt: job.attempts })
        completed++
        return { id: job.id, attempt: job.attempts, status: 'completed' }
      } catch {
        if (job.attempts >= maxAttempts) { dead++; return { id: job.id, attempt: job.attempts, status: 'dead' } }
        queue.push(job)
        return { id: job.id, attempt: job.attempts, status: 'retry' }
      } finally { processing = false }
    },
  }
}
