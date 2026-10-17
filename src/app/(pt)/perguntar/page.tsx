import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { AskScreen, askCopy } from "@/components/organisms/AskScreen"
import { askEnabled } from "@/lib/ask/config"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata("perguntar", "pt", askCopy.pt)

export default function AskPage() {
  if (!askEnabled()) notFound()
  return <AskScreen locale="pt" />
}
