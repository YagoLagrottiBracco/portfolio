import assert from "node:assert/strict"
import test from "node:test"

import { discoveryPages, discoverySlugs, isDiscoverySlug } from "../src/data/discovery"
import { buildDiscoveryMetadata } from "../src/lib/discovery-metadata"
import { getDiscoveryPath, parseDiscoveryPath } from "../src/lib/discovery-routes"
import { locales } from "../src/lib/i18n"

test("every discovery slug has title and description across all three locales", () => {
  for (const slug of discoverySlugs) {
    const page = discoveryPages[slug]
    assert.ok(page, `Missing definition for ${slug}`)
    for (const locale of locales) {
      assert.ok(page.title[locale]?.trim(), `Missing ${locale} title for ${slug}`)
      assert.ok(page.description[locale]?.trim(), `Missing ${locale} description for ${slug}`)
    }
  }
})

test("discovery routes correctly generate and parse paths", () => {
  for (const slug of discoverySlugs) {
    // Portuguese is unprefixed
    assert.equal(getDiscoveryPath("pt", slug), `/${slug}`)
    assert.deepEqual(parseDiscoveryPath(`/${slug}`), { locale: "pt", slug })

    // English
    assert.equal(getDiscoveryPath("en", slug), `/en/${slug}`)
    assert.deepEqual(parseDiscoveryPath(`/en/${slug}`), { locale: "en", slug })

    // Spanish
    assert.equal(getDiscoveryPath("es", slug), `/es/${slug}`)
    assert.deepEqual(parseDiscoveryPath(`/es/${slug}`), { locale: "es", slug })
  }

  // Trailing slash tolerance
  assert.deepEqual(parseDiscoveryPath("/links/"), { locale: "pt", slug: "links" })
  assert.deepEqual(parseDiscoveryPath("/en/radar/"), { locale: "en", slug: "radar" })

  // Invalid paths
  assert.equal(parseDiscoveryPath("/not-a-slug"), null)
  assert.equal(parseDiscoveryPath("/en/not-a-slug"), null)
  assert.equal(parseDiscoveryPath("/fr/links"), null)
})

test("isDiscoverySlug accurately guards known slugs", () => {
  assert.equal(isDiscoverySlug("links"), true)
  assert.equal(isDiscoverySlug("status"), true)
  assert.equal(isDiscoverySlug("analytics"), true)
  assert.equal(isDiscoverySlug("unknown-slug"), false)
  assert.equal(isDiscoverySlug(""), false)
})

test("buildDiscoveryMetadata produces valid metadata for all locales", () => {
  for (const slug of discoverySlugs) {
    for (const locale of locales) {
      const meta = buildDiscoveryMetadata(locale, slug)
      assert.ok(meta.title)
      assert.ok(meta.description)
      assert.ok(meta.alternates?.canonical)
      assert.ok(meta.openGraph?.title)
    }
  }
})


