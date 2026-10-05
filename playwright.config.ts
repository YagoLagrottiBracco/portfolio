import { defineConfig, devices } from "@playwright/test"

const PORT = 3458

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
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: `http://127.0.0.1:${PORT}/blog`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
