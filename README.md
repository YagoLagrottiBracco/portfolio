# Yago Lagrotti Bracco — Portfolio (`lagrotti.dev`)

Portfólio pessoal em três idiomas (português, inglês e espanhol), construído com Next.js 15 e React 19. Reúne estudos de caso de engenharia, projetos, experiência, um blog técnico e um currículo em PDF gerado a partir dos mesmos dados do site.

## Stack

| Categoria | Tecnologia |
| --- | --- |
| Framework | **Next.js 15** (App Router) |
| UI | **React 19** + **TypeScript 5** |
| Estilização | **Tailwind CSS 4** |
| Componentes | Radix UI via shadcn/ui |
| Animações | Framer Motion |
| Blog | Arquivos MDX em `src/content/blog`, com `gray-matter` e `react-markdown` |
| Currículo | `pdf-lib` |
| Testes | `node:test` (unitários) e Playwright (navegador) |
| Deploy | **Vercel** |

## Scripts

```bash
npm run dev          # Servidor de desenvolvimento em localhost:3000
npm run build        # Build de produção
npm run start        # Serve o build de produção
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Testes unitários
npm run test:e2e     # Testes no navegador (rode `npm run build` antes)
npm run check:links  # Confere se os links dos projetos ainda respondem
```

Os testes de navegador precisam do Chromium do Playwright: `npx playwright install --with-deps chromium`.

## Rotas e idiomas

Cada página existe uma vez por idioma. O português fica sem prefixo e é o canônico; inglês e espanhol ficam sob `/en` e `/es`.

| Página | Português | Inglês | Espanhol |
| --- | --- | --- | --- |
| Home | `/` | `/en` | `/es` |
| Estudo de caso | `/projetos/[slug]` | `/en/projetos/[slug]` | `/es/projetos/[slug]` |
| Índice do blog | `/blog` | `/en/blog` | `/es/blog` |
| Feed RSS | `/blog/feed.xml` | `/en/blog/feed.xml` | `/es/blog/feed.xml` |
| Currículo (PDF) | `/cv/pt` | `/cv/en` | `/cv/es` |

Os artigos do blog ficam todos em `/blog/[slug]`; o idioma vem do próprio artigo.

Nessas páginas o idioma é o da URL, e o servidor já entrega o HTML traduzido, com o `<html lang>` certo e `hreflang` apontando para as outras versões. Para isso há três layouts raiz em `src/app` (veja [docs/architecture.md](docs/architecture.md)); uma página nova precisa ficar dentro de um deles. Uma visita a `/` é encaminhada para `/en` ou `/es` conforme o idioma do navegador (`src/middleware.ts`); quem escolhe um idioma no seletor passa a ser respeitado por um cookie. Requisições sem `Accept-Language`, como as dos buscadores, recebem a versão em português.

## Onde fica cada coisa

```text
src/
├── app/                 # Rotas (App Router): (pt), [locale] e (article), cada um com seu layout raiz
├── components/
│   ├── atoms/           # LanguageSwitcher, ThemeToggle, SkipLink
│   ├── molecules/       # ArchitectureFlow
│   ├── RootDocument.tsx # <html> compartilhado pelos três layouts raiz
│   ├── organisms/       # Seções da home, HomeScreen, CaseStudyScreen, CaseStudyView
│   ├── blog/            # Índice, lista com filtro e artigo
│   └── ui/              # Primitivos shadcn/ui
├── content/blog/        # Artigos, um arquivo por idioma
├── contexts/            # TranslationContext (i18n próprio, sem biblioteca)
├── data/
│   ├── personal.ts      # Fonte única de dados pessoais, experiências e projetos
│   └── content-labels.ts# Tradução de rótulos curtos (métricas, competências)
├── lib/                 # Rotas por idioma, metadados, blog, currículo, analytics
└── messages/            # Textos de interface: pt.json, en.json, es.json
```

Mais detalhes em [docs/architecture.md](docs/architecture.md). A publicação de artigos está em [docs/blog-publishing.md](docs/blog-publishing.md) e [docs/blog-publishing-api.md](docs/blog-publishing-api.md).

## Como adicionar conteúdo

### Novo projeto

Adicione uma entrada no array `projects` de `src/data/personal.ts`. Todo texto visível tem as três versões.

```ts
{
  slug: "meu-projeto",
  title: { pt: "Meu Projeto", en: "My Project", es: "Mi proyecto" },
  tagline: { pt: "Uma linha", en: "One line", es: "Una línea" },
  description: { pt: "Descrição...", en: "Description...", es: "Descripción..." },
  category: "produtos", // plataformas | arquitetura | ia | produtos
  techStack: ["React", "Node.js"],
  links: [{ label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://..." }],
  status: { pt: "Em produção", en: "In production", es: "En producción" },
  image: "/meu-projeto.png", // arquivo em /public, 16:9
}
```

Assim ele aparece na grade "Outros projetos". Para virar estudo de caso em destaque, com página própria nos três idiomas, acrescente `featured: true`, um `caseStudy` e o `slug` em `featuredOrder`.

### Novo texto de interface

Adicione a mesma chave em `src/messages/pt.json`, `en.json` e `es.json`. Os testes falham se um idioma ficar para trás.

### Nova seção na home

1. Crie `src/components/organisms/MinhaSecao.tsx`.
2. Inclua em `src/components/organisms/HomeScreen.tsx`.
3. Dê um `id` à `<section>` e acrescente o item em `navItems`, em `Navigation.tsx`.

## Variáveis de ambiente

Veja `.env.example`. As do blog (`BLOG_*`) são necessárias só para a API de publicação. `GOOGLE_SITE_VERIFICATION` e `BING_SITE_VERIFICATION` são opcionais e servem para confirmar a posse do site no Search Console e no Bing Webmaster Tools.

## Convenções

- **Dados** ficam em `src/data/personal.ts`, nunca soltos nos componentes.
- **Links internos** para páginas com idioma saem dos helpers de `src/lib` (`getHomePath`, `getCaseStudyPath`, `getBlogIndexPath`), nunca escritos à mão.
- **Classes CSS** passam por `cn()` de `src/lib/utils.ts`; cores são sempre tokens (`bg-surface`, `text-brand`), nunca cores brutas.
- **Animações** de rolagem usam `useReveal()`; o que aparece na primeira tela usa a classe CSS `rise-in`, que não depende de JavaScript.

## Licença

MIT
