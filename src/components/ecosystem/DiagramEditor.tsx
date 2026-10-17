"use client"

import React, {useId,useState} from "react"
import type {Locale} from "@/lib/i18n"
import {getCaseStudyProjects} from "@/lib/projects"
import {getCaseStudyPath} from "@/lib/case-study-routes"
import {addGraphEdge,addGraphNode,downloadStudioText,graphMermaid,graphSvg,removeGraphNode,seedCaseGraph,validateGraph,type StudioGraph} from "@/lib/resource-studio"
import {studioButton,studioCopy,studioInput,studioPanel,studioSecondary} from "@/lib/resource-studio-ui"

const cases=getCaseStudyProjects().filter((project)=>project.caseStudy.diagram?.length)

export function DiagramEditor({locale}:{locale:Locale}) {
  const copy=studioCopy(locale)
  const [caseId,setCaseId]=useState(cases[0].slug)
  const selected=cases.find((project)=>project.slug===caseId)!
  const [graph,setGraph]=useState<StudioGraph>(()=>seedCaseGraph(cases[0].caseStudy.diagram!,locale))
  const [nodeLabel,setNodeLabel]=useState(copy("Novo componente","New component","Nuevo componente"))
  const [from,setFrom]=useState("n1"),[to,setTo]=useState("n2"),[edgeLabel,setEdgeLabel]=useState("")
  const [exported,setExported]=useState(""),[format,setFormat]=useState<"svg"|"mmd">("mmd"),[status,setStatus]=useState("")
  const markerId=useId().replace(/:/g,"")
  const valid=Boolean(validateGraph(graph))
  function changed(next:StudioGraph) {setGraph(next);setExported("");setStatus("")}
  function reset(slug=caseId) {const project=cases.find((item)=>item.slug===slug)!;setCaseId(slug);changed(seedCaseGraph(project.caseStudy.diagram!,locale));setFrom("n1");setTo("n2")}
  function exportGraph(kind:"svg"|"mmd") {try {setExported(kind==="svg"?graphSvg(graph):graphMermaid(graph));setFormat(kind);setStatus("")} catch {setStatus(copy("Corrija o diagrama antes de exportar.","Fix the graph before exporting.","Corrige el diagrama antes de exportar."))}}
  const position=(id:string)=>{const index=graph.nodes.findIndex((node)=>node.id===id);return {x:25+(index%4)*225,y:30+Math.floor(index/4)*150}}
  return <section className={studioPanel} aria-label={copy("Editor de diagramas","Diagram editor","Editor de diagramas")}>
    <p className="text-sm text-muted-foreground">{copy("Comece com as etapas de um estudo de caso real. As alterações ficam apenas nesta sessão. Use Tab para navegar, Enter/Espaço nos botões e as setas nos seletores. Limites: 16 componentes, 32 conexões e 64 caracteres por nome.","Start with the stages of a real case study. Edits stay only in this session. Use Tab to navigate, Enter/Space on buttons and arrows in selectors. Limits: 16 components, 32 connections and 64 characters per label.","Empieza con las etapas de un caso real. Los cambios quedan solo en esta sesión. Usa Tab para navegar, Enter/Espacio en botones y flechas en selectores. Límites: 16 componentes, 32 conexiones y 64 caracteres por nombre.")}</p>
    <label className="mt-5 block text-sm">{copy("Estudo de caso inicial","Seed case study","Caso inicial")}<select className={studioInput} value={caseId} onChange={(event)=>reset(event.target.value)}>{cases.map((project)=><option key={project.slug} value={project.slug}>{project.title[locale]}</option>)}</select></label>
    <a className="mt-3 inline-flex min-h-11 items-center text-sm text-brand underline underline-offset-4" href={getCaseStudyPath(locale,selected.slug)}>{copy("Ler as decisões do caso","Read the case decisions","Leer las decisiones del caso")}: {selected.title[locale]}</a>
    <div className="mt-4 overflow-x-auto rounded-xl border border-hairline bg-background p-2">
      <svg className="h-auto min-w-[640px] w-full" viewBox={`0 0 920 ${Math.ceil(graph.nodes.length/4)*150+30}`} role="img" aria-label={copy("Prévia do diagrama editado; lista de componentes e conexões abaixo","Edited diagram preview; component and connection lists below","Vista del diagrama editado; listas de componentes y conexiones debajo")}>
        <defs><marker id={markerId} markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="currentColor" /></marker></defs>
        {graph.edges.map((edge)=>{const start=position(edge.from),end=position(edge.to);return <g key={edge.id} className="text-muted-foreground"><path d={`M${start.x+200} ${start.y+39} L${end.x} ${end.y+39}`} stroke="currentColor" strokeWidth={2} fill="none" markerEnd={`url(#${markerId})`} /><text x={(start.x+end.x)/2+100} y={(start.y+end.y)/2+22} textAnchor="middle" fill="currentColor" fontSize={11}>{edge.label.slice(0,24)}</text></g>})}
        {graph.nodes.map((node)=>{const point=position(node.id);return <g key={node.id}><rect x={point.x} y={point.y} width={200} height={78} rx={12} className="fill-surface stroke-hairline" /><text x={point.x+100} y={point.y+23} textAnchor="middle" className="fill-foreground" fontSize={12}>{(node.label.match(/.{1,24}/gu)??[""]).map((line,index)=><tspan key={index} x={point.x+100} dy={index===0?0:17}>{line}</tspan>)}</text></g>})}
      </svg>
    </div>
    <h3 className="mt-6 font-semibold">{copy("Componentes","Components","Componentes")} ({graph.nodes.length}/16)</h3>
    <ul className="mt-3 space-y-3">{graph.nodes.map((node)=><li data-node-id={node.id} key={node.id} className="flex flex-wrap items-end gap-3 rounded-xl border border-hairline p-3">
      <label className="min-w-40 flex-1 text-sm">{copy("Nome","Name","Nombre")} ({node.id})<input className={studioInput} maxLength={64} value={node.label} onChange={(event)=>changed({...graph,nodes:graph.nodes.map((item)=>item.id===node.id?{...item,label:event.target.value}:item)})} /></label>
      <button type="button" className={studioSecondary} data-remove-node disabled={graph.nodes.length<=1} aria-label={`${copy("Remover componente","Remove component","Eliminar componente")} ${node.label}`} onClick={()=>changed(removeGraphNode(graph,node.id))}>{copy("Remover","Remove","Eliminar")}</button>
    </li>)}</ul>
    <div className="mt-4 flex flex-wrap items-end gap-3"><label className="min-w-48 flex-1 text-sm">{copy("Novo componente","New component","Nuevo componente")}<input className={studioInput} maxLength={64} value={nodeLabel} onChange={(event)=>setNodeLabel(event.target.value)} /></label><button type="button" data-testid="diagram-add-node" className={studioButton} disabled={graph.nodes.length>=16 || !nodeLabel.trim()} onClick={()=>{const next=addGraphNode(graph,nodeLabel);if(next) changed(next);else setStatus(copy("Revise os nomes dos componentes.","Review component labels.","Revisa los nombres de los componentes."))}}>{copy("Adicionar componente","Add component","Añadir componente")}</button></div>
    <h3 className="mt-7 font-semibold">{copy("Conexões","Connections","Conexiones")} ({graph.edges.length}/32)</h3>
    <ul className="mt-3 space-y-3">{graph.edges.map((edge)=><li key={edge.id} className="flex flex-wrap items-end gap-3 rounded-xl border border-hairline p-3"><label className="min-w-40 flex-1 text-sm">{graph.nodes.find((node)=>node.id===edge.from)?.label} → {graph.nodes.find((node)=>node.id===edge.to)?.label}<input className={studioInput} maxLength={64} aria-label={`${copy("Nome da conexão","Connection label","Nombre de la conexión")} ${edge.id}`} value={edge.label} onChange={(event)=>changed({...graph,edges:graph.edges.map((item)=>item.id===edge.id?{...item,label:event.target.value}:item)})} /></label><button type="button" className={studioSecondary} aria-label={`${copy("Remover conexão","Remove connection","Eliminar conexión")} ${edge.id}`} onClick={()=>changed({...graph,edges:graph.edges.filter((item)=>item.id!==edge.id)})}>{copy("Remover","Remove","Eliminar")}</button></li>)}</ul>
    <div className="mt-4 grid items-end gap-3 sm:grid-cols-2">
      <label className="text-sm">{copy("Origem","From","Origen")}<select className={studioInput} value={from} onChange={(event)=>setFrom(event.target.value)}>{graph.nodes.map((node)=><option key={node.id} value={node.id}>{node.label}</option>)}</select></label>
      <label className="text-sm">{copy("Destino","To","Destino")}<select className={studioInput} value={to} onChange={(event)=>setTo(event.target.value)}>{graph.nodes.map((node)=><option key={node.id} value={node.id}>{node.label}</option>)}</select></label>
      <label className="text-sm">{copy("Nome da conexão (opcional)","Connection label (optional)","Nombre de la conexión (opcional)")}<input className={studioInput} maxLength={64} value={edgeLabel} onChange={(event)=>setEdgeLabel(event.target.value)} /></label>
      <button type="button" className={studioSecondary} data-testid="diagram-add-edge" disabled={graph.edges.length>=32 || graph.nodes.length<2} onClick={()=>{const next=addGraphEdge(graph,from,to,edgeLabel);if(next) changed(next);else setStatus(copy("Use componentes diferentes, sem repetir uma conexão. Revise também nomes vazios.","Use different components without repeating a connection. Also check for empty labels.","Usa componentes diferentes sin repetir conexiones. Revisa también nombres vacíos."))}}>{copy("Adicionar conexão","Add connection","Añadir conexión")}</button>
    </div>
    <div className="mt-6 flex flex-wrap gap-3">
      <button type="button" className={studioSecondary} data-testid="diagram-reset" onClick={()=>reset()}>{copy("Restaurar caso inicial","Reset to case study","Restaurar caso inicial")}</button>
      <button type="button" className={studioSecondary} onClick={()=>setStatus(valid?copy("Diagrama válido.","Graph is valid.","Diagrama válido."):copy("Há nomes vazios ou conexões inválidas.","There are empty labels or invalid connections.","Hay nombres vacíos o conexiones inválidas."))}>{copy("Validar","Validate","Validar")}</button>
      <button type="button" className={studioSecondary} disabled={!valid} data-testid="diagram-mermaid" onClick={()=>exportGraph("mmd")}>Mermaid</button>
      <button type="button" className={studioSecondary} disabled={!valid} data-testid="diagram-svg" onClick={()=>exportGraph("svg")}>SVG</button>
    </div>
    {exported && <div className="mt-5"><label className="text-sm">{copy("Exportação segura","Safe export","Exportación segura")}<textarea data-testid="diagram-export" className={`${studioInput} font-mono`} readOnly rows={8} value={exported} onFocus={(event)=>event.target.select()} /></label><button type="button" className={`${studioSecondary} mt-3`} onClick={()=>{if(!downloadStudioText(`architecture-${caseId}.${format}`,exported,format==="svg"?"image/svg+xml":"text/plain")) setStatus(copy("Download indisponível. Copie o conteúdo do campo.","Download unavailable. Copy the field contents.","Descarga no disponible. Copia el contenido del campo."))}}>{copy("Baixar arquivo","Download file","Descargar archivo")}</button></div>}
    <p role="status" aria-live="polite" className="mt-4 text-sm text-muted-foreground">{status || (!valid?copy("Complete todos os nomes para validar e exportar.","Complete all labels to validate and export.","Completa todos los nombres para validar y exportar."):"")}</p>
  </section>
}
