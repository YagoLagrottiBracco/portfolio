"use client"

/**
 * @file TrackedLink.tsx
 * @description A plain anchor that counts its click, for Server Components
 * that need one tracked link without becoming client components themselves.
 */
import type { AnchorHTMLAttributes } from "react"

import { trackEvent, type EventName } from "@/lib/analytics"

interface TrackedLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  event: EventName
  properties: Record<string, string>
}

export function TrackedLink({ event, properties, onClick, ...anchor }: TrackedLinkProps) {
  return (
    <a
      {...anchor}
      onClick={(clickEvent) => {
        trackEvent(event, properties)
        onClick?.(clickEvent)
      }}
    />
  )
}
