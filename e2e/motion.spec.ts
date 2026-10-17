import { expect, test } from "@playwright/test"

/**
 * Scroll reveals are CSS animations driven by scrolling (src/lib/motion.ts).
 * A scroll-linked fade can get stuck half done when an element sits too close
 * to the end of the page to scroll far enough, so every reveal on the pages
 * that use them must end fully opaque once brought into view.
 */
const pages = ["/", "/en", "/projetos/envrune", "/es/projetos/vmageste"]

for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
  for (const path of pages) {
    test(`every reveal on ${path} ends fully visible at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto(path)
      expect(await page.evaluate(() => CSS.supports("animation-timeline: view()"))).toBe(true)

      const reveals = page.locator("[data-reveal]")
      const count = await reveals.count()
      expect(count).toBeGreaterThan(0)
      for (let index = 0; index < count; index++) {
        const element = reveals.nth(index)
        await element.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }))
        await expect.poll(() => element.evaluate((node) => Number(getComputedStyle(node).opacity)), { message: `reveal #${index}` }).toBeGreaterThan(0.99)
      }
    })
  }
}

test("the navigation is painted with the page, not after hydration", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.route("**/_next/static/chunks/**", (route) => route.abort())
  await page.goto("/")
  const box = await page.getByRole("navigation").first().boundingBox()
  expect(box?.y).toBe(0)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
})

test("the mobile menu opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/")
  const toggle = page.getByRole("button", { name: /abrir menu/i })
  await toggle.click()
  const menu = page.locator("#mobile-nav")
  await expect(menu).toBeVisible()
  await menu.getByRole("link", { name: /contato/i }).click()
  await expect(menu).toBeHidden()
})
