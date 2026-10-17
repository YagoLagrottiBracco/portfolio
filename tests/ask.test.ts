import assert from "node:assert/strict"
import test from "node:test"
import type Anthropic from "@anthropic-ai/sdk"
import { createAskHandler } from "../src/lib/ask/handler"
import { buildAskRequest, translateStream, type AskDocument, type AskEvent } from "../src/lib/ask/request"
import { queryTerms, retrieveSections, type Section } from "../src/lib/ask/retrieval"
import { createRateLimiter } from "../src/lib/rate-limit"

type Event = Anthropic.Beta.Messages.BetaRawMessageStreamEvent

const section = (article: string, title: string, text: string, keywords = ""): Section => ({ article, title, text, keywords, url: `https://lagrotti.dev/blog/${article}` })

test("finds the sections that share the question's rarer words", () => {
  assert.deepEqual(queryTerms("Ele já usou Kafka em produção?"), ["usou", "kafka", "producao"])
  const sections = [
    section("a", "Eventos — Por que Kafka", "Kafka desacopla a ingestão do processamento em produção."),
    section("a", "Eventos — Consumidores", "Consumidores em Go leem do Kafka."),
    section("a", "Eventos — Custos", "Kafka custa caro sem particionamento."),
    section("b", "Front — React", "Componentes React em produção."),
    section("c", "Outro", "Nada a ver."),
  ]
  const picked = retrieveSections("Ele já usou Kafka em produção?", sections)
  assert.equal(picked[0].title, "Eventos — Por que Kafka", "the section with both words first")
  assert.deepEqual(new Set(picked.map((item) => item.title)), new Set(["Eventos — Por que Kafka", "Eventos — Consumidores", "Front — React"]))
  assert.equal(picked.filter((item) => item.article === "a").length, 2, "at most two per article")
  assert.deepEqual(retrieveSections("o que é?", sections), [], "no topical words, no sections")
})

const stable: AskDocument[] = [
  { title: "Perfil", url: "https://lagrotti.dev/trabalhe-comigo", text: "Perfil" },
  { title: "VMageste", url: "https://lagrotti.dev/projetos/vmageste", text: "Kafka" },
]
const retrieved: AskDocument[] = [{ title: "Artigo — Kafka", url: "https://lagrotti.dev/blog/a#kafka", text: "Seção" }]

test("caches the stable prefix and enables citations on every document", () => {
  const params = buildAskRequest({ question: "Kafka?", locale: "pt", stableDocuments: stable, retrievedDocuments: retrieved })
  assert.equal(params.model, "claude-opus-5-5")
  assert.deepEqual(params.output_config, { effort: "low" })
  assert.equal(params.fallbacks, "default")
  assert.deepEqual(params.betas, ["server-side-fallback-2026-07-01"])
  assert.match(String(params.system), /Brazilian Portuguese/)
  const content = params.messages[0].content as Anthropic.Beta.BetaContentBlockParam[]
  const documents = content.filter((block): block is Anthropic.Beta.BetaRequestDocumentBlock => block.type === "document")
  assert.equal(documents.length, 3)
  assert.ok(documents.every((block) => block.citations?.enabled), "citations on all documents")
  assert.deepEqual(documents.map((block) => Boolean(block.cache_control)), [false, true, false], "breakpoint on the last stable document")
  assert.deepEqual(content.at(-1), { type: "text", text: "Kafka?" }, "the question comes last, after the cache")

  const haiku = buildAskRequest({ question: "Kafka?", locale: "en", stableDocuments: stable, retrievedDocuments: [], model: "claude-haiku-5-5" })
  assert.equal("fallbacks" in haiku, false, "Haiku 5.5 has no server-side fallback")
})

async function* events(list: unknown[]): AsyncGenerator<Event> {
  for (const event of list) yield event as Event
}
const citation = (documentIndex: number) => ({ type: "citations_delta", citation: { type: "char_location", cited_text: "x", document_index: documentIndex, document_title: "t", start_char_index: 0, end_char_index: 1 } })
async function collect(iterable: AsyncIterable<AskEvent>) {
  const out: AskEvent[] = []
  for await (const event of iterable) out.push(event)
  return out
}

test("streams text, numbers sources in order of first use, and ignores fallback blocks", async () => {
  const out = await collect(translateStream(events([
    { type: "message_start", message: {} },
    { type: "content_block_start", index: 0, content_block: { type: "fallback" } },
    { type: "content_block_delta", index: 1, delta: { type: "text_delta", text: "Usou Kafka" } },
    { type: "content_block_delta", index: 1, delta: citation(1) },
    { type: "content_block_delta", index: 2, delta: { type: "text_delta", text: " e liderou times." } },
    { type: "content_block_delta", index: 2, delta: citation(0) },
    { type: "content_block_delta", index: 2, delta: citation(1) },
    { type: "content_block_delta", index: 2, delta: citation(9) },
    { type: "message_delta", delta: { stop_reason: "end_turn" }, usage: {} },
  ]), [...stable, ...retrieved]))
  assert.deepEqual(out, [
    { t: "text", block: 1, text: "Usou Kafka" },
    { t: "cite", block: 1, source: 1 },
    { t: "text", block: 2, text: " e liderou times." },
    { t: "cite", block: 2, source: 2 },
    { t: "cite", block: 2, source: 1 },
    { t: "done", sources: [{ n: 1, title: "VMageste", url: "https://lagrotti.dev/projetos/vmageste" }, { n: 2, title: "Perfil", url: "https://lagrotti.dev/trabalhe-comigo" }] },
  ])
})

test("a refusal at the end of the chain is reported instead of sources", async () => {
  const out = await collect(translateStream(events([
    { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: "Parcial" } },
    { type: "message_delta", delta: { stop_reason: "refusal" }, usage: {} },
  ]), stable))
  assert.deepEqual(out.at(-1), { t: "refusal" })
})

const ask = (handler: (request: Request) => Promise<Response>, body: unknown, headers: Record<string, string> = {}) =>
  handler(new Request("https://lagrotti.dev/api/ask", { method: "POST", headers: { "content-type": "application/json", origin: "https://lagrotti.dev", ...headers }, body: JSON.stringify(body) }))
const lines = async (response: Response) => (await response.text()).trim().split("\n").map((line) => JSON.parse(line))

test("the endpoint streams the cited answer as NDJSON and never logs the question", async () => {
  let sent: Anthropic.Beta.Messages.MessageCreateParamsStreaming | undefined
  const logged: string[] = []
  const handler = createAskHandler({
    stream: async (params) => {
      sent = params
      return events([{ type: "content_block_delta", index: 0, delta: { type: "text_delta", text: "Sim." } }, { type: "content_block_delta", index: 0, delta: citation(0) }])
    },
    stableDocuments: () => stable,
    sections: () => [section("kafka-post", "Kafka — Por quê", "Kafka em produção")],
    log: (_action, fields) => logged.push(JSON.stringify(fields)),
  })
  const response = await ask(handler, { question: "  Usou   Kafka em produção? ", locale: "es" })
  assert.equal(response.headers.get("content-type"), "application/x-ndjson; charset=utf-8")
  assert.deepEqual(await lines(response), [
    { t: "text", block: 0, text: "Sim." },
    { t: "cite", block: 0, source: 1 },
    { t: "done", sources: [{ n: 1, title: "Perfil", url: "https://lagrotti.dev/trabalhe-comigo" }] },
  ])
  assert.deepEqual(sent!.messages[0].content.at(-1), { type: "text", text: "Usou Kafka em produção?" })
  assert.match(String(sent!.system), /Spanish/)
  assert.ok(logged.every((entry) => !entry.includes("Kafka")), "the question text is not logged")
})

test("the endpoint refuses what it should, before calling Claude", async () => {
  let calls = 0
  const stream = async () => {
    calls++
    return events([])
  }
  const base = { stream, stableDocuments: () => stable, sections: () => [], log: () => {} }
  assert.equal((await ask(createAskHandler({ ...base, stream: null }), { question: "Kafka?" })).status, 503, "no API key")
  const handler = createAskHandler({ ...base, limiter: createRateLimiter({ limit: 2, windowMs: 60_000 }) })
  assert.equal((await ask(handler, { question: "Kafka?" }, { origin: "https://evil.example" })).status, 403)
  assert.equal((await ask(handler, { question: "a" })).status, 400, "too short")
  assert.equal((await ask(handler, { question: "x".repeat(301) })).status, 400, "too long")
  assert.equal((await ask(handler, { question: "Kafka?" })).status, 429, "two per window in this test")
  assert.equal(calls, 0)
})

test("an API failure mid-stream ends with an error line, not a broken response", async () => {
  const handler = createAskHandler({
    stream: async () => (async function* () {
      yield { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: "Começo" } } as Event
      throw new Error("connection reset")
    })(),
    stableDocuments: () => stable,
    sections: () => [],
    log: () => {},
  })
  assert.deepEqual((await lines(await ask(handler, { question: "Kafka?" }))).at(-1), { t: "error", code: "unavailable" })
})
