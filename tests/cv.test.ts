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
