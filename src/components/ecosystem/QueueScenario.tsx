"use client"

import React, { useEffect, useState } from "react"
import type { Locale } from "@/lib/i18n"
import { decodeQueueScenario, queueScenarioUrl, type QueueScenarioConfig } from "@/lib/resource-studio"
import { studioCopy, studioInput, studioSecondary } from "@/lib/resource-studio-ui"

export function QueueScenario({locale,config,onApply}:{locale:Locale;config:Omit<QueueScenarioConfig,"steps">;onApply:(scenario:QueueScenarioConfig)=>void}) {
  const copy=studioCopy(locale)
  const [steps,setSteps]=useState(10)
  const [pending,setPending]=useState<QueueScenarioConfig|null>(null)
  const [invalid,setInvalid]=useState(false)
  const [url,setUrl]=useState("")
  const [copyFailed,setCopyFailed]=useState(false)
  useEffect(()=>{
    const params=new URLSearchParams(window.location.search)
    if(!params.has("queue")) return
    const imported=decodeQueueScenario(window.location.search)
    setPending(imported);setInvalid(!imported)
    if(imported) setSteps(imported.steps)
  },[])
  const limits=copy("Limites: 0–50 entradas, 1–50 workers, 0–100% de falhas, 0–500 passos.","Limits: 0–50 arrivals, 1–50 workers, 0–100% failures, 0–500 steps.","Límites: 0–50 entradas, 1–50 workers, 0–100% de fallos, 0–500 pasos.")
  return <div className="mt-6 border-t border-hairline pt-5">
    <h3 className="font-semibold">{copy("Compartilhar cenário","Share a scenario","Compartir escenario")}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{copy("O link reproduz os parâmetros atuais a partir de uma fila vazia, pelo número de passos escolhido. Ele não registra mudanças anteriores na configuração. Apenas parâmetros sintéticos entram no link.","The link replays the current parameters from an empty queue for your chosen number of steps. It does not record earlier configuration changes. Only synthetic parameters enter the link.","El enlace reproduce los parámetros actuales desde una cola vacía durante los pasos elegidos. No registra cambios anteriores de configuración. Solo incluye parámetros sintéticos.")}</p>
    <p className="mt-2 text-sm text-muted-foreground">{limits}</p>
    {pending && <div className="mt-4 rounded-xl border border-hairline bg-background p-4">
      <p className="text-sm">{copy("Cenário recebido","Received scenario","Escenario recibido")}: {pending.arrivals} / {pending.workers} / {pending.failurePercent}% · {pending.steps} {copy("passos","steps","pasos")}</p>
      <button type="button" data-testid="scenario-apply" className={`${studioSecondary} mt-3`} onClick={()=>{onApply(pending);setPending(null);setUrl("")}}>{copy("Aplicar cenário e reiniciar","Apply scenario and reset","Aplicar escenario y reiniciar")}</button>
    </div>}
    <div className="mt-4 flex flex-wrap items-end gap-3">
      <label className="max-w-56 text-sm">{copy("Passos para reproduzir","Steps to replay","Pasos a reproducir")}<input type="number" min={0} max={500} step={1} value={steps} className={studioInput} onChange={(event)=>{setSteps(Math.max(0,Math.min(500,Math.floor(Number(event.target.value)||0))));setUrl("")}} /></label>
      <button type="button" data-testid="scenario-share" className={studioSecondary} onClick={()=>{
        try {setUrl(queueScenarioUrl(window.location.href,{...config,steps}));setInvalid(false);setCopyFailed(false)} catch {setInvalid(true);setUrl("")}
      }}>{copy("Gerar link","Generate link","Generar enlace")}</button>
    </div>
    {url && <div className="mt-4"><label className="block text-sm">{copy("Link do cenário","Scenario link","Enlace del escenario")}<textarea data-testid="scenario-url" readOnly value={url} rows={3} className={`${studioInput} font-mono`} onFocus={(event)=>event.target.select()} /></label><button type="button" className={`${studioSecondary} mt-2`} onClick={async()=>{try {await navigator.clipboard.writeText(url);setCopyFailed(false)} catch {setCopyFailed(true)}}}>{copy("Copiar link","Copy link","Copiar enlace")}</button></div>}
    <p role="status" aria-live="polite" className="mt-3 text-sm text-muted-foreground">{invalid ? copy("Cenário inválido ou fora dos limites. A simulação não foi alterada.","Invalid or out-of-range scenario. The simulation was not changed.","Escenario inválido o fuera de límites. La simulación no se modificó.") : copyFailed ? copy("Não foi possível copiar. Selecione e copie o link no campo acima.","Could not copy. Select and copy the link in the field above.","No se pudo copiar. Selecciona y copia el enlace del campo superior.") : ""}</p>
  </div>
}
