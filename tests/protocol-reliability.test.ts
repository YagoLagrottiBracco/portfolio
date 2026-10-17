import assert from "node:assert/strict"
import test from "node:test"
import { spawnSync } from "node:child_process"
import { GET as webfinger } from "../src/app/.well-known/webfinger/route"
import { GET as actor } from "../src/app/fediverse/actor/route"
import { GET as outbox } from "../src/app/api/activitypub/outbox/route"
import { buildBlogFeed } from "../src/lib/blog-feed"
import { getParticipationPublicPaths } from "../src/lib/resource-participation-server"

function withEnv(values: Record<string, string | undefined>, run: () => Promise<void> | void) {
  const previous = Object.fromEntries(Object.keys(values).map(key => [key, process.env[key]]))
  for (const [key, value] of Object.entries(values)) { if (value === undefined) delete process.env[key]; else process.env[key] = value }
  return Promise.resolve().then(run).finally(() => { for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value } })
}
const lookup = (query = "") => webfinger(new Request(`https://lagrotti.dev/.well-known/webfinger${query}`))

test("WebFinger rejects missing, repeated and foreign account resources before bridge discovery", () => withEnv({ ACTIVITYPUB_MODE: "bridge", ACTIVITYPUB_WEBFINGER_URL: "https://bridge.example/.well-known/webfinger", ACTIVITYPUB_USERNAME: "blog" }, async () => {
  assert.equal((await lookup()).status, 400)
  assert.equal((await lookup("?resource=acct:other@lagrotti.dev")).status, 404)
  assert.equal((await lookup("?resource=acct:blog@evil.example")).status, 404)
  assert.equal((await lookup("?resource=acct:blog@lagrotti.dev&resource=acct:other@lagrotti.dev")).status, 400)
  const response = await lookup("?resource=acct:blog@lagrotti.dev")
  assert.equal(response.status, 307)
  assert.equal(new URL(response.headers.get("location")!).searchParams.get("resource"), "acct:blog@lagrotti.dev")
}))

test("invalid bridge destinations cannot be advertised or redirected", () => withEnv({ ACTIVITYPUB_MODE: "bridge", ACTIVITYPUB_WEBFINGER_URL: "http://bridge.example/webfinger", ACTIVITYPUB_ACTOR_URL: "https://user:password@bridge.example/actor" }, async () => {
  assert.equal((await lookup("?resource=acct:blog@lagrotti.dev")).status, 404)
  assert.equal((await actor()).status, 404)
}))

test("native mode does not advertise unimplemented actors, followers or a publishing outbox", () => withEnv({ ACTIVITYPUB_MODE: "native", ACTIVITYPUB_WEBFINGER_URL: undefined }, async () => {
  assert.equal((await lookup("?resource=acct:blog@lagrotti.dev")).status, 404)
  assert.equal((await actor()).status, 404)
  assert.equal((await outbox()).status, 404)
}))

test("disabled Ask pages are absent from the public publication catalogue in every language", () => withEnv({ ANTHROPIC_API_KEY: undefined }, () => {
  const paths = getParticipationPublicPaths()
  for (const path of ["/perguntar", "/en/perguntar", "/es/perguntar"]) assert.equal(paths.has(path), false, path)
  assert.ok(paths.has("/privacidade"))
}))

test("RSS advertises only a configured valid HTTPS WebSub hub", () => withEnv({ WEBSUB_HUB_URL: "https://hub.example/publish?a=1&b=2" }, async () => {
  assert.match(buildBlogFeed([], "pt", "https://lagrotti.dev"), /<atom:link href="https:\/\/hub.example\/publish\?a=1&amp;b=2" rel="hub"\/>/)
  await withEnv({ WEBSUB_HUB_URL: "http://hub.example" }, () => assert.doesNotMatch(buildBlogFeed([], "pt", "https://lagrotti.dev"), /rel="hub"/))
}))

test("WebSub and social commands default to dry run even with credentials", () => {
  const websub = spawnSync(process.execPath, ["--import", "tsx", "scripts/websub-ping.ts"], { encoding: "utf8", timeout: 30_000, env: { ...process.env, WEBSUB_HUB_URL: "https://127.0.0.1:1/hub" } })
  assert.equal(websub.status, 0, websub.stderr)
  assert.equal(JSON.parse(websub.stdout).dryRun, true)
  const social = spawnSync(process.execPath, ["--import", "tsx", "scripts/distribute.ts"], { encoding: "utf8", timeout: 30_000, env: { ...process.env, DISTRIBUTE_MAX_AGE_HOURS: "999999", MASTODON_INSTANCE: "https://127.0.0.1:1", MASTODON_ACCESS_TOKEN: "fake" } })
  assert.equal(social.status, 0, social.stderr)
  assert.match(social.stdout, /dry-run/)
})

test("both IndexNow commands share the static public ownership key and reject disabled Ask URLs", () => {
  for (const script of ["scripts/indexnow.ts", "scripts/submit-indexnow.ts"]) {
    const preview = spawnSync(process.execPath, ["--import", "tsx", script, "https://lagrotti.dev/privacidade"], { encoding: "utf8", timeout: 30_000, env: { ...process.env, INDEXNOW_KEY: undefined } })
    assert.equal(preview.status, 0, preview.stderr)
    assert.equal(JSON.parse(preview.stdout).payload.keyLocation, "https://lagrotti.dev/4f31dd50dbdb4c5d9f4eac94301d918a.txt")
    const disabled = spawnSync(process.execPath, ["--import", "tsx", script, "https://lagrotti.dev/en/perguntar"], { encoding: "utf8", timeout: 30_000, env: { ...process.env, ANTHROPIC_API_KEY: "" } })
    assert.equal(disabled.status, 1)
    assert.match(disabled.stderr, /known canonical/)
  }
})

test("optional webmention.io reads cannot publish unreviewed received mentions", () => {
  const result = spawnSync(process.execPath, ["--conditions=react-server", "--import", "tsx", "-e", `
    const {getWebmentions}=require('./src/lib/webmentions.ts');
    getWebmentions('/blog/review-required', async()=>Response.json({children:[{type:'entry',url:'https://unreviewed.example/post',author:{name:'Unreviewed'},content:{text:'Unapproved text'},'wm-target':'https://lagrotti.dev/blog/review-required','wm-private':false}]})).then(value=>console.log(JSON.stringify(value)));
  `], { encoding: "utf8", timeout: 30_000, env: { ...process.env, WEBMENTION_IO_TOKEN: "fake" } })
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout), [])
})

test("IndexNow publication limits its payload to URLs in both the live sitemap and local public catalogue", () => {
  const preload = `globalThis.fetch=async (url, options={})=>{
    if(!options.signal || options.redirect!=='error') throw Error('missing bounded request');
    if(String(url)==='https://lagrotti.dev/sitemap.xml') return new Response('<urlset><url><loc>https://lagrotti.dev/privacidade</loc></url><url><loc>https://lagrotti.dev/en/perguntar</loc></url><url><loc>https://evil.example/</loc></url></urlset>');
    if(String(url)==='https://lagrotti.dev/4f31dd50dbdb4c5d9f4eac94301d918a.txt') return new Response('4f31dd50dbdb4c5d9f4eac94301d918a');
    if(String(url)==='https://api.indexnow.org/indexnow' && options.method==='POST') {
      const payload=JSON.parse(options.body);
      if(JSON.stringify(payload.urlList)!==JSON.stringify(['https://lagrotti.dev/privacidade'])) throw Error('wrong live sitemap selection');
      return new Response(null,{status:202});
    }
    throw Error('unexpected request');
  }`
  const result = spawnSync(process.execPath, ["--import", "tsx", "--import", `data:text/javascript,${encodeURIComponent(preload)}`, "scripts/indexnow.ts", "--publish"], { encoding: "utf8", timeout: 30_000, env: { ...process.env, ANTHROPIC_API_KEY: "" } })
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(result.stdout).urls, 1)
})
