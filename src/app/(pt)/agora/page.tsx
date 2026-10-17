import type { Metadata } from "next"

import { NowScreen, nowMeta } from "@/components/organisms/NowScreen"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata("agora", "pt", nowMeta.pt)

export default function NowPage() {
  return <NowScreen locale="pt" />
}
