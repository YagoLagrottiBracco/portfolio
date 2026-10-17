import { buildIndexNowPayload, INDEXNOW_ENDPOINT } from "../src/lib/resource-participation"
import { getParticipationCanonicalUrls } from "../src/lib/resource-participation-server"

async function main(){
  const args=process.argv.slice(2)
  if(args.some(arg=>arg.startsWith("--")&&arg!=="--submit"))throw Error("Usage: npx tsx scripts/submit-indexnow.ts [--submit] [canonical URL ...]")
  const known=new Set(getParticipationCanonicalUrls())
  const urls=args.filter(arg=>arg!=="--submit")
  const selected=urls.length?urls:[...known]
  if(selected.some(url=>!known.has(url)))throw Error("Only known canonical site pages can be submitted")
  const payload=buildIndexNowPayload(selected)
  if(!args.includes("--submit")){console.log(JSON.stringify({dryRun:true,endpoint:INDEXNOW_ENDPOINT,payload},null,2));return}
  const keyResponse=await fetch(payload.keyLocation,{redirect:"error",signal:AbortSignal.timeout(10_000),cache:"no-store"})
  if(!keyResponse.ok || Number(keyResponse.headers.get("content-length"))>256)throw Error("Production IndexNow key is unavailable; deploy before submitting")
  const reader=keyResponse.body?.getReader();if(!reader)throw Error("Missing production key body")
  let size=0;const parts:Uint8Array[]=[]
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>256){await reader.cancel();throw Error("Invalid production key")}parts.push(value)}
  if(Buffer.concat(parts).toString("utf8").trim()!==payload.key)throw Error("Production key mismatch; no submission sent")
  const response=await fetch(INDEXNOW_ENDPOINT,{method:"POST",headers:{"content-type":"application/json; charset=utf-8"},body:JSON.stringify(payload),redirect:"error",signal:AbortSignal.timeout(15_000)})
  if(response.status!==200&&response.status!==202)throw Error(`IndexNow rejected submission (HTTP ${response.status}); indexing is not guaranteed`)
  console.log(JSON.stringify({submitted:true,status:response.status,urls:payload.urlList.length,message:response.status===202?"Received; key validation pending. No indexing/ranking guarantee.":"Received. No indexing/ranking guarantee."}))
}
main().catch(error=>{console.error(error instanceof Error?error.message:"IndexNow submission failed");process.exitCode=1})
