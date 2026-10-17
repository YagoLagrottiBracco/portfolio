/**
 * Prints a lagrotti.dev link tagged with UTM parameters, so a link sent out by
 * hand shows up in Umami under its source and campaign.
 *
 *   npm run utm -- linkedin --campaign blog-mcp --path /blog/mcp-producao-2026-ferramentas-agentes-seguranca
 *   npm run utm -- whatsapp --campaign recrutadores --content mensagem-1
 *   npm run utm -- email --medium newsletter --campaign outubro-2026
 *
 * The naming convention lives in docs/utm.md.
 */
import { parseArgs } from "node:util"

import { SITE_URL } from "../src/lib/site"
import { withUtm } from "../src/lib/utm"

/** The usual medium for each source, so most links need only a source and a campaign. */
const defaultMedium: Record<string, string> = {
  linkedin: "social",
  instagram: "social",
  x: "social",
  bluesky: "social",
  youtube: "social",
  whatsapp: "messaging",
  telegram: "messaging",
  email: "email",
  github: "referral",
  qrcode: "offline",
}

const slug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    campaign: { type: "string", short: "c" },
    medium: { type: "string", short: "m" },
    content: { type: "string" },
    term: { type: "string" },
    path: { type: "string", short: "p", default: "/" },
  },
})

const source = positionals[0] ? slug(positionals[0]) : ""
const medium = values.medium ? slug(values.medium) : defaultMedium[source]

if (!source || !medium || !values.campaign) {
  console.error("Usage: npm run utm -- <source> --campaign <name> [--medium <medium>] [--path /page] [--content <variant>]")
  console.error(`Sources with a default medium: ${Object.keys(defaultMedium).join(", ")}`)
  process.exit(1)
}

const path = values.path.startsWith("/") ? values.path : `/${values.path}`
console.log(
  withUtm(`${SITE_URL}${path}`, {
    utm_source: source,
    utm_medium: medium,
    utm_campaign: slug(values.campaign),
    utm_content: values.content && slug(values.content),
    utm_term: values.term && slug(values.term),
  }),
)
