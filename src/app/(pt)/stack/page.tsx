import type { Metadata } from "next"

import { StackIndexScreen } from "@/components/organisms/StackScreens"
import { buildStackMetadata } from "@/lib/stack-metadata"

export const metadata: Metadata = buildStackMetadata("pt")

export default function StackIndexPage() {
  return <StackIndexScreen locale="pt" />
}
