# Publicar no blog

Os artigos vivem em `src/content/blog/*.mdx`, nas versões `pt`, `en` e `es`. O GitHub e os arquivos MDX são a fonte de verdade. O editor privado e o ChatGPT Work com cron gravam na mesma branch, configurada por `BLOG_GITHUB_BRANCH`.

## Configurar o editor privado

1. Crie um GitHub OAuth App. Configure a homepage para a URL pública do site e a callback para `https://lagrotti.dev/api/auth/callback/github`. Para desenvolvimento local, use uma aplicação OAuth separada com callback `http://localhost:3000/api/auth/callback/github`.
2. No servidor ou na plataforma de deploy, configure `AUTH_SECRET` (valor aleatório longo), `AUTH_URL` (origem exata, por exemplo `https://lagrotti.dev` ou `http://localhost:3000`), `AUTH_GITHUB_ID` e `AUTH_GITHUB_SECRET` (OAuth App), `BLOG_ADMIN_GITHUB_ID` (ID numérico da única conta autorizada), `BLOG_GITHUB_TOKEN` (GitHub token com permissão Contents de leitura e escrita), `BLOG_GITHUB_REPOSITORY` e `BLOG_GITHUB_BRANCH`. `AUTH_URL` também fixa a origem confiável usada pelo Auth.js; sem ela, um servidor de produção local pode recusar a sessão. Veja `.env.example`.
3. Configure `BLOG_API_KEY` separadamente para o cron. Esses segredos ficam no servidor; não use o prefixo `NEXT_PUBLIC_`.
4. Abra `/admin/blog`, entre com a conta GitHub autorizada e crie um artigo em `/admin/blog/new`. Outra conta recebe 403. A lista privada mostra rascunhos e o status de cada idioma, inclusive posts com estado misto criados pelo cron.

O formulário pede título, slug, resumo, data, tags e corpo em PT, EN e ES. O título é o único H1: o corpo começa com H2. A capa pode vir de HTTPS ou upload com dimensões reais e texto alternativo. O corpo aceita imagens PNG, JPEG, WebP e AVIF até 5 MB, também com texto alternativo. O editor visual oferece subtítulos, ênfase, links, listas, citação, código com linguagem, tabela e imagens. Use a aba Markdown para ajustes finos. Se a conversão visual alterar texto ou blocos, o corpo abre nessa aba para preservar o original.

Revise a prévia privada dos três idiomas antes de publicar. **Salvar rascunho** grava as três versões com `draft: true`. Em um artigo já publicado, as mudanças ficam no navegador até **Publicar alterações**; salvar como rascunho não retira o post público do ar. O slug de uma versão publicada fica bloqueado para preservar a URL. A área privada e a prévia têm `noindex`.

Um salvamento cria um único commit com os três MDX e as imagens novas. A confirmação `deployment-pending` significa que o commit foi aceito: o site público atualiza depois do deploy da branch. Se o cron ou outra pessoa alterar o artigo enquanto ele estiver aberto, o editor recebe **409**, mantém o texto local e pede comparação com a versão atual antes de recarregar. Copie seu texto antes de descartar a aba. Falhas de GitHub não são mostradas como publicação bem-sucedida.

## Frontmatter e SEO

```yaml
title: "Título claro e específico"
slug: "titulo-claro-e-especifico"
translationKey: "mesmo-artigo-em-todos-os-idiomas"
excerpt: "Resumo factual que explica o valor do artigo."
date: "2026-10-05"
tags: ["arquitetura de software", "typescript"]
locale: "pt"
draft: true
image:
  url: "https://images.example.com/capa.webp"
  alt: "Descrição objetiva da capa"
  width: 1200
  height: 630
```

Use `locale: pt`, `en` ou `es`. O `translationKey` é igual nas três versões; cada slug é único. A capa local usa `image.src: "/blog/arquivo.webp"` no lugar de `image.url`. Campos extras de frontmatter de artigos existentes são preservados pelo editor. Rascunhos e posts com data futura não aparecem nas páginas, listagens, feeds ou sitemap públicos.

As URLs públicas são `/blog/<slug>` em todos os idiomas, com listagens em `/blog`, `/en/blog` e `/es/blog`. O build gera canonical, descrição, Open Graph, Twitter card, `BlogPosting`, `BreadcrumbList`, `hreflang` e sitemap. O texto público renderiza Markdown sem executar HTML/MDX arbitrário, inclusive sem JavaScript no navegador. Ele inclui sumário H2/H3, tabelas responsivas, código destacado e botão de cópia progressivo.

## Verificar localmente

```bash
npm test
npm run lint
npm run build
npm run dev -- --port 3000
```

Com as variáveis configuradas, confira login, criação de rascunho, prévia e publicação em `/admin/blog`. Sem OAuth configurado, ainda é possível conferir um artigo público sem JavaScript e a resposta 401 de `/api/admin/blog` para visitantes. A callback real do GitHub só pode ser verificada com o OAuth App configurado.

Para o contrato do cron, consulte [a API de publicação](blog-publishing-api.md).

## Política obrigatória de qualidade visual das capas

A existência de um arquivo e as dimensões corretas não bastam. A capa precisa **comunicar visualmente o assunto** do artigo e estar legível tanto em 1200 × 630 quanto em 600 × 315. Uma superfície monocromática, um gradiente quase vazio, um diagrama invisível ou uma imagem genérica desconectada do texto **não é publicável**.

Antes de enviar o payload ou criar o commit, o editor automatizado deve:

1. Criar ou obter a capa e abrir **o arquivo final real** em visualização; não confiar só no prompt, em metadados ou no nome do arquivo. Revisar também uma miniatura de aproximadamente 600 × 315.
2. Conferir se o assunto aparece imediatamente (nome do projeto, conceito de arquitetura ou diagrama relevante) com contraste forte, elementos distinguíveis e hierarquia. Rejeitar imagens visualmente vazias, texto ilegível, composição improvisada e interfaces fictícias apresentadas como capturas reais.
3. Para IA, evitar texto técnico minúsculo ou afirmações visuais inventadas. Identificar como *ilustração conceitual* qualquer interface inventada que pareça captura do produto.
4. Exigir alt text fiel à imagem **efetivamente produzida**, não ao que se pretendia produzir, além de formato suportado, tamanho máximo de 5 MB e dimensões verificadas no arquivo.
5. Abrir a prévia do artigo ou validar que a URL da capa responde e renderiza na página; confirmar os três frontmatters. Quando a capa falhar, **refazer antes de publicar**, nunca substituí-la por um fundo neutro.
6. Só então publicar PT + EN + ES + a capa no mesmo commit ou payload. Se não houver capa de qualidade, abortar a publicação e informar o bloqueio.

O job `npm run check:blog-covers` faz uma verificação automática de existência, dimensões, formato, quantidade de cores e contraste estrutural das capas locais alteradas; **não substitui a inspeção editorial visual**. Em CI, a checagem roda nos arquivos MDX e imagens afetados pelo commit.
