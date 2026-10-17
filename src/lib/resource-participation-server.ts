import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { discoverySlugs } from "@/data/discovery"
import snapshot from "@/data/resources/roadmap-snapshot.json"
import { createBlogIndex } from "@/lib/blog-content"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { getDiscoveryPath } from "@/lib/discovery-routes"
import { locales } from "@/lib/i18n"
import { getPagePath, localizedPages, unlistedPages } from "@/lib/page-routes"
import { getCaseStudyProjects } from "@/lib/projects"
import { getResourceEntries, resourceSections } from "@/lib/resource-catalog"
import { parseRoadmapIssues, PARTICIPATION_REPOSITORY, ROADMAP_LABEL, type RoadmapIssue } from "@/lib/resource-participation"
import { getResourcePath } from "@/lib/resource-routes"
import { isPublishedPagePath } from "@/lib/publication"
import { SITE_URL } from "@/lib/site"
import { getStackPath, publishedTechs } from "@/lib/stack"

export function getParticipationPublicPaths(): Set<string> {
  const paths=new Set<string>(["/","/en","/es","/blog","/en/blog","/es/blog"])
  const directory=join(process.cwd(),"src/content/blog")
  const posts=createBlogIndex(readdirSync(directory).filter(name=>/\.mdx?$/.test(name)).map(filename=>({filename,source:readFileSync(join(directory,filename),"utf8")}))).getAllPosts()
  const techs=publishedTechs(posts)
  for(const locale of locales){
    paths.add(getResourcePath(locale))
    for(const section of resourceSections){paths.add(getResourcePath(locale,section.slug));for(const entry of getResourceEntries(section.slug))paths.add(getResourcePath(locale,section.slug,entry.slug))}
    for(const project of getCaseStudyProjects())paths.add(getCaseStudyPath(locale,project.slug))
    for(const slug of discoverySlugs)paths.add(getDiscoveryPath(locale,slug))
    for(const page of localizedPages)if(!unlistedPages.has(page))paths.add(getPagePath(locale,page))
    paths.add(getStackPath(locale))
    for(const tech of techs)paths.add(getStackPath(locale,tech.slug))
  }
  for(const post of posts)paths.add(post.url)
  return new Set([...paths].filter(isPublishedPagePath))
}
export function getParticipationCanonicalUrls(): string[] {
  return [...getParticipationPublicPaths()].map(path=>`${SITE_URL}${path==="/"?"":path}`).sort()
}
export interface RoadmapState { source:"live"|"cached"|"snapshot"|"unavailable"; fetchedAt:string|null; issues:RoadmapIssue[]; limited:boolean }
let cache:{at:number;state:RoadmapState}|undefined
export async function readRoadmap(fetcher:typeof fetch=fetch):Promise<RoadmapState>{
  if(cache && Date.now()-cache.at<300_000)return {...cache.state,source:"cached"}
  try{
    const url=new URL(`https://api.github.com/repos/${PARTICIPATION_REPOSITORY}/issues`)
    url.search=new URLSearchParams({labels:ROADMAP_LABEL,state:"all",per_page:"100",sort:"updated",direction:"desc"}).toString()
    const response=await fetcher(url,{headers:{accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28"},signal:AbortSignal.timeout(5000),redirect:"error",cache:"no-store"})
    if(!response.ok)throw Error("Public GitHub read unavailable")
    const reader=response.body?.getReader();if(!reader)throw Error("Missing GitHub response")
    let size=0;const parts:Uint8Array[]=[]
    while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>1_000_000){await reader.cancel();throw Error("GitHub response limit")}parts.push(value)}
    const raw=JSON.parse(Buffer.concat(parts).toString("utf8"))
    const state:RoadmapState={source:"live",fetchedAt:new Date().toISOString(),issues:parseRoadmapIssues(raw),limited:Array.isArray(raw)&&raw.length===100}
    cache={at:Date.now(),state}
    return state
  }catch{
    if(cache)return {...cache.state,source:"snapshot"}
    if(snapshot.fetchedAt)return {source:"snapshot",fetchedAt:snapshot.fetchedAt,issues:snapshot.issues as RoadmapIssue[],limited:false}
    return {source:"unavailable",fetchedAt:null,issues:[],limited:false}
  }
}
