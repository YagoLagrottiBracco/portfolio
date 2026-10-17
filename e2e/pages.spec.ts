import { expect, test } from "@playwright/test"

test.describe("work with me", () => {
  test("is linked from the navigation and offers every contact channel", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto("/")
    await page.getByRole("navigation").first().getByRole("link", { name: "Trabalhe comigo" }).click()

    await expect(page).toHaveURL(/\/trabalhe-comigo$/)
    await expect(page.getByRole("heading", { level: 1, name: "Trabalhe comigo" })).toBeVisible()
    await expect(page.getByRole("link", { name: "Agendar uma conversa" }).first()).toHaveAttribute("href", /calendly\.com/)
    // The areas come from the case studies, so each links to one.
    await expect(page.getByRole("link", { name: /EnvRune/ })).toHaveAttribute("href", "/projetos/envrune")
  })

  test("exists in English and Spanish and follows the language switcher", async ({ page }) => {
    await page.goto("/en/trabalhe-comigo")
    await expect(page.locator("html")).toHaveAttribute("lang", "en-US")
    await expect(page.getByRole("heading", { level: 1, name: "Work with me" })).toBeVisible()

    await page.getByRole("button", { name: "Change language" }).first().click()
    await page.getByRole("menuitemradio", { name: "Español" }).click()
    await expect(page).toHaveURL(/\/es\/trabalhe-comigo$/)
    await expect(page.getByRole("heading", { level: 1, name: "Trabaja conmigo" })).toBeVisible()
  })

  test("sends /pt to the unprefixed page and unknown prefixes to the 404", async ({ request }) => {
    const redirected = await request.get("/pt/trabalhe-comigo", { maxRedirects: 0 })
    expect(redirected.status()).toBe(308)
    // Next sometimes repeats the header with the same value, as it does for the case studies.
    expect(redirected.headers().location.split(",")[0].trim()).toBe("/trabalhe-comigo")
    expect((await request.get("/fr/trabalhe-comigo")).status()).toBe(404)
  })
})

test("the privacy notice is in the footer of every page", async ({ page }) => {
  await page.goto("/blog")
  await page.getByRole("contentinfo").getByRole("link", { name: "Privacidade" }).click()
  await expect(page).toHaveURL(/\/privacidade$/)
  await expect(page.getByRole("heading", { level: 1, name: "Privacidade" })).toBeVisible()
  await expect(page.getByRole("heading", { level: 2, name: "Newsletter" })).toBeVisible()
})

test("the sitemap lists the new pages with their languages", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text()
  for (const path of ["/trabalhe-comigo", "/en/trabalhe-comigo", "/es/privacidade"]) {
    expect(xml).toContain(`<loc>https://lagrotti.dev${path}</loc>`)
  }
  // Blog indexes carry the date of their newest article.
  expect(xml).toMatch(/<loc>https:\/\/lagrotti\.dev\/blog<\/loc>\s*<lastmod>/)
})
