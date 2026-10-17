import assert from "node:assert/strict"
import test from "node:test"
import { attributionProperties, recordLanding, touchFromLanding } from "../src/lib/attribution"
import { readUtm, withUtm } from "../src/lib/utm"

const memoryStorage = () => {
  const items = new Map<string, string>()
  return { getItem: (key: string) => items.get(key) ?? null, setItem: (key: string, value: string) => void items.set(key, value) }
}

test("reads UTM tags, ignoring blanks and case", () => {
  assert.deepEqual(readUtm("?utm_source=LinkedIn&utm_medium=social&utm_campaign=&ref=x"), {
    utm_source: "linkedin",
    utm_medium: "social",
  })
  assert.deepEqual(readUtm(""), {})
})

test("tags a URL without losing its query or hash", () => {
  assert.equal(
    withUtm("https://lagrotti.dev/blog?tag=ia#topo", { utm_source: "rss", utm_medium: "feed", utm_campaign: undefined }),
    "https://lagrotti.dev/blog?tag=ia&utm_source=rss&utm_medium=feed#topo",
  )
})

test("a landing is credited to its UTM tags first, then to an external referrer", () => {
  assert.deepEqual(touchFromLanding("https://lagrotti.dev/en?utm_source=linkedin&utm_medium=social&utm_campaign=launch", "https://www.google.com/"), {
    source: "linkedin",
    medium: "social",
    campaign: "launch",
    content: undefined,
    landing: "/en",
  })
  assert.deepEqual(touchFromLanding("https://lagrotti.dev/blog", "https://www.google.com/"), {
    source: "google.com",
    medium: "referral",
    landing: "/blog",
  })
})

test("typed URLs and internal navigation credit nobody", () => {
  assert.equal(touchFromLanding("https://lagrotti.dev/", ""), null)
  assert.equal(touchFromLanding("https://lagrotti.dev/blog", "https://lagrotti.dev/"), null)
  assert.equal(touchFromLanding("https://www.lagrotti.dev/blog", "https://lagrotti.dev/"), null)
})

test("keeps the first touch ever and the touch that started this visit", () => {
  const local = memoryStorage()
  const firstVisit = memoryStorage()
  recordLanding({ source: "linkedin", medium: "social", campaign: "launch", landing: "/" }, local, firstVisit)

  const laterVisit = memoryStorage()
  recordLanding({ source: "google.com", medium: "referral", landing: "/blog" }, local, laterVisit)
  recordLanding(null, local, laterVisit)

  assert.deepEqual(attributionProperties(local, laterVisit), {
    source: "google.com",
    medium: "referral",
    first_source: "linkedin",
    first_campaign: "launch",
  })
})

test("a visitor nobody referred, or blocked storage, adds no properties", () => {
  assert.deepEqual(attributionProperties(memoryStorage(), memoryStorage()), {})
  assert.deepEqual(attributionProperties(undefined, undefined), {})
  const broken = { getItem: () => "{not json", setItem: () => { throw new Error("quota") } }
  assert.doesNotThrow(() => recordLanding({ source: "x", landing: "/" }, broken, broken))
  assert.deepEqual(attributionProperties(broken, broken), {})
})
