import GithubSlugger from "github-slugger"
import { toString } from "mdast-util-to-string"
import type { Heading, Root } from "mdast"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkGfm from "remark-gfm"

export interface BlogHeading {
  depth: 2 | 3
  id: string
  text: string
}

function markHeadings(tree: Root): BlogHeading[] {
  const slugger = new GithubSlugger()
  const outline: BlogHeading[] = []

  for (const node of tree.children) {
    if (node.type !== "heading") continue
    const heading = node as Heading
    const text = toString(heading).trim()
    const id = slugger.slug(text)
    heading.data = { ...heading.data, hProperties: { ...heading.data?.hProperties, id } }
    if (heading.depth === 2 || heading.depth === 3) {
      outline.push({ depth: heading.depth, id, text })
    }
  }
  return outline
}

export function getBlogOutline(content: string): BlogHeading[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(content)
  return markHeadings(tree)
}

export function remarkBlogHeadingIds() {
  return (tree: Root) => {
    markHeadings(tree)
  }
}
