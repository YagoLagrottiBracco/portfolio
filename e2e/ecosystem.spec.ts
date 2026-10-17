import { expect, test } from "@playwright/test"

test("ecosystem collection exposes all twenty additions in every locale", async ({
  page,
}) => {
  for (const prefix of ["", "/en", "/es"]) {
    await page.goto(prefix + "/recursos/ecossistema")
    await expect(page.locator("h1")).toBeVisible()
    await expect(
      page.locator('main a[href*="/recursos/ecossistema/"]')
    ).toHaveCount(20)
  }
})

test("shared queue scenario is reviewed before deterministic replay", async ({
  page,
}) => {
  await page.goto(
    "/recursos/ecossistema/cenarios?queue=1&arrivals=8&workers=3&failures=0&steps=10"
  )
  await expect(page.getByTestId("queue-backlog")).toHaveText("0")
  await page.getByTestId("scenario-apply").click()
  await expect(page.getByTestId("queue-backlog")).toHaveText("50")
  await page.getByTestId("scenario-share").click()
  const shared = new URL(await page.getByTestId("scenario-url").inputValue())
  expect(shared.searchParams.get("arrivals")).toBe("8")
  expect(shared.searchParams.get("steps")).toBe("10")
})

test("technical challenges grade answers and retain explicit local progress", async ({
  page,
}) => {
  await page.goto("/recursos/ecossistema/desafios")
  await page.getByTestId("challenge-hint").click()
  await page.locator('[data-option-id="50"]').check()
  await page.getByTestId("challenge-grade").click()
  await expect(page.getByTestId("challenge-result")).toContainText("Correto!")
  await expect(page.getByTestId("challenge-progress")).toContainText("1 / 6")
  await page.reload()
  await expect(page.getByTestId("challenge-progress")).toContainText("1 / 6")
  await page.getByTestId("challenge-reset").click()
  await expect(page.getByTestId("challenge-progress")).toContainText("0 / 6")
})

test("architecture editing exports real escaped graph text", async ({
  page,
}) => {
  await page.goto("/recursos/ecossistema/editor-diagramas")
  await page
    .getByLabel("Novo componente", { exact: true })
    .fill("Service <sample> & test")
  await page.getByTestId("diagram-add-node").click()
  await page.getByTestId("diagram-svg").click()
  await expect(page.getByTestId("diagram-export")).toHaveValue(
    /Service &lt;sample&gt; &amp; test/
  )
  await page.getByTestId("diagram-mermaid").click()
  await expect(page.getByTestId("diagram-export")).toHaveValue(/^flowchart LR/)
})

test("named collections share only known IDs and import through explicit review", async ({
  page,
}) => {
  await page.goto("/recursos/ecossistema/colecoes")
  await page.getByTestId("collection-name").fill("Estudo de contratos")
  await page.locator('[data-resource-id="ferramentas/json"]').check()
  await page.getByTestId("collection-share").click()
  const url = await page.getByTestId("collection-export").inputValue()
  await page.goto(url)
  await expect(page.locator("[data-selected-resource]")).toHaveCount(0)
  await page.getByTestId("collection-import").click()
  await expect(page.locator("[data-selected-resource]")).toHaveCount(1)
  await page.getByTestId("collection-save").click()
  await page.reload()
  await page
    .getByLabel("Abrir coleção salva")
    .selectOption("Estudo de contratos")
  await expect(page.locator("[data-selected-resource]")).toHaveCount(1)
  await page.getByTestId("collection-markdown").click()
  await expect(page.getByTestId("collection-export")).toHaveValue(
    /ferramentas\/json/
  )
})

test("citation, README card and QR builders produce usable outputs", async ({
  page,
}) => {
  await page.goto("/recursos/ecossistema/citacoes")
  await page.getByLabel("Material para citar").selectOption("templates/worker")
  await expect(page.getByRole("textbox", { name: "BibTeX", exact: true })).toHaveValue(
    /templates-worker/
  )
  await expect(
    page.getByRole("link", { name: "Baixar BibTeX" })
  ).toHaveAttribute("href", /^data:application\/x-bibtex/)
  await page.goto("/recursos/ecossistema/cartoes")
  await page.getByLabel("Recurso do cartão").selectOption("ferramentas/json")
  await expect(page.getByLabel("Markdown para incorporar")).toHaveValue(
    /api\/resources\/card\?id=ferramentas%2Fjson/
  )
  await expect
    .poll(() =>
      page
        .getByTestId("resource-card-builder")
        .locator("img")
        .evaluate((element) => (element as HTMLImageElement).naturalWidth)
    )
    .toBeGreaterThan(0)
  await page.goto("/recursos/ecossistema/links-qr")
  await page.getByLabel("Destino do link curto").selectOption("filas")
  await expect(page.getByRole("textbox", { name: "Link curto", exact: true })).toHaveValue(
    "https://lagrotti.dev/r/filas"
  )
  await expect
    .poll(() =>
      page
        .getByTestId("short-link-builder")
        .locator("img")
        .evaluate((element) => (element as HTMLImageElement).naturalWidth)
    )
    .toBeGreaterThan(0)
})

test("article passage links resolve and corrections remain reviewable local drafts", async ({
  page,
}) => {
  const marker = "CORRECTION_PRIVATE_SAMPLE_2026",
    leaked: string[] = []
  page.on("request", (request) => {
    if ((request.url() + (request.postData() ?? "")).includes(marker))
      leaked.push(request.url())
  })
  await page.goto("/blog")
  await page.locator('article a[href^="/blog/"]').first().click()
  const passage = page.locator('.blog-prose p[id^="p-"]').first()
  const id = await passage.getAttribute("id")
  await expect(page.locator(`a[href$="#${id}"]`).first()).toBeVisible()
  const selected = await passage.evaluate((element) => {
    const range = document.createRange()
    range.selectNodeContents(element)
    const selection = window.getSelection()!
    selection.removeAllRanges()
    selection.addRange(range)
    return selection.toString().trim().slice(0, 1500)
  })
  await page
    .getByRole("button", { name: "Usar texto selecionado", exact: true })
    .click()
  await expect(page.getByRole("textbox", { name: "Trecho original", exact: true })).toHaveValue(
    selected
  )
  await page.getByLabel("Correção sugerida", { exact: true }).fill(marker)
  await page
    .locator("[data-correction-proposal]")
    .getByRole("button", { name: "Preparar rascunho", exact: true })
    .click()
  await expect(
    page.getByRole("link", { name: "Revisar no GitHub", exact: true })
  ).toHaveAttribute("href", new RegExp(marker))
  expect(leaked).toEqual([])
})

test("resource corrections preserve the resource URL rather than the correction-tool URL", async ({
  page,
}) => {
  await page.goto("/recursos/templates/worker")
  await page
    .getByText("Sugerir correção deste recurso", { exact: true })
    .click()
  const form = page.locator("[data-correction-proposal]")
  await form
    .getByLabel("Correção sugerida", { exact: true })
    .fill("Improve the explanation of retry limits in this resource.")
  await form
    .getByRole("button", { name: "Preparar rascunho", exact: true })
    .click()
  const href = await form
    .getByRole("link", { name: "Revisar no GitHub", exact: true })
    .getAttribute("href")
  expect(href).toContain(
    encodeURIComponent("https://lagrotti.dev/recursos/templates/worker")
  )
})

test("catalogue, releases, filtered feeds and short URLs work over HTTP", async ({
  request,
}) => {
  const response = await request.get(
    "/api/resources/v1?locale=en&section=ecossistema"
  )
  expect(response.ok()).toBeTruthy()
  expect((await response.json()).count).toBe(20)
  expect((await request.get("/api/resources/v1?locale=xx")).status()).toBe(400)
  const feed = await request.get(
    "/es/recursos/feed.xml?resource=templates%2Fworker"
  )
  expect(feed.headers()["content-type"]).toContain("application/rss+xml")
  expect(((await feed.text()).match(/<item>/g) ?? []).length).toBe(1)
  const redirect = await request.get(
    "/r/filas?lang=en&url=https://evil.example",
    { maxRedirects: 0 }
  )
  expect(redirect.status()).toBe(307)
  expect(redirect.headers().location).toContain(
    "https://lagrotti.dev/en/recursos/demos/queue"
  )
  for (const filename of [
    "resource-tools-1.0.0.tgz",
    "resource-action-1.0.0.zip",
    "worker-starter-1.0.0.zip",
    "http-lab-1.0.0.zip",
    "manifest.json",
    "SHA256SUMS",
  ]) {
    const asset = await request.get("/recursos/releases/1.0.0/" + filename)
    expect(asset.ok(), filename).toBeTruthy()
    expect((await asset.body()).length).toBeGreaterThan(100)
  }
  const configuration = await (await request.get("/api/webmention")).json()
  if (!configuration.configured) {
    const missing = await request.post("/api/webmention", {
      form: {
        source: "https://example.com/real-reference",
        target: "https://lagrotti.dev/recursos/templates/worker",
      },
    })
    expect(missing.status()).toBe(503)
  }
})

test("new interactive pages fit mobile screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const kind of [
    "desafios",
    "editor-diagramas",
    "colecoes",
    "citacoes",
    "cartoes",
    "links-qr",
    "correcoes",
    "pedidos",
  ]) {
    await page.goto("/recursos/ecossistema/" + kind)
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth
      ),
      kind
    ).toBe(false)
  }
})
