import { defineConfig, devices } from "@playwright/test"

// Overridable so two checkouts can run their suites side by side.
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3458)
// `VISUAL=1` runs only the screenshot comparisons (e2e/visual.spec.ts), which
// need the baselines' own fonts: see .github/workflows/visual.yml.
const VISUAL = Boolean(process.env.VISUAL)

/**
 * Browser tests run against the production build (`npm run build` first), so
 * they see the same static pages and the same middleware Vercel serves.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    // The homepage picks a language from the browser's; pin it so tests start in Portuguese.
    locale: "pt-BR",
    trace: "on-first-retry",
  },
  projects: VISUAL
    ? [{ name: "visual", testMatch: /visual\.spec\.ts$/, use: { ...devices["Desktop Chrome"] } }]
    : [{ name: "chromium", testIgnore: /visual\.spec\.ts$/, use: { ...devices["Desktop Chrome"] } }],
  expect: {
    // Antialiasing differs a little between runs; a real change moves far more.
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },
  // One baseline per screenshot, shared by every Linux machine that runs the container.
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}{ext}",
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}/blog`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
