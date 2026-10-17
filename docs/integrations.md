# Integrações e ativação

O código não ativa contas externas. A referência de configuração é `.env.example`; este documento distingue o que funciona sem conta e o que depende do proprietário. Nunca copiar um token amplo do `gh` para o deploy.

| Recurso | Configuração e comportamento | Passo externo restante |
| --- | --- | --- |
| Conteúdo, busca, CV, recursos, QR e compartilhamento | Funcionam sem serviços opcionais. Conteúdo publicado é gerado no build; os recursos de navegador não enviam arquivos a um servidor. | Nenhum. |
| Umami no navegador | `NEXT_PUBLIC_UMAMI_WEBSITE_ID`; sem ID não monta o tracker. | Criar/selecionar o site no Umami e configurar o ID no deploy. |
| Mais lidos e audiência pública | `UMAMI_WEBSITE_ID`, `UMAMI_API_KEY`, `UMAMI_API_URL` opcional. Cloud usa `https://api.umami.is/v1`; self-hosted exige base completa com `/api` e token Bearer apropriado. Somente caminhos exatos de artigos publicados entram no agregado. Cache/singleflight por processo de cinco minutos, timeout de cinco segundos, no máximo mil caminhos consultados e nove artigos expostos. | Chave legítima do proprietário. Não usar credencial do navegador. |
| Relatório mensal | Mesmo cliente Umami; secret Actions `UMAMI_API_KEY`, variables `UMAMI_WEBSITE_ID` e opcional `UMAMI_API_URL`. O workflow mensal cria uma issue; cada seção indisponível fica identificada. | Configurar credenciais do provedor; conferir primeiro relatório. Um job verde não comprova sucesso de todas as seções. |
| Enquetes | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, opcional `INTERACTIONS_KEY`. Atualização atômica Lua no mesmo JSON preserva totais anteriores; falha do store não produz votos fictícios. | Provisionar Redis REST compatível e credenciais. Limite de requisições continua por instância. |
| Briefing e recomendações | `RESEND_API_KEY` e `CONTACT_TO`; `CONTACT_FROM` deve usar domínio verificado. Sem configuração, há alternativas de contato. Recomendações chegam por e-mail e exigem revisão editorial antes da publicação. | Verificar remetente e configurar chave/inbox. Não foram enviados formulários reais de teste. |
| Newsletter | `BUTTONDOWN_API_KEY`; sem chave o formulário fica oculto e a API informa indisponibilidade. | Conta e consentimento/double opt-in; envio de edições é feito no provedor. |
| Comentários | Quatro valores `NEXT_PUBLIC_GISCUS_*`. | Habilitar Discussions, instalar/configurar giscus e preencher IDs reais. |
| Assistente | `ANTHROPIC_API_KEY`; `ASK_MODEL` e `ASK_DAILY_LIMIT` opcionais. Sem chave: página 404, API 503 e URL ausente dos índices. A extração do corpus acompanha os títulos reais da AST Markdown. | Conta, chave e limite de gastos no provedor. Limite diário em memória não é teto global de gasto. Nenhuma chamada paga foi executada na validação. |
| Webmentions recebidos | `WEBMENTION_GITHUB_TOKEN`, token dedicado com Issues read/write somente neste repositório. O recebimento verifica backlink e só retorna 202 após criar issue durável; publicação exige aprovação e PR de conteúdo. | Criar credencial específica e configurar deploy; aprovar menções verdadeiras. |
| webmention.io | `WEBMENTION_IO_TOKEN`, integração de leitura separada. Somente pares source/target já presentes no arquivo de referências revisadas podem aparecer. Não sincroniza automaticamente a fila de aprovação GitHub. | Conta/token e referências consentidas e revisadas. |
| Federação | `ACTIVITYPUB_MODE=bridge`, `ACTIVITYPUB_USERNAME`, `ACTIVITYPUB_WEBFINGER_URL` HTTPS; opcionais URLs HTTPS `ACTIVITYPUB_ACTOR_URL` e `ACTIVITYPUB_OUTBOX_URL`. WebFinger só responde ao `acct` local correto. | Selecionar/configurar bridge externo com recebimento, assinaturas e armazenamento. O servidor local não implementa seguidores/Follow/Accept: modo nativo não é anunciado; inbox local continua 501. |
| WebSub | `WEBSUB_HUB_URL` HTTPS no **build/deploy** e na variable Actions. Os três RSS anunciam esse hub; o workflow após deploy envia os tópicos. `npm run websub` simula; `--publish` envia. | Selecionar hub compatível e configurar os dois ambientes. Sem hub não há anúncio nem ping. |
| IndexNow | Chave pública versionada em `public/4f31dd50dbdb4c5d9f4eac94301d918a.txt`; `/indexnow-key.txt` é alias compatível. Um único fluxo valida chave e intersecta as URLs conhecidas com o sitemap implantado antes de enviar. | Nenhuma credencial de conta. Aceite HTTP não garante indexação ou ranking. |
| Sentry | `NEXT_PUBLIC_SENTRY_DSN`; reporter de erros não tratados no navegador, com limite local e ruído filtrado. | Conta/DSN e confirmação de entrega no painel. Não equivale a instrumentação do servidor. |
| Admin/publicação | OAuth GitHub, ID numérico permitido, `AUTH_*`, token GitHub dedicado, repositório/branch e `BLOG_API_KEY` para Bearer. Uploads validam bytes reais via sharp. | Configurar OAuth e tokens de menor privilégio. Publicação retorna deployment-pending e depende do deploy. |
| Busca orgânica | Metatags com `GOOGLE_SITE_VERIFICATION` e `BING_SITE_VERIFICATION`; sitemap público. | Provar posse e enviar sitemap nos painéis; esses atos não são demonstrados pelo código. |
| Podcast, depoimentos, números comerciais e usos da comunidade | Arrays/datasets só publicam conteúdo verdadeiro aprovado. TTS do navegador é independente de episódios gravados. Os rótulos dos cases distinguem escopo e resultados; um número de módulos não mede conversão. | Produzir episódios, obter consentimento e evidências de resultados reais. Não preencher com exemplos fingindo produção. |

## Distribuição manual

`npm run distribute` simula por padrão. Apenas `--publish` publica nos provedores configurados; `--dry-run` explicita a simulação. As credenciais de Mastodon, Telegram, Bluesky e LinkedIn em `.env.example` são somente de servidor/script e nunca `NEXT_PUBLIC_*`. O comando de crosspost dev.to continua criando rascunho somente quando solicitado. Esta entrega não enviou posts ou mensagens a pessoas.

Há dois downloads históricos distintos de worker: o ZIP TypeScript antigo requer Node 22 e dependências; o release MJS 1.0.0 é independente e requer Node 20+. Os arquivos de release 1.0.0 e seus hashes são imutáveis.

## Evidência editorial

O artigo EnvRune possui PT/EN/ES e fontes fixadas no commit público `c2aa0d1`. Foram mantidas as características técnicas apoiadas pelas descrições existentes, sem inventar receita, conversão ou redução de custos. Os cinco anos adicionados em `848b4cd` sem fonte histórica registrada foram retirados até confirmação: VMageste, DevAgent, PulseWatch, Eurologado e Praxis. Uma data de artigo ou de criação do repositório não prova o início do produto.

A auditoria inicial é um snapshot de `5af653b`, não uma declaração permanente do estado de produção. Os resultados finais e as dependências restantes estão em `UPDATE.md`.
