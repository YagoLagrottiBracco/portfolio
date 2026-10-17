import { acceptWebmention, createGitHubWebmentionQueue } from "@/lib/webmention"
import { getParticipationPublicPaths } from "@/lib/resource-participation-server"
export const runtime="nodejs"
export const dynamic="force-dynamic"
// Per-instance admission limit; hosting edge quotas add a distributed limit.
let windowStart=0, accepted=0
function admit(){const now=Date.now();if(now-windowStart>60_000){windowStart=now;accepted=0}return ++accepted<=20}
export async function POST(request:Request){
  const paths=getParticipationPublicPaths()
  return acceptWebmention(request,{knownTarget:path=>paths.has(path),queue:createGitHubWebmentionQueue(process.env.WEBMENTION_GITHUB_TOKEN),rateLimit:admit})
}
export async function GET(){return Response.json({configured:Boolean(process.env.WEBMENTION_GITHUB_TOKEN?.trim()),endpoint:"/api/webmention",format:"application/x-www-form-urlencoded",fields:["source","target"],publication:"Requires pinned-IP backlink verification and maintainer approval",manual:"https://github.com/YagoLagrottiBracco/portfolio/issues/new?template=reference.yml"},{headers:{"Cache-Control":"no-store"}})}
