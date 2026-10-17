import { expect, test } from "@playwright/test"
import { discoveryPages, discoverySlugs } from "../src/data/discovery"

test("all Discovery pages keep their locale, canonical URL and one main title", async ({ request }) => {
  for (const locale of ["pt", "en", "es"] as const) {
    for (const slug of discoverySlugs) {
      const path = `${locale === "pt" ? "" : `/${locale}`}/${slug}`
      const response = await request.get(path)
      expect(response.status(), path).toBe(200)
      const html = await response.text()
      expect(html, path).toContain(`lang="${locale === "pt" ? "pt-BR" : locale === "en" ? "en-US" : "es"}"`)
      expect(html, path).toContain(`rel="canonical" href="https://lagrotti.dev${path}"`)
      expect(html.match(/<h1(?:\s|>)/g), path).toHaveLength(1)
      expect(html, path).toContain(discoveryPages[slug].title[locale])
    }
  }
})

test("invalid dynamic paths return real 404 responses rather than server errors", async ({ request }) => {
  for (const path of [
    "/blog/portfolio-como-produto-de-engenharia", "/blog/engineering-portfolio-as-a-product",
    "/blog/does-not-exist", "/en/projetos/does-not-exist", "/es/stack/does-not-exist",
    "/recursos/does-not-exist", "/fr/links", "/en/does-not-exist", "/pt/does-not-exist",
  ]) expect((await request.get(path)).status(), path).toBe(404)
})
