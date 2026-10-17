import assert from "node:assert/strict"
import test from "node:test"
import { personalData } from "../src/data/personal"
import { MIN_TECH_EVIDENCE, techCatalog } from "../src/data/stack"
import { getLocalizedPath, getRouteLocale } from "../src/lib/locale-routes"
import { evidenceCount, findTech, getStackPath, jobTechs, namesTech, parseStackPath, publishedTechs, techFor } from "../src/lib/stack"

const posts = [
  { translationKey: "kafka-post", tags: ["kafka", "clickhouse"] },
  { translationKey: "kafka-post", tags: ["kafka"] }, // the same article in another language
  { translationKey: "nest-post", tags: ["nestjs"] },
]

test("every spelling in the data maps to one technology", () => {
  assert.equal(techFor("Next.js 16")?.slug, "nextjs")
  assert.equal(techFor("next.js")?.slug, "nextjs")
  assert.equal(techFor("Apache Kafka")?.slug, "kafka")
  assert.equal(techFor("React Native"), undefined, "React Native is not React")
  assert.equal(namesTech(findTech("react")!, "react three fiber"), false)
  assert.equal(new Set(techCatalog.map((entry) => entry.slug)).size, techCatalog.length)
})

test("an article and its translations count once", () => {
  const kafka = findTech("kafka")!
  assert.equal(evidenceCount(kafka, posts) - evidenceCount(kafka, []), 1)
})

test("only technologies with enough evidence get a page", () => {
  const published = publishedTechs(posts)
  for (const entry of published) assert.ok(evidenceCount(entry, posts) >= MIN_TECH_EVIDENCE, entry.slug)
  for (const entry of techCatalog.filter((candidate) => !published.includes(candidate))) assert.ok(evidenceCount(entry, posts) < MIN_TECH_EVIDENCE, entry.slug)
  assert.ok(published.some((entry) => entry.slug === "typescript"))
})

test("jobs are matched on the technologies their descriptions name", () => {
  const pulses = personalData.experience.find((job) => job.company === "Pulses")!
  assert.deepEqual(jobTechs(pulses).map((entry) => entry.slug).sort(), ["nestjs", "nodejs", "php", "terraform", "vuejs"])
})

test("stack pages follow the site's language routing", () => {
  assert.equal(getStackPath("pt"), "/stack")
  assert.equal(getStackPath("en", "kafka"), "/en/stack/kafka")
  assert.deepEqual(parseStackPath("/es/stack/nextjs"), { locale: "es", slug: "nextjs" })
  assert.deepEqual(parseStackPath("/stack"), { locale: "pt", slug: undefined })
  assert.equal(parseStackPath("/stacks"), null)
  assert.equal(getRouteLocale("/stack/kafka"), "pt")
  assert.equal(getLocalizedPath("/en/stack/kafka", "es"), "/es/stack/kafka")
})
