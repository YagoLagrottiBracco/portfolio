import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import matter from "gray-matter"
import { checkMarkdownRoundtrip } from "../src/lib/blog-editor-roundtrip"

test("keeps Markdown content and block structure across visual conversion", () => {
  const original = "## Heading\n\nA **bold** [link](https://example.com).\n\n- One\n- Two\n\n> Quote\n\n```ts\nconst n = 1\n```\n\n| A | B |\n| --- | --- |\n| 1 | 2 |"
  assert.equal(checkMarkdownRoundtrip(original, original).safe, true)
  assert.equal(checkMarkdownRoundtrip("## A\n\n**bold** text", "## A\n\nbold text").safe, true)
  assert.equal(checkMarkdownRoundtrip(original, original.replace("const n = 1", "const n = 2")).safe, false)
  assert.equal(checkMarkdownRoundtrip(original, "## Heading\n\nA bold link.").safe, false)
  assert.equal(checkMarkdownRoundtrip("## Heading\n\n<script>x</script>", "## Heading").safe, false)
})

test("all current article bodies pass a lossless identity check", () => {
  const dir = join(process.cwd(), "src/content/blog")
  const filenames = readdirSync(dir).filter(name => name.endsWith(".mdx"))
  assert.equal(filenames.length, 54)
  for (const name of filenames) {
    const body = matter(readFileSync(join(dir, name), "utf8")).content
    assert.equal(checkMarkdownRoundtrip(body, body).safe, true, name)
  }
})
