# Arquitetura — `lagrotti.dev`

Portfólio pessoal em Next.js 15 (App Router) e React 19, em três idiomas (pt, en, es), com tema claro e escuro e dados centralizados em um único arquivo.

As páginas são **Server Components** geradas estaticamente no build: o HTML entregue já contém o conteúdo, no idioma da URL. Só as seções interativas são `"use client"`.

- **Produção:** <https://lagrotti.dev>, com deploy pela Vercel a cada push no `master`
- **Verificação:** GitHub Actions roda lint, testes, build e testes de navegador em cada pull request (`.github/workflows/ci.yml`)

## Rotas

```text
src/app/
├── (pt)/                       # Rotas sem prefixo, em português
│   ├── layout.tsx              # Layout raiz: <html lang="pt-BR">
│   ├── page.tsx                # Home
│   ├── projetos/[slug]/page.tsx
│   └── blog/                   # Índice (com filtro por tag), layout e RSS
├── [locale]/                   # /en e /es
│   ├── layout.tsx              # Layout raiz: idioma vem do prefixo
│   ├── page.tsx                # Home
│   ├── projetos/[slug]/page.tsx
│   └── blog/                   # Índice, layout e RSS
├── (article)/blog/[slug]/      # Artigo do blog, em qualquer idioma
│   ├── layout.tsx              # Layout raiz: idioma vem do artigo
│   └── page.tsx
├── blog/[slug]/opengraph-image.tsx  # Imagem de compartilhamento do artigo
├── cv/[locale]/route.ts        # Currículo em PDF
├── api/blog/publish/route.ts   # API de publicação de artigos
├── global-not-found.tsx        # 404 de qualquer URL desconhecida
├── fonts.ts, globals.css, sitemap.ts, robots.ts, opengraph-image.tsx
src/middleware.ts               # Escolhe o idioma de quem chega em "/"
```

### Três layouts raiz

Não existe `src/app/layout.tsx`. Há um layout raiz para cada forma de saber o idioma de uma página, e os três renderizam o mesmo `RootDocument` (`src/components/RootDocument.tsx`): fontes, JSON-LD `Person`, providers e Analytics. É isso que faz o `<html lang>` sair certo já no HTML do servidor.

| Layout | Rotas | De onde vem o idioma |
| --- | --- | --- |
| `(pt)/layout.tsx` | `/`, `/projetos/...`, `/blog` | sempre português |
| `[locale]/layout.tsx` | `/en/...`, `/es/...` | prefixo da URL |
| `(article)/blog/[slug]/layout.tsx` | `/blog/[slug]` | idioma do artigo |

Consequências práticas:

- **Toda página nova precisa ficar dentro de um desses três.** Um `page.tsx` criado fora deles (por exemplo em `src/app/admin/`) não tem layout raiz e quebra o build; ou entra em `(pt)`, ou ganha um layout próprio que renderize `RootDocument`.
- **Navegar de um layout raiz para outro recarrega a página inteira:** trocar de idioma, ou ir do índice do blog para um artigo.
- **404:** `global-not-found.tsx` (recurso experimental `globalNotFound` do Next, ligado em `next.config.ts`) atende as URLs desconhecidas. O `not-found.tsx` ao lado de cada layout renderiza a mesma tela quando uma página chama `notFound()`.
- A imagem de compartilhamento dos artigos fica fora do grupo de propósito: dentro dele o Next acrescenta um sufixo à URL, e ela é referenciada pelo caminho fixo `/blog/[slug]/opengraph-image`.

`[locale]` casa com qualquer segmento, então cada página dentro dele valida o idioma: `/pt/...` redireciona para a versão sem prefixo e qualquer outro valor responde 404.

## Idiomas

Não há biblioteca de i18n. São três peças:

1. **Textos de interface** em `src/messages/{pt,en,es}.json`, lidos por `t("chave.aninhada")` de `useTranslation()`.
2. **Conteúdo** em `src/data/personal.ts`, onde todo texto visível é um `LocalizedText` (`{ pt, en, es }`). Rótulos curtos e repetidos, como métricas e competências, são traduzidos em `src/data/content-labels.ts`.
3. **Idioma ativo**, decidido em `TranslationContext`:
   - **a página manda** sempre que tem idioma próprio: o prefixo da URL, as rotas em português (`getRouteLocale` em `src/lib/locale-routes.ts`) ou o idioma do artigo, que o layout passa como `pageLocale`. É o que permite ao servidor renderizar `/en` em inglês e ao buscador indexar cada versão;
   - só no 404 de uma URL sem prefixo vale a escolha salva ou o idioma do navegador.

O seletor de idioma navega para a URL equivalente (`getLocalizedPath`) e grava a escolha em `localStorage` e no cookie `locale`.

### Quem chega em `/`

`src/middleware.ts` roda só para `/`. Com o cookie `locale`, respeita a escolha. Sem ele, usa o `Accept-Language`: português fica em `/`, inglês e espanhol vão para `/en` e `/es`, e quem não fala nenhum dos três vai para `/en`. Sem o cabeçalho — caso dos buscadores — serve a página em português, que é a canônica. A regra está em `negotiateLocale` (`src/lib/locale-negotiation.ts`) e é coberta por testes.

## SEO

- **Metadados por página e por idioma**, gerados no servidor: `src/lib/home-metadata.ts`, `src/lib/case-study-metadata.ts` e as páginas do blog. Cada versão declara seu `canonical` e os `hreflang` das outras, com `x-default` em português.
- **Sitemap** (`src/app/sitemap.ts`) com as três homes, os estudos de caso nos três idiomas, os índices do blog e os artigos, cada entrada com suas alternativas de idioma.
- **Dados estruturados:** `Person` no layout raiz (com `@id` que os outros blocos referenciam), `ProfilePage` na home, `TechArticle` nos estudos de caso, `BlogPosting` e `BreadcrumbList` nos artigos.
- **Posse do site:** `GOOGLE_SITE_VERIFICATION` e `BING_SITE_VERIFICATION` viram as meta tags de verificação.
- **Primeira tela sem depender de JavaScript:** o hero e o cabeçalho dos estudos de caso entram com a animação CSS `rise-in`. As demais seções usam `useReveal()` (Framer Motion) e só aparecem depois da hidratação.

## Dados (`src/data/personal.ts`)

Regra de ouro: tudo fica aqui. Componentes não carregam dados próprios.

- `ProjectEntry` — `slug`, `title`, `tagline`, `description`, `category`, `year?`, `techStack`, `links`, `status`, `image`, `featured?`, `caseStudy?`
- `CaseStudy` — `context`, `challenge`, `solution`, `highlights[]`, `architecture?`, `metrics?`, `diagram?` (etapas do fluxo de arquitetura), `articleKey?` (`translationKey` do artigo do blog sobre o projeto)
- `ExperienceEntry` e `EducationEntry` — o campo `order` é um `AAAAMM` usado para ordenar a linha do tempo, do mais recente para o mais antigo

**Uma única lista de projetos**, com 21 entradas. `featured: true` leva o projeto para a seção de estudos de caso da home e gera sua página nos três idiomas; os demais caem na grade filtrável. Como as duas seções leem a mesma lista, nenhum projeto aparece duas vezes. A ordem dos destaques é `featuredOrder`.

`year` é opcional de propósito: só é preenchido onde a data é conhecida.

## Currículo em PDF

`/cv/pt`, `/cv/en` e `/cv/es` são gerados no build por `src/lib/cv.ts`, lendo `personalData` e os dicionários de interface. Não existe um arquivo de currículo para manter: mudou o `personal.ts`, mudou o PDF.

## Blog

Os artigos são arquivos MDX em `src/content/blog`, um por idioma, ligados entre si pelo `translationKey` do frontmatter. `src/lib/blog-content.ts` valida e indexa; `src/lib/blog.ts` é a porta de entrada no servidor. O fluxo de publicação está em `docs/blog-publishing.md` e `docs/blog-publishing-api.md`.

## Medição

`@vercel/analytics` e `@vercel/speed-insights` ficam no layout raiz, então todas as páginas são contadas. Além das visitas, `src/lib/analytics.ts` registra quatro eventos: `cv_download`, `contact_click`, `project_link_click` e `article_click`.

## Testes

- `npm test` — `node:test` em `tests/`: i18n, rotas por idioma, negociação de idioma, blog, feed, estudos de caso e currículo.
- `npm run test:e2e` — Playwright em `e2e/`, contra o build de produção: idioma da home, seletor de idioma, estudo de caso, filtro do blog, feeds e currículo.
- `npm run check:links` — confere os links externos dos projetos; é manual, porque site de terceiro sai do ar sem aviso.

## Convenções

- **Animações:** `useReveal()` para o que entra ao rolar; `rise-in` para a primeira tela. Ambos respeitam `prefers-reduced-motion`.
- **Navegação:** âncoras reais (`<a href="#secao">`), que funcionam sem JavaScript. A seção ativa é detectada por `IntersectionObserver`.
- **Imagens:** sempre `next/image` com `sizes`, exceto a imagem de capa dos artigos.
- **Estilo:** Tailwind 4 com tokens em `globals.css` (`bg-surface`, `border-hairline`, `text-brand`, `bg-brand-soft`, `text-accent2`). Cores brutas como `bg-blue-950` só funcionam em um dos temas; se precisar de uma, declare o par claro/escuro.
- **Classes condicionais:** `cn()` de `src/lib/utils.ts`.
- **Links internos:** sempre pelos helpers de rota (`getHomePath`, `getCaseStudyPath`, `getBlogIndexPath`), para que o idioma acompanhe.
