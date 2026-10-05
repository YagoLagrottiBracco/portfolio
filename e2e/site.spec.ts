import { expect, test } from "@playwright/test"

test.describe("homepage", () => {
  test("is served in Portuguese, with the name in the main heading", async ({ page }) => {
    await page.goto("/")

    await expect(page).toHaveTitle(/Engenheiro de Software Sênior/)
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Yago Lagrotti Bracco")
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Engenheiro de")
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR")
    await expect(page.getByRole("link", { name: "EnvRune", exact: true })).toHaveAttribute("href", "/projetos/envrune")
  })

  test("sends an English browser to the English homepage", async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US" })
    const page = await context.newPage()
    await page.goto("/")

    await expect(page).toHaveURL(/\/en$/)
    await expect(page).toHaveTitle(/Senior Software Engineer/)
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Senior")
    await expect(page.locator("html")).toHaveAttribute("lang", "en-US")
    await expect(page.getByRole("link", { name: "EnvRune", exact: true })).toHaveAttribute("href", "/en/projetos/envrune")
    await context.close()
  })

  test("keeps a visitor's explicit choice over the browser language", async ({ browser, baseURL }) => {
    const context = await browser.newContext({ locale: "en-US" })
    await context.addCookies([{ name: "locale", value: "pt", url: baseURL! }])
    const page = await context.newPage()
    await page.goto("/")

    await expect(page).toHaveURL(/\/$/)
    await expect(page).toHaveTitle(/Engenheiro de Software Sênior/)
    await context.close()
  })

  test("switching language moves to that language's URL", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: "Alterar idioma" }).first().click()
    await page.getByRole("menuitemradio", { name: "Español" }).click()

    await expect(page).toHaveURL(/\/es$/)
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ingeniero")
  })
})

test.describe("case study", () => {
  test("shows the architecture flow and follows the language switcher", async ({ page }) => {
    await page.goto("/projetos/envrune")

    await expect(page.getByRole("heading", { level: 1, name: "EnvRune" })).toBeVisible()
    const flow = page.getByRole("list", { name: "Fluxo da arquitetura" })
    await expect(flow).toBeVisible()
    await expect(flow.locator("> li:not([aria-hidden])")).toHaveCount(5)

    await page.getByRole("button", { name: "Alterar idioma" }).first().click()
    await page.getByRole("menuitemradio", { name: "English" }).click()

    await expect(page).toHaveURL(/\/en\/projetos\/envrune$/)
    await expect(page.getByRole("list", { name: "Architecture flow" })).toBeVisible()
    await expect(page).toHaveTitle(/^EnvRune/)
  })

  test("links to the article written about the project", async ({ page }) => {
    await page.goto("/es/projetos/vmageste")

    const article = page.getByRole("link", { name: /Artículo completo/ })
    await expect(article).toHaveAttribute("href", /^\/blog\//)
  })
})

test.describe("blog", () => {
  test("filters the index by tag", async ({ page }) => {
    await page.goto("/en/blog")
    await expect(page.getByRole("navigation").first().getByRole("link", { name: "Blog" })).toBeVisible()

    const articles = page.getByRole("article")
    const total = await articles.count()
    expect(total).toBeGreaterThan(5)

    const filters = page.getByRole("group", { name: "Filter articles by topic" })
    await filters.getByRole("button", { name: /^next\.js/ }).click()

    const filtered = await articles.count()
    expect(filtered).toBeGreaterThan(0)
    expect(filtered).toBeLessThan(total)
    for (const article of await articles.all()) {
      await expect(article.getByRole("button", { name: "next.js", exact: true })).toBeVisible()
    }

    await filters.getByRole("button", { name: /^All/ }).click()
    await expect(articles).toHaveCount(total)
  })

  test("publishes an RSS feed per language", async ({ request }) => {
    for (const path of ["/blog/feed.xml", "/en/blog/feed.xml", "/es/blog/feed.xml"]) {
      const response = await request.get(path)
      expect(response.status(), path).toBe(200)
      expect(response.headers()["content-type"], path).toContain("application/rss+xml")
    }
  })
})

test("serves the résumé as a PDF in every language", async ({ request }) => {
  for (const locale of ["pt", "en", "es"]) {
    const response = await request.get(`/cv/${locale}`)
    expect(response.status(), locale).toBe(200)
    expect(response.headers()["content-type"], locale).toBe("application/pdf")
  }
})

test.describe("document language", () => {
  // Read from the raw response, before any script runs: this is what a crawler gets.
  const documentLang = async (html: string) => /<html[^>]*\slang="([^"]+)"/.exec(html)?.[1]

  test("is declared by the server for every localized page", async ({ request }) => {
    const expected: Record<string, string> = {
      "/": "pt-BR",
      "/en": "en-US",
      "/es": "es",
      "/blog": "pt-BR",
      "/es/blog": "es",
      "/projetos/envrune": "pt-BR",
      "/en/projetos/envrune": "en-US",
    }
    for (const [path, lang] of Object.entries(expected)) {
      const response = await request.get(path, { headers: { "accept-language": "" } })
      expect(await documentLang(await response.text()), path).toBe(lang)
    }
  })

  test("follows the language of each article", async ({ request }) => {
    for (const [feed, lang] of [["/blog/feed.xml", "pt-BR"], ["/en/blog/feed.xml", "en-US"], ["/es/blog/feed.xml", "es"]]) {
      const xml = await (await request.get(feed)).text()
      const article = /<item>[\s\S]*?<link>https:\/\/lagrotti\.dev([^<]+)<\/link>/.exec(xml)?.[1]
      expect(article, feed).toBeTruthy()
      expect(await documentLang(await (await request.get(article!)).text()), article).toBe(lang)
    }
  })

  test("an article's navigation speaks the article's language", async ({ page, request }) => {
    const xml = await (await request.get("/en/blog/feed.xml")).text()
    const article = /<item>[\s\S]*?<link>https:\/\/lagrotti\.dev([^<]+)<\/link>/.exec(xml)![1]
    await page.goto(article)

    await expect(page.getByRole("navigation").first().getByRole("link", { name: "About" })).toBeVisible()
    await expect(page.locator("html")).toHaveAttribute("lang", "en-US")
  })
})

test.describe("not found", () => {
  test("unknown paths get the site's own 404 page", async ({ page }) => {
    for (const path of ["/nao-existe", "/nao/existe/mesmo", "/projetos/nao-existe", "/blog/nao-existe"]) {
      const response = await page.goto(path)
      expect(response?.status(), path).toBe(404)
      await expect(page.getByRole("heading", { level: 1, name: "Página não encontrada" })).toBeVisible()
      await expect(page.getByRole("navigation").first()).toBeVisible()
    }
  })

  test("a 404 under a language prefix stays in that language", async ({ page }) => {
    const response = await page.goto("/en/nothing-here")
    expect(response?.status()).toBe(404)
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible()
  })
})
