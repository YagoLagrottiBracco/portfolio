import type { ReactNode } from "react"

import { RootDocument } from "@/components/RootDocument"
import { rootViewport } from "@/lib/root-metadata"

export const viewport = rootViewport

/** The admin routes need the same document shell and global styles as public pages. */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="pt" pageLocale="pt" measured={false}>{children}</RootDocument>
}
