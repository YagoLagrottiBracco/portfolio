/**
 * Republishes an article on dev.to as a draft, with `canonical_url` pointing
 * here so search engines keep crediting lagrotti.dev.
 *
 *   npm run crosspost -- <slug>                      # print the dev.to Markdown
 *   DEVTO_API_KEY=… npm run crosspost -- <slug> --draft [--ai some_ai]
 *
 * `--draft` creates an unpublished draft in your dev.to account; review it and
 * publish from there. `--ai` sets dev.to's AI disclosure (no_ai, some_ai,
 * fully_autonomous). dev.to keys: https://dev.to/settings/extensions
 */
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { parseArgs } from "node:util"

import { createBlogIndex } from "../src/lib/blog-content"
import { devtoArticle, type AiDisclosure } from "../src/lib/crosspost"
import { SITE_URL } from "../src/lib/site"

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { draft: { type: "boolean", default: false }, ai: { type: "string" } },
})

async function main() {
  const directory = join(process.cwd(), "src", "content", "blog")
  const index = createBlogIndex(readdirSync(directory).filter((name) => /\.mdx?$/.test(name)).map((filename) => ({ filename, source: readFileSync(join(directory, filename), "utf8") })))
  const post = positionals[0] ? index.getPostBySlug(positionals[0]) : null
  if (!post) {
    console.error("Usage: npm run crosspost -- <published article slug> [--draft] [--ai no_ai|some_ai|fully_autonomous]")
    process.exitCode = 1
    return
  }
  const ai = values.ai as AiDisclosure | undefined
  if (ai && !["not_disclosed", "no_ai", "some_ai", "fully_autonomous"].includes(ai)) {
    console.error(`Unknown --ai value: ${ai}`)
    process.exitCode = 1
    return
  }

  const article = devtoArticle(post, SITE_URL, ai)
  if (!values.draft) {
    console.log(`---\ntitle: ${JSON.stringify(article.title)}\npublished: false\ndescription: ${JSON.stringify(article.description)}\ntags: ${article.tags.join(", ")}\ncanonical_url: ${article.canonical_url}\n${article.main_image ? `cover_image: ${article.main_image}\n` : ""}---\n\n${article.body_markdown}`)
    return
  }

  const apiKey = process.env.DEVTO_API_KEY
  if (!apiKey) {
    console.error("Set DEVTO_API_KEY to create the draft.")
    process.exitCode = 1
    return
  }
  const response = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/vnd.forem.api-v1+json" },
    body: JSON.stringify({ article }),
  })
  const body = (await response.json().catch(() => ({}))) as { url?: string; error?: string }
  if (response.status !== 201) {
    console.error(`dev.to answered ${response.status}: ${body.error ?? "no details"}`)
    process.exitCode = 1
    return
  }
  console.log(`Draft created: ${body.url ?? "(see your dev.to dashboard)"}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
