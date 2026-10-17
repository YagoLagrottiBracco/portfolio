import { expect, test } from "@playwright/test"

test("Ctrl+K searches the whole site and opens the chosen result", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto("/")
  await page.keyboard.press("Control+k")
  const dialog = page.getByRole("dialog", { name: "Buscar no site" })
  await expect(dialog).toBeVisible()
  const box = dialog.getByRole("combobox", { name: "Buscar" })
  await expect(box).toBeFocused()

  await box.fill("nestjs")
  const options = dialog.getByRole("option")
  await expect(options.first()).toContainText("NestJS")
  await expect(dialog.getByRole("option", { name: /Tecnologia/ }).first()).toBeVisible()
  await expect(options.first()).toHaveAttribute("aria-selected", "true")
  await box.press("Enter")
  await expect(page).toHaveURL(/\/stack\/nestjs$/)
})

test("'/' opens the search, Esc closes it, and the index follows the language", async ({ page }) => {
  await page.goto("/en/blog")
  await page.keyboard.press("/")
  const dialog = page.getByRole("dialog", { name: "Search the site" })
  await expect(dialog).toBeVisible()
  await dialog.getByRole("combobox").fill("privacy")
  await expect(dialog.getByRole("option").first()).toContainText("Privacy")
  await page.keyboard.press("Escape")
  await expect(dialog).toBeHidden()
})

test("the search button works on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto("/trabalhe-comigo")
  await page.getByRole("button", { name: /Buscar no site/ }).last().click()
  const dialog = page.getByRole("dialog", { name: "Buscar no site" })
  await dialog.getByRole("combobox").fill("vmageste")
  await dialog.getByRole("option").first().click()
  await expect(page).toHaveURL(/\/projetos\/vmageste$/)
})
