import assert from "node:assert/strict"
import test from "node:test"
import { PDFDocument } from "pdf-lib"
import { buildCvPdf } from "../src/lib/cv"
import { getCvFileName, getCvPath } from "../src/lib/cv-routes"
import { locales } from "../src/lib/i18n"

test("names the résumé route and file per locale", () => {
  assert.equal(getCvPath("en"), "/cv/en")
  assert.equal(getCvFileName("es"), "yago-lagrotti-bracco-cv-es.pdf")
})

test("generates a short, titled PDF résumé in every language", async () => {
  for (const locale of locales) {
    const bytes = await buildCvPdf(locale)
    assert.equal(Buffer.from(bytes.subarray(0, 5)).toString("latin1"), "%PDF-")
    const pdf = await PDFDocument.load(bytes)
    assert.ok(pdf.getPageCount() >= 1 && pdf.getPageCount() <= 3, `${locale}: ${pdf.getPageCount()} pages`)
    assert.match(pdf.getTitle() ?? "", /Yago Lagrotti Bracco/)
  }
})

test("a focus only reorders what the data already holds", async () => {
  const { personalData } = await import("../src/data/personal")
  const { cvFocuses, cvFocusSpecs, orderSkills, pickProjects } = await import("../src/lib/cv-focus")
  const { getCaseStudyProjects } = await import("../src/lib/projects")
  for (const focus of cvFocuses) {
    for (const skill of cvFocusSpecs[focus].skills) assert.ok(personalData.skills.includes(skill), `${focus}: unknown skill ${skill}`)
    const skills = orderSkills(personalData.skills, focus)
    assert.deepEqual([...skills].sort(), [...personalData.skills].sort(), `${focus}: same skills, new order`)
    assert.equal(skills[0], cvFocusSpecs[focus].skills[0])
    const projects = pickProjects(getCaseStudyProjects(), focus)
    assert.ok(projects.length <= 6)
    assert.ok(cvFocusSpecs[focus].categories.includes(projects[0].category), `${focus}: leads with its own category`)
  }
})

test("generates every focused résumé in every language", async () => {
  const { cvFocuses } = await import("../src/lib/cv-focus")
  for (const locale of locales) {
    for (const focus of cvFocuses) {
      const pdf = await PDFDocument.load(await buildCvPdf(locale, focus))
      assert.ok(pdf.getPageCount() >= 1 && pdf.getPageCount() <= 3, `${locale}/${focus}: ${pdf.getPageCount()} pages`)
    }
  }
  assert.equal(getCvPath("pt", "ia"), "/cv/pt/ia")
  assert.equal(getCvFileName("en", "backend"), "yago-lagrotti-bracco-cv-en-backend.pdf")
})

test("reads ISO dates from the English period labels", async () => {
  const { parsePeriod } = await import("../src/lib/cv-formats")
  assert.deepEqual(parsePeriod("Feb 2023 - Aug 2023"), { startDate: "2023-02", endDate: "2023-08" })
  assert.deepEqual(parsePeriod("Jan 2026 - present"), { startDate: "2026-01" })
  assert.deepEqual(parsePeriod("2015–2018"), { startDate: "2015", endDate: "2018" })
  assert.deepEqual(parsePeriod("In progress"), {})
})

test("the résumé exists as JSON Resume, plain text and a vCard", async () => {
  const { buildJsonResume, buildPlainTextCv, buildVcard } = await import("../src/lib/cv-formats")
  const { personalData } = await import("../src/data/personal")
  for (const locale of locales) {
    const resume = buildJsonResume(locale)
    assert.equal(resume.basics.name, personalData.name)
    assert.equal(resume.work.length, personalData.experience.length)
    for (const job of resume.work) assert.match(job.startDate ?? "", /^\d{4}-\d{2}$/, `${job.name} has a start date`)
    assert.equal(resume.work[0].endDate, undefined, "the current job has no end date")
    const text = buildPlainTextCv(locale)
    assert.ok(text.startsWith(`${personalData.name}\n`))
    for (const job of personalData.experience) assert.ok(text.includes(job.position[locale]), job.company)
  }
  const card = buildVcard("pt")
  assert.match(card, /^BEGIN:VCARD\r\nVERSION:3\.0\r\nN:Lagrotti Bracco;Yago;;;\r\n/)
  assert.match(card, /\r\nTEL;TYPE=CELL:\+5517997642678\r\n/)
  assert.ok(card.endsWith("END:VCARD\r\n"))
})
