# Yago Lagrotti Bracco — Portfolio (`lagrotti.dev`)

Portfólio pessoal bilíngue (🇧🇷 Português / 🇬🇧 English) construído com Next.js 15 e React 19. Exibe projetos, experiências, formação acadêmica e formulário de contato.

## Stack

| Categoria | Tecnologia |
|---|---|
| Framework | **Next.js 15** (App Router) |
| UI | **React 19** + **TypeScript 5** |
| Estilização | **Tailwind CSS 4** |
| Componentes | Radix UI via shadcn/ui |
| Animações | Framer Motion |
| Ícones | Lucide React |
| Fontes | Geist Sans + Geist Mono (`next/font`) |
| Tema | next-themes |
| Deploy | **Vercel** |

## Estrutura

```
src/
├── app/                    # App Router (layout, page, globals.css)
│   ├── [locale]/           # Rotas localizadas (pt | en)
│   └── blog/               # Blog (lista + post individual)
├── components/
│   ├── atoms/              # LanguageSwitcher, ThemeToggle
│   ├── organisms/          # Hero, About, Projects, Experience, Contact, Navigation
│   └── ui/                 # Primitivos shadcn/ui (badge, button, dropdown-menu)
├── contexts/
│   └── TranslationContext.tsx  # Sistema i18n customizado (pt/en)
├── data/
│   └── personal.ts         # ⭐ Fonte única de todos os dados pessoais
├── lib/
│   ├── blog.ts             # getAllPosts(), getPostBySlug()
│   └── utils.ts            # cn() — clsx + tailwind-merge
└── messages/
    ├── pt.json             # Strings de UI em português
    └── en.json             # Strings de UI em inglês
```

## Scripts

```bash
npm run dev    # Servidor de desenvolvimento em localhost:3000
npm run build  # Build de produção
npm run start  # Serve o build de produção
npm run lint   # ESLint
```

## Internacionalização (i18n)

O projeto usa um **sistema i18n customizado** sem biblioteca externa:

- Strings de UI → `src/messages/{locale}.json` (acessadas via `t('chave.aninhada')`)
- Dados pessoais bilíngues → tipo `LocalizedText = Record<'pt' | 'en', string>` em `personal.ts`
- Idioma ativo → persiste em `localStorage` sob a chave `"locale"`
- Detecção automática → `navigator.language` no primeiro acesso

## Como Adicionar Conteúdo

### Novo projeto
Edite `src/data/personal.ts` e adicione no array `projects`:

```ts
{
  id: "meu-projeto",
  title:       { pt: "Meu Projeto", en: "My Project" },
  description: { pt: "Descrição...", en: "Description..." },
  techStack: ["React", "Node.js"],
  links: [{ label: { pt: "Site", en: "Live" }, url: "https://..." }],
  status: { pt: "Em produção", en: "In production" },
  image: "/meu-projeto.png",  // coloque o arquivo em /public/
}
```

### Nova tradução de UI
Adicione a mesma chave em `src/messages/pt.json` **e** `src/messages/en.json`.

### Nova seção de página
1. Crie `src/components/organisms/MinhaSecao.tsx`
2. Importe e insira em `src/app/page.tsx`
3. Adicione `id="minha-secao"` na `<section>` para o scroll funcionar
4. Adicione o item de navegação no array `navItems` em `Navigation.tsx`

## Convenções

- **Dados** → sempre em `src/data/personal.ts`, nunca inline nos componentes
- **Classes CSS** → sempre com `cn()` de `src/lib/utils.ts`
- **Cores** → tokens semânticos (`bg-background`, `text-muted-foreground`, etc.) — nunca cores brutas
- **Animações** → `whileInView` + `viewport={{ once: true }}` para seções; `animate` apenas para o Hero
- **Textos bilíngues visíveis** → sempre `LocalizedText`, nunca `string` simples

## Licença

MIT
