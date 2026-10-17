import assert from "node:assert/strict"
import test from "node:test"
import {
  decodeQueueScenario, queueScenarioUrl, replayQueueScenario,
  validateGraph, addGraphNode, removeGraphNode, addGraphEdge,
  graphMermaid, graphSvg, seedCaseGraph,
  decodeCollection, collectionUrl, collectionMarkdown,
  readStudioStorage, writeStudioStorage,
} from "../src/lib/resource-studio"
import { challenges, gradeChallenge } from "../src/data/resources/challenges"

test("scenario URLs preserve synthetic parameters and replay steps without carrying other inputs", () => {
  const scenario = { arrivals: 4, workers: 2, failurePercent: 0, steps: 3 }
  const url = queueScenarioUrl("https://example.com/en/recursos/ecossistema/cenarios?secret=hidden#private", scenario)
  assert.equal(url, "https://example.com/en/recursos/ecossistema/cenarios?queue=1&arrivals=4&workers=2&failures=0&steps=3")
  assert.deepEqual(decodeQueueScenario(new URL(url).search), scenario)
  const result = replayQueueScenario(scenario)
  assert.equal(result.tick, 3)
  assert.equal(result.pending.length, 6)
  assert.equal(result.completed, 6)
})

test("scenario imports reject ambiguous, fractional, excessive and malformed parameters", () => {
  assert.equal(decodeQueueScenario(""), null)
  for (const query of [
    "?queue=1&arrivals=51&workers=2&failures=0&steps=3",
    "?queue=1&arrivals=4&workers=0&failures=0&steps=3",
    "?queue=1&arrivals=4&workers=2&failures=101&steps=3",
    "?queue=1&arrivals=4&workers=2&failures=0&steps=501",
    "?queue=1&arrivals=4.5&workers=2&failures=0&steps=3",
    "?queue=1&arrivals=4&arrivals=5&workers=2&failures=0&steps=3",
    "?queue=1&arrivals=%E0%A4%A&workers=2&failures=0&steps=3",
  ]) assert.equal(decodeQueueScenario(query), null, query)
  assert.throws(() => queueScenarioUrl("https://example.com", {arrivals: 0, workers: 1, failurePercent: 0, steps: Infinity}))
  assert.throws(() => queueScenarioUrl("javascript:alert(1)", {arrivals:0,workers:1,failurePercent:0,steps:0}))
  assert.throws(() => queueScenarioUrl("https://user:password@example.com", {arrivals:0,workers:1,failurePercent:0,steps:0}))
})

test("case graph edits preserve referential integrity and remove incident edges", () => {
  let graph = seedCaseGraph([{title:{pt:"Entrada",en:"Input",es:"Entrada"}}, {title:{pt:"Worker",en:"Worker",es:"Worker"}}], "en")
  assert.equal(graph.nodes[0].label, "Input")
  assert.deepEqual(graph.edges[0], {id:"e1",from:"n1",to:"n2",label:""})
  graph = addGraphNode(graph, "Database")!
  graph = addGraphEdge(graph, "n2", "n3", "write")!
  assert.equal(addGraphEdge(graph, "n2", "n3", "duplicate"), null)
  assert.equal(addGraphEdge(graph, "n1", "missing", ""), null)
  const removed = removeGraphNode(graph, "n2")
  assert.equal(removed.nodes.length, 2)
  assert.equal(removed.edges.length, 0)
  assert.ok(validateGraph(removed))
  assert.equal(validateGraph({...graph, nodes: [...graph.nodes,graph.nodes[0]]}), null)
  assert.equal(validateGraph({...graph, edges: [{id:"e1",from:"n1",to:"missing",label:""}]}), null)
  assert.equal(validateGraph({nodes:Array.from({length:17},(_,i)=>({id:`n${i+1}`,label:"x"})),edges:[]}), null)
})

test("SVG and Mermaid exports escape attacker text and reject invalid graphs", () => {
  const graph = {nodes:[{id:"n1",label:'</text><script>alert("x")</script> & [A]'}],edges:[]}
  const svg = graphSvg(graph)
  assert.match(svg, /&lt;script&gt;/)
  assert.doesNotMatch(svg, /<script|<foreignObject|onload=/)
  const mermaid = graphMermaid(graph)
  assert.match(mermaid, /^flowchart LR\n/)
  assert.doesNotMatch(mermaid, /<script>|"x"|\[A\]/)
  assert.throws(() => graphSvg({nodes:[{id:"n1",label:"x".repeat(65)}],edges:[]}))
})

test("SVG connection arrows meet node boundaries and graph limits include edges", () => {
  const graph = {nodes:[{id:"n1",label:"API"},{id:"n2",label:"Worker"}],edges:[{id:"e1",from:"n1",to:"n2",label:"enqueue"}]}
  assert.match(graphSvg(graph), /d="M225 69 L250 69"/)
  const nodes=Array.from({length:9},(_,index)=>({id:`n${index+1}`,label:`Service ${index+1}`}))
  const edges=nodes.flatMap((from)=>nodes.filter((to)=>to.id!==from.id).map((to)=>({id:"",from:from.id,to:to.id,label:""}))).slice(0,33).map((edge,index)=>({...edge,id:`e${index+1}`}))
  assert.equal(validateGraph({nodes,edges}),null)
  assert.ok(validateGraph({nodes,edges:edges.slice(0,32)}))
})

const resources = [{id:"ferramentas/json",title:"JSON [tool]",url:"/en/recursos/ferramentas/json"}, {id:"demos/queue",title:"Queue",url:"/en/recursos/demos/queue"}]
test("named collections round-trip only known IDs and export catalogue links", () => {
  const collection = {name:"Workshop [A]",ids:["ferramentas/json","demos/queue"]}
  const url = collectionUrl("https://example.com/en/recursos/ecossistema/colecoes?private=secret", collection, resources)
  assert.deepEqual(decodeCollection(new URL(url).searchParams.get("collection")!, resources), collection)
  assert.ok(!url.includes("secret"))
  assert.equal(decodeCollection(JSON.stringify({name:"Fake",ids:["https://evil.test"]}), resources), null)
  assert.equal(decodeCollection(JSON.stringify({name:"Fake",ids:["demos/queue","demos/queue"]}), resources), null)
  assert.equal(decodeCollection("x".repeat(8001), resources), null)
  assert.equal(decodeCollection(JSON.stringify({name:"x".repeat(81),ids:[]}), resources), null)
  assert.match(collectionMarkdown(collection, resources), /\[JSON \\\[tool\\\]\]\(https:\/\/lagrotti.dev\/en\/recursos\/ferramentas\/json\)/)
  assert.throws(() => collectionUrl("data:text/html,invalid",collection,resources))
  assert.throws(() => collectionMarkdown({name:"x",ids:["unknown/id"]}, resources))
  assert.throws(() => collectionMarkdown({name:"x",ids:["ferramentas/json"]}, [{...resources[0],url:"javascript:alert(1)"}]))
  const many=Array.from({length:41},(_,index)=>({id:`demos/item-${index}`,title:"Item",url:`/recursos/demos/item-${index}`}))
  assert.equal(decodeCollection(JSON.stringify({name:"Too many",ids:many.map((value)=>value.id)}),many),null)
})

test("unavailable storage reports failure without throwing or inventing saved progress", () => {
  const unavailable = {getItem(){throw new Error("denied")},setItem(){throw new Error("quota")}}
  assert.deepEqual(readStudioStorage(unavailable, "key"), {ok:false,value:null})
  assert.equal(writeStudioStorage(unavailable, "key", {a:1}), false)
  const memory = new Map<string,string>()
  const storage = {getItem:(key:string)=>memory.get(key)??null,setItem:(key:string,value:string)=>{memory.set(key,value)}}
  assert.equal(writeStudioStorage(storage, "key", {done:["q"]}), true)
  assert.deepEqual(readStudioStorage(storage,"key"), {ok:true,value:{done:["q"]}})
})

test("six localized challenges grade deterministically and reject unknown answers", () => {
  assert.ok(challenges.length >= 6)
  for (const challenge of challenges) {
    for (const locale of ["pt","en","es"] as const) {
      assert.ok(challenge.title[locale].length > 5)
      assert.ok(challenge.prompt[locale].length > 50)
      assert.ok(challenge.explanation[locale].length > 70)
      assert.ok(challenge.hints.length >= 2)
      for(const hint of challenge.hints) assert.ok(hint[locale].length > 15)
      for(const option of challenge.options) assert.ok(option.label[locale])
    }
    for (const option of challenge.options) assert.equal(gradeChallenge(challenge.id,option.id), option.id === challenge.answer)
    assert.equal(gradeChallenge(challenge.id,"__proto__"), false)
  }
  assert.equal(gradeChallenge("missing", "a"), false)
})
