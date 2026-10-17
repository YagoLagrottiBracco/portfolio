"use client"
import React, { useState } from "react"
import type { Locale } from "@/lib/i18n"
import { tr } from "@/data/resources/types"
import { buildCorrectionIssueUrl } from "@/lib/resource-participation"

export interface CorrectionProposalProps { locale:Locale; pageUrl:string; title?:string; initialExcerpt?:string }
const field="w-full rounded-lg border border-hairline bg-background px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand"
export function CorrectionProposal({locale,pageUrl,title,initialExcerpt}:CorrectionProposalProps){
  const copy=(pt:string,en:string,es:string)=>tr(pt,en,es)[locale]
  const [excerpt,setExcerpt]=useState(initialExcerpt??title??"")
  const [suggestion,setSuggestion]=useState("")
  const [draft,setDraft]=useState("")
  const [message,setMessage]=useState("")
  function capture(){const selection=window.getSelection()?.toString().trim();setDraft("");if(selection){setExcerpt(selection.slice(0,1500));setMessage(copy("Seleção capturada. Revise o trecho.","Selection captured. Review the excerpt.","Selección capturada. Revisa el fragmento."))}else setMessage(copy("Selecione um trecho da página primeiro.","Select an excerpt on this page first.","Selecciona un fragmento de esta página primero."))}
  function prepare(event:React.FormEvent){event.preventDefault();setDraft("");try{setDraft(buildCorrectionIssueUrl({pageUrl,locale,excerpt,suggestion}));setMessage(copy("Rascunho pronto para sua revisão no GitHub.","Draft ready for your review on GitHub.","Borrador listo para tu revisión en GitHub."))}catch{setMessage(copy("Revise a URL, preencha os campos e reduza o texto se necessário.","Check the URL, complete the fields and shorten the text if needed.","Revisa la URL, completa los campos y acorta el texto si es necesario."))}}
  return <section data-correction-proposal className="space-y-4 rounded-2xl border border-hairline bg-surface p-5">
    <h2 className="text-lg font-semibold">{copy("Sugerir uma correção","Suggest a correction","Sugerir una corrección")}</h2>
    <p className="break-all text-xs text-muted-foreground">{pageUrl} · {locale.toUpperCase()}</p>
    <p className="text-sm text-muted-foreground">{copy("Seu texto fica neste formulário até você preparar e abrir o rascunho. Você revisa e publica a issue no GitHub.","Your text stays in this form until you prepare and open the draft. You review and publish the issue on GitHub.","Tu texto permanece en este formulario hasta preparar y abrir el borrador. Tú revisas y publicas la issue en GitHub.")}</p>
    <button type="button" onClick={capture} className="min-h-11 rounded-lg border border-hairline px-3 text-sm">{copy("Usar texto selecionado","Use selected text","Usar texto seleccionado")}</button>
    <form onSubmit={prepare} className="space-y-4">
      <label className="block space-y-2"><span className="text-sm">{copy("Trecho original","Original excerpt","Fragmento original")}</span><textarea required maxLength={1500} rows={3} className={field} value={excerpt} onChange={event=>{setExcerpt(event.target.value);setDraft("")}}/></label>
      <label className="block space-y-2"><span className="text-sm">{copy("Correção sugerida","Suggested correction","Corrección sugerida")}</span><textarea required maxLength={2000} rows={4} className={field} value={suggestion} onChange={event=>{setSuggestion(event.target.value);setDraft("")}}/></label>
      <button className="min-h-11 rounded-lg border border-brand/40 px-4 text-sm font-medium text-brand" type="submit">{copy("Preparar rascunho","Prepare draft","Preparar borrador")}</button>
    </form>
    <p role="status" className="text-sm text-muted-foreground">{message}</p>
    {draft&&<a href={draft} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-brand underline underline-offset-4">{copy("Revisar no GitHub","Review on GitHub","Revisar en GitHub")}</a>}
  </section>
}
