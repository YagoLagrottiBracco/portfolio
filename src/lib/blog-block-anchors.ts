import type { Root, RootContent } from "mdast"
import { toString } from "mdast-util-to-string"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"

export interface BlogBlockAnchor {
  id: string
  kind: "p" | "code"
  text: string
}
function blockHash(text: string): string {
  let value = 2166136261
  for (let index = 0; index < text.length; index++) {
    value ^= text.charCodeAt(index)
    value = Math.imul(value, 16777619)
  }
  return (value >>> 0).toString(16).padStart(8, "0")
}
function markBlocks(tree: Root): BlogBlockAnchor[] {
  const seen = new Map<string, number>(),
    anchors: BlogBlockAnchor[] = []
  function visit(node: Root | RootContent) {
    if (node.type === "paragraph" || node.type === "code") {
      const kind = node.type === "code" ? "code" : "p"
      const text = toString(node).replace(/\s+/g, " ").trim()
      if (text) {
        const base = `${kind}-${blockHash(text)}`,
          count = (seen.get(base) ?? 0) + 1
        seen.set(base, count)
        const id = base + (count === 1 ? "" : `-${count}`)
        node.data = {
          ...node.data,
          hProperties: {
            ...node.data?.hProperties,
            id,
            "data-block-anchor": id,
          },
        }
        anchors.push({ id, kind, text })
      }
    }
    if ("children" in node)
      for (const child of node.children) visit(child as RootContent)
  }
  visit(tree)
  return anchors
}
export function getBlogBlockAnchors(content: string): BlogBlockAnchor[] {
  return markBlocks(unified().use(remarkParse).use(remarkGfm).parse(content))
}
export function remarkBlogBlockAnchors() {
  return (tree: Root) => {
    markBlocks(tree)
  }
}
