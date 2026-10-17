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
