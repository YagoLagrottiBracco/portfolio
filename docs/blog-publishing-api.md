# Blog publishing API

POST /api/blog/publish publishes one complete article set.

## Configuration

Set these server environment variables in the deployment platform:

- BLOG_API_KEY: secret sent in the Bearer Authorization header.
- BLOG_GITHUB_TOKEN: fine-grained GitHub token with Contents read/write permission.
- BLOG_GITHUB_REPOSITORY: owner/repository, for example YagoLagrottiBracco/portfolio.
- BLOG_GITHUB_BRANCH: branch to receive the commit; defaults to main.

Do not expose these values in browser code or commit them to Git.

## Request

Send Authorization: Bearer YOUR_BLOG_API_KEY and JSON with all three languages.

```json
{
  "translationKey": "my-article",
  "articles": {
    "pt": { "title": "Titulo", "slug": "meu-artigo", "excerpt": "Resumo.", "date": "2026-09-24", "tags": ["seo"], "content": "## Conteudo\n\nTexto." },
    "en": { "title": "Title", "slug": "my-article", "excerpt": "Summary.", "date": "2026-09-24", "tags": ["seo"], "content": "## Content\n\nText." },
    "es": { "title": "Titulo", "slug": "mi-articulo", "excerpt": "Resumen.", "date": "2026-09-24", "tags": ["seo"], "content": "## Contenido\n\nTexto." }
  },
  "image": {
    "kind": "remote",
    "url": "https://images.example.com/cover.webp",
    "alt": "Cover description",
    "width": 1200,
    "height": 630
  }
}
```

For a local public image, replace image with:

```json
{
  "kind": "upload",
  "filename": "cover.webp",
  "contentType": "image/webp",
  "base64": "BASE64_IMAGE_BYTES",
  "alt": "Cover description",
  "width": 1200,
  "height": 630
}
```

The API accepts PNG, JPEG, WebP, and AVIF uploads up to 5 MB. It saves uploaded files under public/blog and writes image.src into each MDX frontmatter. Remote images must use HTTPS and are written as image.url.

## Responses

- 201: commitSha, article URLs, and status deployment-pending.
- 400: invalid JSON or article/image fields.
- 401: missing or invalid API key.
- 409: the target branch changed during publication.
- 413: uploaded image exceeds 5 MB.
- 502: GitHub or server configuration error.

A 201 means GitHub accepted one atomic commit containing the three MDX files and optional image. The normal Git deployment then builds the site and its SEO metadata.