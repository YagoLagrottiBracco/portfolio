import type { Metadata } from "next"

import { RecommendScreen, recommendCopy } from "@/components/organisms/RecommendScreen"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata("recomendar", "pt", recommendCopy.pt)

export default function RecommendPage() {
  return <RecommendScreen locale="pt" />
}
