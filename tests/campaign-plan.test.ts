import assert from "node:assert/strict"
import test from "node:test"
import { mkdtempSync, readFileSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { execFileSync } from "node:child_process"
import {
  campaignEntries,
  getCampaignEntries,
  buildCampaignCalendar,
  buildCampaignMarkdown,
  parseCampaignProgress,
} from "../src/data/resources/campaign-plan"
import { parseResourcePath } from "../src/lib/resource-routes"
import { parseCaseStudyPath } from "../src/lib/case-study-routes"
import { getResourceEntry } from "../src/lib/resource-catalog"
import { getCaseStudyProjects } from "../src/lib/projects"
import { buildCampaignAssets } from "../scripts/build-campaign-assets"

const locales = ["pt", "en", "es"] as const

test("editorial plan covers thirty consecutive days without duplicate completion IDs", () => {
  assert.equal(campaignEntries.length, 30)
  assert.equal(new Set(campaignEntries.map((entry) => entry.id)).size, 30)
  const dates = campaignEntries.map((entry) => entry.date)
  assert.equal(dates[0], "2026-10-19")
  assert.equal(dates.at(-1), "2026-11-17")
  assert.equal(new Set(dates).size, 30)
  for (let index = 1; index < dates.length; index++)
    assert.equal(
      Date.parse(dates[index]) - Date.parse(dates[index - 1]),
      86400000
    )
})

test("every localized publication has full copy and a real localized target with channel UTMs", () => {
  for (const locale of locales) {
    const entries = getCampaignEntries(locale)
    assert.equal(entries.length, 30)
    assert.deepEqual(
      new Set(entries.map((entry) => entry.channel)),
      new Set(["linkedin", "whatsapp", "community", "newsletter"])
    )
    for (const entry of entries) {
      assert.ok(entry.text.length > 120, `${locale}/${entry.id}`)
      assert.ok(
        entry.text.includes(entry.href),
        `${locale}/${entry.id}: target absent from copy`
      )
      assert.ok(!/\[(?:name|nome|nombre|link|url)\]/i.test(entry.text))
      const url = new URL(entry.href)
      assert.equal(url.origin, "https://lagrotti.dev")
      assert.equal(url.searchParams.get("utm_source"), entry.channel)
      assert.equal(url.searchParams.get("utm_campaign"), "biblioteca-2026-10")
      assert.equal(url.searchParams.get("utm_content"), `${entry.id}-${locale}`)
      assert.ok(url.searchParams.get("utm_medium"))
      const resource = parseResourcePath(url.pathname)
      const project = parseCaseStudyPath(url.pathname)
      assert.equal((resource ?? project)?.locale, locale)
      if (resource) {
        assert.ok(resource.section && resource.slug)
        assert.ok(
          getResourceEntry(resource.section, resource.slug),
          url.pathname
        )
      } else {
        assert.ok(
          project &&
            getCaseStudyProjects().some(
              (candidate) => candidate.slug === project.slug
            ),
          url.pathname
        )
      }
    }
  }
})

test("calendar preserves full copy, escapes injected properties and folds UTF-8 lines to 75 octets", () => {
  const entries = getCampaignEntries("pt")
  const calendar = buildCampaignCalendar("pt")
  assert.equal((calendar.match(/BEGIN:VEVENT/g) ?? []).length, 30)
  assert.ok(calendar.includes("DTSTART;VALUE=DATE:20261019\r\n"))
  assert.ok(calendar.includes("DTEND;VALUE=DATE:20261020\r\n"))
  assert.ok(calendar.includes("DTEND;VALUE=DATE:20261118\r\n"))
  const unfolded = calendar.replace(/\r\n /g, "")
  assert.ok(unfolded.includes(entries[0].href))
  assert.ok(unfolded.includes("TRANSP:TRANSPARENT"))
  for (const line of calendar.split("\r\n"))
    assert.ok(Buffer.byteLength(line, "utf8") <= 75)
  const hostile = buildCampaignCalendar("pt", [
    {
      ...entries[0],
      title: "Ação, teste; x\\y\nBEGIN:VEVENT",
      text: "Olá\r\nATTENDEE:evil@example.com",
    },
  ])
  assert.equal((hostile.match(/\r\nBEGIN:VEVENT\r\n/g) ?? []).length, 1)
  assert.ok(
    hostile
      .replace(/\r\n /g, "")
      .includes("SUMMARY:Ação\\, teste\\; x\\\\y\\nBEGIN:VEVENT")
  )
  assert.ok(!hostile.includes("\r\nATTENDEE:"))
})

test("Markdown export retains every publication and progress input accepts IDs only", () => {
  for (const locale of locales) {
    const markdown = buildCampaignMarkdown(locale)
    for (const entry of getCampaignEntries(locale)) {
      assert.ok(markdown.includes(entry.date))
      assert.ok(markdown.includes(entry.text))
    }
  }
  const id = campaignEntries[0].id
  assert.deepEqual(
    parseCampaignProgress(
      JSON.stringify([id, id, "unknown", { name: "private" }, 42])
    ),
    [id]
  )
  for (const malformed of [
    "bad JSON",
    "null",
    "{}",
    '{"email":"private"}',
    '["not-an-id"]',
  ])
    assert.deepEqual(parseCampaignProgress(malformed), [])
})

test("asset builder creates portable complete campaign and facilitator ZIP packages", async () => {
  const output = mkdtempSync(join(tmpdir(), "campaign-assets-"))
  try {
    await buildCampaignAssets(output)
    for (const locale of locales) {
      assert.equal(
        readFileSync(join(output, `campanha/${locale}/calendario.ics`), "utf8"),
        buildCampaignCalendar(locale)
      )
      assert.equal(
        readFileSync(
          join(output, `campanha/${locale}/plano-30-dias.md`),
          "utf8"
        ),
        buildCampaignMarkdown(locale)
      )
      const names = JSON.parse(
        execFileSync(
          "python3",
          [
            "-c",
            "import json,sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); print(json.dumps(z.namelist())); assert z.testzip() is None",
            join(output, `sessoes/${locale}/kit-sessoes.zip`),
          ],
          { encoding: "utf8" }
        )
      ) as string[]
      assert.deepEqual(
        names.sort(),
        [
          "arquitetura-60min.md",
          "caderno-participante.md",
          "filas-30min.md",
        ].sort()
      )
      const publicationNames = JSON.parse(
        execFileSync(
          "python3",
          [
            "-c",
            "import json,sys,zipfile; z=zipfile.ZipFile(sys.argv[1]); print(json.dumps(z.namelist())); assert z.testzip() is None",
            join(output, `campanha/${locale}/kit-campanha.zip`),
          ],
          { encoding: "utf8" }
        )
      ) as string[]
      assert.ok(publicationNames.includes("plano-30-dias.md"))
      assert.ok(publicationNames.includes("calendario.ics"))
    }
  } finally {
    rmSync(output, { recursive: true, force: true })
  }
})
