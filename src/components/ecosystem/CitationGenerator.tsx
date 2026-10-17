"use client"
import React, { useState } from "react"
import type { Locale } from "@/lib/i18n"
import { buildCitation, type ResourceCitation } from "@/lib/resource-citation"
import { CopyField } from "@/components/resources/CopyField"

export function CitationGenerator({
  items,
  locale,
}: {
  items: ResourceCitation[]
  locale: Locale
}) {
  const [selected, setSelected] = useState(items[0]?.id ?? "")
  const item = items.find((record) => record.id === selected) ?? items[0]
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  if (!item) return null
  const citation = buildCitation(item)
  return (
    <section
      className="mt-8 rounded-2xl border border-hairline bg-surface p-5 sm:p-7"
      aria-label={copy(
        "Gerador de referências",
        "Citation generator",
        "Generador de referencias"
      )}
      data-testid="citation-generator"
    >
      <h2 className="text-2xl font-semibold">
        {copy(
          "Referência com origem e versão",
          "Reference with source and version",
          "Referencia con origen y versión"
        )}
      </h2>
      <label className="mt-5 block text-sm font-medium">
        {copy("Material para citar", "Material to cite", "Material que citar")}
        <select
          className="mt-2 min-h-11 w-full rounded-lg border border-hairline bg-background px-3"
          value={item.id}
          onChange={(event) => setSelected(event.target.value)}
        >
          {items.map((record) => (
            <option key={record.id} value={record.id}>
              {record.title}
            </option>
          ))}
        </select>
      </label>
      <CopyField
        value={citation.text}
        label={copy(
          "Referência em texto",
          "Plain-text reference",
          "Referencia en texto"
        )}
        locale={locale}
      />
      <CopyField value={citation.bibtex} label="BibTeX" locale={locale} />
      <a
        download={item.id.replace(/[^a-z0-9-]/gi, "-") + ".bib"}
        href={
          "data:application/x-bibtex;charset=utf-8," +
          encodeURIComponent(citation.bibtex)
        }
        className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-hairline px-4 text-sm font-medium text-brand"
      >
        {copy("Baixar BibTeX", "Download BibTeX", "Descargar BibTeX")}
      </a>
    </section>
  )
}
