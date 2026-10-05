import type { Metadata } from "next"
import type { ReactNode } from "react"

import { RootDocument } from "@/components/RootDocument"
import { buildRootMetadata } from "@/lib/root-metadata"

export const metadata: Metadata = buildRootMetadata("pt")

/** Root layout of the unprefixed routes, which are all in Portuguese. */
export default function PortugueseRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="pt">{children}</RootDocument>
}
