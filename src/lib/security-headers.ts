/**
 * Response headers sent with every route (wired in `next.config.ts`, which is
 * why this file imports nothing through the `@/` alias).
 *
 * The pages are static, so the Content-Security-Policy cannot carry a nonce —
 * that would force every page to render per request. Scripts therefore allow
 * `'unsafe-inline'` (Next's inline payloads, the theme script); everything else
 * is pinned to the origins the site actually talks to:
 *
 * - Umami: the tracker from `cloud.umami.is`, which reports to `gateway.umami.is`.
 * - Vercel Analytics and Speed Insights are served from this origin in
 *   production (`/_vercel/...`), so `'self'` covers them.
 * - Images may come from any HTTPS host: article covers and Markdown images
 *   are allowed to be remote.
 * - Sign-in posts a form that redirects to GitHub, and Chrome applies
 *   `form-action` to that redirect.
 * - The resource library frames its own embeddable tools and, once a visitor
 *   opts in, two client products (`PROJECT_DEMO_ORIGINS`).
 * - The embeddable tools (`/incorporar/…`) exist to be framed by other sites,
 *   so they alone allow any ancestor and skip X-Frame-Options.
 *
 * HSTS is absent on purpose: Vercel already sends it on every response.
 */
export const UMAMI_SCRIPT_ORIGIN = "https://cloud.umami.is"
export const UMAMI_COLLECT_ORIGIN = "https://gateway.umami.is"
/** Calendly's scheduling widget, loaded only when a visitor opens it (`CalendlyEmbed`). */
export const CALENDLY_SCRIPT_ORIGIN = "https://assets.calendly.com"
export const CALENDLY_FRAME_ORIGIN = "https://calendly.com"
/** Origins of `src/data/resources/project-demos.ts`; a test keeps the two lists in sync. */
export const PROJECT_DEMO_ORIGINS = ["https://duplaface.arq.br", "https://florapsicologa.com.br"]

interface PolicyOptions {
  dev?: boolean
  /** For pages meant to be framed by other sites. */
  embeddable?: boolean
}

export function contentSecurityPolicy({ dev = false, embeddable = false }: PolicyOptions = {}): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      UMAMI_SCRIPT_ORIGIN,
      CALENDLY_SCRIPT_ORIGIN,
      // React Refresh evaluates code, and the analytics debug scripts load from Vercel's CDN.
      ...(dev ? ["'unsafe-eval'", "https://va.vercel-scripts.com"] : []),
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", "blob:", "https:"],
    "font-src": ["'self'", "data:"],
    "connect-src": ["'self'", UMAMI_COLLECT_ORIGIN, ...(dev ? ["ws:"] : [])],
    "frame-src": ["'self'", CALENDLY_FRAME_ORIGIN, ...PROJECT_DEMO_ORIGINS],
    "frame-ancestors": embeddable ? ["*"] : ["'none'"],
    "form-action": ["'self'", "https://github.com"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "manifest-src": ["'self'"],
    "worker-src": ["'self'", "blob:"],
  }

  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ")
}

export function securityHeaders({ dev = false, embeddable = false }: PolicyOptions = {}): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy({ dev, embeddable }) },
    { key: "X-Content-Type-Options", value: "nosniff" },
    ...(embeddable ? [] : [{ key: "X-Frame-Options", value: "DENY" }]),
    // Full URL inside the site, only the origin elsewhere: the projects linked
    // from here still see lagrotti.dev as the referrer.
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ]
}
