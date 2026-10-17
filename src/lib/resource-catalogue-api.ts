import { getResourceEntries, resourceSections } from "./resource-catalog"
import { getResourcePath } from "./resource-routes"
import { isLocale } from "./i18n"
import { SITE_URL } from "./site"
import { ECOSYSTEM_DATE, ECOSYSTEM_VERSION } from "@/data/resources/ecosystem"

const universalDownloads = new Set([
  "worker-starter.zip",
  "json-clone.csv",
  "json-clone.json",
  "benchmark-json.mjs",
])
export function buildResourceCatalogue(
  params: URLSearchParams = new URLSearchParams()
) {
  for (const key of params.keys())
    if (!["locale", "section"].includes(key) || params.getAll(key).length !== 1)
      throw new Error("Only one locale and section filter are accepted")
  const locale = params.get("locale") ?? "pt"
  if (!isLocale(locale)) throw new Error("locale must be pt, en or es")
  const section = params.get("section")
  if (section && !resourceSections.some((item) => item.slug === section))
    throw new Error("Unknown resource section")
  const resources = resourceSections
    .filter((item) => !section || item.slug === section)
    .flatMap((collection) =>
      getResourceEntries(collection.slug).map((entry) => ({
        id: `${collection.slug}/${entry.slug}`,
        section: collection.slug,
        slug: entry.slug,
        locale,
        title: entry.title[locale],
        description: entry.description[locale],
        url: `${SITE_URL}${getResourcePath(locale, collection.slug, entry.slug)}`,
        license: {
          text: "CC-BY-4.0",
          code: "MIT where supplied",
          thirdPartyAssets: "Excluded; see the material credits",
        },
        ...(entry.download
          ? {
              download: {
                url: `${SITE_URL}/recursos/downloads/${universalDownloads.has(entry.download) ? "" : locale + "/"}${entry.download}`,
              },
            }
          : {}),
        ...(entry.source ? { source: entry.source } : {}),
      }))
    )
  return {
    apiVersion: "1",
    release: ECOSYSTEM_VERSION,
    releasedAt: ECOSYSTEM_DATE,
    locale,
    license: "CC-BY-4.0",
    schema: `${SITE_URL}/api/resources/v1/schema`,
    releaseManifest: `${SITE_URL}/recursos/releases/${ECOSYSTEM_VERSION}/manifest.json`,
    count: resources.length,
    resources,
  }
}
/** Studio links stay relative until the Markdown exporter applies the canonical origin. */
export function getStudioResourceOptions(
  params: URLSearchParams = new URLSearchParams()
) {
  return buildResourceCatalogue(params).resources.map((item) => ({
    id: item.id,
    title: item.title,
    url: new URL(item.url).pathname,
  }))
}

export const resourceCatalogueSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: `${SITE_URL}/api/resources/v1/schema`,
  title: "Public resource catalogue",
  type: "object",
  required: [
    "apiVersion",
    "release",
    "releasedAt",
    "locale",
    "resources",
    "count",
  ],
  properties: {
    apiVersion: { const: "1" },
    release: { type: "string" },
    releasedAt: { type: "string", format: "date" },
    locale: { enum: ["pt", "en", "es"] },
    count: { type: "integer", minimum: 0 },
    resources: {
      type: "array",
      items: {
        type: "object",
        required: [
          "id",
          "section",
          "slug",
          "title",
          "description",
          "url",
          "locale",
          "license",
        ],
        properties: {
          id: { type: "string" },
          section: { type: "string" },
          slug: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          url: { type: "string", format: "uri" },
          locale: { enum: ["pt", "en", "es"] },
          license: { type: "object" },
          download: { type: "object" },
          source: { type: "string", format: "uri" },
        },
      },
    },
  },
}
