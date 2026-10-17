import { expect, test } from "@playwright/test"

test.describe("work with me", () => {
  test("is linked from the navigation and offers every contact channel", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto("/")
    await page.getByRole("navigation").first().getByRole("link", { name: "Trabalhe comigo" }).click()

    await expect(page).toHaveURL(/\/trabalhe-comigo$/)
    await expect(page.getByRole("heading", { level: 1, name: "Trabalhe comigo" })).toBeVisible()
    // The top button scrolls to the embedded schedule; the closing one opens Calendly.
    await expect(page.getByRole("link", { name: "Agendar uma conversa" }).first()).toHaveAttribute("href", "#agendar")
    await expect(page.getByRole("link", { name: "Agendar uma conversa" }).last()).toHaveAttribute("href", /calendly\.com/)
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

test.describe("installable and machine-readable", () => {
  test("serves a web app manifest whose icons exist", async ({ page, request }) => {
    await page.goto("/")
    const href = await page.locator('link[rel="manifest"]').getAttribute("href")
    const manifest = await (await request.get(href!)).json()
    expect(manifest.start_url).toBe("/?utm_source=pwa&utm_medium=homescreen")
    for (const icon of manifest.icons) expect((await request.get(icon.src)).headers()["content-type"], icon.src).toBe("image/png")
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute("href", "/apple-touch-icon.png")
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#0a0a0a")
  })

  test("publishes llms.txt with the case studies and articles", async ({ request }) => {
    const response = await request.get("/llms.txt")
    expect(response.headers()["content-type"]).toContain("text/markdown")
    const text = await response.text()
    expect(text).toMatch(/^# Yago Lagrotti Bracco/)
    expect(text).toContain("](https://lagrotti.dev/en/projetos/envrune)")
    expect(text).toContain("## Articles (Português)")
  })
})

test("the IndexNow key file only exists once a key is configured", async ({ request }) => {
  const response = await request.get("/indexnow-key.txt")
  if (process.env.INDEXNOW_KEY) expect(await response.text()).toBe(process.env.INDEXNOW_KEY)
  else expect(response.status()).toBe(404)
})

test("the now page shows availability, the current role and recent writing", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("contentinfo").getByRole("link", { name: "Agora" }).click()
  await expect(page).toHaveURL(/\/agora$/)
  await expect(page.getByRole("heading", { level: 1, name: "Agora" })).toBeVisible()
  await expect(page.getByText("Aberto a vagas remotas e a novos projetos").first()).toBeVisible()
  await expect(page.getByRole("region", { name: "Onde estou" })).toContainText("Independente")
  await expect(page.getByRole("region", { name: "O que escrevi por último" }).getByRole("link")).toHaveCount(3)
})

test("the résumé comes focused, as text, as JSON Resume and as a contact card", async ({ request }) => {
  const types: Record<string, string> = {
    "/cv/pt/ia": "application/pdf",
    "/cv/en/backend": "application/pdf",
    "/cv/es/plain.txt": "text/plain; charset=utf-8",
    "/cv/en/resume.json": "application/json",
    "/contato.vcf": "text/vcard; charset=utf-8",
  }
  for (const [path, type] of Object.entries(types)) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    expect(response.headers()["content-type"], path).toContain(type)
  }
  expect((await request.get("/cv/pt/nao-existe")).status()).toBe(404)
  expect((await (await request.get("/cv/en/resume.json")).json()).basics.name).toBe("Yago Lagrotti Bracco")
})

test("recruiters get the screening answers in one place, unanswered ones hidden", async ({ page }) => {
  await page.goto("/trabalhe-comigo#triagem")
  const section = page.getByRole("region", { name: "Respostas rápidas para recrutadores" })
  await expect(section.getByText("Quando pode começar?")).toBeVisible()
  await expect(section.getByText("Imediatamente.")).toBeVisible()
  await expect(section.getByText("UTC-3", { exact: false })).toBeVisible()
  await expect(section.getByText("pretensão salarial", { exact: false })).toHaveCount(0)
})

test("the recommendation page is reachable by link only, with email as a way in", async ({ page, request }) => {
  await page.goto("/trabalhe-comigo")
  await page.getByRole("link", { name: "Deixe um depoimento" }).click()
  await expect(page).toHaveURL(/\/recomendar$/)
  await expect(page.getByRole("heading", { level: 1, name: "Recomende meu trabalho" })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/)
  await expect(page.getByRole("link", { name: /@/ })).toHaveAttribute("href", /^mailto:/)
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/recomendar")
})

test.describe("technology pages", () => {
  test("gather projects, experience and articles, and link onwards", async ({ page }) => {
    await page.goto("/stack")
    await expect(page.getByRole("heading", { level: 1, name: "Tecnologias" })).toBeVisible()
    await page.getByRole("link", { name: /^NestJS/ }).click()
    await expect(page).toHaveURL(/\/stack\/nestjs$/)
    await expect(page.getByRole("heading", { level: 1 })).toContainText("NestJS")
    await expect(page.getByRole("region", { name: "Experiência profissional" })).toContainText("Pulses")
    await expect(page.getByRole("link", { name: "Agendar uma conversa" })).toBeVisible()

    await page.getByRole("button", { name: "Alterar idioma" }).first().click()
    await page.getByRole("menuitemradio", { name: "English" }).click()
    await expect(page).toHaveURL(/\/en\/stack\/nestjs$/)
    await expect(page.getByRole("region", { name: "Professional experience" })).toBeVisible()
  })

  test("are reached from a case study's stack and listed in the sitemap", async ({ page, request }) => {
    await page.goto("/projetos/vmageste")
    await expect(page.getByRole("link", { name: "PostgreSQL", exact: true })).toHaveAttribute("href", "/stack/postgresql")
    const xml = await (await request.get("/sitemap.xml")).text()
    expect(xml).toContain("<loc>https://lagrotti.dev/en/stack/typescript</loc>")
    expect((await request.get("/stack/terraform")).status(), "too little evidence for a page").toBe(404)
  })

  test("the experience timeline filters by technology", async ({ page }) => {
    await page.goto("/#experience")
    const filters = page.getByRole("group", { name: "Filtrar experiências por tecnologia" })
    await filters.getByRole("button", { name: "Vue.js" }).click()
    await expect(page.locator("#experience").getByText("Pulses", { exact: true })).toBeVisible()
    await expect(page.locator("#experience").getByText("SorocabaCom", { exact: true })).toHaveCount(0)
    await expect(page.getByRole("link", { name: /Ver projetos, experiência e artigos com Vue\.js/ })).toHaveAttribute("href", "/stack/vuejs")
    await filters.getByRole("button", { name: "Todas" }).click()
    await expect(page.locator("#experience").getByText("SorocabaCom", { exact: true })).toBeVisible()
  })
})

test("case studies, pages and technologies share their own cards", async ({ page, request }) => {
  for (const [path, image] of [
    ["/projetos/pulsewatch", "/og/projetos/pt/pulsewatch"],
    ["/en/trabalhe-comigo", "/og/paginas/en/trabalhe-comigo"],
    ["/es/stack/nestjs", "/og/stack/es/nestjs"],
  ]) {
    await page.goto(path)
    await expect(page.locator('meta[property="og:image"]').first(), path).toHaveAttribute("content", `https://lagrotti.dev${image}`)
    const response = await request.get(image)
    expect(response.headers()["content-type"], image).toBe("image/png")
  }
})
