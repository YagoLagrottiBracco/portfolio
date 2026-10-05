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

## Editor privado e cron

O editor visual em `/admin/blog` usa GitHub OAuth. Configure `AUTH_SECRET`, `AUTH_URL`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` e `BLOG_ADMIN_GITHUB_ID`, além das variáveis GitHub acima. A callback do OAuth App é `/api/auth/callback/github` na origem do site. `AUTH_URL` deve ser essa origem exata, com protocolo e porta quando houver; o Auth.js a usa também para confiar no host. Veja [a configuração completa](blog-publishing.md).

O cron do ChatGPT Work continua chamando **POST /api/blog/publish** com o mesmo Bearer token e o mesmo JSON: não precisa enviar sessão web, CSRF ou versões de arquivo. Sem `draft`, ou com `draft: false`, cada idioma é publicado diretamente após o deploy. Com `draft: true` nos três idiomas, o conjunto entra na lista privada. O editor exibe também estados mistos quando o cron envia valores de `draft` diferentes entre idiomas; o contrato atual da API permanece igual.

As rotas privadas são `GET/POST /api/admin/blog` e `GET/PUT /api/admin/blog/[translationKey]`. Elas exigem sessão GitHub autorizada; as mutações exigem origem, JSON e token CSRF da sessão. Ao salvar, o editor compara as versões dos três arquivos que abriu com a branch atual. Um **409** mantém a edição no navegador para comparação. O resultado de sucesso usa `status: "deployment-pending"`: o conteúdo público muda após o deploy habitual.
