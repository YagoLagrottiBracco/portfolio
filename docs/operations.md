# Operação — segurança, verificações automáticas e indexação

O que roda sozinho, o que protege o site e o que precisa de um passo seu fora do código.

## Headers de segurança

`src/lib/security-headers.ts`, aplicado a todas as rotas pelo `next.config.ts`:

| Header | Valor | Por quê |
| --- | --- | --- |
| `Content-Security-Policy` | só este domínio e o Umami | impede que um script injetado carregue código de fora, envie dados para outro domínio, abra o site num `<iframe>` ou troque o `<base>` |
| `X-Content-Type-Options` | `nosniff` | o navegador não "adivinha" tipo de arquivo |
| `X-Frame-Options` | `DENY` | o mesmo que `frame-ancestors 'none'`, para navegadores antigos |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | os sites dos projetos continuam vendo que a visita veio do `lagrotti.dev`, mas não a URL completa |
| `Permissions-Policy` | câmera, microfone, localização etc. desligados | o site não usa nenhum deles |
| `Cross-Origin-Opener-Policy` | `same-origin` | isola a janela de páginas abertas a partir daqui |

O HSTS não está na lista porque a Vercel já o envia em toda resposta.

**A CSP permite `'unsafe-inline'` em scripts.** As páginas são estáticas, geradas no build, e não podem carregar um *nonce* por requisição sem perder isso. O resto da política continua valendo.

**Ao adicionar um serviço externo** (um embed, outra ferramenta de analytics, uma fonte remota), inclua a origem na diretiva certa de `contentSecurityPolicy()`. O teste `e2e/security.spec.ts` falha se alguma página principal disparar uma violação de CSP.

## Limites de requisição e auditoria

| Rota | Limite | Chave |
| --- | --- | --- |
| `POST /api/blog/publish` | 10 a cada 10 min | IP |
| `POST`/`PUT /api/admin/blog` | 30 gravações a cada 10 min | usuário do GitHub |
| `POST /api/newsletter` | 5 por hora | IP |

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
| Idem | **Lighthouse** em cinco páginas (desktop, mediana de 3): acessibilidade e SEO ≥ 95, boas práticas ≥ 90 reprovam; desempenho < 90 só avisa | job `lighthouse`, relatórios como artefato |
| Toda segunda, 09:00 | os links externos dos projetos respondem? Abre ou atualiza a issue "Links de projetos fora do ar" e a fecha quando tudo volta | `link-check.yml` |
| Dia 1º, 09:00 | relatório de tráfego do mês anterior como issue | `traffic-report.yml` ([utm.md](utm.md#relatório-mensal)) |
| Após cada deploy de produção | ping do IndexNow com as páginas alteradas | `indexnow.yml` |

Para rodar localmente: `npm run test:e2e` (depois de `npm run build`) e `npx --yes @lhci/cli@0.15.1 autorun`. Com outro checkout rodando os testes ao mesmo tempo, use `PLAYWRIGHT_PORT=3470 npm run test:e2e`.

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

1. Gere uma chave: `openssl rand -hex 16`.
2. Salve-a como `INDEXNOW_KEY` na Vercel (Production) e faça um deploy. A chave fica pública em `https://lagrotti.dev/indexnow-key.txt`, como o protocolo exige.
3. Salve o mesmo valor como **variável** (não secret) `INDEXNOW_KEY` no GitHub, em **Settings → Secrets and variables → Actions → Variables**.

A partir daí, cada deploy de produção da Vercel dispara `indexnow.yml`, que envia as páginas alteradas nos últimos 2 dias. Para enviar à mão: `INDEXNOW_KEY=… npm run indexnow -- --all`.

## Dependências

- **Dependabot** (`.github/dependabot.yml`): toda segunda abre no máximo 5 PRs de atualização, com minor e patch agrupados e uma espera de 14 dias depois de cada lançamento, para não pegar versão recém-publicada. As GitHub Actions são atualizadas uma vez por mês.
- **CodeQL** (`codeql.yml`): análise estática de segurança em cada PR, em cada push no `master` e toda quarta. Os alertas aparecem em **Security → Code scanning**.
- **`npm audit`** no CI: vulnerabilidade alta ou crítica numa dependência de produção reprova o PR.
- **Ative no repositório**, em **Settings → Code security**: *Dependabot alerts*, *Dependabot security updates*, *Secret scanning* e *Push protection*. A última bloqueia um push que contenha uma chave (Buttondown, Resend, Anthropic…) antes que ela vaze.

O `postcss` é forçado para `^8.5.28` em `overrides` no `package.json`, porque o Next fixa uma 8.4 com vulnerabilidades altas. Ficam conhecidas, sem correção compatível, vulnerabilidades baixas e moderadas no `gray-matter` (só lê os artigos no build) e no editor Milkdown (só no `/admin`). As duas exigem trocar a versão principal desses pacotes.
