/**
 * @file project-categories.ts
 * @description The filter keys of the project grid and their labels. Small and
 * separate from `personal.ts` (which re-exports it) so the case study page and
 * the grid filter do not pull the whole project list into the browser.
 */
import type { Locale } from "@/lib/i18n"

/**
 * Stable filter keys for the project grid. The visible label for each one
 * lives in `projectCategories` below, so the filter never depends on
 * translated strings matching each other.
 */
export type ProjectCategoryId = "plataformas" | "arquitetura" | "ia" | "produtos"

/** Visible labels for each filter key, in all locales. */
export const projectCategories: { id: ProjectCategoryId; label: Record<Locale, string> }[] = [
  {
    id: "plataformas",
    label: { pt: "Plataformas & E-commerce", en: "Platforms & E-commerce", es: "Plataformas y comercio electrónico" },
  },
  {
    id: "arquitetura",
    label: { pt: "Sistemas & Arquitetura", en: "Systems & Architecture", es: "Sistemas y arquitectura" },
  },
  {
    id: "ia",
    label: { pt: "IA & Automação", en: "AI & Automation", es: "IA y automatización" },
  },
  {
    id: "produtos",
    label: { pt: "Produtos sob medida", en: "Custom Products", es: "Productos a medida" },
  },
]
