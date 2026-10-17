import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test("a case study opens as slides driven by the keyboard", async ({ page }) => {
  await page.goto("/projetos/vmageste")
  await page.getByRole("link", { name: "Modo apresentação" }).click()
  await expect(page).toHaveURL(/\/projetos\/vmageste\/apresentar$/)
  await expect(page.getByRole("heading", { level: 1 })).toContainText("VMageste")
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)

  const counter = page.getByText(/^\d+ de \d+$/)
  await expect(counter).toHaveText(/^1 de/)
  await page.keyboard.press("ArrowRight")
  await expect(counter).toHaveText(/^2 de/)
  await expect(page.getByRole("heading", { name: "Contexto" })).toBeVisible()
  await expect(page).toHaveURL(/#2$/)

  await page.keyboard.press("End")
  await expect(page.getByRole("heading", { name: "Obrigado!" })).toBeVisible()
  await page.reload()
  await expect(page.getByRole("heading", { name: "Obrigado!" })).toBeVisible()

  await page.getByRole("button", { name: "Slide anterior" }).click()
  await expect(page.getByRole("heading", { name: "Stack" })).toBeVisible()
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([])
})

test("the English deck stays in English", async ({ page }) => {
  await page.goto("/en/projetos/pulsewatch/apresentar#2")
  await expect(page.getByRole("heading", { name: "Context" })).toBeVisible()
  await expect(page.getByText(/^2 of \d+$/)).toBeVisible()
})
