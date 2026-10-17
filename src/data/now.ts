/**
 * @file now.ts
 * @description Free notes for `/agora` (a "now page", see nownownow.com): what
 * has Yago's attention this season, in his words. Empty on purpose — the page
 * already shows the current role, recent case studies and articles from the
 * data, and only Yago can say what he is reading, learning or exploring.
 * Each note needs all three languages; bump `updatedAt` when editing.
 */
import type { Locale } from "@/lib/i18n"

export const nowNotes: { updatedAt: string; notes: Record<Locale, string>[] } = {
  updatedAt: "2026-10-17",
  notes: [],
}
