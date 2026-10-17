import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

/** NDJSON as /api/ask streams it. */
const ndjson = (events: unknown[]) => events.map((event) => JSON.stringify(event)).join("\n") + "\n"

test("the Ask page exists only when Claude is configured, and so does its link", async ({ page, request }) => {
  const status = (await request.get("/perguntar")).status()
  await page.goto("/trabalhe-comigo")
  const link = page.getByRole("link", { name: /Pergunte ao meu portfólio/ })
  if (status === 404) await expect(link).toHaveCount(0)
  else await expect(link).toHaveAttribute("href", "/perguntar")
})

test.describe("with Claude configured", () => {
  test.beforeEach(async ({ request }) => {
    test.skip((await request.get("/perguntar")).status() === 404, "build without ANTHROPIC_API_KEY")
  })

  test("streams a cited answer and lists its sources", async ({ page }) => {
    let sent: { question?: string; locale?: string } = {}
    await page.route("**/api/ask", async (route) => {
      sent = route.request().postDataJSON()
      await route.fulfill({
        contentType: "application/x-ndjson",
        body: ndjson([
          { t: "text", block: 0, text: "Sim: no VMageste, com Kafka entre a ingestão e o processamento." },
          { t: "cite", block: 0, source: 1 },
          { t: "text", block: 1, text: " Também escreveu sobre isso." },
          { t: "cite", block: 1, source: 2 },
          { t: "done", sources: [
            { n: 1, title: "VMageste — Marketing Analytics", url: "https://lagrotti.dev/projetos/vmageste" },
            { n: 2, title: "De monólito a Kafka — Por que Kafka", url: "https://lagrotti.dev/blog/x#kafka" },
          ] },
        ]),
      })
    })
    await page.goto("/perguntar")
    await page.getByRole("button", { name: "Ele já usou Kafka em produção?" }).click()

    await expect(page.getByText(/Sim: no VMageste/)).toBeVisible()
    await expect(page.getByRole("link", { name: "[1]" })).toHaveAttribute("href", "https://lagrotti.dev/projetos/vmageste")
    await expect(page.getByRole("heading", { name: "Fontes" })).toBeVisible()
    await expect(page.getByRole("link", { name: "De monólito a Kafka — Por que Kafka" })).toBeVisible()
    expect(sent).toEqual({ question: "Ele já usou Kafka em produção?", locale: "pt" })
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([])
  })

  test("drops a refused answer and says so", async ({ page }) => {
    await page.route("**/api/ask", (route) => route.fulfill({ contentType: "application/x-ndjson", body: ndjson([{ t: "text", block: 0, text: "Parcial" }, { t: "refusal" }]) }))
    await page.goto("/en/perguntar")
    await page.getByRole("textbox", { name: "Your question" }).fill("Something odd")
    await page.getByRole("button", { name: "Ask" }).click()
    await expect(page.getByText("I cannot answer that one.", { exact: false })).toBeVisible()
    await expect(page.getByText("Parcial")).toHaveCount(0)
  })

  test("explains a rate limit", async ({ page }) => {
    await page.route("**/api/ask", (route) => route.fulfill({ status: 429, body: '{"error":"limited"}' }))
    await page.goto("/perguntar")
    await page.getByRole("textbox", { name: "Sua pergunta" }).fill("Ele já liderou times?")
    await page.keyboard.press("Enter")
    await expect(page.getByText("Muitas perguntas em pouco tempo.", { exact: false })).toBeVisible()
  })
})
