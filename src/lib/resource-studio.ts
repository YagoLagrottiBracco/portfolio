import type { Locale } from "@/lib/i18n"
import { advanceQueue, initialQueue } from "@/lib/resource-tools"
import { SITE_URL } from "@/lib/site"

export interface QueueScenarioConfig {
  arrivals: number
  workers: number
  failurePercent: number
  steps: number
}
function integer(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max
}
function validScenario(value: QueueScenarioConfig) {
  return integer(value.arrivals,0,50) && integer(value.workers,1,50) && integer(value.failurePercent,0,100) && integer(value.steps,0,500)
}
function shareBase(base:string):URL {
  const url=new URL(base)
  if(!["https:","http:"].includes(url.protocol) || url.username || url.password) throw new Error("Invalid share URL")
  url.hash=""
  return url
}
export function decodeQueueScenario(search: string): QueueScenarioConfig | null {
  if (search.length > 2048) return null
  const params = new URLSearchParams(search)
  const keys = ["queue", "arrivals", "workers", "failures", "steps"]
  if (keys.some((key) => params.getAll(key).length !== 1) || params.get("queue") !== "1") return null
  if (keys.slice(1).some((key) => !/^\d{1,3}$/.test(params.get(key)!))) return null
  const value = {arrivals:Number(params.get("arrivals")),workers:Number(params.get("workers")),failurePercent:Number(params.get("failures")),steps:Number(params.get("steps"))}
  return validScenario(value) ? value : null
}
export function queueScenarioUrl(base: string, value: QueueScenarioConfig): string {
  if (!validScenario(value)) throw new Error("Invalid scenario")
  const url = shareBase(base)
  url.search = new URLSearchParams({queue:"1",arrivals:String(value.arrivals),workers:String(value.workers),failures:String(value.failurePercent),steps:String(value.steps)}).toString()
  url.hash = ""
  return url.toString()
}
export function replayQueueScenario(value: QueueScenarioConfig) {
  if (!validScenario(value)) throw new Error("Invalid scenario")
  let state = initialQueue()
  for(let i=0;i<value.steps;i++) state = advanceQueue(state, value)
  return state
}

export interface StudioNode {id:string;label:string}
export interface StudioEdge {id:string;from:string;to:string;label:string}
export interface StudioGraph {nodes:StudioNode[];edges:StudioEdge[]}
function object(value: unknown): value is Record<string,unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}
function safeLabel(value: unknown, empty = false): value is string {
  return typeof value === "string" && value.length <= 64 && (empty || value.trim().length > 0) && !/[\u0000-\u001f\u007f]/.test(value)
}
export function validateGraph(value: unknown): StudioGraph | null {
  if (!object(value) || !Array.isArray(value.nodes) || !Array.isArray(value.edges) || value.nodes.length < 1 || value.nodes.length > 16 || value.edges.length > 32) return null
  const ids = new Set<string>(), edgeIds = new Set<string>(), pairs = new Set<string>()
  for(const node of value.nodes) {
    if(!object(node) || typeof node.id !== "string" || !/^n[1-9]\d{0,5}$/.test(node.id) || ids.has(node.id) || !safeLabel(node.label)) return null
    ids.add(node.id)
  }
  for(const edge of value.edges) {
    if(!object(edge) || typeof edge.id !== "string" || !/^e[1-9]\d{0,5}$/.test(edge.id) || edgeIds.has(edge.id) || typeof edge.from !== "string" || typeof edge.to !== "string" || !ids.has(edge.from) || !ids.has(edge.to) || edge.from === edge.to || !safeLabel(edge.label,true)) return null
    const pair = `${edge.from}:${edge.to}`
    if(pairs.has(pair)) return null
    pairs.add(pair); edgeIds.add(edge.id)
  }
  return {nodes:value.nodes.map(({id,label})=>({id,label})),edges:value.edges.map(({id,from,to,label})=>({id,from,to,label}))}
}
export function seedCaseGraph(stages: {title:Record<Locale,string>}[],locale:Locale): StudioGraph {
  const nodes = stages.slice(0,16).map((stage,index)=>({id:`n${index+1}`,label:stage.title[locale].replace(/[\u0000-\u001f\u007f]/g," ").slice(0,64)}))
  if(!nodes.length) throw new Error("Case has no diagram")
  return {nodes,edges:nodes.slice(1).map((node,index)=>({id:`e${index+1}`,from:nodes[index].id,to:node.id,label:""}))}
}
function nextId(prefix:string,ids:string[]) {
  let index=1
  while(ids.includes(`${prefix}${index}`)) index++
  return `${prefix}${index}`
}
export function addGraphNode(graph:StudioGraph,label:string):StudioGraph|null {
  return validateGraph({...graph,nodes:[...graph.nodes,{id:nextId("n",graph.nodes.map((node)=>node.id)),label:label.trim()}]})
}
export function removeGraphNode(graph:StudioGraph,id:string):StudioGraph {
  if(graph.nodes.length <= 1) return graph
  return {nodes:graph.nodes.filter((node)=>node.id !== id),edges:graph.edges.filter((edge)=>edge.from !== id && edge.to !== id)}
}
export function addGraphEdge(graph:StudioGraph,from:string,to:string,label:string):StudioGraph|null {
  return validateGraph({...graph,edges:[...graph.edges,{id:nextId("e",graph.edges.map((edge)=>edge.id)),from,to,label:label.trim()}]})
}
function checkedGraph(graph:StudioGraph) {
  const value=validateGraph(graph)
  if(!value) throw new Error("Invalid graph")
  return value
}
const xml = (value:string) => value.replace(/[&<>"']/g,(character)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;"})[character]!)
const mermaidText = (value:string) => value.replace(/[^\p{L}\p{N} ._-]/gu,(character)=>`#${character.codePointAt(0)};`)
export function graphMermaid(graph:StudioGraph):string {
  const value=checkedGraph(graph)
  return ["flowchart LR",...value.nodes.map((node)=>`  ${node.id}["${mermaidText(node.label)}"]`),...value.edges.map((edge)=>`  ${edge.from} -->${edge.label ? `|"${mermaidText(edge.label)}"|` : ""} ${edge.to}`)].join("\n")+"\n"
}
export function graphSvg(graph:StudioGraph):string {
  const value=checkedGraph(graph), width=920, height=Math.ceil(value.nodes.length/4)*170+30
  const position=(id:string)=>{const index=value.nodes.findIndex((node)=>node.id===id);return {x:25+(index%4)*225,y:30+Math.floor(index/4)*170}}
  const edges=value.edges.map((edge)=>{
    const from=position(edge.from),to=position(edge.to)
    return `<path d="M${from.x+200} ${from.y+39} L${to.x} ${to.y+39}" stroke="#64748b" stroke-width="2" fill="none" marker-end="url(#arrow)"/><text x="${(from.x+to.x)/2+100}" y="${(from.y+to.y)/2+25}" text-anchor="middle" font-size="11">${xml(edge.label)}</text>`
  }).join("")
  const nodes=value.nodes.map((node)=>{
    const {x,y}=position(node.id)
    const words=node.label.match(/.{1,24}/gu)??[]
    return `<g><rect x="${x}" y="${y}" width="200" height="78" rx="12" fill="#f8fafc" stroke="#475569"/><text x="${x+100}" y="${y+23}" text-anchor="middle" font-size="12">${words.map((line,index)=>`<tspan x="${x+100}" dy="${index===0?0:17}">${xml(line)}</tspan>`).join("")}</text></g>`
  }).join("")
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img"><title>Architecture</title><rect width="100%" height="100%" fill="white"/><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="9" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#64748b"/></marker></defs><g font-family="system-ui,sans-serif" fill="#0f172a">${edges}${nodes}</g></svg>`
}

export interface StudioResource {id:string;title:string;url:string}
export interface StudioCollection {name:string;ids:string[]}
export function decodeCollection(source:string,resources:StudioResource[]):StudioCollection|null {
  if(source.length>8000) return null
  try {
    const value:unknown=JSON.parse(source)
    if(!object(value) || typeof value.name !== "string" || !value.name.trim() || value.name.length>80 || /[\u0000-\u001f\u007f]/.test(value.name) || !Array.isArray(value.ids) || value.ids.length>40 || new Set(value.ids).size !== value.ids.length) return null
    const known=new Set(resources.map((resource)=>resource.id))
    if(value.ids.some((id)=>typeof id !== "string" || !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(id) || !known.has(id))) return null
    return {name:value.name.trim(),ids:value.ids.slice() as string[]}
  } catch {return null}
}
function checkedCollection(collection:StudioCollection,resources:StudioResource[]) {
  const value=decodeCollection(JSON.stringify(collection),resources)
  if(!value) throw new Error("Invalid collection")
  return value
}
export function collectionUrl(base:string,collection:StudioCollection,resources:StudioResource[]):string {
  const value=checkedCollection(collection,resources),url=shareBase(base)
  url.search=new URLSearchParams({collection:JSON.stringify(value)}).toString();url.hash=""
  return url.toString()
}
const markdownText=(value:string)=>value.replace(/[\\`*_{}[\]()<>#!|]/g,"\\$&").replace(/[\r\n]/g," ")
export function collectionMarkdown(collection:StudioCollection,resources:StudioResource[]):string {
  const value=checkedCollection(collection,resources)
  const lines=value.ids.map((id)=>{
    const resource=resources.find((entry)=>entry.id===id)!
    if(!/^(?:\/(?:en|es))?\/recursos\/[a-z0-9-]+\/[a-z0-9-]+$/.test(resource.url)) throw new Error("Invalid resource URL")
    return `- [${markdownText(resource.title)}](${SITE_URL}${resource.url})`
  })
  return `# ${markdownText(value.name)}\n\n${lines.join("\n")}\n`
}
export type StudioStorage = Pick<Storage,"getItem"|"setItem">
export function studioBrowserStorage():StudioStorage|null {
  try {return window.localStorage} catch {return null}
}
export function readStudioStorage(storage:StudioStorage|null,key:string):{ok:boolean;value:unknown} {
  try {
    if(!storage) return {ok:false,value:null}
    const source=storage.getItem(key)
    if(source && source.length>100000) return {ok:false,value:null}
    return {ok:true,value:source ? JSON.parse(source) : null}
  } catch {return {ok:false,value:null}}
}
export function writeStudioStorage(storage:StudioStorage|null,key:string,value:unknown):boolean {
  try {
    if(!storage) return false
    const source=JSON.stringify(value)
    if(source.length>100000) return false
    storage.setItem(key,source);return true
  } catch {return false}
}
export function downloadStudioText(filename:string,content:string,type:string):boolean {
  try {
    const url=URL.createObjectURL(new Blob([content],{type})),anchor=document.createElement("a")
    anchor.href=url;anchor.download=filename;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
    return true
  } catch {return false}
}
