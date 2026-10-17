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
│   ├── projetos/[slug]/        # Estudo de caso e apresentar/ (modo apresentação)
│   ├── trabalhe-comigo, agora, privacidade, recomendar, perguntar
│   ├── stack/                  # Índice e página de cada tecnologia
│   └── blog/                   # Índice (com filtro por tag), layout, RSS e podcast
├── [locale]/                   # /en e /es
│   ├── layout.tsx              # Layout raiz: idioma vem do prefixo
│   ├── page.tsx                # Home
│   ├── …                       # As mesmas páginas de (pt)
│   └── blog/                   # Índice, layout, RSS e podcast
├── (article)/blog/[slug]/      # Artigo do blog, em qualquer idioma
│   ├── layout.tsx              # Layout raiz: idioma vem do artigo
│   └── page.tsx
├── blog/[slug]/opengraph-image.tsx  # Imagem de compartilhamento do artigo
├── cv/[locale]/                # Currículo em PDF, por foco ([focus]), plain.txt e resume.json
├── contato.vcf/route.ts        # Cartão de contato
├── og/                         # Imagens de compartilhamento de estudos de caso, páginas e tecnologias
├── search-index/[locale]/      # Índice da busca (Ctrl+K), gerado no build
├── api/blog/publish/route.ts   # API de publicação de artigos
├── api/newsletter/route.ts     # Inscrição na newsletter (Buttondown)
├── api/contact/                # Briefing e recomendação (e-mail pelo Resend)
├── api/ask/route.ts            # "Pergunte ao portfólio" (Claude, em streaming)
├── llms.txt/route.ts           # Mapa do site para modelos de linguagem
├── indexnow-key.txt/route.ts   # Chave do IndexNow (404 sem INDEXNOW_KEY)
├── manifest.ts                 # Web app manifest (PWA)
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

`trabalhe-comigo` e `privacidade` existem dentro de `(pt)` e de `[locale]`, como os estudos de caso, com o segmento em português nos três idiomas (`src/lib/page-routes.ts`).

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
- **Primeira tela sem depender de JavaScript:** o hero e o cabeçalho dos estudos de caso entram com a animação CSS `rise-in`. As demais seções usam `reveal()` (`src/lib/motion.ts`): uma animação CSS ligada à rolagem (`animation-timeline: view()`), sem JavaScript; onde o navegador não suporta, ou com movimento reduzido, o conteúdo aparece direto. O `e2e/motion.spec.ts` garante que toda seção termina 100% visível.

## Dados (`src/data/personal.ts`)

Regra de ouro: tudo fica aqui. Componentes não carregam dados próprios.

Duas partes pequenas moram ao lado e entram em `personalData`: `src/data/profile.ts` (nome, links de contato, disponibilidade) e `src/data/project-categories.ts` (os filtros da grade). São o que componentes de cliente presentes em toda página (navegação, rodapé, botões de contato) importam, para o navegador não baixar todos os estudos de caso, nos três idiomas, só para desenhar um link. Pela mesma razão, os endereços ficam em módulos `*-routes.ts` sem dados, e a home é um Server Component que entrega a `Projects` e `Experience` (as seções com estado) só o que elas mostram.

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

`RootDocument` carrega o Umami (sem cookies, só em `lagrotti.dev`), `@vercel/analytics` e `@vercel/speed-insights`, então todas as páginas são contadas; o `/admin` fica de fora (`measured={false}`). Além das visitas, `src/lib/analytics.ts` envia ao Umami os eventos de conversão (contato, currículo, agendamento, briefing, newsletter, busca…; a lista está em [utm.md](utm.md#como-a-atribuição-funciona)), cada um com a origem da visita (UTMs ou referrer) guardada por `src/lib/attribution.ts`. Com `NEXT_PUBLIC_SENTRY_DSN`, `ErrorReporter` envia os erros do navegador ao Sentry, sem o SDK ([operations.md](operations.md#monitoramento)). Convenção de UTMs, eventos, funis e o relatório mensal estão em [utm.md](utm.md); newsletter, compartilhamento e republicação, em [growth.md](growth.md).

## Segurança

Todas as rotas recebem CSP, `nosniff`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` e COOP (`src/lib/security-headers.ts`, aplicados no `next.config.ts`). As APIs de escrita (publicação, editor, newsletter, formulários de contato, perguntas ao Claude) têm limite de requisições por instância (`src/lib/rate-limit.ts`) e registram cada tentativa (`src/lib/audit-log.ts`); os commits feitos por elas levam trailers `Published-Via`/`Edited-By`. Os formulários públicos passam todos por `createFormEndpoint` (`src/lib/form-endpoint.ts`): origem, limite, campo-armadilha e resposta que funciona sem JavaScript. Detalhes e a regra de firewall da Vercel em [operations.md](operations.md).

## Testes

- `npm test` — `node:test` em `tests/`: i18n, rotas por idioma, negociação de idioma, blog, feed, estudos de caso e currículo.
- `npm run test:e2e` — Playwright em `e2e/`, contra o build de produção: idioma da home, seletor de idioma, estudo de caso, filtro e busca do blog, fim dos artigos, páginas novas, feeds, currículo, manifest, headers de segurança e CSP, acessibilidade (axe, WCAG 2.1 A/AA, nos dois temas), busca, modo apresentação, Calendly, "Pergunte ao portfólio" (com a API simulada) e as revelações ao rolar.
- `npm run test:visual` — comparação de capturas, só no container do Playwright ([operations.md](operations.md#testes-visuais)).
- Lighthouse CI (`lighthouserc.json`) roda no CI em cinco páginas; veja [operations.md](operations.md#verificações-automáticas).
- `npm run check:links` e `npm run check:article-links` — conferem os links externos dos projetos e dos artigos; rodam toda segunda no `link-check.yml`, porque site de terceiro sai do ar sem aviso.

## Convenções

- **Animações:** `reveal()` para o que entra ao rolar (CSS ligado à rolagem, sem JavaScript); `rise-in` para a primeira tela. Ambos respeitam `prefers-reduced-motion`.
- **Server Components primeiro:** uma seção sem estado não leva `"use client"`. Textos de interface vêm de `translator(locale)` (`src/lib/translate.ts`) e cliques contados, de `TrackedLink`.
- **Navegação:** âncoras reais (`<a href="#secao">`), que funcionam sem JavaScript. A seção ativa é detectada por `IntersectionObserver`.
- **Imagens:** sempre `next/image` com `sizes`, exceto a imagem de capa dos artigos.
- **Estilo:** Tailwind 4 com tokens em `globals.css` (`bg-surface`, `border-hairline`, `text-brand`, `bg-brand-soft`, `text-accent2`). Cores brutas como `bg-blue-950` só funcionam em um dos temas; se precisar de uma, declare o par claro/escuro.
- **Classes condicionais:** `cn()` de `src/lib/utils.ts`.
- **Links internos:** sempre pelos helpers de rota (`getHomePath`, `getCaseStudyPath`, `getBlogIndexPath`), para que o idioma acompanhe.
