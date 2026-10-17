# Operação — segurança, monitoramento, verificações automáticas e indexação

O que roda sozinho, o que protege o site e o que precisa de um passo seu fora do código.

## Headers de segurança

`src/lib/security-headers.ts`, aplicado a todas as rotas pelo `next.config.ts`:

| Header | Valor | Por quê |
| --- | --- | --- |
| `Content-Security-Policy` | este domínio e só os serviços que as páginas usam: Umami, Calendly, giscus, as demos dos projetos e, com DSN, o Sentry | impede que um script injetado carregue código de fora, envie dados para outro domínio, abra o site num `<iframe>` ou troque o `<base>` |
| `X-Content-Type-Options` | `nosniff` | o navegador não "adivinha" tipo de arquivo |
| `X-Frame-Options` | `DENY` | o mesmo que `frame-ancestors 'none'`, para navegadores antigos |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | os sites dos projetos continuam vendo que a visita veio do `lagrotti.dev`, mas não a URL completa |
| `Permissions-Policy` | câmera, microfone, localização etc. desligados | o site não usa nenhum deles |
| `Cross-Origin-Opener-Policy` | `same-origin` | isola a janela de páginas abertas a partir daqui |

O HSTS não está na lista porque a Vercel já o envia em toda resposta.

**As ferramentas de `/incorporar/*` são a exceção ao `<iframe>`:** foram feitas para outros sites embutirem, então recebem `frame-ancestors *` e não levam `X-Frame-Options`. Todo o resto continua sem poder ser emoldurado.

**A CSP permite `'unsafe-inline'` em scripts.** As páginas são estáticas, geradas no build, e não podem carregar um *nonce* por requisição sem perder isso. O resto da política continua valendo.

**Ao adicionar um serviço externo** (um embed, outra ferramenta de analytics, uma fonte remota), inclua a origem na diretiva certa de `contentSecurityPolicy()`. O teste `e2e/security.spec.ts` falha se alguma página principal disparar uma violação de CSP.

## Limites de requisição e auditoria

| Rota | Limite | Chave |
| --- | --- | --- |
| `POST /api/blog/publish` | 10 a cada 10 min | IP |
| `POST`/`PUT /api/admin/blog` | 30 gravações a cada 10 min | usuário do GitHub |
| `POST /api/newsletter` | 5 por hora | IP |
| `POST /api/contact/brief` | 3 por hora | IP |
| `POST /api/contact/recommendation` | 3 por hora | IP |
| `POST /api/interactions/polls/:id` | 20 a cada 10 min, até mil chaves em memória | IP |
| `POST /api/ask` | 8 por hora, e `ASK_DAILY_LIMIT` por dia no total | IP; o diário é por instância |

Os limites ficam na memória de cada instância da função (`src/lib/rate-limit.ts`). Eles param um script descontrolado ou uma rajada, mas não um ataque distribuído. Para isso existe o firewall da Vercel:

1. No projeto da Vercel, abra **Firewall → Configure → New Rule**.
2. Condição: **Request Path** *starts with* `/api/`.
3. Ação: **Rate Limit**, 60 requisições por 60 segundos por IP, depois **Deny** (resposta 429).
4. Salve e publique a regra. O plano Hobby permite até 3 regras próprias.

**Auditoria** (`src/lib/audit-log.ts`):

- toda tentativa nas APIs de escrita, inclusive as recusadas, vira uma linha JSON no log da função: `{"audit":"blog.publish","outcome":"denied","ip":"…","requestId":"…"}`. No Hobby, a Vercel guarda esses logs por pouco tempo; para mantê-los, configure um *log drain*;
- todo commit feito pelas APIs leva trailers no git, que ficam para sempre no histórico:

```text
feat(blog): publish meu-artigo

Published-Via: blog-api
Request-Id: gru1::abcde-1792207682824-13ef93c65cf2
```

O editor grava `Edited-By: github:<id>`. Para listar tudo o que foi publicado pelas APIs: `git log --grep="Published-Via\|Edited-By"`.

## Verificações automáticas

| Quando | O quê | Onde |
| --- | --- | --- |
| Cada pull request e push no `master` | lint, testes unitários, capas novas do blog, build e tipos | job `checks` de `ci.yml` |
| Idem | testes de navegador: idioma, páginas, blog, CSP sem violações, **acessibilidade WCAG 2.1 A/AA com axe nos dois temas** | job `e2e` |
| Idem | **Lighthouse** em cinco páginas (celular em 4G lento, mediana de 3): acessibilidade e SEO ≥ 95, boas práticas ≥ 90 reprovam; desempenho < 85 só avisa | job `lighthouse`, relatórios como artefato |
| Cada pull request | **comparação visual** de 32 capturas (veja [Testes visuais](#testes-visuais)) | `visual.yml` |
| De hora em hora | **o site responde?** Home, blog, artigo mais recente, currículo, sitemap e a API da newsletter. Abre ou atualiza a issue "Site com problema" e a fecha quando tudo volta | `uptime.yml` |
| Toda segunda, 09:00 | os links externos dos projetos e as fontes citadas nos artigos respondem? Mantém as issues "Links de projetos fora do ar" e "Links quebrados nos artigos", fechadas quando tudo volta | `link-check.yml` |
| Dia 1º, 09:00 | relatório de tráfego do mês anterior como issue | `traffic-report.yml` ([utm.md](utm.md#relatório-mensal)) |
| Após cada deploy de produção | ping do IndexNow com as páginas alteradas | `indexnow.yml` |

Para rodar localmente: `npm run test:e2e` (depois de `npm run build`) e `npx --yes @lhci/cli@0.15.1 autorun`. Com outro checkout rodando os testes ao mesmo tempo, use `PLAYWRIGHT_PORT=3470 npm run test:e2e`.

## Monitoramento

**Disponibilidade.** `scripts/uptime-check.mjs` faz as mesmas perguntas de quem visita: a home, o blog, o artigo mais recente do feed, o currículo em PDF, o sitemap e a API da newsletter (que precisa recusar um e-mail inválido, prova de que está rodando). Cada falha é repetida uma vez antes de contar, para um *cold start* não virar alarme. O workflow `uptime.yml` roda de hora em hora sem `npm ci`, em segundos. Para conferir outro endereço, como um preview: `npm run check:uptime -- https://<preview>.vercel.app`. A variável `SITE_URL` do GitHub troca o alvo do workflow.

**Erros no navegador (Sentry).** Sem o SDK do Sentry: `ErrorReporter` envia direto à API de *envelopes* os erros não tratados e as *promises* rejeitadas, no máximo 5 por página, cada mensagem uma vez, sem ruído de extensões nem do `ResizeObserver`. Vão o tipo e a mensagem do erro, a pilha, a página, o navegador, o idioma e o commit; nada do que a pessoa digitou. Com o DSN, a CSP também passa a reportar violações ao Sentry.

1. Em <https://sentry.io>, crie um projeto **Browser JavaScript** (o plano grátis basta).
2. Em **Project Settings → Client Keys (DSN)**, copie o DSN e salve como `NEXT_PUBLIC_SENTRY_DSN` na Vercel (Production). Faça um deploy.
3. Para testar, rode no console do site: `setTimeout(() => { throw new Error("teste do Sentry") })`. O erro aparece em **Issues** em alguns segundos.

Sem a variável, nada é enviado e a CSP não muda.

## Testes visuais

`e2e/visual.spec.ts` fotografa o topo da home, de um estudo de caso, de `/trabalhe-comigo`, de um artigo e da página 404, e ainda o card de destaque, o contato e o rodapé da home: nos dois temas, no notebook e no celular. Imagens remotas e o ano do rodapé ficam mascarados.

As fontes mudam de máquina para máquina, então as referências (`e2e/visual.spec.ts-snapshots/`) são geradas no container oficial do Playwright, pelo workflow `visual.yml`:

1. **Atualizar referências:** em **Actions → visual → Run workflow**, escolha o branch e marque **update**. O workflow gera as 32 imagens no container fixado e as commita no branch. Baselines ausentes reprovam o check; comparação nunca é silenciosamente pulada.
2. **Em cada PR:** as capturas são comparadas com as referências. Se algo mudou, o job falha e o artefato `visual-diffs` traz a imagem esperada, a obtida e a diferença.
3. **Mudança intencional:** confira as diferenças e rode o workflow de novo com **update** no branch do PR.

Fora do CI, rode no mesmo container (com Docker): `docker run --rm -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.63.0-noble bash -c "npm ci && npm run build && npm run test:visual"`. O `npm run test:e2e` não inclui esses testes. Ao atualizar o `@playwright/test`, atualize também a tag da imagem no `visual.yml` e gere as referências de novo.

## Indexação

**Google Search Console**

1. Em <https://search.google.com/search-console>, adicione a propriedade **Prefixo do URL** `https://lagrotti.dev/`.
2. Escolha **Tag HTML**, copie só o valor de `content` e salve como `GOOGLE_SITE_VERIFICATION` na Vercel. Faça um deploy e clique em **Verificar**.
3. Em **Sitemaps**, envie `sitemap.xml`.

**Bing Webmaster Tools**

1. Em <https://www.bing.com/webmasters>, use **Importar do Google Search Console** (mais rápido) ou verifique com a meta tag em `BING_SITE_VERIFICATION`.
2. Envie `https://lagrotti.dev/sitemap.xml`.

O Bing também alimenta o Copilot e o DuckDuckGo, então vale o mesmo cuidado que o Google.

**IndexNow** avisa o Bing (e o Yandex) assim que uma página muda, em vez de esperar o próximo rastreamento:

A chave já é pública e versionada em `/4f31dd50dbdb4c5d9f4eac94301d918a.txt`; `/indexnow-key.txt` é um alias compatível. Não depende de `INDEXNOW_KEY`. O workflow após deploy valida o arquivo em produção, cruza as URLs canônicas locais com o sitemap implantado e envia somente as publicadas. `npm run indexnow` e `npm run indexnow:submit` simulam o mesmo fluxo; `--publish` (ou `--submit`) envia. `--since N` filtra datas de modificação; HTTP 200/202 significa recebimento, sem garantia de indexação.

**WebSub:** com `WEBSUB_HUB_URL` HTTPS no build/deploy e na variable Actions, os RSS do blog anunciam o hub e o mesmo workflow o notifica após produção. `npm run websub` simula e `--publish` envia. Sem configuração, não anuncia nem envia.

## Dependências

- **Dependabot** (`.github/dependabot.yml`): toda segunda abre no máximo 5 PRs de atualização, com minor e patch agrupados e uma espera de 14 dias depois de cada lançamento, para não pegar versão recém-publicada. As GitHub Actions são atualizadas uma vez por mês.
- **CodeQL** (`codeql.yml`): análise estática de segurança em cada PR, em cada push no `master` e toda quarta. Os alertas aparecem em **Security → Code scanning**.
- **`npm audit`** no CI: vulnerabilidade alta ou crítica numa dependência de produção reprova o PR.
- **Ative no repositório**, em **Settings → Code security**: *Dependabot alerts*, *Dependabot security updates*, *Secret scanning* e *Push protection*. A última bloqueia um push que contenha uma chave (Buttondown, Resend, Anthropic…) antes que ela vaze.

O `postcss` é forçado para `^8.5.28` em `overrides` no `package.json`, porque o Next fixa uma 8.4 com vulnerabilidades altas. Ficam conhecidas, sem correção compatível, vulnerabilidades baixas e moderadas no `gray-matter` (só lê os artigos no build) e no editor Milkdown (só no `/admin`). As sugestões automáticas de correção são downgrades incompatíveis; não aplicar `--force`. A [revisão dos alertas](security-review-2026-10-17.md) registra a análise, e a [matriz de integrações](integrations.md) registra os passos de infraestrutura pendentes.

## Limites operacionais desta entrega

A aplicação conta bytes efetivamente recebidos antes de interpretar JSON/formulários: 10 kB nos formulários (ou limite específico), 4 kB no assistente e 8 MiB na publicação Bearer. O admin conserva seu limite e validação de imagens. Recusas malformadas/excessivas são auditadas com códigos fixos, sem conteúdo privado ou erro cru de provedor. Uma recusa feita pela hospedagem antes de chegar à aplicação não produz log de aplicação.

A aprovação e retenção durável das menções são distintas de logs operacionais: Webmentions recebidos criam issues pendentes, enquanto logs da função precisam de retenção/log drain externo. A configuração de firewall e de gastos do provedor não foi inferida a partir do código.
