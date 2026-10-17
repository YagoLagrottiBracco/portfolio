import test from "node:test"
import assert from "node:assert/strict"
import { buildCorrectionIssueUrl, buildRequestIssueUrl, parseRoadmapIssues, selectVerifiedContributions, buildIndexNowPayload, INDEXNOW_KEY } from "../src/lib/resource-participation"
import { isPublicAddress, validateWebmention, fetchPinnedPublicHtml, hasBacklink, acceptWebmention, approveReference, requestPinnedHttps } from "../src/lib/webmention"

const target = "https://lagrotti.dev/recursos/ferramentas/json"
const known = (path: string) => path === "/recursos/ferramentas/json"

test("correction draft preserves actual context, Unicode and locale without submitting", () => {
  const draft = new URL(buildCorrectionIssueUrl({ pageUrl: `${target}#block-real`, locale: "es", excerpt: "Contrato real á", suggestion: "Cambiar campo" }))
  assert.equal(draft.origin, "https://github.com")
  assert.equal(draft.searchParams.get("page"), `${target}#block-real`)
  assert.equal(draft.searchParams.get("locale"), "es")
  assert.equal(draft.searchParams.get("excerpt"), "Contrato real á")
  assert.equal(draft.searchParams.get("suggestion"), "Cambiar campo")
  assert.throws(() => buildCorrectionIssueUrl({pageUrl:"https://evil.example",locale:"pt",excerpt:"a",suggestion:"b"}))
  assert.throws(() => buildCorrectionIssueUrl({pageUrl:target,locale:"pt",excerpt:"x".repeat(1501),suggestion:"b"}))
})
test("request drafts use a dedicated form and bounded user text", () => {
  const url = new URL(buildRequestIssueUrl("en", "Queue simulator", "Please support pauses."))
  assert.equal(url.searchParams.get("template"), "resource-request.yml")
  assert.equal(url.searchParams.get("details"), "Please support pauses.")
  assert.throws(() => buildRequestIssueUrl("en", " ", "details"))
})
test("roadmap admits only genuine repository issues and positive reaction counts", () => {
  const issues = parseRoadmapIssues([{number:4,title:"Real",html_url:"https://github.com/YagoLagrottiBracco/portfolio/issues/4",state:"open",updated_at:"2026-10-17T00:00:00Z",labels:[{name:"resource-request"},{name:"in-progress"}],reactions:{"+1":3}},{number:5,title:"PR",pull_request:{},labels:[{name:"resource-request"}]}])
  assert.deepEqual(issues, [{number:4,title:"Real",url:"https://github.com/YagoLagrottiBracco/portfolio/issues/4",status:"in-progress",votes:3,updatedAt:"2026-10-17T00:00:00Z"}])
  assert.deepEqual(parseRoadmapIssues([{number:1,title:"spoof",html_url:"https://evil.example",labels:[{name:"resource-request"}]}]),[])
})
test("external contribution evidence requires public merged PR, exact author and other owner", () => {
  const pr = { number:42, title:"Fix",html_url:"https://github.com/other/project/pull/42",merged_at:"2026-05-19T05:08:17Z",state:"closed",user:{login:"YagoLagrottiBracco"},base:{repo:{private:false,full_name:"other/project",owner:{login:"other"}}} }
  assert.equal(selectVerifiedContributions([pr])[0]?.mergedAt, pr.merged_at)
  assert.deepEqual(selectVerifiedContributions([{...pr,merged_at:null},{...pr,user:{login:"someone"}},{...pr,base:{repo:{...pr.base.repo,private:true}}}]), [])
})
test("IndexNow accepts only exact canonical origin without tracking/query/hash", () => {
  const payload = buildIndexNowPayload([target,target])
  assert.deepEqual(payload.urlList,[target])
  assert.equal(payload.keyLocation, `https://lagrotti.dev/${INDEXNOW_KEY}.txt`)
  for (const value of ["https://evil.example/a",`${target}?secret=yes`,`${target}#x`,"http://lagrotti.dev/a","https://lagrotti.dev:444/a"]) assert.throws(() => buildIndexNowPayload([value]))
})
test("Webmention rejects invalid source and unknown target before persistence", () => {
  assert.equal(validateWebmention({source:"https://author.example/post",target},known).target,target)
  for (const source of ["http://public.example/a","https://127.0.0.1/","https://[::1]/","https://localhost/","https://user:pass@public.example/","https://author.example:8443/"]) assert.throws(() => validateWebmention({source,target},known))
  assert.throws(() => validateWebmention({source:"https://author.example/post",target:"https://lagrotti.dev/admin"},known))
  assert.throws(() => validateWebmention({source:target,target},known))
})
test("SSRF address filter denies reserved IPv4, IPv6 and mapped addresses", () => {
  for (const value of ["127.0.0.1","10.1.1.1","172.16.0.1","192.168.1.1","169.254.169.254","100.100.100.200","192.0.2.1","198.18.1.1","224.0.0.1","0.0.0.0","::1","::","::ffff:8.8.8.8","fc00::1","fe80::1","2001:db8::1","2002:7f00:1::"]) assert.equal(isPublicAddress(value),false,value)
  for (const value of ["8.8.8.8","93.184.216.34","2606:4700:4700::1111"]) assert.equal(isPublicAddress(value),true,value)
})
test("verification pins resolved public IP and validates each redirect", async () => {
  const calls: string[] = []
  const dependencies = {resolve:async (host:string) => host === "private.example" ? [{address:"127.0.0.1",family:4}] : [{address:"93.184.216.34",family:4}],request:async (url:URL,ip:{address:string;family:number}) => {calls.push(`${url.hostname}:${ip.address}`);return {status:302,headers:{location:"https://private.example/"},body:""}}}
  await assert.rejects(fetchPinnedPublicHtml("https://public.example/post",dependencies),/public|reserved/i)
  assert.deepEqual(calls,["public.example:93.184.216.34"])
  await assert.rejects(fetchPinnedPublicHtml("https://mixed.example/",{...dependencies,resolve:async()=>[{address:"93.184.216.34",family:4},{address:"10.0.0.1",family:4}]}))
})
test("backlink verification parses actual link elements, entities and relative paths", () => {
  assert.equal(hasBacklink(`<a href="${target}">article</a>`,"https://author.example/post",target),true)
  assert.equal(hasBacklink(`<script>"<a href='${target}'>"</script>`,"https://author.example/post",target),false)
  assert.equal(hasBacklink(`<!-- <a href="${target}"> -->`,"https://author.example/post",target),false)
  assert.equal(hasBacklink(`<p>${target}</p>`,"https://author.example/post",target),false)
  assert.equal(hasBacklink(`<a href="${target}-fake">x</a>`,"https://author.example/post",target),false)
})
test("receiver never acknowledges without durable persistence and limits payloads", async () => {
  const request = () => new Request("https://lagrotti.dev/api/webmention",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams({source:"https://author.example/post",target})})
  assert.equal((await acceptWebmention(request(),{knownTarget:known})).status,503)
  let queued = 0
  const response = await acceptWebmention(request(),{knownTarget:known,queue:async()=>{queued++;return "https://github.com/YagoLagrottiBracco/portfolio/issues/7"}})
  assert.equal(response.status,202)
  assert.equal(queued,1)
  const failed = await acceptWebmention(request(),{knownTarget:known,queue:async()=>{throw Error("no durable write")}})
  assert.equal(failed.status,503)
  assert.equal((await acceptWebmention(new Request("https://lagrotti.dev/api/webmention",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},body:"x".repeat(8193)}),{knownTarget:known,queue:async()=>"x"})).status,413)
})
test("references require verification and explicit maintainer evidence before publication", () => {
  const entry = {source:"https://author.example/post",target,verifiedAt:"2026-10-17T12:00:00Z",title:"Real source"}
  assert.throws(()=>approveReference(entry,{reviewer:"",issueUrl:"",reviewedAt:"2026-10-17"}))
  assert.equal(approveReference(entry,{reviewer:"YagoLagrottiBracco",issueUrl:"https://github.com/YagoLagrottiBracco/portfolio/issues/7",reviewedAt:"2026-10-17"}).review.reviewer,"YagoLagrottiBracco")
})

test("backlink tokenizer rejects quoted fake tags, incomplete inert elements and respects base", () => {
  assert.equal(hasBacklink(`<div data-note="<a href='${target}'>">fake</div>`,"https://author.example/post",target),false)
  assert.equal(hasBacklink(`<script>var fake = '<a href="${target}">';`,"https://author.example/post",target),false)
  assert.equal(hasBacklink(`<base href="https://lagrotti.dev/recursos/"><a href="ferramentas/json">real</a>`,"https://author.example/post",target),true)
})

test("SSRF filter rejects compressed low IPv6 ranges and retired 6bone", () => {
  for(const address of ["2::1","3::1","3ffe::1","2000::1"])assert.equal(isPublicAddress(address),false,address)
})

test("source fragments cannot bypass same-document rejection and review dates must exist", () => {
  assert.throws(()=>validateWebmention({source:`${target}#fragment`,target},known))
  assert.throws(()=>approveReference({source:"https://author.example/post",target,verifiedAt:"2026-10-17T12:00:00Z",title:"Real source"},{reviewer:"YagoLagrottiBracco",issueUrl:"https://github.com/YagoLagrottiBracco/portfolio/issues/7",reviewedAt:"2026-02-31"}))
  assert.deepEqual(buildIndexNowPayload(["https://lagrotti.dev"]).urlList,["https://lagrotti.dev"])
})

test("HTML verification ignores markup that the browser parser does not make into links",()=>{
  assert.equal(hasBacklink(`<select><option><a href="${target}">fake</a></option></select>`,"https://author.example/post",target),false)
  assert.equal(hasBacklink(`<a href="https://lagrotti.dev/recursos/ferramentas/&#106;son">actual entity</a>`,"https://author.example/post",target),true)
})

test("receiver rejects forged small lengths, duplicate fields, unsupported encoding and rate overflow",async()=>{
  const options={knownTarget:known,queue:async()=>"https://github.com/YagoLagrottiBracco/portfolio/issues/1"}
  const request=(body:string,headers:Record<string,string>={})=>new Request("https://lagrotti.dev/api/webmention",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded",...headers},body})
  assert.equal((await acceptWebmention(request("x".repeat(8193),{"content-length":"1"}),options)).status,413)
  assert.equal((await acceptWebmention(request(new URLSearchParams({source:"https://author.example/post",target}).toString()+"&source=https://duplicate.example"),options)).status,400)
  assert.equal((await acceptWebmention(request("{}",{"content-type":"application/json"}),options)).status,415)
  assert.equal((await acceptWebmention(request("source=x&target=y"),{...options,rateLimit:()=>false})).status,429)
})


test("pinned transport also rejects direct literal/private URL calls before opening a socket",async()=>{
  await assert.rejects(requestPinnedHttps(new URL("https://127.0.0.1/"),{address:"1.1.1.1",family:4}),/public HTTPS/)
  await assert.rejects(requestPinnedHttps(new URL("https://one.one.one.one/"),{address:"127.0.0.1",family:4}),/Reserved/)
})
