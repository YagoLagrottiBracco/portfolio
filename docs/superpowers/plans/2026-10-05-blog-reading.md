# Blog Reading Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every existing article a clearer, accessible reading layout with a table of contents, useful code and image treatment, and richer cards.

**Architecture:** Markdown remains the source. A small parsing unit derives stable heading IDs and outline entries; one shared server-rendered Markdown component renders the public article and, later, the private preview. The page keeps its current metadata and static generation.

**Tech Stack:** Next.js 15, React 19, TypeScript, `react-markdown`, `remark-gfm`, `unified`, `remark-parse`, `mdast-util-to-string`, `github-slugger`, and `rehype-highlight`.

**Spec:** `docs/superpowers/specs/2026-10-05-blog-editor-design.md`

## Global Constraints

- Keep Markdown/MDX files in `src/content/blog`; preserve all 54 existing articles and `pt`/`en`/`es` URLs.
- Keep article content in server-rendered HTML; only the copy button requires client JavaScript.
- Preserve canonical, hreflang, Open Graph, BlogPosting, BreadcrumbList, and sitemap behavior.
- Do not execute raw HTML or scripts from Markdown.
- Do not stage unrelated files already modified in the shared workspace.

## Review Focus

- Repeated accented headings produce distinct stable anchors; Task 1 tests this.
- Unknown code fence languages render readable plain code; Task 2 tests this.
- `javascript:` links and image URLs never become executable output; Task 2 tests this.
- Wide tables remain usable on mobile; Task 2 tests the scroll wrapper.
- Missing image titles and covers do not produce empty captions or broken cards; Tasks 2 and 3 test these cases respectively.

---

### Task 1: Markdown outline and stable anchors

**Files:** Create `src/lib/blog-outline.ts`; create `tests/blog-outline.test.ts`; modify `package.json` and lockfile for direct AST and slugger dependencies.

**Interfaces:** Produce `BlogHeading = { depth: 2 | 3; id: string; text: string }`, `getBlogOutline(content: string): BlogHeading[]`, and `remarkBlogHeadingIds()`; both functions use the same GitHub-style slugger algorithm.

- [ ] **Step 1: Write `test("deduplicates outline anchors")`** with `assert.deepEqual(headings.map(h => h.depth), [2, 2, 3])`, `assert.notEqual(headings[0].id, headings[1].id)` and matching `id` values after `remarkBlogHeadingIds` processes `"## Visão geral\n\n## Visão geral\n\n### API"`. Include inline Markdown in one heading and assert plain `text`.
- [ ] **Step 2: Run** `node --import tsx --test tests/blog-outline.test.ts`; expect failure because the module is absent.
- [ ] **Step 3: Implement** the two exported functions in `src/lib/blog-outline.ts` using one slugger instance per document and skipping H1/H4+ in the outline.
- [ ] **Step 4: Run** the focused test; expect pass.
- [ ] **Step 5: Commit** only Task 1 files with `feat(blog): derive article outline`.

### Task 2: Shared safe Markdown renderer

**Files:** Create `src/components/blog/BlogMarkdown.tsx`, `src/components/blog/BlogCopyCode.tsx`, `src/lib/blog-markdown-url.ts`, `tests/blog-markdown.test.tsx`; modify `src/app/globals.css`; add `rehype-highlight` to `package.json` and lockfile.

**Interfaces:** Produce `BlogMarkdown({ content }: { content: string })`; consumes `remarkBlogHeadingIds`. Export `safeBlogUrl(url: string, kind: "link" | "image"): string | undefined` from `src/lib/blog-markdown-url.ts`; links permit HTTPS/HTTP, `mailto:`, anchors and single-slash local paths, while images permit HTTPS and single-slash local paths. The code component receives `code: string` and optional `language: string`.

- [ ] **Step 1: Write `test("renders safe rich markdown")`** with `renderToStaticMarkup`: `assert.match(html, /id="api"/)`, `assert.doesNotMatch(html, /href="javascript:|src="javascript:/)`, and `assert.match(html, /overflow-x-auto/)`. Also assert unknown-language code stays escaped, image title makes a caption and missing title does not.
- [ ] **Step 2: Run** `node --import tsx --test tests/blog-markdown.test.tsx`; expect missing renderer.
- [ ] **Step 3: Implement** `safeBlogUrl` and `BlogMarkdown` with GFM, the heading plugin, server highlighting, semantic figure/table/code markup and safe links. Keep raw HTML disabled. Make copy an optional client enhancement in `BlogCopyCode`.
- [ ] **Step 4: Run** both Task 1 and Task 2 tests; expect pass.
- [ ] **Step 5: Commit** only Task 2 files with `feat(blog): render rich markdown safely`.

### Task 3: Article layout and cards

**Files:** Modify `src/components/blog/BlogArticle.tsx`, `src/components/blog/BlogIndex.tsx`, `src/components/blog/BlogPostList.tsx` (create it if absent on the execution branch), `src/app/blog/[slug]/page.tsx`, and `src/app/globals.css`; create `tests/blog-article-layout.test.tsx`.

**Interfaces:** `BlogArticle({ post, translations }: { post: BlogPost; translations: BlogPost[] })` receives translations explicitly so the private preview can reuse it. The public page passes `getPostTranslations(post)`. `BlogIndex` passes optional cover fields to its list component.

- [ ] **Step 1: Write `test("article and cards remain readable")`** with `assert.equal((html.match(/<h1/g) ?? []).length, 1)`, `assert.match(html, /href="#api"/)`, and checks for date/read time, no empty `figcaption`, and a linked card with and without a cover.
- [ ] **Step 2: Run** `node --import tsx --test tests/blog-article-layout.test.tsx`; expect failure on the missing outline/cover behavior.
- [ ] **Step 3: Implement** responsive article spacing, outline navigation, cover-aware cards, code/table styling and the shared `BlogMarkdown` call. Keep existing metadata/page routes intact.
- [ ] **Step 4: Run** focused tests plus `npm run lint`, `npm test`, and `npm run build`; expect all pass. Inspect one PT and one EN article at desktop and mobile widths, including a wide table and code block.
- [ ] **Step 5: Commit** only Task 3 files with `feat(blog): improve article reading layout`.
