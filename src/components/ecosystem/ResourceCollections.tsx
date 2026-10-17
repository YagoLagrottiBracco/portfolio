"use client"

import React, {useEffect,useState} from "react"
import type {Locale} from "@/lib/i18n"
import {collectionMarkdown,collectionUrl,decodeCollection,downloadStudioText,readStudioStorage,studioBrowserStorage,writeStudioStorage,type StudioCollection,type StudioResource} from "@/lib/resource-studio"
import {studioButton,studioCopy,studioInput,studioPanel,studioSecondary} from "@/lib/resource-studio-ui"

export function ResourceCollections({locale,resources}:{locale:Locale;resources:StudioResource[]}) {
  const copy=studioCopy(locale)
  const blank=()=>({name:copy("Minha coleção","My collection","Mi colección"),ids:[] as string[]})
  const [current,setCurrent]=useState<StudioCollection>(blank)
  const [saved,setSaved]=useState<StudioCollection[]>([]),[pending,setPending]=useState<StudioCollection|null>(null)
  const [importText,setImportText]=useState(""),[search,setSearch]=useState(""),[exported,setExported]=useState(""),[exportKind,setExportKind]=useState<"url"|"md">("md")
  const [storageFailed,setStorageFailed]=useState(false),[status,setStatus]=useState("")
  useEffect(()=>{
    const stored=readStudioStorage(studioBrowserStorage(),"resource-collections-v1")
    setStorageFailed(!stored.ok)
    if(stored.value!==null) {
      const decoded=Array.isArray(stored.value) && stored.value.length<=10 ? stored.value.map((value)=>decodeCollection(JSON.stringify(value),resources)) : null
      if(decoded && decoded.every((value):value is StudioCollection=>value!==null) && new Set(decoded.map((value)=>value.name)).size===decoded.length) setSaved(decoded)
      else setStorageFailed(true)
    }
    const params=new URLSearchParams(window.location.search)
    if(params.has("collection")) {
      const value=params.getAll("collection").length===1?decodeCollection(params.get("collection")!,resources):null
      setPending(value)
      if(!value) setStatus(copy("Importação inválida: confira o tamanho e os IDs do catálogo.","Invalid import: check payload size and catalogue IDs.","Importación inválida: revisa el tamaño y los IDs del catálogo."))
    }
    // Locale and catalogue changes belong to a newly rendered resource page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[resources])
  function update(next:StudioCollection) {setCurrent(next);setExported("");setStatus("")}
  function persist(next:StudioCollection[]) {setSaved(next);const ok=writeStudioStorage(studioBrowserStorage(),"resource-collections-v1",next);setStorageFailed(!ok);return ok}
  function invalidImport() {setPending(null);setStatus(copy("Importação inválida: confira o tamanho e os IDs do catálogo.","Invalid import: check payload size and catalogue IDs.","Importación inválida: revisa el tamaño y los IDs del catálogo."))}
  function reviewImport() {
    if(importText.length>24000) {invalidImport();return}
    let source=importText.trim()
    if(!source.startsWith("{")) {
      try {const url=new URL(source);if(!["https:","http:"].includes(url.protocol) || url.searchParams.getAll("collection").length!==1) {invalidImport();return};source=url.searchParams.get("collection")!} catch {invalidImport();return}
    }
    const value=decodeCollection(source,resources)
    if(!value) {invalidImport();return}
    setPending(value);setStatus("")
  }
  const selected=current.ids.map((id)=>resources.find((resource)=>resource.id===id)).filter((resource):resource is StudioResource=>Boolean(resource))
  const visible=resources.filter((resource)=>`${resource.title} ${resource.id}`.toLocaleLowerCase(locale).includes(search.toLocaleLowerCase(locale)))
  return <section className={studioPanel} aria-label={copy("Coleções pessoais","Personal collections","Colecciones personales")}>
    <p className="text-sm text-muted-foreground">{copy("Organize recursos reais do catálogo em até 10 coleções locais, com 40 itens cada. Salve explicitamente para manter uma coleção neste navegador. Links compartilhados contêm o nome público e os IDs escolhidos; use um nome sem informações privadas.","Organize real catalogue resources in up to 10 local collections of 40 items each. Save explicitly to keep a collection in this browser. Shared links contain the public name and selected IDs; choose a name without private information.","Organiza recursos reales del catálogo en hasta 10 colecciones locales de 40 elementos. Guarda explícitamente para conservar una colección en este navegador. Los enlaces incluyen el nombre público y los IDs; elige un nombre sin información privada.")}</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      <label className="text-sm">{copy("Nome da coleção (até 80 caracteres)","Collection name (up to 80 characters)","Nombre de la colección (hasta 80 caracteres)")}<input data-testid="collection-name" className={studioInput} maxLength={80} value={current.name} onChange={(event)=>update({...current,name:event.target.value})} /></label>
      <label className="text-sm">{copy("Abrir coleção salva","Open a saved collection","Abrir colección guardada")}<select className={studioInput} value="" onChange={(event)=>{const next=saved.find((value)=>value.name===event.target.value);if(next) update({...next,ids:[...next.ids]})}}><option value="">{copy("Selecionar…","Select…","Seleccionar…")}</option>{saved.map((value)=><option key={value.name} value={value.name}>{value.name} ({value.ids.length})</option>)}</select></label>
    </div>
    <div className="mt-4 flex flex-wrap gap-3">
      <button type="button" data-testid="collection-save" className={studioButton} disabled={!current.name.trim()} onClick={()=>{
        const value=decodeCollection(JSON.stringify(current),resources)
        if(!value) {invalidImport();return}
        if(saved.length>=10 && !saved.some((item)=>item.name===value.name)) {setStatus(copy("Limite de 10 coleções. Remova uma coleção antes de salvar outra.","Limit of 10 collections. Remove a collection before saving another.","Límite de 10 colecciones. Elimina una antes de guardar otra."));return}
        update(value)
        const next=[...saved.filter((item)=>item.name!==value.name),value]
        if(persist(next)) setStatus(copy("Coleção salva neste navegador.","Collection saved in this browser.","Colección guardada en este navegador."))
      }}>{copy("Salvar coleção nomeada","Save named collection","Guardar colección con nombre")}</button>
      <button type="button" className={studioSecondary} onClick={()=>update(blank())}>{copy("Nova coleção","New collection","Nueva colección")}</button>
      <button type="button" className={studioSecondary} disabled={!saved.some((item)=>item.name===current.name.trim())} onClick={()=>{persist(saved.filter((item)=>item.name!==current.name.trim()));update(blank())}}>{copy("Excluir coleção salva","Delete saved collection","Eliminar colección guardada")}</button>
    </div>
    <h3 className="mt-7 font-semibold">{copy("Selecionados","Selected","Seleccionados")} ({current.ids.length}/40)</h3>
    {selected.length===0 && <p className="mt-2 text-sm text-muted-foreground">{copy("Adicione recursos do catálogo abaixo.","Add catalogue resources below.","Añade recursos del catálogo debajo.")}</p>}
    <ul className="mt-3 space-y-2">{selected.map((resource)=><li key={resource.id} data-selected-resource className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-background p-3"><a className="text-brand underline underline-offset-4" href={resource.url}>{resource.title}</a><button type="button" data-testid="collection-remove-resource" className={studioSecondary} aria-label={`${copy("Remover","Remove","Eliminar")} ${resource.title}`} onClick={()=>update({...current,ids:current.ids.filter((id)=>id!==resource.id)})}>{copy("Remover","Remove","Eliminar")}</button></li>)}</ul>
    <label className="mt-6 block text-sm">{copy("Buscar no catálogo","Search catalogue","Buscar en el catálogo")}<input type="search" className={studioInput} maxLength={100} value={search} onChange={(event)=>setSearch(event.target.value)} /></label>
    <p className="mt-2 text-sm text-muted-foreground">{visible.length} {copy("recursos encontrados","resources found","recursos encontrados")}</p>
    <div className="mt-3 max-h-80 overflow-y-auto rounded-xl border border-hairline bg-background p-3"><ul className="space-y-2">{visible.map((resource)=><li key={resource.id}><label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-surface-hover"><input type="checkbox" data-resource-id={resource.id} className="accent-brand" checked={current.ids.includes(resource.id)} disabled={current.ids.length>=40 && !current.ids.includes(resource.id)} onChange={(event)=>update({...current,ids:event.target.checked?[...current.ids,resource.id]:current.ids.filter((id)=>id!==resource.id)})} /><span className="text-sm">{resource.title}<span className="block text-xs text-muted-foreground">{resource.id}</span></span></label></li>)}</ul>{!resources.length && <p className="text-sm text-muted-foreground">{copy("O catálogo não está disponível nesta página.","The catalogue is unavailable on this page.","El catálogo no está disponible en esta página.")}</p>}</div>
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" className={studioSecondary} data-testid="collection-share" onClick={()=>{try {setExported(collectionUrl(window.location.href,current,resources));setExportKind("url");setStatus("")} catch {invalidImport()}}}>{copy("Gerar link público","Generate public link","Generar enlace público")}</button>
      <button type="button" className={studioSecondary} data-testid="collection-markdown" onClick={()=>{try {setExported(collectionMarkdown(current,resources));setExportKind("md");setStatus("")} catch {invalidImport()}}}>{copy("Exportar Markdown","Export Markdown","Exportar Markdown")}</button>
    </div>
    {exported && <div className="mt-4"><label className="text-sm">{exportKind==="url"?copy("Link para compartilhar","Shareable link","Enlace para compartir"):"Markdown"}<textarea data-testid="collection-export" className={`${studioInput} font-mono`} readOnly rows={5} value={exported} onFocus={(event)=>event.target.select()} /></label><div className="mt-3 flex flex-wrap gap-3"><button type="button" className={studioSecondary} onClick={async()=>{try {await navigator.clipboard.writeText(exported);setStatus(copy("Copiado.","Copied.","Copiado."))} catch {setStatus(copy("Selecione e copie o conteúdo do campo.","Select and copy the field contents.","Selecciona y copia el contenido del campo."))}}}>{copy("Copiar","Copy","Copiar")}</button>{exportKind==="md" && <button type="button" className={studioSecondary} onClick={()=>{if(!downloadStudioText("resource-collection.md",exported,"text/markdown")) setStatus(copy("Download indisponível. Copie o conteúdo.","Download unavailable. Copy the contents.","Descarga no disponible. Copia el contenido."))}}>{copy("Baixar Markdown","Download Markdown","Descargar Markdown")}</button>}</div></div>}
    <div className="mt-7 border-t border-hairline pt-5"><h3 className="font-semibold">{copy("Importar uma coleção","Import a collection","Importar una colección")}</h3><label className="mt-3 block text-sm">{copy("Cole um link ou JSON (máximo 24.000 caracteres no link)","Paste a link or JSON (maximum 24,000 link characters)","Pega un enlace o JSON (máximo 24.000 caracteres en el enlace)")}<textarea className={studioInput} data-testid="collection-import-input" maxLength={24000} rows={3} value={importText} onChange={(event)=>{setImportText(event.target.value);setPending(null)}} /></label><button type="button" className={`${studioSecondary} mt-3`} disabled={!importText.trim()} onClick={reviewImport}>{copy("Revisar importação","Review import","Revisar importación")}</button>
      {pending && <div className="mt-4 rounded-xl border border-hairline bg-background p-4"><p>{pending.name} · {pending.ids.length} {copy("recursos verificados","verified resources","recursos verificados")}</p><button type="button" className={`${studioButton} mt-3`} data-testid="collection-import" onClick={()=>{update(pending);setPending(null);setImportText("")}}>{copy("Importar para edição","Import for editing","Importar para editar")}</button></div>}
    </div>
    <button type="button" className={`${studioSecondary} mt-6`} data-testid="collection-reset" onClick={()=>{persist([]);update(blank());setPending(null);setImportText("")}}>{copy("Apagar todas as coleções locais","Reset all local collections","Borrar todas las colecciones locales")}</button>
    <p role="status" aria-live="polite" className="mt-4 text-sm text-muted-foreground">{status}</p>
    {storageFailed && <p role="status" className="mt-3 text-sm text-muted-foreground">{copy("O armazenamento local falhou ou contém dados inválidos. Você pode editar, compartilhar e exportar nesta sessão, mas as alterações podem não persistir.","Local storage failed or contains invalid data. You can edit, share and export in this session, but changes may not persist.","El almacenamiento local falló o contiene datos inválidos. Puedes editar, compartir y exportar en esta sesión, pero los cambios pueden no persistir.")}</p>}
  </section>
}
