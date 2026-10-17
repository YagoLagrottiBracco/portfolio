"use client"

/**
 * @file AttributionCapture.tsx
 * @description Remembers where a visitor came from (UTM tags or referrer) so
 * later analytics events can say so. Renders nothing.
 */
import { useEffect } from "react"

import { browserStorages, recordLanding, touchFromLanding } from "@/lib/attribution"

export function AttributionCapture() {
  useEffect(() => {
    const { local, session } = browserStorages()
    recordLanding(touchFromLanding(window.location.href, document.referrer), local, session)
  }, [])

  return null
}
