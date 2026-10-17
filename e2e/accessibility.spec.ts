import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

/**
 * WCAG 2.1 A and AA checks with axe on the main page types, in both themes.
 * Reduced motion is on so that scroll reveals render settled, not mid-fade.
 */
test.use({ reducedMotion: "reduce" })

async function anArticle(page: Page) {
  const xml = await (await page.request.get("/blog/feed.xml")).text()
  return /<item>[\s\S]*?<link>https:\/\/lagrotti\.dev([^<?]+)/.exec(xml)![1]
}

async function violations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze()
  return violations.map((violation) => ({
    rule: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.slice(0, 5).map((node) => `${node.target.join(" ")} — ${node.failureSummary?.split("\n").slice(1).join(" ").trim()}`),
  }))
}

for (const theme of ["dark", "light"] as const) {
  test.describe(`${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme)
    })

    for (const path of ["/", "/en/blog", "/projetos/envrune", "/trabalhe-comigo", "/privacidade", "/nao-existe"]) {
      test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
        await page.goto(path)
        await page.waitForLoadState("networkidle")
        expect(await violations(page)).toEqual([])
      })
    }

    test("an article has no WCAG A/AA violations", async ({ page }) => {
      await page.goto(await anArticle(page))
      await page.waitForLoadState("networkidle")
      expect(await violations(page)).toEqual([])
    })
  })
}
