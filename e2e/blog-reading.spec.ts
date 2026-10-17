import { expect, test } from "@playwright/test"

/** The newest Portuguese article, taken from the feed. */
async function anArticle(request: import("@playwright/test").APIRequestContext) {
  const xml = await (await request.get("/blog/feed.xml")).text()
  return /<item>[\s\S]*?<link>https:\/\/lagrotti\.dev([^<?]+)/.exec(xml)![1]
}

test.describe("blog index search", () => {
  test("narrows the list as you type, ignoring accents, and keeps the query in the URL", async ({ page }) => {
    await page.goto("/blog")
    const articles = page.getByRole("article")
    const total = await articles.count()

    await page.getByRole("searchbox", { name: "Buscar artigos" }).fill("psicologia")
    await expect(articles).not.toHaveCount(total)
    const found = await articles.count()
    expect(found).toBeGreaterThan(0)
    await expect(page).toHaveURL(/\?q=psicologia$/)

    await page.getByRole("searchbox", { name: "Buscar artigos" }).fill("PSICOLOGÍA")
    await expect(articles).toHaveCount(found)

    await page.getByRole("searchbox", { name: "Buscar artigos" }).fill("zzzz-nada")
    await expect(articles).toHaveCount(0)
    await page.getByRole("button", { name: "Limpar busca e filtros" }).click()
    await expect(articles).toHaveCount(total)
  })

  test("opens with the search from a shared link", async ({ page }) => {
    await page.goto("/blog?q=kafka")
    await expect(page.getByRole("searchbox", { name: "Buscar artigos" })).toHaveValue("kafka")
    await expect(page.getByText(/artigos encontrados/)).toBeVisible()
  })
})

test.describe("article", () => {
  test("ends with sharing, a way to get in touch and more to read", async ({ page, request }) => {
    const path = await anArticle(request)
    await page.goto(path)

    const share = page.getByRole("region", { name: "Compartilhar este artigo" })
    await expect(share.getByRole("link", { name: "LinkedIn" })).toHaveAttribute("href", /share-offsite\/\?url=.*utm_source%3Dlinkedin%26utm_medium%3Dshare/)
    await expect(share.getByRole("button", { name: "Imprimir ou salvar PDF" })).toBeVisible()

    const cta = page.getByRole("region", { name: "Precisa de alguém para um desafio parecido?" })
    await expect(cta.getByRole("link", { name: "Agendar uma conversa" })).toHaveAttribute("href", /calendly\.com/)
    await expect(cta.getByRole("link", { name: "Como trabalho" })).toHaveAttribute("href", "/trabalhe-comigo")

    const related = page.getByRole("region", { name: "Continue lendo" }).getByRole("link")
    await expect(related).toHaveCount(3)
    for (const link of await related.all()) expect(await link.getAttribute("href")).not.toBe(path)
  })

  test("links an article to its project's case study", async ({ page }) => {
    await page.goto("/projetos/vmageste")
    await page.getByRole("link", { name: /Artigo completo/ }).click()
    await expect(page.getByRole("link", { name: /Ver o estudo de caso: VMageste/ })).toHaveAttribute("href", "/projetos/vmageste")
  })

  test("shows reading progress as the reader scrolls", async ({ page, request }) => {
    await page.goto(await anArticle(request))
    await page.evaluate(() => {
      const body = document.getElementById("article-body")!
      window.scrollTo(0, body.offsetTop + body.offsetHeight / 2)
    })
    await expect(page.getByText(/min restantes?$/)).toBeVisible()
  })
})

test("reads the article aloud block by block, and stops when asked", async ({ page, request }) => {
  // A stand-in for speech synthesis, so the test does not depend on installed voices.
  await page.addInitScript(() => {
    const spoken: string[] = []
    Object.assign(window, { __spoken: spoken })
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        speaking: false,
        getVoices: () => [],
        speak(utterance: SpeechSynthesisUtterance) {
          spoken.push(utterance.text)
          setTimeout(() => utterance.onstart?.(new Event("start") as SpeechSynthesisEvent), 0)
          setTimeout(() => utterance.onend?.(new Event("end") as SpeechSynthesisEvent), 400)
        },
        cancel() {},
        pause() {},
        resume() {},
      },
    })
  })
  const xml = await (await request.get("/blog/feed.xml")).text()
  await page.goto(/<item>[\s\S]*?<link>https:\/\/lagrotti\.dev([^<?]+)/.exec(xml)![1])

  await page.getByRole("button", { name: "Ouvir este artigo" }).click()
  await expect(page.getByRole("button", { name: "Pausar" })).toBeVisible()
  await expect(page.locator("#article-body .speech-reading")).toHaveCount(1)
  await expect.poll(() => page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken.length)).toBeGreaterThan(1)
  const first = await page.evaluate(() => (window as unknown as { __spoken: string[] }).__spoken[0])
  expect(first.startsWith(await page.getByRole("heading", { level: 1 }).innerText())).toBe(true)

  await page.getByRole("button", { name: "Parar" }).click()
  await expect(page.getByRole("button", { name: "Ouvir este artigo" })).toBeVisible()
  await expect(page.locator(".speech-reading")).toHaveCount(0)
})

test("the podcast feed waits for its first recorded episode", async ({ request }) => {
  for (const path of ["/blog/podcast.xml", "/en/blog/podcast.xml"]) expect((await request.get(path)).status(), path).toBe(404)
})
