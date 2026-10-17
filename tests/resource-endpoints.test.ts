import assert from "node:assert/strict"
import test from "node:test"
import { GET as catalogue } from "../src/app/api/resources/v1/route"
import { GET as schema } from "../src/app/api/resources/v1/schema/route"
import { GET as card } from "../src/app/api/resources/card/route"
import { GET as qr } from "../src/app/api/resources/qr/route"
import { GET as redirect } from "../src/app/r/[code]/route"
import { resourceFeedResponse } from "../src/lib/resource-feed-handler"

test("catalogue endpoint has CORS, conditional caching and documented invalid-filter errors", async () => {
  const request = new Request(
    "https://lagrotti.dev/api/resources/v1?locale=es&section=ecossistema"
  )
  const response = catalogue(request)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get("access-control-allow-origin"), "*")
  const data = await response.json()
  assert.equal(data.count, 20)
  const etag = response.headers.get("etag")!
  const unchanged = catalogue(
    new Request(request.url, { headers: { "if-none-match": etag } })
  )
  assert.equal(unchanged.status, 304)
  assert.equal(await unchanged.text(), "")
  assert.equal(catalogue(new Request(request.url + "&locale=en")).status, 400)
  assert.match(
    schema().headers.get("content-type")!,
    /application\/schema\+json/
  )
})

test("SVG and QR endpoints reject arbitrary IDs and generate actual allowlisted assets", async () => {
  const image = card(
    new Request(
      "https://lagrotti.dev/api/resources/card?id=ferramentas%2Fjson&locale=en"
    )
  )
  assert.equal(image.status, 200)
  assert.match(image.headers.get("content-type")!, /image\/svg\+xml/)
  assert.ok((await image.text()).includes("<title"))
  assert.equal(
    card(new Request("https://lagrotti.dev/api/resources/card?id=<script>"))
      .status,
    404
  )
  const code = await qr(
    new Request("https://lagrotti.dev/api/resources/qr?code=filas&locale=es")
  )
  assert.equal(code.status, 200)
  const svg = await code.text()
  assert.ok(svg.includes("<svg") && svg.includes("<path"))
  assert.match(svg, /width="320"/)
  assert.ok(!svg.includes("<script"))
  assert.equal(
    (
      await qr(
        new Request(
          "https://lagrotti.dev/api/resources/qr?code=https://evil.example"
        )
      )
    ).status,
    404
  )
})

test("short-link HTTP redirects ignore arbitrary destinations and validate locale", async () => {
  const result = await redirect(
    new Request(
      "https://lagrotti.dev/r/filas?url=https://evil.example&lang=en"
    ),
    { params: Promise.resolve({ code: "filas" }) }
  )
  assert.equal(result.status, 307)
  assert.equal(
    new URL(result.headers.get("location")!).origin,
    "https://lagrotti.dev"
  )
  assert.ok(
    result.headers.get("location")!.includes("/en/recursos/demos/queue")
  )
  assert.equal(
    (
      await redirect(new Request("https://lagrotti.dev/r/filas?lang=xx"), {
        params: Promise.resolve({ code: "filas" }),
      })
    ).status,
    404
  )
})

test("RSS endpoint applies real filters and gives explicit errors for malformed queries", async () => {
  const response = resourceFeedResponse(
    new Request(
      "https://lagrotti.dev/en/recursos/feed.xml?section=ecossistema"
    ),
    "en"
  )
  assert.equal(response.status, 200)
  assert.match(response.headers.get("content-type")!, /application\/rss\+xml/)
  assert.equal(((await response.text()).match(/<item>/g) || []).length, 20)
  assert.equal(
    resourceFeedResponse(
      new Request("https://lagrotti.dev/recursos/feed.xml?resource=x/y"),
      "pt"
    ).status,
    400
  )
  assert.equal(
    resourceFeedResponse(
      new Request(
        "https://lagrotti.dev/recursos/feed.xml?resource=templates/worker&resource=templates/adr"
      ),
      "pt"
    ).status,
    400
  )
})
