# Publicar no blog

Os posts vivem em src/content/blog/. Cada arquivo .md ou .mdx usa Markdown.

## Frontmatter obrigatorio

title: "Titulo claro e especifico"
slug: "titulo-claro-e-especifico"
translationKey: "mesmo-artigo-em-todos-os-idiomas"
excerpt: "Resumo factual que explica para quem e o artigo e o que ele resolve."
date: "2026-09-24"
tags: ["arquitetura de software", "typescript"]
locale: "pt"

Use locale: pt, en ou es. O titulo e o unico H1; o corpo deve iniciar com ##.

## Imagem opcional

image:
  url: "https://images.example.com/arquitetura-exemplo.webp"
  alt: "Descricao objetiva da imagem"
  width: 1200
  height: 630

Use url para uma imagem HTTPS. Para uma imagem no projeto, use src: "/blog/arquitetura-exemplo.webp" e salve o arquivo em public/. Informe alt, width e height reais.

## URLs e SEO

- Listagem: /blog (pt), /en/blog e /es/blog.
- Artigo: /blog/<slug> em todos os idiomas.
- O build cria canonical, meta description, Open Graph, Twitter card, BlogPosting, BreadcrumbList, hreflang e sitemap.

Antes de publicar, execute:

npx.cmd tsx --test tests/blog-content.test.ts tests/blog-image.test.ts tests/blog-routes.test.ts
npm.cmd run lint
npm.cmd run build

Para auditar HTML local:

npm.cmd run dev -- --port 3100
python scripts/seo-audit.py --base-url http://localhost:3100 --output docs/seo-audit-local.json