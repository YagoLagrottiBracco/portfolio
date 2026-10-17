import assert from "node:assert/strict"
import test from "node:test"
import React, { act } from "react"
import { createRoot } from "react-dom/client"
import { renderToStaticMarkup } from "react-dom/server"
import { Window } from "happy-dom"
import { CorrectionProposal } from "../src/components/ecosystem/CorrectionProposal"
import { ParticipationResources } from "../src/components/ecosystem/ParticipationResources"

const pageUrl="https://lagrotti.dev/en/recursos/ferramentas/json"
test("correction controls render actual page context and no outbound issue draft before submit",()=>{
  const html=renderToStaticMarkup(<CorrectionProposal locale="en" pageUrl={pageUrl} title="Actual title"/>)
  assert.match(html,/Actual title/)
  assert.match(html,/Original excerpt/)
  assert.match(html,/https:\/\/lagrotti.dev\/en\/recursos\/ferramentas\/json/)
  assert.doesNotMatch(html,/href="https:\/\/github.com/)
  for(const locale of ["pt","en","es"] as const){
    const content=renderToStaticMarkup(<ParticipationResources kind="contribuicoes" locale={locale}/>)
    assert.doesNotMatch(content,/vmageste-dashboard/)
    assert.match(content,/is%3Apublic/)
    assert.match(content,/2026-10-17/)
  }
})
test("selection capture updates the actual excerpt only after the visitor clicks",async()=>{
  const window=new Window({url:pageUrl})
  const globals=["window","document","navigator","HTMLElement","Event","IS_REACT_ACT_ENVIRONMENT"] as const
  const saved=new Map(globals.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]))
  for(const key of globals)Object.defineProperty(globalThis,key,{configurable:true,value:key==="IS_REACT_ACT_ENVIRONMENT"?true:key==="window"?window:window[key]})
  const container=window.document.createElement("div");window.document.body.append(container)
  const root=createRoot(container as unknown as HTMLElement)
  try{
    await act(async()=>root.render(<CorrectionProposal locale="en" pageUrl={pageUrl}/>))
    const paragraph=window.document.createElement("p");paragraph.textContent="An actual selected paragraph";window.document.body.append(paragraph)
    const range=window.document.createRange();range.selectNodeContents(paragraph)
    window.getSelection().removeAllRanges();window.getSelection().addRange(range)
    const textarea=container.querySelector("textarea")!
    assert.equal(textarea.value,"")
    await act(async()=>container.querySelector("button")!.click())
    assert.equal(textarea.value,"An actual selected paragraph")
    assert.equal(container.querySelector('a[href^="https://github.com"]'),null)
  }finally{
    await act(async()=>root.unmount());await window.happyDOM.abort()
    for(const key of globals){const descriptor=saved.get(key);if(descriptor)Object.defineProperty(globalThis,key,descriptor);else Reflect.deleteProperty(globalThis,key)}
  }
})
