import assert from "node:assert/strict"
import { readdirSync } from "node:fs"
import { join, relative } from "node:path"
import test from "node:test"
import { getSortedRoutes } from "next/dist/shared/lib/router/utils/sorted-routes"

// Exercise Next's real route sorter: build can succeed with two incompatible
// dynamic names, but next start fails before serving even a static document.
test("the complete App Router tree can be sorted by the production server", () => {
  const root = join(process.cwd(), "src/app")
  function pages(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return pages(path)
      if (!/^(page|route)\.[jt]sx?$/.test(entry.name)) return []
      const parts = relative(root, dir).split(/[\\/]/).filter((part) => part && !/^\(.*\)$/.test(part))
      return [`/${parts.join("/")}`]
    })
  }
  assert.doesNotThrow(() => getSortedRoutes(pages(root)))
})
