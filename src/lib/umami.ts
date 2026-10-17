/**
 * The few Umami Cloud API calls the reporting scripts make.
 * Reference: https://docs.umami.is/docs/api — Cloud serves it at
 * `https://api.umami.is/v1` with the API key as a Bearer token, limited to
 * 50 calls every 15 seconds per key.
 */
export class UmamiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
  }
}

export interface UmamiClient {
  get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T>
  post<T>(path: string, body: unknown): Promise<T>
}

export function createUmamiClient({ apiKey, websiteId, fetch: fetcher = fetch, baseUrl = "https://api.umami.is/v1" }: { apiKey: string; websiteId: string; fetch?: typeof fetch; baseUrl?: string | undefined }): UmamiClient {
  const site = `${baseUrl}/websites/${encodeURIComponent(websiteId)}`

  async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetcher(url, {
      ...init,
      headers: { Accept: "application/json", Authorization: `Bearer ${apiKey}`, ...(init?.body ? { "Content-Type": "application/json" } : {}) },
    })
    if (!response.ok) throw new UmamiError(response.status, `Umami answered ${response.status} for ${url.replace(baseUrl, "")}`)
    return response.json() as Promise<T>
  }

  return {
    get(path, params = {}) {
      const query = new URLSearchParams(Object.entries(params).filter((entry): entry is [string, string | number] => entry[1] !== undefined).map(([key, value]) => [key, String(value)]))
      return request(`${site}${path}${query.size ? `?${query}` : ""}`)
    },
    post(path, body) {
      return request(`${site}${path}`, { method: "POST", body: JSON.stringify(body) })
    },
  }
}

/** One step of an Umami funnel: a page (`*` only at the end) or a custom event. */
export interface FunnelStep { type: "path" | "event"; value: string }

export interface FunnelDefinition {
  name: string
  description: string
  steps: FunnelStep[]
  /** Minutes allowed between consecutive steps. */
  window: number
}

const WEEK = 7 * 24 * 60

/**
 * The paths from reading to getting in touch worth watching. Created in
 * Umami by `npm run umami:funnels`; the monthly report reads them back.
 */
export const funnels: FunnelDefinition[] = [
  {
    name: "Artigo → contato",
    description: "Leu um artigo do blog e clicou num canal de contato em até 7 dias.",
    steps: [{ type: "path", value: "/blog/*" }, { type: "event", value: "contact_click" }],
    window: WEEK,
  },
  {
    name: "Estudo de caso → contato",
    description: "Abriu um estudo de caso (português) e clicou num canal de contato em até 7 dias.",
    steps: [{ type: "path", value: "/projetos/*" }, { type: "event", value: "contact_click" }],
    window: WEEK,
  },
  {
    name: "Trabalhe comigo → contato",
    description: "Visitou a página Trabalhe comigo e clicou num canal de contato.",
    steps: [{ type: "path", value: "/trabalhe-comigo" }, { type: "event", value: "contact_click" }],
    window: WEEK,
  },
  {
    name: "Artigo → newsletter",
    description: "Leu um artigo do blog e se inscreveu na newsletter.",
    steps: [{ type: "path", value: "/blog/*" }, { type: "event", value: "newsletter_signup" }],
    window: WEEK,
  },
]
