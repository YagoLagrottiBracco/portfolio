import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"

interface Node { type: string; value?: string; url?: string; alt?: string; title?: string; depth?: number; lang?: string; meta?: string; ordered?: boolean; start?: number; checked?: boolean | null; align?: Array<string | null>; identifier?: string; referenceType?: string; children?: Node[] }

function comparable(node: Node): unknown {
  if (["strong", "emphasis", "delete"].includes(node.type)) return (node.children ?? []).map(comparable)
  if (node.type === "text") return node.value ?? ""
  if (node.type === "html") throw new Error("Unsupported raw HTML")
  if (node.type === "link" || node.type === "image") return [node.type, node.url, node.title ?? null, node.type === "image" ? node.alt : flatten(node.children ?? [])]
  if (node.type === "linkReference" || node.type === "imageReference") return [node.type, node.identifier, node.referenceType, node.type === "imageReference" ? node.alt : flatten(node.children ?? [])]
  if (node.type === "definition") return [node.type, node.identifier, node.url, node.title ?? null]
  if (node.type === "footnoteReference" || node.type === "footnoteDefinition") return [node.type, node.identifier, (node.children ?? []).map(comparable)]
  if (node.type === "code") return ["code", node.lang ?? "", node.meta ?? null, node.value ?? ""]
  if (node.type === "inlineCode") return ["inlineCode", node.value ?? ""]
  if (node.type === "heading") return ["heading", node.depth, flatten(node.children ?? [])]
  if (node.type === "paragraph" || node.type === "tableCell") return [node.type, flatten(node.children ?? [])]
  if (node.type === "list") return ["list", node.ordered ?? false, node.ordered ? node.start ?? 1 : null, (node.children ?? []).map(comparable)]
  if (node.type === "listItem") return ["listItem", node.checked ?? null, (node.children ?? []).map(comparable)]
  if (node.type === "table") return ["table", node.align ?? [], (node.children ?? []).map(comparable)]
  if (node.type === "thematicBreak" || node.type === "break") return [node.type]
  return [node.type, (node.children ?? []).map(comparable)]
}

function flatten(nodes: Node[]): unknown[] {
  const result: unknown[] = []
  for (const node of nodes) {
    const values = ["strong", "emphasis", "delete"].includes(node.type) ? flatten(node.children ?? []) : [comparable(node)]
    for (const value of values) {
      if (typeof value === "string" && typeof result.at(-1) === "string") result[result.length - 1] = String(result.at(-1)) + value
      else result.push(value)
    }
  }
  return result
}

function normalized(markdown: string): unknown {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown) as Node
  return (tree.children ?? []).map(comparable)
}

export function checkMarkdownRoundtrip(original: string, serialized: string): { safe: boolean; reason?: string } {
  try {
    if (JSON.stringify(normalized(original)) === JSON.stringify(normalized(serialized))) return { safe: true }
    return { safe: false, reason: "A conversão alterou texto ou blocos do Markdown" }
  } catch {
    return { safe: false, reason: "Este Markdown requer a edição em código-fonte" }
  }
}
