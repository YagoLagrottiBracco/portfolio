import assert from "node:assert/strict"
import test from "node:test"
import { unified } from "unified"
import remarkParse from "remark-parse"
import type { Root } from "mdast"

import { getBlogOutline, remarkBlogHeadingIds } from "../src/lib/blog-outline"

test("deduplicates outline anchors and strips inline formatting", () => {
  const content = "## Visão **geral**\n\n## Visão geral\n\n### API\n\n#### Detail"
  const headings = getBlogOutline(content)

  assert.deepEqual(headings.map(heading => heading.depth), [2, 2, 3])
  assert.deepEqual(headings.map(heading => heading.text), ["Visão geral", "Visão geral", "API"])
  assert.notEqual(headings[0].id, headings[1].id)

  const processor = unified().use(remarkParse).use(remarkBlogHeadingIds)
  const tree = processor.runSync(processor.parse(content)) as Root
  const ids = tree.children.filter(node => node.type === "heading" && node.depth <= 3)
    .map(node => String(node.data?.hProperties?.id))
  assert.deepEqual(ids, headings.map(heading => heading.id))
})
