# Blog Publishing API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Provide an authenticated endpoint that atomically publishes a Portuguese, English, and Spanish MDX article plus an optional remote or uploaded cover image.

**Architecture:** A pure publishing module validates and serializes the request into MDX and an optional public image. A narrow GitHub client creates blobs, a tree, and one commit. The Next.js route authenticates the bearer token, invokes those units, and returns safe JSON responses.

**Tech Stack:** Next.js 15 Route Handlers, TypeScript, node:test, node:crypto, GitHub REST Git Data API, gray-matter.

**Spec:** docs/superpowers/specs/2026-09-24-blog-publishing-api-design.md

## Global Constraints

- Require exactly pt, en, and es article entries in every request.
- Authenticate only with server-side BLOG_API_KEY and never expose it.
- Persist with BLOG_GITHUB_TOKEN through the GitHub Git Data API; do not write deployment filesystem state.
- Accept remote HTTPS images and local uploads limited to 5 MB in PNG, JPEG, WebP, or AVIF.
- Publish the three MDX files and optional image atomically in one Git commit.
- Reuse createBlogIndex validation before a remote write.
- Preserve existing SEO frontmatter fields and image semantics.

## Review Focus

- A valid base64 string can still decode to an invalid or oversized image; reject it before GitHub calls.
- A request can contain all three locale keys while using duplicate or unsafe slugs; reject before serialization.
- A path may appear safe before normalization but contain traversal segments or a hidden extension; generated paths must be server-owned.
- The branch can move after its head SHA was read; surface GitHub's non-fast-forward failure as 409 without retrying.
- A valid remote URL must remain HTTPS after parsing; reject malformed, protocol-relative, and non-HTTPS URLs.

---

## File structure

- Create: src/lib/blog-publishing.ts - request types, validation, image normalization, MDX serialization, and publication file plan.
- Create: src/lib/github-git-data.ts - fetch wrapper and atomic tree/commit/ref update operation.
- Create: src/app/api/blog/publish/route.ts - Next route authentication, JSON limits, orchestration, and HTTP response mapping.
- Create: tests/blog-publishing.test.ts - pure validation and serialization tests.
- Create: tests/github-git-data.test.ts - mocked GitHub atomic commit tests.
- Create: tests/blog-publish-route.test.ts - authenticated request and response tests.
- Create: .env.example - server-only configuration names without values.
- Create: docs/blog-publishing-api.md - request examples, setup, error codes, and deployment behavior.
- Modify: docs/blog-publishing.md - link writers to the API guide.
- Modify: package.json only if a new test command is required; otherwise preserve current dependencies.

### Task 1: Validate and serialize an article batch

**Files:**
- Create: src/lib/blog-publishing.ts
- Test: tests/blog-publishing.test.ts

**Interfaces:**
- Produces: `parsePublishRequest(input: unknown): PublishRequest`.
- Produces: `preparePublication(request: PublishRequest): PreparedPublication`.
- Produces: `PublishError { code: string; status: 400 | 413; message: string }`.
- Consumes: `createBlogIndex(sources)` from src/lib/blog-content.ts.

- [ ] **Step 1: Write the failing tests**

```ts
test("requires exactly pt, en, and es article bodies", () => {
  assert.throws(() => parsePublishRequest({ translationKey: "article", articles: { pt: article("pt") } }), /pt.*en.*es/i)
})

test("serializes three MDX files and an HTTPS image URL", () => {
  const publication = preparePublication(parsePublishRequest(remotePayload()))
  assert.deepEqual(publication.files.map(file => file.path), [
    "src/content/blog/article.pt.mdx",
    "src/content/blog/article.en.mdx",
    "src/content/blog/article.es.mdx",
  ])
  assert.match(publication.files[0].content, /url: https:\/\/images.example.com\/cover.webp/)
})

test("stores a valid uploaded WebP below public/blog", () => {
  const publication = preparePublication(parsePublishRequest(uploadPayload()))
  assert.match(publication.files.at(-1)!.path, /^public\/blog\/article-[a-f0-9]{12}\.webp$/)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx.cmd tsx --test tests/blog-publishing.test.ts`

Expected: FAIL because src/lib/blog-publishing.ts does not exist.

- [ ] **Step 3: Implement the validation module**

```ts
export function parsePublishRequest(input: unknown): PublishRequest
export function preparePublication(request: PublishRequest): PreparedPublication
```

Implement exact locale keys, matching translationKey, fields required by blog-content, safe kebab-case slugs, Markdown body validation through createBlogIndex, 6 MB encoded body guard, and MDX frontmatter generated with gray-matter. For uploads, decode base64, check 5 MB decoded length and the supplied MIME type, derive an extension from an allowlist, hash bytes with SHA-256, and use only the generated public/blog path.

- [ ] **Step 4: Add failure tests and make them pass**

```ts
test("rejects non-HTTPS image URLs", () => assert.throws(() => parsePublishRequest(remotePayload({ url: "http://example.com/a.png" })), /HTTPS/))
test("rejects traversal filenames and oversized uploads", () => assert.throws(() => parsePublishRequest(uploadPayload({ filename: "../cover.png", base64: oversizedBase64 })), /filename|size/i))
test("rejects article content that fails the existing blog SEO validator", () => assert.throws(() => preparePublication(parsePublishRequest(payloadWithBody("# duplicate h1"))), /H1/i))
```

Run: `npx.cmd tsx --test tests/blog-publishing.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/blog-publishing.ts tests/blog-publishing.test.ts
git commit -m "feat: validate blog publishing payloads"
```

### Task 2: Create the GitHub atomic commit client

**Files:**
- Create: src/lib/github-git-data.ts
- Test: tests/github-git-data.test.ts

**Interfaces:**
- Consumes: `PreparedFile { path: string; content: string | Uint8Array; encoding: "utf8" | "base64" }`.
- Produces: `commitFiles(input: GitHubCommitInput): Promise<{ sha: string }>`.
- Throws: `GitHubPublishError { kind: "conflict" | "upstream"; message: string }`.

- [ ] **Step 1: Write the failing tests**

```ts
test("creates blobs, one tree, one commit, and one branch update", async () => {
  const fetch = createGitHubFetchMock()
  const result = await commitFiles({ fetch, repository: "owner/repo", branch: "main", token: "token", files: preparedFiles })
  assert.equal(result.sha, "commit-sha")
  assert.deepEqual(fetch.paths(), [
    "GET /repos/owner/repo/git/ref/heads/main",
    "GET /repos/owner/repo/git/commits/head-sha",
    "POST /repos/owner/repo/git/blobs",
    "POST /repos/owner/repo/git/trees",
    "POST /repos/owner/repo/git/commits",
    "PATCH /repos/owner/repo/git/refs/heads/main",
  ])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx.cmd tsx --test tests/github-git-data.test.ts`

Expected: FAIL because src/lib/github-git-data.ts does not exist.

- [ ] **Step 3: Implement the Git Data API client**

Use fetch against https://api.github.com. Read the branch ref and head commit, create one blob per file, create a tree whose base_tree is the head tree, create one commit whose parent is the head SHA, then PATCH the branch ref with force false. Send GitHub API version and bearer token headers. Translate 409 and 422 ref-update responses to conflict errors; translate other non-2xx responses to upstream errors without returning response bodies.

- [ ] **Step 4: Add conflict and encoding tests**

```ts
test("surfaces a changed branch as a conflict", async () => {
  await assert.rejects(() => commitFiles(conflictingInput), error => error.kind === "conflict")
})
test("base64 encodes uploaded bytes in GitHub blob payloads", async () => {
  await commitFiles(uploadInput)
  assert.equal(mock.lastBlob().encoding, "base64")
})
```

Run: `npx.cmd tsx --test tests/github-git-data.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/lib/github-git-data.ts tests/github-git-data.test.ts
git commit -m "feat: commit blog batches through GitHub"
```

### Task 3: Expose the authenticated route

**Files:**
- Create: src/app/api/blog/publish/route.ts
- Test: tests/blog-publish-route.test.ts

**Interfaces:**
- Consumes: `parsePublishRequest`, `preparePublication`, and `commitFiles`.
- Produces: POST endpoint /api/blog/publish returning 201, 400, 401, 409, 413, or 502 JSON.

- [ ] **Step 1: Write the failing route tests**

```ts
test("returns 401 without a matching bearer key", async () => {
  const response = await POST(request(payload, {}))
  assert.equal(response.status, 401)
})
test("returns 201 with article URLs after one atomic commit", async () => {
  const response = await POST(request(validPayload, { authorization: "Bearer test-key" }))
  assert.deepEqual(await response.json(), {
    commitSha: "commit-sha",
    status: "deployment-pending",
    urls: ["/blog/artigo", "/blog/article", "/blog/articulo"],
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx.cmd tsx --test tests/blog-publish-route.test.ts`

Expected: FAIL because the route does not exist.

- [ ] **Step 3: Implement POST**

Set `export const runtime = "nodejs"`. Compare the bearer token with BLOG_API_KEY using timingSafeEqual after checking identical byte lengths. Reject missing required environment variables with a 502 configuration error. Parse JSON once, pass it to the pure module, invoke the GitHub client, and map known errors to the specified status and `{ error: { code, message } }` response. Return no raw request data, token, image bytes, or GitHub error text.

- [ ] **Step 4: Add route boundary tests**

```ts
test("returns 413 before GitHub when decoded image exceeds 5 MB", async () => {
  const response = await POST(request(oversizedPayload, auth))
  assert.equal(response.status, 413)
  assert.equal(mockCommitCalls, 0)
})
test("returns 409 when GitHub rejects the branch update", async () => {
  const response = await POST(request(validPayload, auth))
  assert.equal(response.status, 409)
})
```

Run: `npx.cmd tsx --test tests/blog-publish-route.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/app/api/blog/publish/route.ts tests/blog-publish-route.test.ts
git commit -m "feat: add authenticated blog publishing API"
```

### Task 4: Document configuration and verify the release artifact

**Files:**
- Create: .env.example
- Create: docs/blog-publishing-api.md
- Modify: docs/blog-publishing.md
- Modify: package.json only if test invocation needs a script.

**Interfaces:**
- Documents: POST /api/blog/publish request schema, remote and upload image examples, environment configuration, error responses, and deploy behavior.

- [ ] **Step 1: Write a documentation-presence test**

```ts
test("documents every required server environment variable", () => {
  const envExample = readFileSync(".env.example", "utf8")
  for (const name of ["BLOG_API_KEY", "BLOG_GITHUB_TOKEN", "BLOG_GITHUB_REPOSITORY"]) {
    assert.match(envExample, new RegExp("^" + name + "=", "m"))
  }
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx.cmd tsx --test tests/blog-publish-docs.test.ts`

Expected: FAIL because .env.example and the test do not exist.

- [ ] **Step 3: Add configuration and usage documentation**

Put blank values in .env.example. In docs/blog-publishing-api.md include a curl request with an Authorization placeholder, complete pt/en/es payload shape, one remote image example, one base64 upload example, and the 201/400/401/409/413/502 response contract. State that a Git commit triggers deployment and request success is deployment-pending.

- [ ] **Step 4: Run full verification**

Run:

```powershell
npx.cmd tsx --test tests/blog-content.test.ts tests/blog-image.test.ts tests/blog-routes.test.ts tests/blog-publishing.test.ts tests/github-git-data.test.ts tests/blog-publish-route.test.ts tests/blog-publish-docs.test.ts
npx.cmd tsc --noEmit
npm.cmd run lint
npm.cmd run build
```

Expected: all tests pass, no TypeScript or lint errors, and Next.js builds /api/blog/publish plus existing blog routes.

- [ ] **Step 5: Commit**

```powershell
git add .env.example docs/blog-publishing-api.md docs/blog-publishing.md tests/blog-publish-docs.test.ts package.json
git commit -m "docs: explain blog publishing API"
```