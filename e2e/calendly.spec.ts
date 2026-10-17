import { expect, test } from "@playwright/test"

/**
 * The embedded schedule, with Calendly stubbed: its widget script and its
 * scheduling page are served locally, so the test checks what this site does
 * (load on demand, pass the visit's source, count the booking) without
 * booking anything for real.
 */
test("loads Calendly only on request and counts the booking with its source", async ({ page }) => {
  let calendlyRequests = 0
  await page.addInitScript(() => {
    const events: [string, Record<string, string>][] = []
    Object.assign(window, { __events: events, umami: { track: (name: string, data: Record<string, string>) => events.push([name, data]) } })
  })
  await page.route("https://assets.calendly.com/**", async (route) => {
    calendlyRequests++
    await route.fulfill({
      contentType: "application/javascript",
      body: `window.Calendly = { initInlineWidget(options) {
        window.__calendlyOptions = options
        const frame = document.createElement("iframe")
        frame.src = options.url
        frame.title = "Calendly"
        options.parentElement.appendChild(frame)
      } }`,
    })
  })
  await page.route("https://calendly.com/**", async (route) => {
    calendlyRequests++
    await route.fulfill({
      contentType: "text/html",
      body: `<!doctype html><button onclick="parent.postMessage({ event: 'calendly.date_and_time_selected', payload: {} }, '*'); parent.postMessage({ event: 'calendly.event_scheduled', payload: {} }, '*')">Confirmar</button>`,
    })
  })

  await page.goto("/trabalhe-comigo?utm_source=linkedin&utm_medium=social&utm_campaign=perfil")
  await page.getByRole("link", { name: "Agendar uma conversa" }).first().click()
  await expect(page).toHaveURL(/#agendar$/)
  expect(calendlyRequests, "nothing from Calendly before the visitor asks").toBe(0)

  await page.getByRole("button", { name: "Ver horários disponíveis" }).click()
  const options = await page.waitForFunction(() => (window as unknown as { __calendlyOptions?: unknown }).__calendlyOptions).then((handle) => handle.jsonValue())
  expect(options).toMatchObject({ url: "https://calendly.com/yago-lagrotti/30min?hide_gdpr_banner=1", utm: { utmSource: "linkedin", utmMedium: "social", utmCampaign: "perfil" } })

  // A message from any other origin is ignored.
  await page.evaluate(() => window.postMessage({ event: "calendly.event_scheduled" }, "*"))
  await page.frameLocator("#agendar iframe").getByRole("button", { name: "Confirmar" }).click()

  const events = () => page.evaluate(() => (window as unknown as { __events: [string, Record<string, string>][] }).__events.map(([name, data]) => `${name}:${data.channel ?? data.placement}`))
  await expect.poll(events).toContain("meeting_booked:work-with-me")
  const names = await events()
  expect(names.filter((name) => name.startsWith("meeting_booked"))).toHaveLength(1)
  expect(names).toContain("meeting_slot_selected:work-with-me")
  expect(names).toContain("contact_click:calendly-embed")
})
