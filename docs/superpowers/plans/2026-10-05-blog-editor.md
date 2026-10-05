# Visual Blog Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a private browser editor for the three-language Git-backed blog while preserving the ChatGPT Work publishing API.

**Architecture:** Auth.js grants one GitHub account access to admin pages and routes. Server-only repository and validation units read/write MDX and image blobs in one GitHub commit with optimistic concurrency; a Milkdown Crepe client edits Markdown, offers source fallback, and previews with the public article component. This plan runs after `2026-10-05-blog-reading.md`.

**Tech Stack:** Next.js 15, React 19, TypeScript, `next-auth@beta` GitHub provider, `@milkdown/crepe`, `@milkdown/react`, `@milkdown/kit`, `sharp`, existing `gray-matter` and GitHub Git API.

**Spec:** `docs/superpowers/specs/2026-10-05-blog-editor-design.md`

## Global Constraints

- Keep `src/content/blog/*.mdx` and GitHub commits as the sole content store; no database or migration of the 54 current files.
- Require PT, EN and ES before an admin draft or publication is committed; preserve `translationKey`, existing slugs and all unknown frontmatter fields on edits.
- Preserve `POST /api/blog/publish`, its Bearer authentication, request and response contract, and direct publishing when `draft` is absent or false.
- Keep `BLOG_GITHUB_TOKEN`, `BLOG_API_KEY`, OAuth secret and admin ID server-only; never return drafts to visitors.
- Commit three locale files and staged images atomically; use per-path blob versions and return 409 for conflicts.
- Do not stage unrelated changes in the shared workspace.

## Review Focus

- A signed-in GitHub user with a different numeric account ID gets 403 on read and write; Task 1 tests this.
- A cron commit between opening and saving an article returns 409 without losing the editor's local text; Tasks 3 and 6 test this.
- A staged image placeholder without matching validated bytes is rejected before a GitHub commit; Task 4 tests this.
- Markdown unsupported by Crepe opens in source mode and cannot be silently rewritten; Task 5 tests this against the existing corpus.
- A mixed `draft` value from the unchanged cron API appears with the correct per-language status; Task 2 tests this.

---

### Task 1: GitHub login and server authorization

**Files:** Create `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/lib/blog-admin-auth.ts`, `tests/blog-admin-auth.test.ts`; modify `.env.example`, `package.json`, and lockfile.

**Interfaces:** Export `auth`, `signIn`, `signOut` from `src/auth.ts`; `authorizeBlogAdmin(session: Session | null, allowedGithubId: string): "ok" | "unauthenticated" | "forbidden"`; `verifyAdminMutation(input: { origin: string | null; expectedOrigin: string; contentType: string | null; csrfHeader: string | null; csrfSession: string }): boolean`. The Auth.js JWT stores GitHub numeric ID and a random CSRF nonce, exposed only to the signed-in session. Resolve `expectedOrigin` from the configured deployment URL, not a client-supplied Host header.

- [ ] **Step 1: Write `test("authorizes only the configured GitHub ID")`** with `assert.equal(authorizeBlogAdmin(null, "42"), "unauthenticated")`, wrong ID → `forbidden`, exact ID → `ok`. In `test("rejects forged admin writes")`, assert `verifyAdminMutation` returns false for wrong origin, content type or CSRF token.
- [ ] **Step 2: Run** `node --import tsx --test tests/blog-admin-auth.test.ts`; expect missing module.
- [ ] **Step 3: Implement** GitHub OAuth with JWT session, numeric account ID allowlist, session-bound CSRF token and the pure guards. Add `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`, `BLOG_ADMIN_GITHUB_ID` to `.env.example`.
- [ ] **Step 4: Run** the focused test and `npm run lint`; expect pass.
- [ ] **Step 5: Commit** only Task 1 files with `feat(blog): protect editor with GitHub login`.

### Task 2: Admin document model and listing

**Files:** Modify `src/lib/blog-content.ts`; create `src/lib/blog-admin-document.ts`, `src/lib/blog-admin-repository.ts`, `tests/blog-admin-document.test.ts`, `tests/blog-admin-repository.test.ts`.

**Interfaces:** Export `parseBlogSource({ filename, source })` from `blog-content.ts` with `draft` retained. Define `AdminArticle = ArticleInput & { locale: Locale; draft: boolean; sourcePath: string; blobSha: string; extraFrontmatter: Record<string, unknown> }` and `BlogAdminBundle = { translationKey: string; articles: Partial<Record<Locale, AdminArticle>>; image?: BlogImage }`. Export `groupBlogSources(sources): BlogAdminBundle[]`, `listBlogBundles(config: GitHubBlogConfig): Promise<BlogAdminBundle[]>`, `loadBlogBundle(config: GitHubBlogConfig, translationKey: string): Promise<BlogAdminBundle | null>`; `GitHubBlogConfig = { repository: string; branch: string; token: string; fetch?: typeof globalThis.fetch }`.

- [ ] **Step 1: Write `test("groups locale sources without losing draft state")`** with `assert.deepEqual(Object.keys(bundle.articles).sort(), ["en", "es", "pt"])`, `assert.equal(bundle.articles.en?.draft, true)`, and an assertion that an unknown frontmatter field survives. Mock GitHub tree/blob reads and assert unrelated paths are absent.
- [ ] **Step 2: Run** both Task 2 test files; expect missing exports.
- [ ] **Step 3: Implement** the public/private parser reuse and GitHub read service. Encode requested paths; reject truncated Git trees instead of showing an incomplete list. Keep token use server-only.
- [ ] **Step 4: Run** both focused tests and existing `tests/blog-content.test.ts`; expect pass.
- [ ] **Step 5: Commit** only Task 2 files with `feat(blog): read editable article bundles`.

### Task 3: Atomic create and update with conflict detection

**Files:** Modify `src/lib/github-git-data.ts`; create `src/lib/blog-admin-save.ts`, `tests/blog-admin-save.test.ts`; extend `tests/github-git-data.test.ts`.

**Interfaces:** `AdminSaveInput = { translationKey: string; articles: Record<Locale, ArticleInput>; image?: RemoteImageInput | UploadImageInput; publish: boolean }`; `PreparedAdminSave = PreparedPublication & { expectedBlobs: Record<string, string | null>; deletePaths: string[] }`. `prepareAdminSave(input: AdminSaveInput, existing: BlogAdminBundle | null, allSlugs: string[]): PreparedAdminSave` returns three serialized MDX files and preserves extra frontmatter. `commitFiles` gains optional `expectedBlobs` and `deletePaths`; existing callers remain valid. Task 4 extends `AdminSaveInput` with staged assets.

- [ ] **Step 1: Write `test("saves three locales atomically")`** with `assert.equal(prepared.files.filter(f => f.path.endsWith(".mdx")).length, 3)` and `assert.equal(prepared.expectedBlobs[oldPath], oldSha)`. Add assertions for published-slug lock, duplicate slug, unknown frontmatter, public edit status, blob mismatch → `conflict`, and a final-ref branch race → `conflict`.
- [ ] **Step 2: Run** Task 3 tests; expect missing save function/options.
- [ ] **Step 3: Implement** validation/serialization through `createBlogIndex` and GitHub tree preconditions. Deleting a renamed draft path and writing replacement paths happens in the same tree; no force update.
- [ ] **Step 4: Run** focused tests plus `tests/blog-publishing.test.ts` and `tests/blog-publish-route.test.ts`; expect the cron contract unchanged.
- [ ] **Step 5: Commit** only Task 3 files with `feat(blog): save articles with Git conflicts`.

### Task 4: Staged image assets and safe Markdown

**Files:** Create `src/lib/blog-admin-assets.ts`, `tests/blog-admin-assets.test.ts`; modify `src/lib/blog-admin-save.ts` and its tests; add `sharp` to `package.json` and lockfile.

**Interfaces:** `StagedAsset = { id: string; filename: string; contentType: string; base64: string; alt: string; width: number; height: number }`. Extend `AdminSaveInput` with `assets?: StagedAsset[]`. `prepareBlogAssets(assets: StagedAsset[], markdownByLocale: Record<Locale, string>, translationKey: string): { files: PreparedFile[]; markdownByLocale: Record<Locale, string> }` resolves `blog-asset://<id>` references to `/blog/<translationKey>-<hash>.<ext>`. `validateBlogMarkdown(content: string): void` rejects raw HTML and unsafe link/image protocols outside code blocks. The same byte/dimension checks apply to a newly uploaded cover.

- [ ] **Step 1: Write `test("rejects missing staged image")`** with `assert.throws(() => prepareBlogAssets([], { pt: "![a](blog-asset://x)", en: "## E", es: "## S" }, "key"), /asset/)`. Add tests asserting magic-byte, dimension, size, duplicate-placeholder, unsafe-URL and raw-HTML rejection, while fenced literal HTML is accepted.
- [ ] **Step 2: Run** Task 4 tests; expect missing module.
- [ ] **Step 3: Implement** `sharp` metadata checks for PNG/JPEG/WebP/AVIF, SHA-based paths, safe placeholder replacement and AST-based Markdown validation. Add image files to the Task 3 commit; leave the cron API image contract unchanged.
- [ ] **Step 4: Run** focused tests and existing publishing tests; expect pass.
- [ ] **Step 5: Commit** only Task 4 files with `feat(blog): validate staged editor images`.

### Task 5: Visual editor with Markdown fallback

**Files:** Create `src/components/blog-admin/VisualMarkdownEditor.tsx`, `src/lib/blog-editor-roundtrip.ts`, `tests/blog-editor-roundtrip.test.ts`; modify `package.json` and lockfile for Milkdown and a DOM test environment.

**Interfaces:** `VisualMarkdownEditor({ value, onChange, onStageAsset }: { value: string; onChange: (markdown: string) => void; onStageAsset: (file: File) => Promise<string> })`; `checkMarkdownRoundtrip(original: string, serialized: string): { safe: boolean; reason?: string }` compares text and block structure while ignoring formatting-only serialization differences.

- [ ] **Step 1: Write `test("keeps Markdown content across visual conversion")`** with `assert.equal(checkMarkdownRoundtrip(original, serialized).safe, true)` for code, links, lists, quotes and tables. Run all 54 current bodies through Crepe parse → serialize in a DOM harness; for unsupported synthetic input assert `safe === false` and the source tab remains active.
- [ ] **Step 2: Run** `node --import tsx --test tests/blog-editor-roundtrip.test.ts`; expect missing module.
- [ ] **Step 3: Implement** client-only Crepe with H2/H3, bold, italic, links, lists, quote, divider, language-tagged code, table and image controls, source tab, dirty state and staged image callback. On opening, compare roundtrip before enabling visual editing; validate every visual serialization before emitting it.
- [ ] **Step 4: Run** the focused corpus test, `npm run lint`, and `npm run build`; expect pass.
- [ ] **Step 5: Commit** only Task 5 files with `feat(blog): add visual markdown editing`.

### Task 6: Private routes, form and preview

**Files:** Create `src/app/admin/blog/layout.tsx`, `src/app/admin/blog/page.tsx`, `src/app/admin/blog/new/page.tsx`, `src/app/admin/blog/[translationKey]/page.tsx`, `src/app/api/admin/blog/route.ts`, `src/app/api/admin/blog/[translationKey]/route.ts`, `src/components/blog-admin/BlogEditorForm.tsx`, `src/components/blog-admin/BlogAdminList.tsx`, `src/lib/blog-admin-handler.ts`, `tests/blog-admin-handler.test.ts`; modify `src/app/globals.css`.

**Interfaces:** `GET/POST /api/admin/blog` list/create and `GET/PUT /api/admin/blog/[translationKey]` read/update. All check `authorizeBlogAdmin`; writes also check `verifyAdminMutation`. JSON errors use `{ error: { code, message } }`; success uses `{ commitSha, status: "deployment-pending", urls }`. `BlogEditorForm` uses the Task 5 editor and the required `BlogArticle({ post, translations })` from the reading plan for preview.

- [ ] **Step 1: Write `test("admin routes enforce auth and publication state")`** with `assert.equal(guestResponse.status, 401)`, `assert.equal(otherUserResponse.status, 403)`, `assert.equal(staleResponse.status, 409)` and `assert.equal(successResponse.status, 201)`. Add cases for CSRF/origin 403, invalid article 400, oversized image 413, GitHub failure 502, list/detail GET, and unchanged cron Bearer publication.
- [ ] **Step 2: Run** `node --import tsx --test tests/blog-admin-handler.test.ts`; expect missing handler.
- [ ] **Step 3: Implement** guarded routes and responsive private pages. The form has PT/EN/ES tabs, title, slug, excerpt, date, tags, shared cover with alt/dimensions, editorial prompts, source/visual tabs, unsaved-change warning, preview, save draft and publish actions. Show a recoverable 409 state without clearing the local form. Mark admin pages `noindex` and dynamic.
- [ ] **Step 4: Run** focused tests, `npm test`, `npm run lint`, and `npm run build`; expect pass. In a browser test fixture with mocked authentication, verify desktop/mobile editing, published and draft previews, keyboard navigation and a no-JavaScript public article. Verify the real OAuth callback after its credentials are configured.
- [ ] **Step 5: Commit** only Task 6 files with `feat(blog): add private publishing workspace`.

### Task 7: Configuration and end-to-end handoff

**Files:** Modify `docs/blog-publishing.md`, `docs/blog-publishing-api.md`, `.env.example`; create `tests/blog-admin-docs.test.ts`.

**Interfaces:** Document GitHub OAuth app callback, `BLOG_ADMIN_GITHUB_ID`, server secrets, private editor paths, draft behavior, conflict recovery and deployment-pending status. State that cron callers need no payload changes.

- [ ] **Step 1: Write `test("documents editor and cron setup")`** with `assert.match(docs, /BLOG_ADMIN_GITHUB_ID/)`, `assert.match(docs, /\/admin\/blog/)`, and `assert.match(docs, /POST \/api\/blog\/publish/)`; check every other new env name in the same test.
- [ ] **Step 2: Run** `node --import tsx --test tests/blog-admin-docs.test.ts`; expect failure.
- [ ] **Step 3: Update** docs and env example with concrete setup and manual verification steps.
- [ ] **Step 4: Run** focused tests, all tests, lint, build, and a final browser pass for one existing code-heavy post and a new three-language draft; expect pass.
- [ ] **Step 5: Commit** only Task 7 files with `docs(blog): explain visual editor setup`.
