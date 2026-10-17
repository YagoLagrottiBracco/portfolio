import { execFileSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { getParticipationPublicPaths } from "../src/lib/resource-participation-server"
import { PARTICIPATION_REPOSITORY } from "../src/lib/resource-participation"
import { validateWebmention, verifyWebmention, approveReference, type ApprovedReference } from "../src/lib/webmention"

import { readOptionalLocalFile } from "./lib/local-files"

const args=process.argv.slice(2)
const option=(name:string)=>{const index=args.indexOf(name);return index<0?undefined:args[index+1]}
function github(endpoint:string){return JSON.parse(execFileSync("gh",["api","-X","GET",endpoint],{encoding:"utf8",maxBuffer:250_000,timeout:15_000}))}
function proposalFromIssue(body:string){
  if(body.length>50_000)throw Error("Issue exceeds size limit")
  const json=/```json\s*\n([\s\S]+?)\n```/.exec(body)
  if(json)return JSON.parse(json[1])
  const field=(heading:string)=>{const match=new RegExp(`^### ${heading}[^\\n]*\\n([\\s\\S]*?)(?=^### |$(?![\\s\\S]))`,"m").exec(body);return match?.[1]?.trim()}
  return {source:field("Source URL"),target:field("Target URL")}
}
async function main(){
  const issueNumber=option("--issue"),input=option("--input")
  if(Boolean(issueNumber)===Boolean(input))throw Error("Choose --issue NUMBER or --input proposal.json")
  let proposal:unknown,issue:Record<string,unknown>|undefined
  if(issueNumber){
    if(!/^[1-9]\d*$/.test(issueNumber))throw Error("Invalid issue number")
    issue=github(`repos/${PARTICIPATION_REPOSITORY}/issues/${issueNumber}`)
    if(issue?.pull_request || typeof issue?.body!=="string")throw Error("Expected a reference issue")
    proposal=proposalFromIssue(issue.body)
  }else{
    const content=readFileSync(resolve(input!),"utf8")
    if(Buffer.byteLength(content)>8192)throw Error("Proposal exceeds size limit")
    proposal=JSON.parse(content)
  }
  const paths=getParticipationPublicPaths()
  const submission=validateWebmention(proposal,path=>paths.has(path))
  const verified=await verifyWebmention(submission)
  if(!args.includes("--approve")){
    console.log(JSON.stringify({dryRun:true,verified,publication:"Not published. Requires a maintainer webmention-approved label and a reviewed content PR."},null,2));return
  }
  if(!issueNumber || !issue)throw Error("Publication requires a real approved GitHub issue")
  const labels=issue.labels as {name?:string}[]
  if(!labels?.some(label=>label.name==="webmention-approved"))throw Error("Maintainer must apply webmention-approved")
  const reviewer=option("--reviewer")??""
  if(!/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(reviewer))throw Error("A named maintainer reviewer is required")
  const permission=github(`repos/${PARTICIPATION_REPOSITORY}/collaborators/${reviewer}/permission`)
  if(!["admin","maintain","write"].includes(permission.permission))throw Error("Reviewer needs write/maintain/admin repository permission")
  const events=github(`repos/${PARTICIPATION_REPOSITORY}/issues/${issueNumber}/events?per_page=100`)
  const approval=[...events].reverse().find(event=>event.event==="labeled"&&event.label?.name==="webmention-approved")
  if(approval?.actor?.login?.toLowerCase()!==reviewer.toLowerCase())throw Error("Reviewer must match the actual approval label event")
  const approved=approveReference(verified,{reviewer,issueUrl:String(issue.html_url),reviewedAt:new Date().toISOString().slice(0,10)})
  const output=resolve(option("--output")??"src/data/resources/references.json")
  const content=readOptionalLocalFile(output)
  const existing:ApprovedReference[]=content?JSON.parse(content.toString("utf8")):[]
  if(!Array.isArray(existing))throw Error("Invalid references dataset")
  for(const entry of existing)approveReference(entry,entry.review)
  const entries=[...existing.filter(entry=>entry.source!==approved.source||entry.target!==approved.target),approved]
  writeFileSync(output,JSON.stringify(entries,null,2)+"\n")
  console.log("Verified reference imported locally. Review the diff and publish only through the content PR workflow.")
}
main().catch(error=>{console.error(JSON.stringify({error:error instanceof Error?error.message:"Reference import failed"}));process.exitCode=1})
