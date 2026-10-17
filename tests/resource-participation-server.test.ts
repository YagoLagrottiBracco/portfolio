import assert from "node:assert/strict"
import test from "node:test"
import { spawnSync } from "node:child_process"
import { getParticipationPublicPaths, readRoadmap } from "../src/lib/resource-participation-server"
import { GET as webmentionStatus, POST as webmentionSubmit } from "../src/app/api/webmention/route"

test("known Webmention targets come from actual public content and exclude administrative routes",()=>{
  const paths=getParticipationPublicPaths()
  assert.ok(paths.has("/recursos/ferramentas/json"))
  assert.ok(paths.has("/en/recursos/ecossistema/referencias"))
  assert.ok([...paths].some(path=>path.startsWith("/blog/")&&path!=="/blog/"))
  assert.ok(!paths.has("/admin"))
  assert.ok(!paths.has("/api/webmention"))
})
test("roadmap failure returns a dated snapshot without fabricated issues or votes",async()=>{
  const result=await readRoadmap(async()=>new Response("rate limited",{status:429}))
  assert.equal(result.source,"snapshot")
  assert.match(result.fetchedAt!,/^2026-10-17T/)
  assert.deepEqual(result.issues,[])
})
test("unconfigured Webmention endpoint reports unavailable and never acknowledges receipt",async()=>{
  const previous=process.env.WEBMENTION_GITHUB_TOKEN
  delete process.env.WEBMENTION_GITHUB_TOKEN
  try{
    const status=await (await webmentionStatus()).json()
    assert.equal(status.configured,false)
    const response=await webmentionSubmit(new Request("https://lagrotti.dev/api/webmention",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({source:"https://author.example/post",target:"https://lagrotti.dev/recursos/ferramentas/json"})}))
    assert.equal(response.status,503)
    assert.match((await response.json()).manual,/template=reference.yml/)
  }finally{if(previous===undefined)delete process.env.WEBMENTION_GITHUB_TOKEN;else process.env.WEBMENTION_GITHUB_TOKEN=previous}
})
test("IndexNow CLI defaults to dry run and rejects foreign canonical URLs before network calls",()=>{
  const result=spawnSync(process.execPath,["--import","tsx","scripts/submit-indexnow.ts","https://lagrotti.dev/recursos/ferramentas/json"],{encoding:"utf8",timeout:15_000})
  assert.equal(result.status,0,result.stderr)
  assert.equal(JSON.parse(result.stdout).dryRun,true)
  const invalid=spawnSync(process.execPath,["--import","tsx","scripts/submit-indexnow.ts","--submit","https://evil.example/"],{encoding:"utf8",timeout:15_000})
  assert.equal(invalid.status,1)
  assert.match(invalid.stderr,/known canonical/)
})
