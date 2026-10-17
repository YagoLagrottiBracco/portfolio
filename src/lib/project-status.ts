import "server-only"

import { personalData } from "@/data/personal"
import type { Locale } from "@/lib/i18n"

export interface ProjectStatusResult {
  slug: string
  title: string
  url: string
  ok: boolean
  status: number | null
  checkedAt: string
}

/** Point-in-time availability of each public project URL; this is not historical uptime. */
export async function checkProjectStatus(locale: Locale, fetcher: typeof fetch = fetch): Promise<ProjectStatusResult[]> {
  const targets = [...new Map(personalData.projects.flatMap(project => project.links
    .filter(link => /^https:\/\//.test(link.url))
    .map(link => [link.url, { slug: project.slug, title: project.title[locale], url: link.url }])))
    .values()]

  return Promise.all(targets.map(async target => {
    const started = Date.now()
    try {
      const response = await fetcher(target.url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(7000),
        headers: { "User-Agent": "lagrotti-status-check/1.0" },
        cache: "no-store",
      })
      return { ...target, ok: response.ok, status: response.status, checkedAt: new Date(started).toISOString() }
    } catch {
      return { ...target, ok: false, status: null, checkedAt: new Date(started).toISOString() }
    }
  }))
}
