import type { Metadata } from "next"

import { PrivacyScreen } from "@/components/organisms/PrivacyScreen"
import { privacy } from "@/data/privacy"
import { buildPageMetadata } from "@/lib/page-metadata"

export const metadata: Metadata = buildPageMetadata("privacidade", "pt", {
  title: privacy.title.pt,
  description: privacy.description.pt,
})

export default function PrivacyPage() {
  return <PrivacyScreen locale="pt" />
}
