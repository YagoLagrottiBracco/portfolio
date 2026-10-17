import assert from "node:assert/strict"
import test from "node:test"
import { buildSearchText } from "../src/lib/blog-search"
import { rankSearch, type SearchItem } from "../src/lib/site-search"

const item = (kind: SearchItem["kind"], title: string, description = "", keywords: string[] = []): SearchItem => ({ kind, title, description, url: `/${title}`, text: buildSearchText([title, description, ...keywords]) })

test("needs every word, ignores accents and ranks title matches first", () => {
  const items = [
    item("article", "Como escalei eventos", "Kafka e ClickHouse em produção"),
    item("stack", "Apache Kafka", "1 projeto · 1 artigo", ["kafka"]),
    item("case", "VMageste", "~3 milhões de eventos por dia", ["Apache Kafka", "ClickHouse"]),
    item("resource", "Guia de filas", "Quando usar uma fila"),
  ]
  assert.deepEqual(rankSearch(items, "kafka").map((result) => result.title), ["Apache Kafka", "VMageste", "Como escalei eventos"])
  assert.deepEqual(rankSearch(items, "PRODUÇÃO kafka").map((result) => result.title), ["Como escalei eventos"])
  assert.deepEqual(rankSearch(items, "  "), [])
  assert.equal(rankSearch(items, "a", 2).length, 2)
})

test("a special character in the query is searched literally", () => {
  assert.deepEqual(rankSearch([item("stack", "C++ (linguagem)")], "c++").map((result) => result.title), ["C++ (linguagem)"])
})
