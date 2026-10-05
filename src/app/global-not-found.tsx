import type { Metadata } from "next"

import { NotFoundScreen } from "@/components/organisms/NotFoundScreen"
import { RootDocument } from "@/components/RootDocument"
import { buildRootMetadata } from "@/lib/root-metadata"

export const metadata: Metadata = {
  ...buildRootMetadata("pt"),
  title: "404 — Yago Lagrotti Bracco",
  robots: { index: false },
}

/**
 * The 404 the server sends for any unknown URL, and for `notFound()` thrown by
 * a page. It carries its own document because it sits above every root layout.
 * The `not-found.tsx` next to each layout renders the same screen once the
 * browser takes over, so the two never disagree.
 */
export default function GlobalNotFound() {
  return (
    <RootDocument lang="pt">
      <NotFoundScreen />
    </RootDocument>
  )
}
