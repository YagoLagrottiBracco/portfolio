/**
 * @file featured-order.ts
 * @description Display order for the featured case studies, by slug.
 *
 * Deliberately alternates the backend-heavy systems (which carry the hard
 * numbers) with the end-to-end products, and opens with the strongest scale
 * claim — the section is titled "Engineering Case Studies", so the first card
 * has to earn that title.
 *
 * It names every case study (tests/case-study-content.test.ts checks it), so
 * code running in the browser can ask "is this a case study?" from this short
 * list instead of downloading the projects. `personal.ts` re-exports it.
 */
export const featuredOrder: string[] = [
  "vmageste",
  "impressaomais3d",
  "envrune",
  "praxis",
  "pulsewatch",
  "digitaltechms",
  "eurologado",
  "dupla-face",
  "flora-psicologia",
  "devagent",
]
