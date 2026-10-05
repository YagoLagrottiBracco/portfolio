import assert from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"
import { createBlogIndex } from "../src/lib/blog-content"
import { locales } from "../src/lib/i18n"
import { getCaseStudyProjects } from "../src/lib/projects"

const contentDirectory = join(process.cwd(), "src", "content", "blog")
const blog = createBlogIndex(
  readdirSync(contentDirectory)
    .filter((filename) => /\.(md|mdx)$/.test(filename))
    .map((filename) => ({ filename, source: readFileSync(join(contentDirectory, filename), "utf8") })),
)

test("every case study article exists in all three languages", () => {
  const linked = getCaseStudyProjects().filter((project) => project.caseStudy.articleKey)
  assert.ok(linked.length > 0)
  for (const project of linked) {
    for (const locale of locales) {
      const post = blog.getPostByTranslationKey(project.caseStudy.articleKey!, locale)
      assert.ok(post, `${project.slug} -> ${project.caseStudy.articleKey} (${locale})`)
      assert.equal(post.locale, locale)
    }
  }
})

test("architecture flows have distinct stages in every language", () => {
  for (const project of getCaseStudyProjects()) {
    const stages = project.caseStudy.diagram
    if (!stages) continue
    assert.ok(stages.length >= 3, project.slug)
    for (const locale of locales) {
      const titles: string[] = stages.map((stage) => stage.title[locale])
      assert.equal(new Set(titles).size, titles.length, `${project.slug} titles (${locale})`)
      for (const stage of stages) {
        const items: string[] = (stage.items ?? []).map((item) => item[locale])
        assert.equal(new Set(items).size, items.length, `${project.slug} items (${locale})`)
      }
    }
  }
})
