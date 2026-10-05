/**
 * @file ArchitectureFlow.tsx
 * @description Draws a case study's `diagram` as a row of stages joined by arrows.
 *
 * It is plain HTML rather than an image so the labels follow the active locale
 * and theme, stay selectable, and read as an ordered list to assistive tech.
 * Below `lg` the row turns into a column: six stages do not fit a phone.
 */
import { ChevronDown, ChevronRight } from "lucide-react"
import { Fragment } from "react"

import type { CaseStudyDiagramStage } from "@/data/personal"
import type { Locale } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface ArchitectureFlowProps {
  stages: CaseStudyDiagramStage[]
  locale: Locale
  /** Accessible name for the list — the section heading, already translated. */
  label: string
}

export function ArchitectureFlow({ stages, locale, label }: ArchitectureFlowProps) {
  return (
    <ol aria-label={label} className="flex flex-col items-stretch gap-2 lg:flex-row lg:gap-1">
      {stages.map((stage, index) => (
        <Fragment key={stage.title[locale]}>
          {index > 0 && (
            <li aria-hidden="true" className="flex shrink-0 items-center justify-center text-muted-foreground">
              <ChevronDown className="h-4 w-4 lg:hidden" />
              <ChevronRight className="hidden h-4 w-4 lg:block" />
            </li>
          )}
          <li
            className={cn(
              "min-w-0 flex-1 rounded-xl border bg-surface p-4",
              stage.emphasis ? "border-brand/50 bg-brand-soft" : "border-hairline"
            )}
          >
            <p className={cn("text-sm font-semibold leading-snug", stage.emphasis && "text-brand")}>
              {stage.title[locale]}
            </p>
            {stage.items && stage.items.length > 0 && (
              <ul className="mt-2 space-y-1.5">
                {stage.items.map((item) => (
                  <li key={item[locale]} className="text-xs leading-snug text-muted-foreground [overflow-wrap:anywhere]">
                    {item[locale]}
                  </li>
                ))}
              </ul>
            )}
          </li>
        </Fragment>
      ))}
    </ol>
  )
}
