import type { ReactNode } from "react"

import { RootDocument } from "@/components/RootDocument"

/** The admin routes need the same document shell and global styles as public pages. */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="pt" pageLocale="pt">{children}</RootDocument>
}
