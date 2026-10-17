import { isIP } from "node:net"
import { lookup } from "node:dns/promises"
import { request as httpsRequest } from "node:https"
import { parse, type DefaultTreeAdapterMap } from "parse5"
import { PARTICIPATION_REPOSITORY } from "./resource-participation"
import { SITE_URL } from "./site"

export const WEBMENTION_MAX_BODY = 8192
const MAX_HTML_BYTES = 512_000
export interface WebmentionSubmission { source: string; target: string }
export interface ReferenceEntry extends WebmentionSubmission { title: string; verifiedAt: string }
export interface ReferenceReview { reviewer: string; issueUrl: string; reviewedAt: string }
export interface ApprovedReference extends ReferenceEntry { review: ReferenceReview }
export function publicHttpsUrl(value: unknown): URL {
  if (typeof value !== "string" || value.length > 2000) throw new Error("Invalid public HTTPS URL")
  const url = new URL(value)
  const host = url.hostname.toLowerCase()
  if (url.protocol !== "https:" || url.username || url.password || url.port || isIP(host.replace(/^\[|\]$/g,"")) || !host.includes(".") || host.endsWith(".") || /\.(?:local|localhost|internal|test|invalid|onion)$/.test(host)) throw new Error("Use a public HTTPS hostname without credentials or custom ports")
  return url
}
export function validateWebmention(input: unknown, knownTarget: (pathname: string) => boolean): WebmentionSubmission {
  if (!input || typeof input !== "object") throw new Error("Missing source and target")
  const {source,target} = input as Record<string,unknown>
  const sourceUrl = publicHttpsUrl(source)
  const targetUrl = publicHttpsUrl(target)
  sourceUrl.hash = ""
  if (targetUrl.origin !== SITE_URL || targetUrl.search || targetUrl.hash || !knownTarget(targetUrl.pathname) || sourceUrl.href === targetUrl.href) throw new Error("Unknown target or source equals target")
  return {source:sourceUrl.href,target:targetUrl.href}
}
/** Conservative global-unicast allowlist. IPv4-mapped/transition IPv6 is denied. */
export function isPublicAddress(address: string): boolean {
  const kind = isIP(address)
  if (kind === 4) {
    const [a,b,c] = address.split(".").map(Number)
    return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0 || (b === 88 && c === 99))) || (a === 198 && (b === 18 || b === 19 || (b === 51 && c === 100))) || (a === 203 && b === 0 && c === 113))
  }
  if (kind !== 6) return false
  const lower = address.toLowerCase()
  if (!/^[23][\da-f]{3}:/.test(lower) || lower.includes(".") || /^(?:2000:|2001:|2002:|3ffe:|3fff:)/.test(lower)) return false
  return true
}
export interface PublicAddress { address: string; family: number }
export interface PinnedResponse { status: number; headers: Record<string,string|undefined>; body: string }
export interface PublicFetchDependencies {
  resolve: (host: string) => Promise<PublicAddress[]>
  request: (url: URL, address: PublicAddress) => Promise<PinnedResponse>
}
export async function resolvePublicAddresses(host: string): Promise<PublicAddress[]> {
  return lookup(host,{all:true,verbatim:true})
}
/** No proxy, no reused socket, verified hostname TLS, and no second DNS lookup. */
export async function requestPinnedHttps(url: URL, address: PublicAddress): Promise<PinnedResponse> {
  publicHttpsUrl(url.href)
  if (!isPublicAddress(address.address) || isIP(address.address)!==address.family) throw new Error("Reserved address or invalid address family")
  return new Promise((resolve,reject) => {
    const request = httpsRequest(url,{
      agent:false,servername:url.hostname,method:"GET",maxHeaderSize:16_384,family:address.family,
      headers:{"user-agent":"lagrotti.dev Webmention verifier/1.0","accept":"text/html,application/xhtml+xml","accept-encoding":"identity"},
      lookup:(_hostname,_options,callback)=>callback(null,address.address,address.family),
    }, response => {
      const parts: Buffer[] = []
      let bytes = 0
      response.on("data",(part:Buffer)=>{
        bytes += part.length
        if (bytes > MAX_HTML_BYTES) {response.destroy(new Error("Source exceeds body limit"));return}
        parts.push(part)
      })
      response.on("error",error=>{clearTimeout(timer);reject(error)})
      response.on("end",()=>{
        clearTimeout(timer)
        const headers = Object.fromEntries(Object.entries(response.headers).map(([key,value])=>[key,Array.isArray(value)?value[0]:value]))
        resolve({status:response.statusCode ?? 0,headers,body:Buffer.concat(parts).toString("utf8")})
      })
    })
    const timer = setTimeout(()=>request.destroy(new Error("Source request timeout")),5000)
    request.on("error",error=>{clearTimeout(timer);reject(error)})
    request.end()
  })
}
export async function fetchPinnedPublicHtml(source: string, dependencies: PublicFetchDependencies = {resolve:resolvePublicAddresses,request:requestPinnedHttps}): Promise<{url:string;html:string}> {
  let current = publicHttpsUrl(source)
  const deadline = Date.now()+20_000
  for (let redirects=0;redirects<=3;redirects++) {
    if (Date.now()>deadline) throw new Error("Verification timeout")
    // Every address must be safe; choose one and pin that exact IP through TLS.
    const addresses = await Promise.race([dependencies.resolve(current.hostname),new Promise<never>((_,reject)=>{const timeout=setTimeout(()=>reject(new Error("DNS timeout")),3000);timeout.unref()})])
    if (!addresses.length || addresses.some(ip=>!isPublicAddress(ip.address))) throw new Error("DNS contains a reserved or non-public address")
    const response = await dependencies.request(current,addresses[0])
    if ([301,302,303,307,308].includes(response.status)) {
      if (redirects===3 || !response.headers.location) throw new Error("Redirect limit or missing location")
      current = publicHttpsUrl(new URL(response.headers.location,current).href)
      continue
    }
    if (response.status !== 200 || !/^(?:text\/html|application\/xhtml\+xml)(?:;|$)/i.test(response.headers["content-type"] ?? "") || (response.headers["content-encoding"] && response.headers["content-encoding"] !== "identity") || Buffer.byteLength(response.body)>MAX_HTML_BYTES) throw new Error("Source must return bounded, uncompressed HTML")
    return {url:current.href,html:response.body}
  }
  throw new Error("Redirect limit")
}
/** Parse inert HTML into the browser-standard tree; no scripts or resources run. */
export function hasBacklink(html: string, source: string, target: string): boolean {
  const document=parse(html,{scriptingEnabled:true})
  const nodes:DefaultTreeAdapterMap["node"][]=[document]
  const links:string[]=[]
  let base=source, foundBase=false
  while(nodes.length){
    const node=nodes.pop()!
    if("tagName" in node){
      // Template contents are inert. The parser stores them separately; do not visit them.
      if(node.tagName==="template")continue
      const href=node.attrs.find(attribute=>attribute.name==="href"&&!attribute.namespace)?.value
      if(href!==undefined && node.namespaceURI==="http://www.w3.org/1999/xhtml"){
        if(node.tagName==="base"&&!foundBase){foundBase=true;try{base=new URL(href,source).href}catch{}}
        else if(["a","link","area"].includes(node.tagName))links.push(href)
      }
    }
    if("childNodes" in node)for(let index=node.childNodes.length-1;index>=0;index--)nodes.push(node.childNodes[index])
  }
  return links.some(href=>{try{return new URL(href,base).href===target}catch{return false}})
}
export async function verifyWebmention(submission: WebmentionSubmission): Promise<ReferenceEntry> {
  const document = await fetchPinnedPublicHtml(submission.source)
  if (!hasBacklink(document.html,document.url,submission.target)) throw new Error("Source has no actual backlink to target")
  // Titles supplied by external HTML are not trusted or published automatically.
  return {...submission,title:new URL(document.url).hostname,verifiedAt:new Date().toISOString()}
}
export function approveReference(entry: ReferenceEntry, review: ReferenceReview): ApprovedReference {
  publicHttpsUrl(entry.source)
  const target=publicHttpsUrl(entry.target)
  if (target.origin !== SITE_URL || target.search || target.hash || typeof entry.title !== "string" || !entry.title.trim() || entry.title.length>200 || Number.isNaN(Date.parse(entry.verifiedAt)) || !/^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(review.reviewer) || !new RegExp(`^https://github\\.com/${PARTICIPATION_REPOSITORY}/issues/[1-9]\\d*$`).test(review.issueUrl) || !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedAt) || Number.isNaN(Date.parse(review.reviewedAt)) || new Date(review.reviewedAt).toISOString().slice(0,10)!==review.reviewedAt) throw new Error("Verified source and named maintainer review evidence are required")
  return {...entry,review:{...review}}
}
export interface WebmentionReceiverOptions { knownTarget:(path:string)=>boolean; queue?:(submission:WebmentionSubmission)=>Promise<string>; rateLimit?:()=>boolean }
export async function acceptWebmention(request: Request, options:WebmentionReceiverOptions): Promise<Response> {
  const failure = (status:number,error:string) => Response.json({error,manual:`https://github.com/${PARTICIPATION_REPOSITORY}/issues/new?template=reference.yml`},{status,headers:{"Cache-Control":"no-store"}})
  if (!options.queue) return failure(503,"Durable Webmention queue is not configured. Use the manual reference form.")
  if (options.rateLimit && !options.rateLimit()) return failure(429,"Rate limit reached; retry later or use the manual form.")
  if (!/^application\/x-www-form-urlencoded(?:;|$)/i.test(request.headers.get("content-type") ?? "")) return failure(415,"Use application/x-www-form-urlencoded")
  if (Number(request.headers.get("content-length"))>WEBMENTION_MAX_BODY) return failure(413,"Payload exceeds 8KB")
  try {
    const reader = request.body?.getReader()
    if (!reader) return failure(400,"Missing body")
    const parts:Uint8Array[]=[]
    let size=0
    while (true) {const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>WEBMENTION_MAX_BODY){await reader.cancel();return failure(413,"Payload exceeds 8KB")}parts.push(value)}
    const body = Buffer.concat(parts).toString("utf8")
    const form = new URLSearchParams(body)
    if (form.getAll("source").length!==1 || form.getAll("target").length!==1) return failure(400,"One source and one target are required")
    const submission = validateWebmention({source:form.get("source"),target:form.get("target")},options.knownTarget)
    try {
      await options.queue(submission)
      return Response.json({status:"queued",message:"Persisted for backlink verification and maintainer review. Not published."},{status:202,headers:{"Cache-Control":"no-store"}})
    } catch {return failure(503,"Durable queue write failed; retry later or use the manual form.")}
  } catch {return failure(400,"Invalid source or unknown target")}
}
export function createGitHubWebmentionQueue(token: string | undefined): WebmentionReceiverOptions["queue"] {
  if (!token?.trim()) return undefined
  return async submission => {
    const response = await fetch(`https://api.github.com/repos/${PARTICIPATION_REPOSITORY}/issues`,{method:"POST",headers:{authorization:`Bearer ${token}`,accept:"application/vnd.github+json","X-GitHub-Api-Version":"2022-11-28","content-type":"application/json"},body:JSON.stringify({title:`[Webmention] ${new URL(submission.source).hostname}`,labels:["webmention-pending"],body:`Pending verification. Do not publish before maintainer review.\n\n\`\`\`json\n${JSON.stringify(submission,null,2)}\n\`\`\``}),signal:AbortSignal.timeout(8000),redirect:"error"})
    if (response.status !== 201) throw new Error("GitHub persistence failed")
    const issue = await response.json()
    if (!new RegExp(`^https://github\\.com/${PARTICIPATION_REPOSITORY}/issues/[1-9]\\d*$`).test(issue.html_url ?? "")) throw new Error("No durable issue receipt")
    return issue.html_url
  }
}
