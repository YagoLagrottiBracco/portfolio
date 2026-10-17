import React from "react"
import type { Locale } from "@/lib/i18n"
import { tr } from "@/data/resources/types"
import contributions from "@/data/resources/external-contributions.json"
import references from "@/data/resources/references.json"
import type { VerifiedContribution } from "@/lib/resource-participation"
import { INDEXNOW_KEY } from "@/lib/resource-participation"
import type { ApprovedReference } from "@/lib/webmention"
import { SITE_URL } from "@/lib/site"
import { CorrectionProposal } from "./CorrectionProposal"
import { ParticipationForms, RoadmapBoard } from "./ParticipationForms"

export type ParticipationResourceKind="correcoes"|"pedidos"|"referencias"|"contribuicoes"|"indexnow"
export function ParticipationResources({kind,locale}:{kind:ParticipationResourceKind;locale:Locale}){
  const copy=(pt:string,en:string,es:string)=>tr(pt,en,es)[locale]
  if(kind==="correcoes")return <CorrectionProposal locale={locale} pageUrl={`${SITE_URL}${locale==="pt"?"":`/${locale}`}/recursos/ecossistema/correcoes`} title={copy("Correções contextuais","Contextual corrections","Correcciones contextuales")}/>
  if(kind==="pedidos")return <div className="space-y-8"><RoadmapBoard locale={locale}/><ParticipationForms kind="pedidos" locale={locale}/></div>
  if(kind==="referencias")return <div className="space-y-6">
    <p className="text-sm text-muted-foreground">{copy("Referências recebidas passam por verificação de backlink e revisão humana. Apenas registros aprovados aparecem aqui.","Incoming references require backlink verification and human review. Only approved records appear here.","Las referencias recibidas requieren verificación del enlace y revisión humana. Solo los registros aprobados aparecen aquí.")}</p>
    {(references as ApprovedReference[]).length===0?<p className="rounded-xl border border-hairline p-4">{copy("Nenhuma referência verificada e aprovada publicada ainda.","No verified and approved references published yet.","Aún no hay referencias verificadas y aprobadas publicadas.")}</p>:(references as ApprovedReference[]).map(entry=><article key={entry.source+entry.target} className="rounded-xl border border-hairline p-4"><a className="text-brand underline" href={entry.source} target="_blank" rel="noopener noreferrer">{entry.title}</a><p className="mt-2 text-xs text-muted-foreground">{entry.target} · {entry.verifiedAt.slice(0,10)} · <a href={entry.review.issueUrl} className="underline">{copy("Revisão","Review","Revisión")}: {entry.review.reviewer}</a></p></article>)}
    <ParticipationForms kind="referencias" locale={locale}/>
    <a href="https://www.w3.org/TR/webmention/" className="text-sm text-brand underline" target="_blank" rel="noopener noreferrer">{copy("Protocolo Webmention (W3C)","Webmention protocol (W3C)","Protocolo Webmention (W3C)")}</a>
  </div>
  if(kind==="contribuicoes")return <div className="space-y-5">
    <p className="text-sm text-muted-foreground">{copy("Pull requests públicos de YagoLagrottiBracco em repositórios de outras pessoas ou organizações, com merge confirmado pela API do GitHub. Isso não implica independência profissional nem endosso.","Public pull requests by YagoLagrottiBracco in repositories owned by other people or organizations, with merge confirmed through the GitHub API. This does not imply professional independence or endorsement.","Pull requests públicos de YagoLagrottiBracco en repositorios de otras personas u organizaciones, con merge confirmado por la API de GitHub. Esto no implica independencia profesional ni respaldo.")}</p>
    <p className="text-xs text-muted-foreground">{copy("Verificado em","Verified at","Verificado el")}: <time dateTime={contributions.verifiedAt}>{contributions.verifiedAt}</time></p>
    {(contributions.entries as VerifiedContribution[]).length===0?<p className="rounded-xl border border-hairline p-4">{copy("Nenhuma contribuição pública com estes critérios foi encontrada na consulta verificada. Nenhum trabalho é atribuído sem evidência pública.","No public contributions meeting these criteria were found in the verified query. No work is credited without public evidence.","No se encontraron contribuciones públicas que cumplan estos criterios en la consulta verificada. No se atribuye trabajo sin evidencia pública.")}</p>:(contributions.entries as VerifiedContribution[]).map(entry=><article className="rounded-xl border border-hairline p-4" key={entry.url}><a href={entry.url} target="_blank" rel="noopener noreferrer" className="text-brand underline">{entry.repository}#{entry.number}: {entry.title}</a><p className="mt-2 text-sm">{copy("Integrado em","Merged at","Integrado el")} <time dateTime={entry.mergedAt}>{entry.mergedAt.slice(0,10)}</time></p></article>)}
    <a href={contributions.queryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm text-brand underline">{copy("Inspecionar a consulta pública no GitHub","Inspect the public query on GitHub","Inspeccionar la consulta pública en GitHub")}</a>
    <p className="text-sm text-muted-foreground">{copy("Atualização reproduzível para manutenção:","Reproducible maintainer refresh:","Actualización reproducible para mantenimiento:")}</p><pre className="overflow-x-auto rounded-xl border border-hairline bg-surface p-4 text-sm"><code>npx tsx scripts/refresh-participation.ts</code></pre>
  </div>
  return <div className="space-y-5">
    <p className="text-sm text-muted-foreground">{copy("O IndexNow informa mecanismos participantes sobre URLs atualizadas. A aceitação confirma recebimento, sem garantia de indexação ou posição.","IndexNow notifies participating search engines about updated URLs. Acceptance confirms receipt, with no indexing or ranking guarantee.","IndexNow notifica a los buscadores participantes sobre URLs actualizadas. La aceptación confirma recepción, sin garantía de indexación ni posicionamiento.")}</p>
    <a href={`/${INDEXNOW_KEY}.txt`} className="text-brand underline">{copy("Chave pública de verificação","Public verification key","Clave pública de verificación")}</a>
    <p className="text-sm text-muted-foreground">{copy("A manutenção revisa a lista de URLs antes de enviar. O comando usa simulação por padrão e verifica a chave publicada antes de qualquer envio real.","Maintainers review the URL list before submitting. The command defaults to dry run and checks the published key before any real submission.","Mantenimiento revisa la lista de URLs antes de enviarla. El comando simula por defecto y comprueba la clave publicada antes de cualquier envío real.")}</p>
    <pre className="overflow-x-auto rounded-xl border border-hairline bg-surface p-4 text-sm"><code>{"npx tsx scripts/submit-indexnow.ts\n# submit after production deployment\nnpx tsx scripts/submit-indexnow.ts --submit"}</code></pre>
    <a href="https://www.indexnow.org/documentation" target="_blank" rel="noopener noreferrer" className="text-sm text-brand underline">{copy("Documentação oficial do IndexNow","Official IndexNow documentation","Documentación oficial de IndexNow")}</a>
  </div>
}
