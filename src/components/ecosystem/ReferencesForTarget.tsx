import React from "react"
import references from "@/data/resources/references.json"
import type { Locale } from "@/lib/i18n"
import type { ApprovedReference } from "@/lib/webmention"
import { tr } from "@/data/resources/types"

/** Only the reviewed static dataset reaches article/resource pages. */
export function ReferencesForTarget({target,locale}:{target:string;locale:Locale}){
  const entries=(references as ApprovedReference[]).filter(entry=>entry.target===target)
  if(entries.length===0)return null
  const copy=(pt:string,en:string,es:string)=>tr(pt,en,es)[locale]
  return <section className="mt-8 space-y-3" aria-label={copy("Referências verificadas","Verified references","Referencias verificadas")}>
    <h2 className="text-lg font-semibold">{copy("Referências verificadas","Verified references","Referencias verificadas")}</h2>
    {entries.map(entry=><article key={entry.source} className="rounded-xl border border-hairline bg-surface p-4">
      <a href={entry.source} target="_blank" rel="noopener noreferrer" className="text-brand underline underline-offset-4">{entry.title}</a>
      <p className="mt-2 text-xs text-muted-foreground">{copy("Link verificado em","Link verified at","Enlace verificado el")} <time dateTime={entry.verifiedAt}>{entry.verifiedAt.slice(0,10)}</time>{" · "}<a href={entry.review.issueUrl} className="underline" target="_blank" rel="noopener noreferrer">{copy("Revisão","Review","Revisión")}: {entry.review.reviewer}</a></p>
    </article>)}
  </section>
}
