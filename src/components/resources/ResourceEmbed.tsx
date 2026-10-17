import Link from "next/link"
import { ResourceTools } from "./ResourceTools"
import { getResourcePath } from "@/lib/resource-routes"
import { getResourceEntry } from "@/lib/resource-catalog"
import type { Locale } from "@/lib/i18n"

export function ResourceEmbed({
  tool,
  locale,
}: {
  tool: "json" | "env" | "queue"
  locale: Locale
}) {
  const entry = getResourceEntry(
    tool === "queue" ? "demos" : "ferramentas",
    tool
  )!
  return (
    <main id="main" className="mx-auto max-w-4xl p-3 sm:p-6">
      <h1 className="mb-4 text-xl font-semibold">{entry.title[locale]}</h1>
      <ResourceTools tool={tool} locale={locale} />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link
          href={getResourcePath(
            locale,
            tool === "queue" ? "demos" : "ferramentas",
            tool
          )}
          target="_blank"
          rel="noopener"
          className="inline-flex min-h-11 items-center text-brand underline"
        >
          Yago Lagrotti Bracco · lagrotti.dev
        </Link>{" "}
        ·{" "}
        <a
          href="/recursos/downloads/tools-LICENSE.txt"
          target="_blank"
          rel="noopener"
          className="text-brand underline"
        >
          MIT
        </a>
      </p>
    </main>
  )
}
