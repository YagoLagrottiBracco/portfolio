import type { Metadata } from "next"

import { WorkWithMeScreen } from "@/components/organisms/WorkWithMeScreen"
import { workWithMe } from "@/data/work-with-me"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata("trabalhe-comigo", "pt", {
  title: workWithMe.metaTitle.pt,
  description: workWithMe.description.pt,
})

export default function WorkWithMePage() {
  return <WorkWithMeScreen locale="pt" />
}
