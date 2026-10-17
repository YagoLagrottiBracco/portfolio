"use client"

/**
 * @file ErrorReporter.tsx
 * @description Sends uncaught browser errors to Sentry (see src/lib/sentry.ts):
 * at most five per page view, each distinct message once, extensions and
 * known noise ignored. Mounted only when NEXT_PUBLIC_SENTRY_DSN is set.
 */
import { useEffect } from "react"

import { buildEnvelope, isNoise, parseDsn } from "@/lib/sentry"

const MAX_PER_PAGE = 5

export function ErrorReporter({ dsn, release }: { dsn: string; release?: string }) {
  useEffect(() => {
    const target = parseDsn(dsn)
    if (!target) return
    const seen = new Set<string>()

    function report(type: string, message: string, stack?: string, source?: string) {
      if (seen.size >= MAX_PER_PAGE || seen.has(message) || isNoise(message, source)) return
      seen.add(message)
      const body = buildEnvelope({ type, message, stack, url: window.location.href, userAgent: navigator.userAgent, locale: document.documentElement.lang, release }, target!.dsn)
      // text/plain avoids a CORS preflight; keepalive lets the report outlive a navigation.
      void fetch(target!.envelopeUrl, { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain;charset=UTF-8" } }).catch(() => {})
    }

    // `event.message` carries the browser's "Uncaught Error: " prefix; the Error itself does not.
    const onError = (event: ErrorEvent) =>
      report(event.error?.name ?? "Error", event.error instanceof Error ? event.error.message : event.message, event.error?.stack, event.filename)
    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason
      report(reason?.name ?? "UnhandledRejection", reason instanceof Error ? reason.message : String(reason), reason?.stack)
    }
    window.addEventListener("error", onError)
    window.addEventListener("unhandledrejection", onRejection)
    return () => {
      window.removeEventListener("error", onError)
      window.removeEventListener("unhandledrejection", onRejection)
    }
  }, [dsn, release])

  return null
}
