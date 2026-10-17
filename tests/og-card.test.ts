import assert from "node:assert/strict"
import test from "node:test"
import { renderOgCard } from "../src/lib/og-card"

test("renders a 1200×630 PNG, with or without a local image", async () => {
  for (const card of [
    { eyebrow: "Estudo de caso", title: "VMageste — Marketing Analytics SaaS de Alta Volumetria", subtitle: "~3 milhões de eventos por dia", highlight: "SaaS multi-tenant", image: "/vmageste.png" },
    { eyebrow: "Tecnologia", title: "NestJS: projetos, experiência e artigos", image: "/../etc/passwd" },
  ]) {
    const bytes = Buffer.from(await renderOgCard(card).arrayBuffer())
    assert.equal(bytes.subarray(1, 4).toString("latin1"), "PNG")
    assert.equal(bytes.readUInt32BE(16), 1200)
    assert.equal(bytes.readUInt32BE(20), 630)
  }
})
