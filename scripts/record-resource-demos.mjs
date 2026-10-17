/** Record the actual browser tools. Requires local server + Playwright Chromium/FFmpeg. */
import { chromium } from "@playwright/test"
import { mkdirSync, copyFileSync } from "node:fs"
import { join } from "node:path"

const base = process.argv[2] || "http://127.0.0.1:3461"
const browser = await chromium.launch({ headless: true })
const scratch = "/tmp/portfolio-resource-recordings"
mkdirSync(scratch, { recursive: true })
try {
  // Warm routes before opening recorded pages to keep build/loading frames out.
  const warm = await browser.newContext()
  for (const locale of ["pt", "en", "es"])
    for (const tool of ["queue", "json"]) {
      const r = await warm.request.get(
        `${base}${locale === "pt" ? "" : `/${locale}`}/incorporar/${tool}`
      )
      if (!r.ok())
        throw new Error(`Warm-up failed: ${locale}/${tool}: ${r.status()}`)
    }
  await warm.close()
  for (const locale of ["pt", "en", "es"])
    for (const tool of ["queue", "json"]) {
      const output = join(process.cwd(), "public/recursos/videos", locale)
      mkdirSync(output, { recursive: true })
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        colorScheme: "dark",
        locale: locale === "pt" ? "pt-BR" : locale,
        recordVideo: { dir: scratch, size: { width: 1280, height: 720 } },
      })
      const page = await context.newPage()
      await page.goto(
        `${base}${locale === "pt" ? "" : `/${locale}`}/incorporar/${tool}`,
        { waitUntil: "networkidle" }
      )
      await page.evaluate(() => document.fonts.ready)
      await page.screenshot({ path: join(output, `${tool}-poster.png`) })
      const tick = () => page.waitForTimeout(6000)
      const original =
        tool === "json" ? await page.getByTestId("tool-left").inputValue() : ""
      await tick()
      if (tool === "queue") {
        await page.getByTestId("queue-ten").click()
        await tick()
        await page.getByTestId("arrivals").fill("0")
        await page.getByTestId("workers").fill("50")
        await tick()
        await page.getByTestId("queue-ten").click()
        await tick()
        await page.getByTestId("failures").fill("100")
        await page.getByTestId("arrivals").fill("5")
        await page.getByTestId("queue-ten").click()
        await tick()
      } else {
        await page.getByTestId("tool-run").click()
        await page.getByTestId("tool-result").scrollIntoViewIfNeeded()
        await tick()
        await tick()
        await page.getByTestId("tool-left").fill("{")
        await page.getByTestId("tool-run").click()
        await tick()
        await page.getByTestId("tool-left").fill(original)
        await page.getByTestId("tool-run").click()
        await page.getByTestId("tool-result").scrollIntoViewIfNeeded()
        await tick()
      }
      const video = page.video()
      await context.close()
      copyFileSync(await video.path(), join(output, `${tool}.webm`))
      console.log(`Recorded ${locale}/${tool}`)
    }
} finally {
  await browser.close()
}
