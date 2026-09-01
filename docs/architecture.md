# Portfolio — Yago Lagrotti Bracco (`lagrotti.dev`)

## Visão Geral

Site portfólio pessoal de Yago Lagrotti Bracco em Next.js 15, com suporte bilíngue (pt/en), tema claro/escuro, animações via Framer Motion e dados 100% centralizados.

A home e as páginas de case study são **Server Components**: o HTML entregue já contém o conteúdo, e só as seções interativas são `"use client"`. As páginas `/projetos/[slug]` são geradas estaticamente a partir de `generateStaticParams`.

- **URL de produção:** `lagrotti.dev`
- **Deploy:** Vercel
- **Framework:** Next.js 15 (App Router)
- **Runtime:** React 19

---

## Stack Tecnológica

| Categoria | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI Library | React 19 |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS 4 |
| Componentes UI | Radix UI (via shadcn/ui — badge, button, dropdown-menu) |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Fontes | Geist Sans + Geist Mono (Google Fonts via next/font) |
| Tema | next-themes |
| Conteúdo Blog | `gray-matter` (markdown frontmatter) |
| Linting | ESLint 9 |

---

## Estrutura de Diretórios

```
src/
├── app/
│   ├── layout.tsx              # Root layout (RSC): fontes, Metadata API, JSON-LD, skip-link, Providers
│   ├── page.tsx                # Home (RSC): apenas compõe as seções
│   ├── globals.css             # Tokens de tema + Tailwind base + reduced-motion
│   ├── sitemap.ts              # sitemap.xml (home, blog, posts e case studies)
│   ├── robots.ts               # robots.txt
│   ├── opengraph-image.tsx     # Imagem de compartilhamento gerada no build
│   ├── projetos/
│   │   └── [slug]/page.tsx     # Case study (SSG via generateStaticParams)
│   ├── [locale]/               # LEGADO — só redireciona /pt e /en; pode ser apagado
│   └── blog/
│       ├── layout.tsx          # Navigation + Footer + metadata
│       ├── page.tsx            # Lista de posts
│       └── [slug]/page.tsx     # Post individual
│
├── components/
│   ├── atoms/                  # Componentes atômicos reutilizáveis
│   │   ├── LanguageSwitcher.tsx  # Dropdown pt/en — atualiza context + localStorage
│   │   └── ThemeToggle.tsx       # Botão light/dark usando next-themes
│   ├── organisms/              # Seções completas da página
│   │   ├── Navigation.tsx        # Navbar fixa com scroll-aware + menu mobile
│   │   ├── Hero.tsx              # Seção hero com avatar, CTA e links sociais
│   │   ├── About.tsx             # Skills e certificações
│   │   ├── Projects.tsx          # Grid de projetos com card + status + techStack
│   │   ├── Experience.tsx        # Timeline de experiências e educação
│   │   └── Contact.tsx           # Formulário de contato (mailto) + links sociais
│   └── ui/                     # Primitivos shadcn/ui (não editar diretamente)
│       ├── badge.tsx
│       ├── button.tsx
│       └── dropdown-menu.tsx
│
├── contexts/
│   └── TranslationContext.tsx  # Sistema i18n customizado — ver seção abaixo
│
├── data/
│   └── personal.ts             # FONTE ÚNICA DE VERDADE de todos os dados pessoais
│
├── lib/
│   ├── blog.ts                 # Funções: getAllPosts(), getPostBySlug()
│   ├── projects.ts             # getCaseStudyProjects(), getCaseStudyBySlug(), getAdjacentCaseStudies()
│   ├── motion.ts               # useReveal() — animação que respeita prefers-reduced-motion
│   └── utils.ts                # cn() — utilitário clsx + tailwind-merge
│
└── messages/
    ├── pt.json                 # Strings de UI em português
    └── en.json                 # Strings de UI em inglês
```

---

## Sistema de i18n (Internacionalização)

O projeto usa um **sistema i18n 100% customizado** (sem next-intl ou i18next), baseado em:

- `src/contexts/TranslationContext.tsx` — Context + Provider + hook `useTranslation()`
- `src/messages/pt.json` e `en.json` — Strings de UI
- `localStorage` com chave `"locale"` — Persistência entre sessões

### Fluxo de detecção de idioma:
1. O servidor renderiza sempre em **pt** — que é o idioma canônico do site e o que vai para os metadados, o `sitemap` e os buscadores
2. Já no cliente, o `TranslationProvider` lê `localStorage.getItem('locale')` e troca para `en` se essa for a preferência salva
3. O `LanguageSwitcher` grava a escolha em `localStorage`

> Não existe mais rota `/pt` e `/en`: elas renderizavam uma segunda cópia da home (conteúdo duplicado para SEO) e, por `[locale]` casar com qualquer segmento, faziam qualquer URL desconhecida renderizar a home em vez de dar 404. Hoje redirecionam para as rotas canônicas.

### Função `t(key: string)`:
Resolve chaves em dot-notation percorrendo o JSON de traduções recursivamente.  
Retorna a própria chave como fallback se não encontrada.

```ts
t('hero.greeting')    // => "Olá, eu sou" | "Hi, I'm"
t('navigation.about') // => "Sobre" | "About"
```

---

## Dados Centralizados (`src/data/personal.ts`)

**Regra de ouro: tudo fica aqui.** Não hardcode dados nos componentes.

### Tipos usados:
- `LocaleKey` = `'pt' | 'en'`
- `LocalizedText` = `Record<LocaleKey, string>` — qualquer string bilíngue
- `ProjectEntry` — `slug`, `title`, `tagline`, `description`, `category`, `year?`, `techStack`, `links`, `status`, `image`, `featured?`, `caseStudy?`
- `CaseStudy` — `context`, `challenge`, `solution`, `highlights[]`, `architecture?`
- `ProjectCategoryId` — chave estável de filtro; os rótulos visíveis ficam em `projectCategories`
- `ExperienceEntry` — `company`, `position`, `period`, `description`, `order`
- `EducationEntry` — `degree`, `institution`, `period`, `order`

### Campo `order` em Experience/Education:
Inteiro numérico que representa `AAAAMM` (ex: `202501` = Janeiro 2025). A timeline em `Experience.tsx` ordena descrescente por este campo, misturando experiências e educações na mesma linha do tempo.

### Projetos:
**Uma única lista.** 19 projetos cadastrados, cada um com imagem local (`/public/*.png`) ou URL de OpenGraph do GitHub.

- `featured: true` promove o projeto para a seção de destaques da home **e** gera a página `/projetos/[slug]` — esses precisam ter `caseStudy`
- os demais caem na grade filtrável logo abaixo

Como as duas seções leem da mesma lista e se dividem por esse único campo, **nenhum projeto aparece duas vezes** — que era o que acontecia quando existiam os arrays separados `projects` e `featuredProjects`.

`year` é opcional de propósito: só é preenchido onde a data é conhecida, nunca chutada.

---

## Convenções de Componentes

- **Páginas são Server Components; seções interativas são `"use client"`** — o que garante HTML real para buscadores e previews de link
- **Animações**: sempre via `useReveal()` de `src/lib/motion.ts`, nunca com `initial/whileInView` escritos à mão. O hook colapsa a animação quando o sistema pede `prefers-reduced-motion`
- **Navegação**: âncoras `<a href="#secao">` de verdade — deep-linkáveis e funcionais sem JS. O scroll suave vem de `scroll-behavior` no CSS e o `scroll-padding-top` evita que a navbar fixa cubra o alvo. A seção ativa é detectada por `IntersectionObserver`
- **Imagens**: sempre `next/image` (nunca `<img>`), com `sizes` declarado — evita layout shift e serve o tamanho certo
- **Contato**: sem backend — CTA para Calendly, WhatsApp e LinkedIn

---

## Convenções de Estilo

- **Tailwind 4** com variáveis CSS em `globals.css`
- Classes semânticas: `bg-background`, `text-foreground`, `text-muted-foreground`, `border`, `bg-muted/50` — sempre usar tokens ao invés de cores brutas (ex: ~~`bg-white`~~)
- **Tokens próprios do portfólio**, definidos para os dois temas: `bg-surface`, `bg-surface-hover`, `border-hairline`, `text-brand`, `bg-brand-soft`, `text-brand-contrast`, `text-accent2`

> Nunca use `white/5`, `border-white/10`, `bg-blue-950` ou `text-blue-400` diretamente: essas cores só funcionam no tema escuro e desaparecem (ou reprovam no contraste de 4.5:1) no claro. Se precisar de um acento fora da paleta de tokens, declare o par claro/escuro explicitamente — ex.: `text-violet-700 dark:text-violet-400`.
- `cn()` de `src/lib/utils.ts` para mesclar classes condicionais com `clsx` + `tailwind-merge`
- Responsividade: mobile-first, breakpoints `md:` e `lg:` para layouts

---

## Scripts

```bash
npm run dev    # Servidor de desenvolvimento (localhost:3000)
npm run build  # Build de produção
npm run start  # Serve o build de produção
npm run lint   # ESLint
```

---

## Como Adicionar Conteúdo

### Novo Projeto
Adicione em `src/data/personal.ts` no array `projects`:
```ts
{
  id: "meu-projeto",
  title: { pt: "Meu Projeto", en: "My Project" },
  description: { pt: "...", en: "..." },
  techStack: ["React", "Node.js"],
  links: [{ label: { pt: "Site", en: "Live" }, url: "https://..." }],
  status: { pt: "Em produção", en: "In production" },
  image: "/meu-projeto.png",  // coloque a imagem em /public/
}
```

### Nova Tradução de UI
Adicione a mesma chave em `src/messages/pt.json` e `src/messages/en.json`.

### Nova Seção
1. Crie o arquivo em `src/components/organisms/MinhaSecao.tsx`
2. Importe e adicione no `page.tsx` entre as seções existentes
3. Adicione `id="minha-secao"` na `<section>` para o scroll funcionar
4. Adicione o item de navegação em `Navigation.tsx` no array `navItems`

---

## Arquitetura de Providers (em `page.tsx`)

```tsx
<TranslationProvider>
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <Navigation />
    <Hero />
    <About />
    <Projects />
    <Experience />
    <Contact />
    <footer />
  </ThemeProvider>
</TranslationProvider>
```

`TranslationProvider` vem fora do `ThemeProvider` pois `Navigation` e outros componentes precisam de ambos.

---

## Notas para o AI Assistant

- **Fonte de dados → sempre `src/data/personal.ts`** — não crie dados inline nos componentes
- **Textos bilíngues → sempre `LocalizedText`** — nunca string simples para conteúdo visível
- **Strings de UI → sempre via `t('chave')`** — adicionar em ambos pt.json e en.json
- **O campo `locale` está disponível via `useTranslation()`** em qualquer componente cliente
- **`cn()` é o único utilitário de classes** — não use `clsx` ou `twMerge` diretamente
- **Animações**: sempre `whileInView` + `viewport={{ once: true }}` — nunca `animate` na entrada de seções
- **O blog usa dados hardcoded** em `src/lib/blog.ts` (não há CMS ou markdown files ainda)
