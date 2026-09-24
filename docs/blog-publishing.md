# Publicar no blog

Os posts vivem em `src/content/blog/`. Cada arquivo `.md` ou `.mdx` é Markdown: não use imports, componentes React ou HTML arbitrário.

## Frontmatter obrigatório

```yaml
---
title: "Título claro e específico"
slug: "titulo-claro-e-especifico"
translationKey: "mesmo-artigo-em-todos-os-idiomas"
excerpt: "Resumo factual que explica para quem é o artigo e o que ele resolve."
date: "2026-09-24"
tags: ["arquitetura de software", "typescript"]
locale: "pt"
---
```

`slug` deve ser globalmente único, em minúsculas e kebab-case. `translationKey` liga versões do mesmo texto; não invente uma tradução se ela não existir. Use `locale: pt`, `en` ou `es`. O título vira o único H1, então o corpo deve começar em `##`. Datas aceitam `YYYY-MM-DD` ou timestamp ISO com fuso horário.

Campos opcionais:

```yaml
updatedAt: "2026-09-25"
draft: true
image:
  src: "/blog/arquitetura-exemplo.webp"
  alt: "Descrição objetiva da imagem"
  width: 1200
  height: 630
```

Rascunhos e posts com data futura não entram em listagens, sitemap, canonical ou alternates. A imagem é local em `public/`, precisa de texto alternativo e dimensões reais. Sem imagem, o site gera a imagem social do artigo automaticamente.

## URLs e SEO gerados

- Listagem: `/blog` (pt), `/en/blog`, `/es/blog`.
- Artigo: `/blog/<slug>` em todos os idiomas.
- Cada artigo cria canonical próprio, title, description, Open Graph, Twitter card, `BlogPosting`, `BreadcrumbList`, hreflang e entrada no sitemap a partir do frontmatter.

A publicação ocorre no build/deploy. Antes de enviar, execute:

```powershell
npx.cmd tsx --test tests/blog-content.test.ts
npm.cmd run lint
npm.cmd run build
```

Para auditar o HTML local, inicie `npm.cmd run dev -- --port 3100` e execute:

```powershell
python scripts/seo-audit.py --base-url http://localhost:3100 --output docs/seo-audit-local.json
```

Escreva para uma pergunta de busca concreta, com experiência própria, exemplos que possam ser conferidos e links para fontes primárias. O schema e as meta tags ajudam a interpretar o conteúdo, mas não substituem qualidade editorial, relevância e indexação no Search Console.

Depois de publicar, valide uma URL no Rich Results Test, inspecione a URL no Search Console e envie o sitemap. Acompanhe Core Web Vitals de campo; um teste local não mede LCP, INP ou CLS reais.
