/**
 * Lists what each case study is still missing: hard numbers (`metrics`), the
 * year, the companion article, the architecture diagram, a testimonial.
 * Numbers convince more than a stack list, but only true ones belong here —
 * this only points at the gaps, it never fills them.
 *
 *   npm run audit:case-studies
 */
import { personalData } from "../src/data/personal"
import { getCaseStudyProjects } from "../src/lib/projects"

const rows = getCaseStudyProjects().map((project) => {
  const missing = [
    !project.caseStudy.metrics?.length && "metrics",
    !project.year && "year",
    !project.caseStudy.articleKey && "article",
    !project.caseStudy.diagram?.length && "diagram",
    !personalData.testimonials.some((item) => item.project === project.slug) && "testimonial",
  ].filter(Boolean)
  return { slug: project.slug, metrics: project.caseStudy.metrics?.length ?? 0, missing }
})

for (const row of rows) console.log(`${row.slug.padEnd(20)} metrics: ${String(row.metrics).padEnd(3)} missing: ${row.missing.join(", ") || "—"}`)
const withoutNumbers = rows.filter((row) => row.metrics === 0).length
console.log(`\n${withoutNumbers} of ${rows.length} case studies have no metrics.`)
