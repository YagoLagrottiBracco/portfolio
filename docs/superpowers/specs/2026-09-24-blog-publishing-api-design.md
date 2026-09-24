# Blog publishing API design

## Objective

Provide one authenticated HTTP endpoint that publishes a complete article in Portuguese, English, and Spanish. The endpoint writes the three MDX files to this repository and can either retain a remote HTTPS cover image or upload a supplied image to public/blog. The resulting Git commit triggers the existing deployment pipeline, so the article becomes available only after the normal build and SEO validation.

## Scope

Endpoint: POST /api/blog/publish

Authentication: Authorization: Bearer <BLOG_API_KEY>.

Persistence: GitHub Contents API, using BLOG_GITHUB_TOKEN. The endpoint never writes to the deployed server filesystem because serverless files are ephemeral. It creates one Git commit on BLOG_GITHUB_BRANCH (default main) in BLOG_GITHUB_REPOSITORY (owner/repository).

## Environment

- BLOG_API_KEY: high-entropy shared secret used by the caller.
- BLOG_GITHUB_TOKEN: fine-grained GitHub token with repository Contents read/write permission.
- BLOG_GITHUB_REPOSITORY: owner/repository, for example YagoLagrottiBracco/portfolio.
- BLOG_GITHUB_BRANCH: optional target branch; defaults to main.

No secret is returned by the endpoint, committed to Git, or exposed to browser code.

## Request contract

The JSON body has one article object with:

- translationKey: stable identifier shared by all locales.
- articles: object with exactly pt, en, and es entries.
- image: optional remote or upload image object.
- commitMessage: optional, otherwise generated from translationKey.

Each locale entry requires title, slug, excerpt, date, tags, and content. It may include updatedAt and draft. The existing blog validation is reused before any remote write: slugs must be lowercase kebab-case, body has no H1 and includes an H2, date and tags are valid, and the locale-specific slug is not already present in the repository.

The image accepts exactly one of:

- { kind: "remote", url, alt, width, height }, where url is HTTPS.
- { kind: "upload", filename, contentType, base64, alt, width, height }, where contentType is image/png, image/jpeg, image/webp, or image/avif. The server validates decoded bytes, limits the file to 5 MB, normalizes the filename, and writes it to public/blog/<translationKey>-<hash>.<extension>.

A remote image is written as image.url in each frontmatter. An uploaded image is written as image.src with the generated public path. All three localized MDX files include the same image reference by default.

## Flow

1. Reject malformed JSON, missing bearer token, invalid API key, or a body larger than 6 MB.
2. Validate that exactly three locale articles are present and that their translationKey matches the request.
3. Convert every locale entry into validated MDX frontmatter and Markdown.
4. If supplied, validate and prepare the image. For uploads, encode it for the GitHub API and add its public path to the MDX frontmatter.
5. Fetch the target branch tree from GitHub and reject conflicts with existing destination paths.
6. Create blobs for the image, if any, and the three MDX files. Create one tree and one commit, then update the configured branch reference.
7. Return 201 with commit SHA, article paths, public URLs, and the deployment-pending state.

No partial publication is possible because the three files and image are committed atomically in one Git commit.

## Error responses

- 400: invalid JSON or invalid article/image fields.
- 401: missing or invalid API key.
- 409: slug/path already exists or target branch changed during publish.
- 413: request or decoded image exceeds the configured limit.
- 502: GitHub API failure; no success response is returned.
- 201: commit created.

Errors contain a short machine-readable code and a safe human-readable message. They never include tokens, request image bytes, or GitHub response bodies.

## SEO and rendering

The endpoint emits the same frontmatter consumed by src/lib/blog-content.ts. Existing build-time validation therefore keeps canonical URLs, alternates, JSON-LD, sitemap entries, Open Graph data, and article images consistent. The endpoint rejects content that would fail that validation before it calls GitHub.

## Tests

Unit tests cover authentication parsing, exact three-locale requirements, MDX serialization, remote and uploaded images, dangerous filenames, invalid base64, image size/type limits, and duplicate destination paths. Route tests mock GitHub and verify that it creates a single commit with the three MDX files plus an optional public image. Existing blog parsing tests remain part of the full suite.