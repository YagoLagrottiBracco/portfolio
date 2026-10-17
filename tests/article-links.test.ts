import assert from "node:assert/strict"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"
import { extractLinks, internalPath, isExternal, routeOf, verdictFor } from "../src/lib/article-links"
import { createBlogIndex } from "../src/lib/blog-content"
import { getBlogFeedPath, getBlogIndexPath } from "../src/lib/blog-routes"
import { getCaseStudyPath } from "../src/lib/case-study-routes"
import { getCvPath } from "../src/lib/cv-routes"
import { locales } from "../src/lib/i18n"
import { getHomePath } from "../src/lib/locale-routes"
import { getPagePath, localizedPages } from "../src/lib/page-routes"
import { getPresentationPath } from "../src/lib/presentation"
import { getCaseStudyProjects } from "../src/lib/projects"
import { getResourceEntries, resourceSections } from "../src/lib/resource-catalog"
import { getResourcePath } from "../src/lib/resource-routes"
import { getStackPath, publishedTechs } from "../src/lib/stack"

test("finds markdown links, images and autolinks, but not code", () => {
  const links = extractLinks('Veja [o caso](/projetos/vmageste "título") e ![d](/blog/d.png).\n\n`[x](/no)`\n\n```\n[y](/nope)\n```\n\n<https://example.com/a>')
  assert.deepEqual(links, [{ url: "/projetos/vmageste", image: false }, { url: "/blog/d.png", image: true }, { url: "https://example.com/a", image: false }])
  assert.equal(internalPath("https://lagrotti.dev/blog/x?utm_source=a"), "/blog/x?utm_source=a")
  assert.equal(internalPath("https://lagrotti.devil.example/"), null)
  assert.equal(isExternal("https://www.lagrotti.dev/"), false)
  assert.equal(routeOf("/blog/x/?a=1#b"), "/blog/x")
  assert.deepEqual([200, 301, 404, 410, 500, 403, 429, 999, null].map(verdictFor), ["ok", "ok", "broken", "broken", "broken", "blocked", "blocked", "blocked", "broken"])
})

test("every internal link in every article points at a page or file that exists", () => {
  const directory = join(process.cwd(), "src", "content", "blog")
  const posts = createBlogIndex(readdirSync(directory).filter((name) => /\.mdx?$/.test(name)).map((filename) => ({ filename, source: readFileSync(join(directory, filename), "utf8") }))).getAllPosts()
  const routes = new Set<string>([
    ...locales.flatMap((locale) => [
      getHomePath(locale), getBlogIndexPath(locale), getBlogFeedPath(locale), getCvPath(locale), getStackPath(locale), getResourcePath(locale),
      ...localizedPages.map((page) => getPagePath(locale, page)),
      ...getCaseStudyProjects().flatMap((project) => [getCaseStudyPath(locale, project.slug), getPresentationPath(locale, project.slug)]),
      ...publishedTechs(posts).map((entry) => getStackPath(locale, entry.slug)),
      ...resourceSections.flatMap((section) => [getResourcePath(locale, section.slug), ...getResourceEntries(section.slug).map((entry) => getResourcePath(locale, section.slug, entry.slug))]),
    ]),
    ...posts.map((post) => post.url),
  ])
  const broken = posts.flatMap((post) =>
    extractLinks(post.content).flatMap(({ url }) => {
      const path = internalPath(url)
      if (!path) return []
      const route = routeOf(path)
      return routes.has(route) || existsSync(join(process.cwd(), "public", route)) ? [] : [`${post.slug} → ${url}`]
    })
  )
  assert.deepEqual(broken, [])
})
