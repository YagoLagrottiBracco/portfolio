"use client"

import { AnalyticsDashboard } from "@/components/discovery/AnalyticsDashboard"
import type { Locale } from "@/lib/i18n"

/** Hydrates after first paint so the static article list is never held back. */
export function PopularPosts({ locale }: { locale: Locale }) {
  return <AnalyticsDashboard locale={locale} />
}
