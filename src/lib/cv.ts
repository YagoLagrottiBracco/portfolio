/**
 * @file cv.ts
 * @description Builds the downloadable résumé as a PDF, straight from
 * `personalData` and the UI dictionaries — there is no second copy of the
 * career history to keep in sync with the site.
 *
 * Text is set in the PDF's built-in Helvetica so the file stays small and
 * selectable, which is also what applicant-tracking systems parse best.
 */
import { PDFDocument, PDFName, PDFString, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib"

import { localizeLabel } from "@/data/content-labels"
import { personalData } from "@/data/personal"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { localeTags, type Locale } from "@/lib/i18n"
import { getCaseStudyProjects } from "@/lib/projects"
import enMessages from "@/messages/en.json"
import esMessages from "@/messages/es.json"
import ptMessages from "@/messages/pt.json"

const SITE_URL = "https://lagrotti.dev"

const messages = { pt: ptMessages, en: enMessages, es: esMessages }

const labels: Record<Locale, {
  summary: string
  skills: string
  experience: string
  projects: string
  education: string
  certifications: string
  subject: string
}> = {
  pt: { summary: "Resumo", skills: "Competências", experience: "Experiência", projects: "Projetos em destaque", education: "Formação", certifications: "Certificações", subject: "Currículo" },
  en: { summary: "Summary", skills: "Skills", experience: "Experience", projects: "Selected projects", education: "Education", certifications: "Certifications", subject: "Résumé" },
  es: { summary: "Resumen", skills: "Competencias", experience: "Experiencia", projects: "Proyectos destacados", education: "Formación", certifications: "Certificaciones", subject: "Currículum" },
}

const PAGE = { width: 595.28, height: 841.89, margin: 46 }
const CONTENT_WIDTH = PAGE.width - PAGE.margin * 2

const ink = rgb(0.1, 0.1, 0.12)
const muted = rgb(0.38, 0.4, 0.45)
const accent = rgb(0.16, 0.32, 0.82)
const rule = rgb(0.82, 0.84, 0.88)

/** Helvetica covers Latin-1; anything else is swapped for a close ASCII form. */
const replacements: Record<string, string> = { "→": "->", "←": "<-", "≥": ">=", "≤": "<=", " ": " ", "‑": "-" }

function printable(text: string, font: PDFFont): string {
  let out = ""
  for (const char of text) {
    const candidate = replacements[char] ?? char
    try {
      font.encodeText(candidate)
      out += candidate
    } catch {
      out += "?"
    }
  }
  return out
}

interface TextStyle {
  font: PDFFont
  size: number
  color?: ReturnType<typeof rgb>
  /** Line height as a multiple of the font size. */
  leading?: number
}

class Sheet {
  private page: PDFPage
  private y: number

  constructor(private readonly doc: PDFDocument) {
    this.page = doc.addPage([PAGE.width, PAGE.height])
    this.y = PAGE.height - PAGE.margin
  }

  private ensure(height: number) {
    if (this.y - height >= PAGE.margin) return
    this.page = this.doc.addPage([PAGE.width, PAGE.height])
    this.y = PAGE.height - PAGE.margin
  }

  gap(height: number) {
    this.y -= height
  }

  private wrap(text: string, style: TextStyle, width: number): string[] {
    const lines: string[] = []
    let line = ""
    for (const word of printable(text, style.font).split(/\s+/).filter(Boolean)) {
      const candidate = line ? `${line} ${word}` : word
      if (line && style.font.widthOfTextAtSize(candidate, style.size) > width) {
        lines.push(line)
        line = word
      } else {
        line = candidate
      }
    }
    if (line) lines.push(line)
    return lines
  }

  /** Flowing text; `keepWithNext` reserves room so a heading never ends a page. */
  text(text: string, style: TextStyle, options: { width?: number; keepWithNext?: number; link?: string } = {}) {
    const width = options.width ?? CONTENT_WIDTH
    const lineHeight = style.size * (style.leading ?? 1.38)
    const lines = this.wrap(text, style, width)
    this.ensure(lineHeight * Math.min(lines.length, 2) + (options.keepWithNext ?? 0))
    for (const line of lines) {
      this.ensure(lineHeight)
      this.y -= lineHeight
      this.page.drawText(line, { x: PAGE.margin, y: this.y + style.size * 0.28, size: style.size, font: style.font, color: style.color ?? ink })
      if (options.link) {
        this.link(PAGE.margin, this.y, style.font.widthOfTextAtSize(line, style.size), lineHeight, options.link)
      }
    }
  }

  /** One line with a left part and a right-aligned part, such as a role and its dates. */
  row(left: string, leftStyle: TextStyle, right: string, rightStyle: TextStyle, keepWithNext = 0) {
    const rightText = printable(right, rightStyle.font)
    const rightWidth = rightStyle.font.widthOfTextAtSize(rightText, rightStyle.size)
    const lineHeight = leftStyle.size * (leftStyle.leading ?? 1.38)
    const lines = this.wrap(left, leftStyle, CONTENT_WIDTH - rightWidth - 12)
    this.ensure(lineHeight * lines.length + keepWithNext)
    lines.forEach((line, index) => {
      this.y -= lineHeight
      const baseline = this.y + leftStyle.size * 0.28
      this.page.drawText(line, { x: PAGE.margin, y: baseline, size: leftStyle.size, font: leftStyle.font, color: leftStyle.color ?? ink })
      if (index === 0) {
        this.page.drawText(rightText, { x: PAGE.width - PAGE.margin - rightWidth, y: baseline, size: rightStyle.size, font: rightStyle.font, color: rightStyle.color ?? muted })
      }
    })
  }

  /** Several short pieces on one line, each optionally a link, separated by a middle dot. */
  inline(parts: { text: string; link?: string }[], style: TextStyle) {
    const lineHeight = style.size * (style.leading ?? 1.5)
    const separator = "  ·  "
    const separatorWidth = style.font.widthOfTextAtSize(separator, style.size)
    this.ensure(lineHeight)
    this.y -= lineHeight
    let x = PAGE.margin
    parts.forEach((part, index) => {
      const text = printable(part.text, style.font)
      const width = style.font.widthOfTextAtSize(text, style.size)
      if (index > 0) {
        if (x + separatorWidth + width > PAGE.width - PAGE.margin) {
          this.ensure(lineHeight)
          this.y -= lineHeight
          x = PAGE.margin
        } else {
          this.page.drawText(separator, { x, y: this.y + style.size * 0.28, size: style.size, font: style.font, color: rule })
          x += separatorWidth
        }
      }
      this.page.drawText(text, { x, y: this.y + style.size * 0.28, size: style.size, font: style.font, color: style.color ?? muted })
      if (part.link) this.link(x, this.y, width, lineHeight, part.link)
      x += width
    })
  }

  heading(text: string, font: PDFFont) {
    this.gap(13)
    this.text(text.toUpperCase(), { font, size: 8.5, color: accent, leading: 1.3 }, { keepWithNext: 40 })
    this.gap(3)
    this.page.drawLine({ start: { x: PAGE.margin, y: this.y }, end: { x: PAGE.width - PAGE.margin, y: this.y }, thickness: 0.6, color: rule })
    this.gap(5)
  }

  private link(x: number, y: number, width: number, height: number, url: string) {
    const annotation = this.doc.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [x, y, x + width, y + height],
      Border: [0, 0, 0],
      A: { Type: "Action", S: "URI", URI: PDFString.of(url) },
    })
    const annotations = this.page.node.lookup(PDFName.of("Annots"))
    if (annotations) this.page.node.addAnnot(this.doc.context.register(annotation))
    else this.page.node.set(PDFName.of("Annots"), this.doc.context.obj([this.doc.context.register(annotation)]))
  }
}

const withoutProtocol = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")

export async function buildCvPdf(locale: Locale): Promise<Uint8Array> {
  const text = messages[locale]
  const label = labels[locale]
  const doc = await PDFDocument.create()
  const regular = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  doc.setTitle(`${personalData.name} — ${text.hero.headline}`)
  doc.setAuthor(personalData.name)
  doc.setSubject(label.subject)
  doc.setLanguage(localeTags[locale])

  const sheet = new Sheet(doc)
  const body: TextStyle = { font: regular, size: 9.5 }
  const small: TextStyle = { font: regular, size: 8.5, color: muted }

  // Header
  sheet.text(personalData.name, { font: bold, size: 22, leading: 1.15 })
  sheet.gap(2)
  sheet.text(`${text.hero.headline}  ·  ${text.hero.focus}`, { font: bold, size: 10.5, color: accent })
  sheet.gap(2)
  sheet.inline(
    [
      { text: text.hero.location },
      { text: personalData.socialLinks.phone, link: `tel:${personalData.socialLinks.phone.replace(/[^+\d]/g, "")}` },
      { text: personalData.socialLinks.email, link: `mailto:${personalData.socialLinks.email}` },
      { text: personalData.socialLinks.domain, link: SITE_URL },
      { text: withoutProtocol(personalData.socialLinks.linkedin), link: personalData.socialLinks.linkedin },
      { text: withoutProtocol(personalData.socialLinks.github), link: personalData.socialLinks.github },
    ],
    { font: regular, size: 9, color: muted }
  )

  sheet.heading(label.summary, bold)
  sheet.text(text.about.summary, body)

  sheet.heading(label.skills, bold)
  sheet.text(personalData.skills.map((skill) => localizeLabel(skill, locale)).join("  ·  "), body)

  sheet.heading(label.experience, bold)
  for (const job of [...personalData.experience].sort((a, b) => b.order - a.order)) {
    sheet.row(job.position[locale], { font: bold, size: 10 }, job.period[locale], small, 30)
    sheet.text(localizeLabel(job.company, locale), { font: regular, size: 9.5, color: accent })
    sheet.text(job.description[locale], body)
    sheet.gap(7)
  }

  sheet.heading(label.projects, bold)
  for (const project of getCaseStudyProjects()) {
    const url = `${SITE_URL}${getCaseStudyPath(locale, project.slug)}`
    sheet.text(`${project.title[locale]} — ${project.tagline[locale]}`, { font: bold, size: 9.5 }, { keepWithNext: 14 })
    sheet.text(withoutProtocol(url), small, { link: url })
    sheet.gap(4)
  }

  sheet.heading(label.education, bold)
  for (const entry of [...personalData.education].sort((a, b) => b.order - a.order)) {
    sheet.row(entry.degree[locale], { font: bold, size: 10 }, entry.period[locale], small, 14)
    sheet.text(entry.institution, { font: regular, size: 9.5, color: accent })
    sheet.gap(5)
  }

  sheet.heading(label.certifications, bold)
  for (const certification of personalData.certifications) sheet.text(`•  ${certification}`, body)

  return doc.save()
}
