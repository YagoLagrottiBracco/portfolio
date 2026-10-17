"use client"

import React, {useEffect,useState} from "react"
import type {Locale} from "@/lib/i18n"
import {challenges,gradeChallenge} from "@/data/resources/challenges"
import {readStudioStorage,studioBrowserStorage,writeStudioStorage} from "@/lib/resource-studio"
import {studioButton,studioSecondary,studioPanel,studioCopy,studioInput} from "@/lib/resource-studio-ui"

export function ChallengeStudio({locale}:{locale:Locale}) {
  const copy=studioCopy(locale)
  const [index,setIndex]=useState(0),[answer,setAnswer]=useState(""),[hints,setHints]=useState(0)
  const [result,setResult]=useState<boolean|null>(null),[completed,setCompleted]=useState<string[]>([]),[storageFailed,setStorageFailed]=useState(false)
  const challenge=challenges[index]
  useEffect(()=>{
    const stored=readStudioStorage(studioBrowserStorage(),"resource-challenges-v1")
    setStorageFailed(!stored.ok)
    if(Array.isArray(stored.value)) setCompleted([...new Set(stored.value.filter((id):id is string=>typeof id==="string" && challenges.some((item)=>item.id===id)))])
  },[])
  function persist(next:string[]) {setCompleted(next);setStorageFailed(!writeStudioStorage(studioBrowserStorage(),"resource-challenges-v1",next))}
  function choose(next:number) {setIndex(next);setAnswer("");setHints(0);setResult(null)}
  return <section className={studioPanel} aria-label={copy("Desafios técnicos","Technical challenges","Desafíos técnicos")}>
    <p className="text-sm text-muted-foreground">{copy("Respostas corrigidas por regras determinísticas. Nenhum código é executado. O progresso fica apenas neste navegador; não é uma certificação.","Answers are checked by deterministic rules. No code is executed. Progress stays only in this browser; this is not a certification.","Las respuestas se corrigen con reglas deterministas. No se ejecuta código. El progreso queda solo en este navegador; no es una certificación.")}</p>
    <p data-testid="challenge-progress" className="mt-3 font-medium">{completed.length} / {challenges.length} {copy("concluídos","completed","completados")}</p>
    <label className="mt-5 block text-sm">{copy("Escolha um desafio","Choose a challenge","Elige un desafío")}<select className={studioInput} value={index} onChange={(event)=>choose(Number(event.target.value))}>{challenges.map((item,itemIndex)=><option key={item.id} value={itemIndex}>{itemIndex+1}. {item.title[locale]}{completed.includes(item.id)?" ✓":""}</option>)}</select></label>
    <h3 className="mt-6 text-xl font-semibold">{challenge.title[locale]}</h3>
    <p className="mt-3 leading-relaxed">{challenge.prompt[locale]}</p>
    <fieldset className="mt-5 grid gap-3"><legend className="sr-only">{copy("Sua resposta","Your answer","Tu respuesta")}</legend>{challenge.options.map((option)=><label key={option.id} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-background p-3"><input type="radio" name="challenge-answer" data-option-id={option.id} className="mt-1 accent-brand" checked={answer===option.id} onChange={()=>{setAnswer(option.id);setResult(null)}} /><span>{option.label[locale]}</span></label>)}</fieldset>
    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" className={studioButton} data-testid="challenge-grade" disabled={!answer} onClick={()=>{const correct=gradeChallenge(challenge.id,answer);setResult(correct);if(correct && !completed.includes(challenge.id)) persist([...completed,challenge.id])}}>{copy("Corrigir resposta","Check answer","Corregir respuesta")}</button>
      <button type="button" className={studioSecondary} data-testid="challenge-hint" disabled={hints>=challenge.hints.length} onClick={()=>setHints((value)=>value+1)}>{copy("Próxima dica","Next hint","Siguiente pista")} ({hints}/{challenge.hints.length})</button>
      <button type="button" className={studioSecondary} onClick={()=>choose((index+1)%challenges.length)}>{copy("Próximo desafio","Next challenge","Siguiente desafío")}</button>
    </div>
    {hints>0 && <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-muted-foreground">{challenge.hints.slice(0,hints).map((hint,hintIndex)=><li key={hintIndex}>{hint[locale]}</li>)}</ol>}
    <div data-testid="challenge-result" role="status" aria-live="polite" className="mt-5">{result!==null && <><p className="font-semibold">{result?copy("Correto!","Correct!","¡Correcto!"):copy("Ainda não. Revise a explicação e tente novamente.","Not yet. Review the explanation and try again.","Todavía no. Revisa la explicación e inténtalo de nuevo.")}</p><p className="mt-2 leading-relaxed text-muted-foreground">{challenge.explanation[locale]}</p></>}</div>
    <button type="button" data-testid="challenge-reset" className={`${studioSecondary} mt-6`} onClick={()=>{persist([]);choose(0)}}>{copy("Apagar progresso local","Reset local progress","Borrar progreso local")}</button>
    <p role="status" className="mt-3 text-sm text-muted-foreground">{storageFailed?copy("O armazenamento local está indisponível. O progresso desta sessão funciona, mas pode ser perdido ao sair.","Local storage is unavailable. Session progress works but may be lost when you leave.","El almacenamiento local no está disponible. El progreso de la sesión funciona, pero puede perderse al salir."):""}</p>
  </section>
}
