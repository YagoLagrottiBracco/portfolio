import { expect, test } from "@playwright/test"

test("resource hub and JSON comparison work in every language", async ({
  page,
}) => {
  for (const prefix of ["", "/en", "/es"]) {
    await page.goto(`${prefix}/recursos`)
    await expect(page.locator("h1")).toBeVisible()
    await expect(page.locator("[data-resource-section]")).toHaveCount(20)
    await page.goto(`${prefix}/recursos/ferramentas/json`)
    await page.getByTestId("tool-run").click()
    await expect(page.getByTestId("tool-result")).toContainText(
      "/payload/total"
    )
    await page.getByTestId("tool-left").fill("{")
    await page.getByTestId("tool-run").click()
    await expect(page.getByTestId("tool-result")).toContainText(
      /inválido|Invalid/
    )
  }
})
test("resource locale switching retains the selected resource", async ({
  page,
}) => {
  await page.goto("/recursos/guias/filas")
  await page.getByRole("button", { name: "Alterar idioma" }).first().click()
  await page.getByRole("menuitemradio", { name: "English" }).click()
  await expect(page).toHaveURL("/en/recursos/guias/filas")
  await expect(page.locator("html")).toHaveAttribute("lang", "en-US")
})
test("queue demo models overload and recovery; embeds retain credit", async ({
  page,
}) => {
  await page.goto("/incorporar/queue")
  await page.getByTestId("queue-ten").click()
  await expect(page.getByTestId("queue-backlog")).toHaveText("180")
  await page.getByTestId("arrivals").fill("0")
  await page.getByTestId("workers").fill("50")
  await page.getByTestId("queue-ten").click()
  await expect(page.getByTestId("queue-backlog")).toHaveText("0")
  await expect(page.getByRole("link", { name: /lagrotti.dev/ })).toBeVisible()
})
test("gallery proposals prepare encoded drafts without posting", async ({
  page,
}) => {
  await page.goto("/recursos/comunidade/sua-aplicacao")
  await page.getByLabel("Seu nome e crédito desejado").fill("Pessoa & Equipe")
  await page
    .getByLabel("Link público do material ou perfil")
    .fill("https://example.com/demo?x=1&y=2")
  await page
    .getByLabel("Proposta, recurso usado e contexto")
    .fill("Usei o worker em um projeto de estudo.")
  await page.getByRole("checkbox").check()
  await page.getByRole("button", { name: "Preparar rascunho" }).click()
  const href = await page.getByTestId("proposal-draft").getAttribute("href")
  expect(href).toMatch(/^mailto:/)
  expect(new URLSearchParams(href!.split("?")[1]).size).toBe(2)
  const github = new URL(
    (await page.getByTestId("github-proposal-draft").getAttribute("href"))!
  )
  expect(github.searchParams.get("template")).toBe("community-use.yml")
  const proposal = JSON.parse(github.searchParams.get("proposal")!)
  expect(proposal.consent).toBe(true)
  expect(proposal.authorName).toBe("Pessoa & Equipe")
  await expect(
    page.getByRole("link", { name: "Baixar proposta em JSON" })
  ).toHaveAttribute("download", "community-proposal.json")
})
test("generated templates, diagrams, media and benchmark downloads are available", async ({
  request,
}) => {
  for (const path of [
    "/recursos/downloads/worker-starter.zip",
    "/recursos/downloads/en/press-kit.zip",
    "/recursos/diagramas/es/vmageste.svg",
    "/recursos/carrosseis/en/vmageste.zip",
    "/recursos/videos/pt/queue.webm",
    "/recursos/videos/es/json.vtt",
    "/recursos/downloads/json-clone.csv",
    "/recursos/imprensa/yago-github.jpg",
    ...["pt", "en", "es"].flatMap((locale) => [
      `/recursos/campanha/${locale}/plano-30-dias.md`,
      `/recursos/campanha/${locale}/calendario.ics`,
      `/recursos/campanha/${locale}/kit-campanha.zip`,
      `/recursos/sessoes/${locale}/filas-30min.md`,
      `/recursos/sessoes/${locale}/arquitetura-60min.md`,
      `/recursos/sessoes/${locale}/caderno-participante.md`,
      `/recursos/sessoes/${locale}/kit-sessoes.zip`,
    ]),
  ]) {
    const response = await request.get(path)
    expect(response.ok(), path).toBeTruthy()
    expect((await response.body()).length).toBeGreaterThan(20)
  }
})

test("real product embeds require activation and close without persisting consent", async ({
  page,
}) => {
  let productRequests = 0
  await page.route("https://duplaface.arq.br/**", async (route) => {
    productRequests++
    await route.fulfill({
      contentType: "text/html; charset=utf-8",
      body: "<!doctype html><html lang='pt-BR'><title>Produto em teste</title><body><button>Sala de demonstração</button></body></html>",
    })
  })
  await page.goto("/recursos/demos/dupla-face-planta")
  const demo = page.locator('[data-live-project-demo="dupla-face-planta"]')
  await expect(demo.locator("iframe")).toHaveCount(0)
  expect(productRequests).toBe(0)
  await demo.locator("[data-demo-activate]").click()
  await expect(demo.locator("iframe")).toHaveAttribute(
    "sandbox",
    "allow-scripts allow-same-origin"
  )
  await expect(
    demo
      .frameLocator("iframe")
      .getByRole("button", { name: "Sala de demonstração" })
  ).toBeVisible()
  expect(productRequests).toBe(1)
  await demo.locator("[data-demo-close]").click()
  await expect(demo.locator("iframe")).toHaveCount(0)
  await expect(demo.locator("[data-demo-activate]")).toBeFocused()
  await page.reload()
  await expect(demo.locator("iframe")).toHaveCount(0)
  expect(productRequests).toBe(1)
})

test("campaign checklist persists locally across reloads and languages", async ({
  page,
}) => {
  await page.goto("/recursos/campanhas/kit-engenharia")
  const planner = page.getByTestId("campaign-planner")
  await expect(planner.getByRole("checkbox")).toHaveCount(30)
  await expect(page.getByTestId("campaign-progress")).toContainText("0 / 30")
  await planner.getByRole("checkbox").first().check()
  await expect(page.getByTestId("campaign-progress")).toContainText("1 / 30")
  await page.reload()
  await expect(planner.getByRole("checkbox").first()).toBeChecked()
  await page.goto("/en/recursos/campanhas/kit-engenharia")
  await expect(page.getByTestId("campaign-progress")).toContainText("1 / 30")
  await page.getByRole("button", { name: "Clear local checklist" }).click()
  await expect(page.getByTestId("campaign-progress")).toContainText("0 / 30")
  await page.getByLabel("Filter by channel").selectOption("linkedin")
  expect(await planner.getByRole("checkbox").count()).toBeLessThan(30)
  await planner.locator("summary").first().click()
  await expect(planner.getByRole("textbox").first()).toHaveValue(
    /utm_source=linkedin/
  )
})
test("unknown resources and unsupported locales return 404", async ({
  request,
}) => {
  for (const path of [
    "/recursos/inexistente",
    "/recursos/guias/inexistente",
    "/fr/recursos",
    "/en/incorporar/unknown",
  ])
    expect((await request.get(path)).status(), path).toBe(404)
})

test("tool and proposal contents never enter network requests", async ({
  page,
}) => {
  const marker = "PRIVATE_MARKER_DO_NOT_SEND_042"
  const leaked: string[] = []
  page.on("request", (request) => {
    if ((request.url() + (request.postData() ?? "")).includes(marker))
      leaked.push(request.url())
  })
  await page.goto("/recursos/ferramentas/json")
  await page.getByTestId("tool-left").fill(JSON.stringify({ value: marker }))
  await page.getByTestId("tool-right").fill("{}")
  await page.getByTestId("tool-run").click()
  await expect(page.getByTestId("tool-result")).toContainText(marker)
  await page.goto("/recursos/colaboracoes/reproduzir-benchmark")
  await page.getByLabel("Seu nome e crédito desejado").fill("Pessoa")
  await page
    .getByLabel("Link público do material ou perfil")
    .fill("https://example.com/")
  await page.getByLabel("Proposta, recurso usado e contexto").fill(marker)
  await page.getByRole("button", { name: "Preparar rascunho" }).click()
  await expect(page.getByTestId("proposal-draft")).toHaveAttribute(
    "href",
    new RegExp(marker)
  )
  expect(leaked).toEqual([])
})

test("resource pages fit mobile and medium-width screens", async ({ page }) => {
  for (const width of [390, 800]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto("/recursos")
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth
    )
    expect(overflow, `viewport ${width}`).toBe(false)
  }
})

test("recorded videos play with captions in all languages", async ({
  page,
}) => {
  for (const prefix of ["", "/en", "/es"])
    for (const kind of ["queue", "json"]) {
      await page.goto(`${prefix}/recursos/videos/${kind}`)
      const video = page.locator("video")
      await video.evaluate(async (element) => {
        const player = element as HTMLVideoElement
        player.muted = true
        if (player.textTracks[0]) player.textTracks[0].mode = "showing"
        await player.play()
      })
      await expect
        .poll(() =>
          video.evaluate((element) => (element as HTMLVideoElement).currentTime)
        )
        .toBeGreaterThan(0)
      const duration = await video.evaluate(
        (element) => (element as HTMLVideoElement).duration
      )
      expect(duration).toBeGreaterThanOrEqual(29)
      expect(duration).toBeLessThan(45)
      await expect
        .poll(() =>
          video.evaluate(
            (element) =>
              (element as HTMLVideoElement).textTracks[0]?.cues?.length ?? 0
          )
        )
        .toBe(5)
    }
})
