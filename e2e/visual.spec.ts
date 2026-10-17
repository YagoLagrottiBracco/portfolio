import { expect, test, type Page } from "@playwright/test"

/**
 * Visual regression: the top of the main page types, plus the home's busiest
 * blocks, in both themes, on a laptop and on a phone. Compared against the
 * baselines in e2e/visual.spec.ts-snapshots, which are made in the official
 * Playwright container (.github/workflows/visual.yml) because fonts render
 * differently on every machine. Not part of `npm run test:e2e`; see
 * docs/operations.md for running and updating it.
 *
 * Reduced motion keeps every reveal and pulse settled; remote images (GitHub
 * previews) and the copyright year are masked, since they change on their own.
 */
const pages = [
  { name: "home", path: "/" },
  { name: "case-study", path: "/projetos/envrune" },
  { name: "work-with-me", path: "/trabalhe-comigo" },
  { name: "article", path: "/blog/portfolio-nao-e-curriculo-lagrotti-dev-produto-de-engenharia" },
  { name: "not-found", path: "/esta-pagina-nao-existe" },
]

const viewports = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "phone", width: 390, height: 844 },
]

test.use({ reducedMotion: "reduce", locale: "pt-BR" })

async function open(page: Page, path: string, theme: string) {
  await page.addInitScript((value) => localStorage.setItem("theme", value), theme)
  await page.goto(path, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
}

const changing = (page: Page) => [page.locator('img[src*="githubassets"]'), page.locator("footer p").filter({ hasText: "©" })]

for (const theme of ["dark", "light"]) {
  for (const viewport of viewports) {
    test.describe(`${theme}, ${viewport.name}`, () => {
      test.use({ viewport })

      for (const { name, path } of pages) {
        test(name, async ({ page }) => {
          await open(page, path, theme)
          await expect(page).toHaveScreenshot(`${name}-${theme}-${viewport.name}.png`, { mask: changing(page) })
        })
      }

      test("home sections", async ({ page }) => {
        await open(page, "/", theme)
        // The fixed bar would cover the top of whatever is scrolled under it.
        const mask = [...changing(page), page.getByRole("navigation").first()]
        await expect(page.locator("#featured-projects article").first()).toHaveScreenshot(`featured-card-${theme}-${viewport.name}.png`, { mask })
        await expect(page.locator("#contact")).toHaveScreenshot(`contact-${theme}-${viewport.name}.png`, { mask })
        await expect(page.locator("footer").first()).toHaveScreenshot(`footer-${theme}-${viewport.name}.png`, { mask })
      })
    })
  }
}
