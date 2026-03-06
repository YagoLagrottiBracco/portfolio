# Portfolio — Yago Lagrotti Bracco (`lagrotti.dev`)

## Visão Geral

Site portfólio pessoal de Yago Lagrotti Bracco. SPA (Single Page Application) em Next.js 15 com suporte bilíngue (pt/en), tema claro/escuro, animações via Framer Motion e dados 100% centralizados.

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
│   ├── layout.tsx              # Root layout: fontes, meta tags SEO, favicon
│   ├── page.tsx                # Página principal: detecção de idioma + orquestração dos providers
│   ├── globals.css             # Variáveis CSS globais + Tailwind base
│   ├── [locale]/               # Rota localizada (pt | en)
│   │   ├── layout.tsx          # Layout com TranslationProvider + ThemeProvider
│   │   ├── page.tsx            # Página da rota localizada
│   │   └── blog/               # Blog dentro do locale
│   └── blog/                   # Blog sem locale (fallback)
│       ├── layout.tsx
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
1. `page.tsx` roda no cliente e lê `localStorage.getItem('locale')`
2. Se não existir, detecta `navigator.language` e define `pt` ou `en`
3. Salva em `localStorage` e remove o loading spinner
4. `TranslationProvider` lê o `localStorage` no `useEffect` e sincroniza o state

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
- `ProjectEntry` — `id`, `title`, `description`, `techStack`, `links`, `status`, `image`
- `ExperienceEntry` — `company`, `position`, `period`, `description`, `order`
- `EducationEntry` — `degree`, `institution`, `period`, `order`

### Campo `order` em Experience/Education:
Inteiro numérico que representa `AAAAMM` (ex: `202501` = Janeiro 2025). A timeline em `Experience.tsx` ordena descrescente por este campo, misturando experiências e educações na mesma linha do tempo.

### Projetos:
12 projetos cadastrados, cada um com imagem local (`/public/*.png`) ou URL de OpenGraph do GitHub. O campo `status` é `LocalizedText`.

---

## Convenções de Componentes

- **Todos os componentes de página usam `"use client"`** (SPA, sem RSC nas seções)
- **Animações**: Framer Motion com `whileInView` + `viewport={{ once: true }}` para animar na entrada do viewport. Nunca reanima.
- **Padrão de animação escalonada**: `transition={{ delay: index * 0.1 }}` em listas
- **Navegação**: `scrollToSection(href)` em `Navigation.tsx` trata `#` (topo), `#section` (scroll suave) e paths externos (`router.push`)
- **Formulário de contato**: Não tem backend — abre `mailto:` com os dados preenchidos

---

## Convenções de Estilo

- **Tailwind 4** com variáveis CSS em `globals.css`
- Classes semânticas: `bg-background`, `text-foreground`, `text-muted-foreground`, `border`, `bg-muted/50` — sempre usar tokens ao invés de cores brutas (ex: ~~`bg-white`~~)
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
