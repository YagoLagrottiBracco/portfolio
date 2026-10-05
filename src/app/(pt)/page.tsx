import type { Metadata } from "next"

import { HomeScreen } from "@/components/organisms/HomeScreen"
import { buildHomeMetadata } from "@/lib/home-metadata"

/** Portuguese homepage, the canonical one; `/en` and `/es` live under `[locale]`. */
export const metadata: Metadata = buildHomeMetadata("pt")

export default function Home() {
  return <HomeScreen locale="pt" />
}
