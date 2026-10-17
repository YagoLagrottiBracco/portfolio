import { expect, test } from "@playwright/test"

/** An article URL, taken from the feed so the test follows whatever is published. */
async function anArticle(request: import("@playwright/test").APIRequestContext) {
  const xml = await (await request.get("/blog/feed.xml")).text()
  return /<item>[\s\S]*?<link>https:\/\/lagrotti\.dev([^<?]+)/.exec(xml)![1]
}

test("every page answers with the hardening headers", async ({ request }) => {
  for (const path of ["/", "/blog", "/blog/feed.xml", "/sitemap.xml"]) {
    const headers = (await request.get(path)).headers()
    expect(headers["content-security-policy"], path).toContain("frame-ancestors 'none'")
    expect(headers["x-content-type-options"], path).toBe("nosniff")
    expect(headers["referrer-policy"], path).toBe("strict-origin-when-cross-origin")
  }
})

test("the Content-Security-Policy blocks nothing the pages use", async ({ page, request }) => {
  const problems: string[] = []
  page.on("console", (message) => {
    // Only CSP reports: `/_vercel/*` scripts exist on Vercel alone and 404 here, which is noise.
    if (message.type() === "error" && /Content Security Policy/i.test(message.text())) problems.push(message.text())
  })
  page.on("pageerror", (error) => problems.push(error.message))

  for (const path of ["/", "/en", "/blog", "/projetos/envrune", await anArticle(request)]) {
    await page.goto(path)
    await page.waitForLoadState("networkidle")
  }
  expect(problems).toEqual([])
})

test("the editor stays out of search results", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text()
  expect(robots).toContain("Disallow: /admin")
  expect(robots).toContain("Disallow: /api/")
})
