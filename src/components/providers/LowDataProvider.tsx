"use client"

import { useEffect } from "react"

/**
 * Honors the browser's Data Saver mode and a local preference. The class is on
 * <html>, so CSS can disable decorative media without waiting for components.
 */
export function LowDataProvider() {
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    const saved = window.localStorage.getItem("low-data")
    const enabled = saved === "1" || (saved !== "0" && connection?.saveData === true)
    document.documentElement.classList.toggle("low-data", enabled)
  }, [])

  return null
}
