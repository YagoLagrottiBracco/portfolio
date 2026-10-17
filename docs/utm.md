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
- **Botões de compartilhar dos artigos:** `utm_source=<rede>&utm_medium=share&utm_campaign=<translationKey>`; `copy` para "copiar link" e `native` para o compartilhamento do celular (`src/lib/share-links.ts`).
- **App instalado (PWA):** abrir pelo ícone da tela inicial chega como `utm_source=pwa&utm_medium=homescreen`.
- **Republicação no dev.to:** o link de volta leva `utm_source=devto&utm_medium=crosspost` ([growth.md](growth.md#republicar-em-outras-plataformas)).

As páginas declaram `canonical`, então URLs com UTM não criam conteúdo duplicado para os buscadores.

## Como a atribuição funciona

`AttributionCapture` (no `RootDocument`) lê a URL de chegada. Com UTMs, a origem é a das UTMs; sem elas, vale o domínio do `referrer` externo (`google.com`, `linkedin.com`...). Ficam guardadas duas origens no navegador:

- a da **primeira visita** (`localStorage`), que vira `first_source` e `first_campaign`;
- a da **visita atual** (`sessionStorage`), que vira `source`, `medium`, `campaign` e `content`.

Cada evento sai para o Umami com essas propriedades. Assim um contato feito numa segunda visita, que chegou "direto", ainda é creditado ao post do LinkedIn que trouxe a pessoa na primeira.

| Evento | Quando | Propriedades próprias |
| --- | --- | --- |
| `contact_click` | clique em Calendly, WhatsApp, LinkedIn ou e-mail | `channel`, `placement` (`contact`, `work-with-me:top`, `article:<translationKey>`…) |
| `cv_download` | download do currículo | `placement`, `locale` |
| `project_link_click` | link externo de um projeto | `project`, `label`, `placement` |
| `article_click` | estudo de caso → artigo do projeto | `project` |
| `article_share` | botão de compartilhar | `network`, `article` |
| `article_print` | imprimir ou salvar PDF | `article` |
| `newsletter_signup` | inscrição aceita (antes da confirmação por e-mail) | `placement`, `locale` |

`contact_click` com `channel: contact-section` é a ida para a seção de contato a partir de um estudo de caso: intenção, não contato.

## Umami

- Crie o site em <https://cloud.umami.is> e copie o *Website ID* para `NEXT_PUBLIC_UMAMI_WEBSITE_ID` na Vercel (Production). Sem a variável, o script não é carregado.
- O script só conta visitas em `lagrotti.dev` (`data-domains`), então previews e `localhost` não entram, e o `/admin` não é medido.
- Não usa cookies, então dispensa banner de consentimento.
- Para não contar suas próprias visitas, rode no console do navegador, uma vez por navegador: `localStorage.setItem("umami.disabled", "1")`.
- No painel: **UTM** mostra fontes, meios e campanhas; **Events** mostra as conversões, que podem ser filtradas pelas propriedades acima.

A Vercel Analytics continua carregada para page views e Speed Insights. No plano Hobby ela não registra eventos customizados nem UTMs, por isso os eventos vão só para o Umami.

## Funis

Quatro funis medem o caminho até a conversa: **Artigo → contato**, **Estudo de caso → contato**, **Trabalhe comigo → contato** e **Artigo → newsletter**, com até 7 dias entre os passos. Estão definidos em `src/lib/umami.ts` e são criados no Umami de uma vez:

```bash
UMAMI_API_KEY=… UMAMI_WEBSITE_ID=… npm run umami:funnels
```

O comando só cria os que ainda não existem; rode de novo depois de acrescentar um funil. O Umami só aceita `*` no fim do caminho, então o funil de estudo de caso cobre as páginas em português (`/projetos/*`).

## Relatório mensal

Os relatórios por e-mail do Umami Cloud são do plano pago. Este repositório gera o próprio relatório pela API:

```bash
UMAMI_API_KEY=… UMAMI_WEBSITE_ID=… npm run report:traffic                    # mês passado
UMAMI_API_KEY=… UMAMI_WEBSITE_ID=… npm run report:traffic -- --month 2026-09
```

Ele traz visitantes, visitas, páginas vistas, rejeição e tempo médio comparados ao mês anterior; canais, sites de origem, fontes e campanhas UTM; páginas mais vistas e de entrada; eventos; contatos pela origem da visita e da primeira visita; e os funis.

Para recebê-lo todo dia 1º como uma issue no GitHub (`.github/workflows/traffic-report.yml`):

1. No Umami: **Settings → API keys → Create key**.
2. No GitHub, em **Settings → Secrets and variables → Actions**: o secret `UMAMI_API_KEY` com a chave e a variável `UMAMI_WEBSITE_ID` com o *Website ID*.
3. Para testar, rode o workflow **traffic-report** à mão em **Actions** (dá para escolher o mês).

Sem a variável `UMAMI_WEBSITE_ID`, o workflow fica parado e não falha.
