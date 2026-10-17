import { execFileSync } from "node:child_process"
import { mkdirSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { parseRoadmapIssues, selectVerifiedContributions, PARTICIPATION_REPOSITORY, ROADMAP_LABEL } from "../src/lib/resource-participation"

const query="type:pr author:YagoLagrottiBracco is:merged is:public -user:YagoLagrottiBracco"
function github(endpoint:string,parameters:Record<string,string>={}){
  const args=["api","-X","GET",endpoint,...Object.entries(parameters).flatMap(([key,value])=>["-f",`${key}=${value}`])]
  return JSON.parse(execFileSync("gh",args,{encoding:"utf8",maxBuffer:8_000_000,timeout:20_000}))
}
try{
  const prs:unknown[]=[]
  const first=github("search/issues",{q:query,per_page:"100",page:"1"})
  if(first.incomplete_results || !Number.isSafeInteger(first.total_count) || first.total_count>1000)throw Error("Incomplete public search; narrow the query before recording evidence")
  const searchItems=[...first.items]
  for(let page=2;page<=Math.ceil(first.total_count/100);page++){
    const result=github("search/issues",{q:query,per_page:"100",page:String(page)})
    if(result.incomplete_results)throw Error("Incomplete public search")
    searchItems.push(...result.items)
  }
  for(const item of searchItems){
    const match=/^https:\/\/api\.github\.com\/repos\/([\w.-]+\/[\w.-]+)\/pulls\/([1-9]\d*)$/.exec(item.pull_request?.url??"")
    if(!match)throw Error("Invalid public search receipt")
    const pr=github(`repos/${match[1]}/pulls/${match[2]}`)
    // An authenticated search must never turn private repository information into public source files.
    if(pr.base?.repo?.private!==false)throw Error("Search result is not public; refusing refresh")
    prs.push(pr)
  }
  const entries=selectVerifiedContributions(prs)
  const rawIssues:unknown[]=[]
  for(let page=1;page<=10;page++){
    const items=github(`repos/${PARTICIPATION_REPOSITORY}/issues`,{labels:ROADMAP_LABEL,state:"all",per_page:"100",page:String(page)})
    if(!Array.isArray(items))throw Error("Invalid issue response")
    rawIssues.push(...items)
    if(items.length<100)break
    if(page===10)throw Error("Roadmap exceeds refresh bound; add explicit pagination support")
  }
  const stamp=new Date().toISOString()
  const output=resolve("src/data/resources")
  mkdirSync(output,{recursive:true})
  writeFileSync(resolve(output,"external-contributions.json"),JSON.stringify({verifiedAt:stamp,query,queryUrl:`https://github.com/search?q=${encodeURIComponent(query)}&type=pullrequests`,totalResults:first.total_count,incompleteResults:false,entries},null,2)+"\n")
  writeFileSync(resolve(output,"roadmap-snapshot.json"),JSON.stringify({fetchedAt:stamp,repository:PARTICIPATION_REPOSITORY,label:ROADMAP_LABEL,issues:parseRoadmapIssues(rawIssues)},null,2)+"\n")
  console.log(`Refreshed public evidence: ${entries.length} verified external merged PRs; ${parseRoadmapIssues(rawIssues).length} labeled roadmap issues. No external changes made.`)
}catch{console.error("Public participation refresh failed. Existing snapshots were preserved; check GitHub connectivity/authentication and query completeness.");process.exitCode=1}
