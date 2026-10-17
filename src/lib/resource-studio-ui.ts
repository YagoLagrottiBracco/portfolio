import type { Locale } from "@/lib/i18n"

export const studioInput = "mt-2 w-full rounded-xl border border-hairline bg-background p-3 text-sm leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
export const studioButton = "inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 py-2 font-semibold text-brand-contrast disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
export const studioSecondary = "inline-flex min-h-11 items-center justify-center rounded-lg border border-hairline bg-surface px-4 py-2 text-sm hover:bg-surface-hover disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
export const studioPanel = "rounded-2xl border border-hairline bg-surface p-4 sm:p-6"
export const studioCopy = (locale:Locale) => (pt:string,en:string,es:string) => ({pt,en,es})[locale]
