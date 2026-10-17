/**
 * Fixed-window request counters, kept in the function's memory.
 *
 * Best effort by design: each serverless instance counts on its own and
 * forgets on a cold start, so this stops a loop or a scripted burst against
 * one instance, not a distributed attack. The durable layer is the Vercel
 * Firewall rule described in docs/operations.md.
 */
export interface RateLimitResult {
  allowed: boolean
  /** Seconds until the window resets; 0 when allowed. */
  retryAfterSeconds: number
}

export interface RateLimiter {
  hit(key: string, now?: number): RateLimitResult
}

export function createRateLimiter({ limit, windowMs, maxKeys = 10_000 }: { limit: number; windowMs: number; maxKeys?: number }): RateLimiter {
  const windows = new Map<string, { count: number; resetAt: number }>()

  function prune(now: number) {
    for (const [key, window] of windows) if (window.resetAt <= now) windows.delete(key)
    // Still full of live keys: drop the oldest rather than grow without bound.
    for (const key of windows.keys()) {
      if (windows.size < maxKeys) break
      windows.delete(key)
    }
  }

  return {
    hit(key, now = Date.now()) {
      let window = windows.get(key)
      if (!window || window.resetAt <= now) {
        if (windows.size >= maxKeys) prune(now)
        window = { count: 0, resetAt: now + windowMs }
        windows.set(key, window)
      }
      if (window.count >= limit) return { allowed: false, retryAfterSeconds: Math.ceil((window.resetAt - now) / 1000) }
      window.count++
      return { allowed: true, retryAfterSeconds: 0 }
    },
  }
}
