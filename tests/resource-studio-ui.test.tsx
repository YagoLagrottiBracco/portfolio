import assert from "node:assert/strict"
import test from "node:test"
import {act, createElement, type ReactNode} from "react"
import {createRoot} from "react-dom/client"
import {Window} from "happy-dom"
import {StudioResources} from "../src/components/ecosystem/StudioResources"
import {collectionUrl} from "../src/lib/resource-studio"

const resources=[{id:"ferramentas/json",title:"JSON comparator",url:"/en/recursos/ferramentas/json"}]
async function mounted(node:ReactNode,url:string,run:(container:HTMLElement,window:Window)=>Promise<void>) {
  const window=new Window({url})
  const globals=["window","document","navigator","HTMLElement","Event","IS_REACT_ACT_ENVIRONMENT"] as const
  const saved=new Map(globals.map((key)=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]))
  for(const key of globals) Object.defineProperty(globalThis,key,{configurable:true,value:key==="IS_REACT_ACT_ENVIRONMENT"?true:key==="window"?window:window[key]})
  const container=window.document.createElement("div");window.document.body.append(container)
  const root=createRoot(container as unknown as HTMLElement)
  try {
    await act(async()=>{root.render(node)})
    await run(container as unknown as HTMLElement,window)
  } finally {
    await act(async()=>{root.unmount()});await window.happyDOM.abort()
    for(const key of globals) {const descriptor=saved.get(key);if(descriptor) Object.defineProperty(globalThis,key,descriptor);else Reflect.deleteProperty(globalThis,key)}
  }
}
const click=async(container:HTMLElement,selector:string)=>{const button=container.querySelector<HTMLElement>(selector);assert.ok(button,selector);await act(async()=>{button.click()})}

test("scenario import waits for explicit application and preserves queue controls",async()=>{
  await mounted(createElement(StudioResources,{kind:"cenarios",locale:"en"}),"https://example.com/en/recursos/ecossistema/cenarios?queue=1&arrivals=4&workers=2&failures=0&steps=3",async(container)=>{
    assert.equal(container.querySelector('[data-testid="queue-backlog"]')?.textContent,"0")
    await click(container,'[data-testid="scenario-apply"]')
    assert.equal(container.querySelector('[data-testid="queue-backlog"]')?.textContent,"6")
    await click(container,'[data-testid="queue-step"]')
    assert.equal(container.querySelector('[data-testid="queue-backlog"]')?.textContent,"8")
    await click(container,'[data-testid="scenario-share"]')
    assert.match(container.querySelector<HTMLTextAreaElement>('[data-testid="scenario-url"]')!.value,/arrivals=4&workers=2&failures=0&steps=3/)
  })
})

test("challenge feedback, progressive hints and reset update real local progress",async()=>{
  await mounted(createElement(StudioResources,{kind:"desafios",locale:"en"}),"https://example.com",async(container,window)=>{
    await click(container,'[data-testid="challenge-hint"]')
    assert.match(container.textContent!,/Compare arrivals and capacity/)
    await click(container,'[data-option-id="50"]')
    await click(container,'[data-testid="challenge-grade"]')
    assert.match(container.querySelector('[data-testid="challenge-result"]')?.textContent??"",/Correct/)
    assert.match(container.querySelector('[data-testid="challenge-progress"]')?.textContent??"",/1 \/ 6/)
    assert.match(window.localStorage.getItem("resource-challenges-v1")!,/queue-capacity/)
    await click(container,'[data-testid="challenge-reset"]')
    assert.match(container.querySelector('[data-testid="challenge-progress"]')?.textContent??"",/0 \/ 6/)
  })
})

test("case diagram editor adds and removes components and resets the actual seed",async()=>{
  await mounted(createElement(StudioResources,{kind:"editor-diagramas",locale:"en"}),"https://example.com",async(container)=>{
    const initial=container.querySelectorAll('[data-node-id]').length
    assert.ok(initial>1)
    await click(container,'[data-testid="diagram-add-node"]')
    assert.equal(container.querySelectorAll('[data-node-id]').length,initial+1)
    await click(container,'[data-node-id]:last-child [data-remove-node]')
    assert.equal(container.querySelectorAll('[data-node-id]').length,initial)
    await click(container,'[data-testid="diagram-mermaid"]')
    assert.match(container.querySelector<HTMLTextAreaElement>('[data-testid="diagram-export"]')!.value,/^flowchart LR/)
    await click(container,'[data-testid="diagram-reset"]')
    assert.equal(container.querySelectorAll('[data-node-id]').length,initial)
  })
})

test("collection import is explicit and named collections survive local saves",async()=>{
  const url=collectionUrl("https://example.com/en/recursos/ecossistema/colecoes",{name:"Study",ids:["ferramentas/json"]},resources)
  await mounted(createElement(StudioResources,{kind:"colecoes",locale:"en",resources}),url,async(container,window)=>{
    assert.equal(container.querySelectorAll('[data-selected-resource]').length,0)
    await click(container,'[data-testid="collection-import"]')
    assert.equal(container.querySelectorAll('[data-selected-resource]').length,1)
    await click(container,'[data-testid="collection-save"]')
    assert.match(window.localStorage.getItem("resource-collections-v1")!,/Study/)
    await click(container,'[data-testid="collection-markdown"]')
    assert.match(container.querySelector<HTMLTextAreaElement>('[data-testid="collection-export"]')!.value,/JSON comparator/)
    await click(container,'[data-testid="collection-remove-resource"]')
    assert.equal(container.querySelectorAll('[data-selected-resource]').length,0)
    await click(container,'[data-testid="collection-reset"]')
    assert.equal(window.localStorage.getItem("resource-collections-v1"),"[]")
  })
})

test("invalid shared collection IDs cannot add links or overwrite the current collection",async()=>{
  const query=new URLSearchParams({collection:JSON.stringify({name:"Malicious",ids:["https://evil.test"]})})
  await mounted(createElement(StudioResources,{kind:"colecoes",locale:"es",resources}),`https://example.com/recursos/ecossistema/colecoes?${query}`,async(container)=>{
    assert.equal(container.querySelector('[data-testid="collection-import"]'),null)
    assert.equal(container.querySelectorAll('[data-selected-resource]').length,0)
    assert.ok(!container.querySelector('a[href*="evil"]'))
    assert.match(container.textContent!,/Importación inválida/)
  })
})

test("blocked storage leaves collection editing and explicit exports usable",async()=>{
  await mounted(createElement(StudioResources,{kind:"colecoes",locale:"en",resources}),"https://example.com",async(container,window)=>{
    Object.defineProperty(window,"localStorage",{configurable:true,get(){throw new Error("blocked")}})
    await click(container,'[data-resource-id="ferramentas/json"]')
    await click(container,'[data-testid="collection-save"]')
    assert.equal(container.querySelectorAll('[data-selected-resource]').length,1)
    assert.match(container.textContent!,/Local storage failed/)
    await click(container,'[data-testid="collection-share"]')
    assert.match(container.querySelector<HTMLTextAreaElement>('[data-testid="collection-export"]')!.value,/collection=/)
  })
})
