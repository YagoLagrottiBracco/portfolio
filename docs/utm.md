# UTMs e origem das visitas

Todo link para o `lagrotti.dev` que você distribui deve levar UTMs. É isso que faz o Umami mostrar **de onde** veio cada visita e cada contato, em vez de "direto/desconhecido", que é o que aparece para links abertos no WhatsApp, no app do LinkedIn, em PDFs e em e-mails.

## Gerar um link

```bash
npm run utm -- linkedin --campaign blog-mcp --path /blog/mcp-producao-2026-ferramentas-agentes-seguranca
# https://lagrotti.dev/blog/mcp-producao-2026-ferramentas-agentes-seguranca?utm_source=linkedin&utm_medium=social&utm_campaign=blog-mcp

npm run utm -- whatsapp --campaign recrutadores --content mensagem-1
npm run utm -- email --medium newsletter --campaign outubro-2026
```

O script normaliza tudo para minúsculas, sem acentos e com hífens, e preenche o `medium` para as fontes conhecidas.

## Convenção

| Parâmetro | O que diz | Exemplos |
| --- | --- | --- |
| `utm_source` | **Onde** o link estava | `linkedin`, `whatsapp`, `email`, `github`, `instagram`, `cv`, `rss`, `qrcode` |
| `utm_medium` | **Tipo** de canal | `social`, `messaging`, `email`, `newsletter`, `referral`, `pdf`, `feed`, `offline` |
| `utm_campaign` | **Por que** você mandou | `blog-mcp`, `recrutadores`, `candidatura-empresa-x`, `outubro-2026` |
| `utm_content` | **Qual variação** (opcional) | `post`, `comentario`, `bio`, `mensagem-1` |

Regras: sempre minúsculas e com hífens; uma campanha por ação (um post, uma leva de mensagens, uma candidatura); nunca use UTM em links **internos** do site, porque isso sobrescreve a origem real da visita.

### Links fixos que valem a pena trocar uma vez

| Onde | Comando |
| --- | --- |
| Site do perfil do LinkedIn | `npm run utm -- linkedin --campaign perfil --content bio` |
| README do perfil do GitHub | `npm run utm -- github --campaign perfil` |
| Assinatura de e-mail | `npm run utm -- email --campaign assinatura` |
| Bio do Instagram | `npm run utm -- instagram --campaign perfil --content bio` |

### O que o próprio site já marca

- **Currículo em PDF:** os links para o site e para os estudos de caso saem com `utm_source=cv&utm_medium=pdf&utm_campaign=cv-<idioma>` (`src/lib/cv.ts`).
- **Feed RSS:** o link de cada artigo leva `utm_source=rss&utm_medium=feed`; o `guid` continua sendo a URL canônica (`src/lib/blog-feed.ts`).

As páginas declaram `canonical`, então URLs com UTM não criam conteúdo duplicado para os buscadores.

## Como a atribuição funciona

`AttributionCapture` (no `RootDocument`) lê a URL de chegada. Com UTMs, a origem é a das UTMs; sem elas, vale o domínio do `referrer` externo (`google.com`, `linkedin.com`...). Ficam guardadas duas origens no navegador:

- a da **primeira visita** (`localStorage`), que vira `first_source` e `first_campaign`;
- a da **visita atual** (`sessionStorage`), que vira `source`, `medium`, `campaign` e `content`.

Cada evento (`cv_download`, `contact_click`, `project_link_click`, `article_click`) sai para o Umami com essas propriedades. Assim um contato feito numa segunda visita, que chegou "direto", ainda é creditado ao post do LinkedIn que trouxe a pessoa na primeira.

## Umami

- Crie o site em <https://cloud.umami.is> e copie o *Website ID* para `NEXT_PUBLIC_UMAMI_WEBSITE_ID` na Vercel (Production). Sem a variável, o script não é carregado.
- O script só conta visitas em `lagrotti.dev` (`data-domains`), então previews e `localhost` não entram, e o `/admin` não é medido.
- Não usa cookies, então dispensa banner de consentimento.
- Para não contar suas próprias visitas, rode no console do navegador, uma vez por navegador: `localStorage.setItem("umami.disabled", "1")`.
- No painel: **UTM** mostra fontes, meios e campanhas; **Events** mostra as conversões, que podem ser filtradas pelas propriedades acima.

A Vercel Analytics continua carregada para page views e Speed Insights. No plano Hobby ela não registra eventos customizados nem UTMs, por isso os eventos vão só para o Umami.
