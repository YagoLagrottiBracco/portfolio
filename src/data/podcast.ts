/**
 * @file podcast.ts
 * @description Recorded audio versions of articles. Each entry adds an audio
 * player to the article and an episode to the language's podcast feed
 * (`/blog/podcast.xml`, `/en/blog/podcast.xml`, `/es/blog/podcast.xml`).
 * Empty: the feeds answer 404 and articles offer the browser's speech
 * synthesis instead. How to record and host episodes: docs/growth.md.
 */
import type { Locale } from "@/lib/i18n"

export interface Episode {
  /** The article it reads, by translationKey and language. */
  translationKey: string
  locale: Locale
  /** Public HTTPS URL of the MP3 (or M4A). */
  audioUrl: string
  /** File size in bytes, required by podcast apps for the enclosure. */
  bytes: number
  durationSeconds: number
  /** ISO date the episode was published. */
  publishedAt: string
}

export const episodes: Episode[] = []
