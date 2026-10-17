# UPDATE — Unificação das 4 Frentes de IA e Evolução Pós-Merge

> **Data de referência**: Outubro de 2026
> **Branch principal**: `master`
> **Escopo**: Registro completo do estado atual do portfólio (`lagrotti.dev`) após a unificação das 4 frentes de IA (**Codex**, **Claude**, **Kimi** e **Antigravity**) e especificação detalhada desta nova leva de melhorias de coesão, conteúdo, links, documentação e higiene de repositório.

---

## 1. Resumo da Unificação ("Grand Merge" — Commit `5af653b`)

O projeto consolidou em uma única árvore (`master`) o trabalho paralelo de 4 agentes de IA:

1. **Ecossistema de Recursos (`origin/master` / Codex)**:
   - Biblioteca interativa em `/recursos/[[...resource]]` (PT/EN/ES) com 20 coleções técnicas.
   - 3 ferramentas incorporáveis via iframe em `/incorporar/[tool]` (`json`, `env`, `queue`).
   - Pacotes standalone testados: CLI em `packages/resource-tools`, GitHub Action em `packages/resource-action` e laboratórios em `examples/http-lab` e `examples/worker-starter`.
   - APIs públicas de catálogo (`/api/resources/v1`), cartões SVG (`/api/resources/card`), QR Code (`/api/resources/qr`), encurtador `/r/[code]`, comparador `/comparar/[slug]/[locale]` e feed RSS (`/recursos/feed.xml`).
2. **Conversão, Alcance, RAG & Operações (`feat/conversion-and-reach` / Claude)**:
   - Assistente **Ask My Portfolio** (`/perguntar` e `/api/ask`) com RAG sobre estudos de caso, perfil e artigos do blog usando citações verificadas.
   - Busca global instantânea (`Ctrl+K` / `/`) indexando todo o site por idioma (`/search-index/[locale]`).
   - Páginas de conversão: `/trabalhe-comigo` (com triagem para recrutadores, Calendly embarcado e formulário de briefing), `/agora`, `/recomendar` (`noindex`) e `/privacidade`.
   - Páginas de tecnologias baseadas em evidências (`/stack` e `/stack/[slug]`) + filtro por tecnologia na linha do tempo de experiência.
   - Modo apresentação de estudos de caso para entrevistas (`/projetos/[slug]/apresentar`).
   - Currículos focados por especialidade (`/cv/[locale]/backend`, `fullstack`, `ia`, `lideranca`), versão texto puro para ATS (`/cv/[locale]/plain.txt`), JSON Resume (`/cv/[locale]/resume.json`) e vCard (`/contato.vcf`).
   - Leitura de artigos em voz alta (TTS), feed de podcast (`/blog/podcast.xml`), comentários Giscus, newsletter Buttondown, animações CSS zero-JS (`reveal()`) e cabeçalhos de segurança (`Content-Security-Policy`).
3. **Discovery Hub, IndieWeb & Qualidade (`feat/growth-and-quality` / Kimi + Antigravity)**:
   - 12 páginas do Discovery Hub em 3 idiomas (36 rotas SSG): `/links`, `/blogroll`, `/radar`, `/leitura`, `/principios`, `/ia`, `/habilidades`, `/status`, `/analytics`, `/cartao`, `/curriculo`, `/participar`.
   - Protocolos abertos: ActivityPub/Fediverse (`/.well-known/webfinger`, `/fediverse/actor`, `/api/activitypub/*`), W3C Webmentions (`/api/webmention` com proteção SSRF/DNS pinning e `/api/webmentions`), OPML (`/blogroll.opml`) e `/llms.txt`.
   - Componentes de leitura: `CodeTabs` (abas multi-linguagem com persistência) e `ReadingModeToggle` (modo foco de leitura).
   - Desacoplamento de `src/data/projects-data.ts` separado de `src/data/personal.ts`.

---

## 2. O Que Faremos Nesta Leva de Alterações (Plano de Execução)

Após a unificação e execução dos scripts de auditoria (`npm run audit:case-studies` e `npm run check:links`), identificamos 4 frentes de aperfeiçoamento para integrar visual e funcionalmente o que cada agente construiu em paralelo:

### Frente 1 — Coesão Visual e Funcional do Discovery Hub (`src/components/discovery/DiscoveryScreen.tsx`)

1. **Transformar `/links` (`LinksScreen`) em um verdadeiro Hub de Navegação**:
   - Atualmente `/links` exibe apenas links de RSS, Blog e os 3 últimos artigos.
   - **Melhoria**: Incluir seções estruturadas com links diretos para as páginas principais do portfólio (`/trabalhe-comigo`, `/stack`, `/recursos`, `/agora`) e um diretório completo para as outras 11 páginas do Discovery Hub (`/principios`, `/ia`, `/habilidades`, `/radar`, `/leitura`, `/blogroll`, `/status`, `/analytics`, `/cartao`, `/curriculo`, `/participar`), além dos perfis sociais (GitHub, LinkedIn, E-mail) e canais.
2. **Gerar QR Code 100% Local e Resumo Traduzido em `/cartao` (`CardScreen`)**:
   - Atualmente `/cartao` aponta uma tag `<img>` para `https://api.qrserver.com/v1/create-qr-code/` (dependência externa que expõe o IP do visitante) e exibe `personalData.summary` (em inglês) mesmo nas rotas em português e espanhol.
   - **Melhoria**: Gerar o QR Code localmente no servidor usando o pacote `qrcode` (`QRCode.toString` em SVG inline ou Data URI, sem requisição externa) e exibir o resumo localizado de `messages[locale].about.summary`.
3. **Integrar Currículos Focados e Resumo Localizado em `/curriculo` (`ResumeScreen`)**:
   - Atualmente `/curriculo` oferece apenas o PDF geral e o JSON Resume, além de exibir `personalData.summary` sem tradução.
   - **Melhoria**: Adicionar botões diretos para os **4 currículos em PDF focados por área** (`Backend`, `Fullstack`, `IA`, `Liderança` via `getCvPath(locale, focus)`) e para a versão **Texto Puro / ATS** (`/cv/${locale}/plain.txt`), além de usar `messages[locale].about.summary`.
4. **Conectar `/habilidades` (`SkillsScreen`) às Páginas de Evidência `/stack/[slug]` e Estudos de Caso**:
   - Atualmente `/habilidades` renderiza cada competência e projeto como texto estático.
   - **Melhoria**: Utilizar `techFor`, `publishedTechs`, `getStackPath`, `getCaseStudyPath` e `localizeLabel` para transformar cada competência que possui página em `/stack/[slug]` em um link direto para sua página de evidências, e transformar os projetos citados em links para seus respectivos estudos de caso (`/projetos/[slug]`).

---

### Frente 2 — Completude dos Estudos de Caso e Saúde dos Links (`src/data/projects-data.ts` e `src/data/content-labels.ts`)

1. **Vincular Artigo Técnico ao Estudo de Caso `envrune`**:
   - O projeto `envrune` possui o artigo publicado `envrune-secrets-out-of-plaintext-dotenv`, mas `caseStudy.article` estava ausente.
   - **Melhoria**: Preencher `article: "envrune-secrets-out-of-plaintext-dotenv"` em `envrune.caseStudy`.
2. **Preencher `year` em Todos os 10 Estudos de Caso**:
   - Adicionar o campo `year` nos 5 estudos de caso que estavam sem ano (`vmageste`, `praxis`, `pulsewatch`, `eurologado`, `devagent`).
3. **Adicionar Métricas Estruturadas e Traduzidas nos 6 Estudos de Caso Pendentes**:
   - Adicionar `metrics` verificáveis nos estudos de caso `impressaomais3d`, `praxis`, `digitaltechms`, `dupla-face`, `flora-psicologia` e `devagent` em `src/data/projects-data.ts`, registrando as respectivas traduções (`pt`, `en`, `es`) em `src/data/content-labels.ts` para que `npm run audit:case-studies` reporte **0 estudos de caso sem métricas** e todos os testes de i18n (`tests/i18n.test.cjs`) passem.
4. **Saneamento de Links Externos Fora do Ar (`npm run check:links`)**:
   - Atualizar ou remover URLs de domínios expirados/offline ou repositórios privados identificados por `npm run check:links` (`normify.app`, `agendify.me`, `florir.online`, `minhas-financas-murex.vercel.app`, `techworkydigital-interno`, `templates-web-mobile` e ajustar links com erro de certificado/indisponibilidade temporária), garantindo que visitantes e recrutadores não encontrem links quebrados.

---

### Frente 3 — Atualização da Documentação Unificada e `.env.example`

1. **`README.md` e `docs/architecture.md`**:
   - Adicionar na tabela de rotas e na árvore de arquitetura as 12 páginas trilíngues do Discovery Hub, os endpoints IndieWeb/Fediverse (`/.well-known/webfinger`, `/fediverse/actor`, `/api/webmention`, `/blogroll.opml`) e o módulo `src/data/projects-data.ts`.
2. **`.env.example`**:
   - Documentar as variáveis opcionais `WEBMENTION_GITHUB_TOKEN`, `WEBMENTION_IO_TOKEN`, `NEXT_PUBLIC_WHATSAPP_CHANNEL_URL` e `NEXT_PUBLIC_TELEGRAM_CHANNEL_URL`.

---

### Frente 4 — Higiene de Worktrees e Branches Locais

1. **Remoção de Worktrees Temporárias Já Unificadas**:
   - Remover as worktrees auxiliares `/media/yago/FC6E31DE6E3191FE/Projetos/Pessoal/portfolio-growth` (`feat/conversion-and-reach`) e `.superpowers/worktrees/resource-ecosystem` (`feat/resource-ecosystem`), cujo conteúdo já está 100% integrado na `master`.
2. **Limpeza de Branches Locais Absorvidas**:
   - Remover branches locais temporárias já mergeadas em `master` (`feat/site-growth`, `feat/conversion-and-reach`, `feat/resource-ecosystem`, `feat/growth-and-quality`), mantendo o repositório limpo e padronizado na `master`.

---

## 3. Critérios de Aceite Desta Leva (Frentes 1–4)

- [x] `DiscoveryScreen.tsx` atualizado (`/links` completo, `/cartao` com QR Code SVG local sem requisições externas, `/curriculo` com os 4 PDFs focados + Plain Text ATS, `/habilidades` linkado a `/stack/[slug]` e `/projetos/[slug]`).
- [ ] `npm run audit:case-studies` sem lacunas de evidências técnicas e artigo relacionado; anos históricos e resultados comerciais somente com fonte. A validação final reabriu a confirmação de cinco anos adicionados sem evidência em `848b4cd` (ver seção 6).
- [x] `npm run check:links` sem links quebrados (17 de 17 links de projetos respondendo).
- [x] `README.md`, `docs/architecture.md` e `.env.example` atualizados com todas as rotas e variáveis das 4 frentes.
- [x] Worktrees e branches antigas já unificadas limpas (`portfolio-growth` e `resource-ecosystem`).
- [x] `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:resource-packages` e `npm run build` 100% verdes.

---

## 4. Complemento após a auditoria do estado real — 17/10/2026

Este complemento foi escrito **antes de iniciar a implementação desta frente**, após a leitura integral das seções anteriores. A referência verificável é `docs/project-state-2026-10-17.md`, baseada no código de `5af653b`, nos workflows e nas respostas de produção. As frentes 1–4 continuam válidas, com as correções abaixo. Não se trata de implementar novamente funcionalidades já existentes.

### Compatibilidade com o plano anterior

| Ponto | Decisão que orienta a execução |
| --- | --- |
| Inventário de recursos | São **21 coleções**, não 20. Preservar os pacotes e os arquivos de releases já publicados; se seus bytes precisarem mudar, publicar uma nova versão. |
| Artigo do EnvRune | O campo real é `caseStudy.articleKey`, não `article`. O artigo citado na frente 2 não existia no snapshot auditado. Vincular somente uma tradução realmente publicada; se necessário, escrever o artigo em PT/EN/ES com base no código/documentação pública verificável do projeto. |
| Anos e métricas | Não inferir ano de criação de produto a partir do ano atual. Preencher somente dados sustentados por evidência, distinguindo escopo técnico de resultado comercial. Se faltar comprovação, registrar a dependência e preservar a ausência em vez de inventar um resultado para satisfazer o auditor. |
| Alterações em andamento | Preservar as edições existentes em `DiscoveryScreen.tsx`, `projects-data.ts` e `content-labels.ts`. Trabalhar em uma branch/worktree isolada e integrar essas frentes após conferir a versão final, sem sobrescrever trabalho concorrente. |
| Limpeza de branches/worktrees | Remover apenas material integrado, sem mudanças exclusivas, sem processos ou agentes ativos e com os registros necessários preservados. Um squash merge exige comparação do conteúdo; não basta testar ancestralidade. Não usar remoção forçada para esconder diferenças. |
| Integrações opcionais | Código disponível não significa serviço ativo. Habilitar somente com configuração legítima disponível. Não reutilizar tokens amplos de outras ferramentas, publicar mensagens em redes sociais, aceitar termos nem produzir depoimentos, contribuições ou números fictícios. |

### Frente 5 — Rotas, respostas 404 e recuperação do CI

- [ ] Eliminar o conflito entre o primeiro segmento dinâmico `[slug]` das páginas PT e `[locale]`, preservando as URLs públicas, idiomas, canonical e hreflang. Preferir rotas PT explícitas que reutilizem o componente comum.
- [ ] Testar a inicialização real com `next start`, as páginas publicadas e caminhos inexistentes/idiomas inválidos. Um recurso ausente precisa responder 404, sem erro 500.
- [ ] Executar os testes E2E completos e o Lighthouse mobile após a correção; conservar os limites de qualidade, corrigindo falhas reais em vez de relaxar os checks para obter verde.
- [ ] Criar baselines reais de regressão visual com ambiente reproduzível e impedir que o workflow passe sem comparar nenhuma imagem.

### Frente 6 — Analytics e interações confiáveis

- [ ] Corrigir o cliente público do Umami: URL da API Cloud, autenticação e endpoint de métricas por caminho, reutilizando as convenções do cliente de relatórios. Não tratar uma série temporal de pageviews como lista de URLs.
- [ ] Testar formatos Cloud/self-hosted, erros e timeout; limitar/cachear consultas e publicar somente agregados de artigos públicos reconhecidos, sem dados pessoais.
- [ ] Tornar o registro de votos atômico no armazenamento Redis/Upstash, evitando a perda de votos simultâneos. Preservar votos anteriores quando existirem.
- [ ] Substituir o mapa ilimitado de rate limit das enquetes por mecanismo limitado em memória ou persistente; manter validação de enquetes/opções e configuração opcional explícita.

### Frente 7 — Limites de requisição, publicação e auditoria

- [ ] Aplicar limite real de bytes durante a leitura dos corpos de briefing, recomendação, assistente e publicação; não depender apenas de `Content-Length`. Manter formulários sem JavaScript e respostas de erro apropriadas.
- [ ] Validar os bytes, dimensões e formato real das capas enviadas à API de publicação, compartilhando a validação adequada com o editor sem quebrar o commit atômico de conteúdo nos três idiomas.
- [ ] Registrar também tentativas recusadas por corpo inválido ou excessivo, com logs sanitizados, sem texto privado, e-mail, imagens ou segredos.
- [ ] Cobrir os casos de requisições sem tamanho declarado, tamanho falso, conteúdo inválido e rejeição anterior ao acesso a provedores. Documentar quais limites são por processo e quais dependem de armazenamento/provedor externo.

### Frente 8 — Corpus do assistente e catálogo único de URLs públicas

- [ ] Extrair seções do corpus pela árvore Markdown usada para os títulos, sem confundir `##` dentro de blocos de código com seções reais. Conferir as citações, âncoras e testes com código cercado.
- [ ] Conferir a configuração de modelo/SDK do assistente na documentação oficial, mantendo o recurso desativado quando não houver credencial; não executar chamadas pagas apenas para testar disponibilidade.
- [ ] Unificar os critérios de publicação usados por sitemap, busca, llms e IndexNow. Excluir `/perguntar` e equivalentes enquanto o assistente estiver desabilitado, preservando as demais URLs canônicas.
- [ ] Consolidar os scripts de IndexNow e a documentação para evitar caminhos de chave divergentes e submissão de páginas que retornam 404.

### Frente 9 — Protocolos de distribuição com capacidades explícitas

- [ ] Validar o `resource` solicitado ao WebFinger e os destinos HTTPS configurados. Não anunciar seguidores/inbox nativos funcionais quando o servidor não implementa essas capacidades.
- [ ] Adotar a integração com bridge externo para federação completa enquanto não houver implementação nativa completa de recebimento, assinaturas e persistência. Documentar o limite e não apresentar o stub de inbox como federação ativa.
- [ ] Integrar WebSub ao RSS e à publicação somente quando houver hub HTTPS configurado, com comando de simulação, erros/timeouts limitados e workflow coerente com o deploy.
- [ ] Manter explícita a distinção entre Webmentions moderados via GitHub e leitura opcional do webmention.io; nenhuma menção não aprovada será publicada automaticamente.
- [ ] Fazer os comandos de distribuição social iniciarem em modo de simulação, exigindo opção explícita para publicar. Nesta execução não enviar mensagens nem posts a terceiros.

### Frente 10 — Segurança, documentação operacional e entrega

- [ ] Revisar os alertas CodeQL e as dependências identificadas na auditoria, corrigindo problemas confirmados com testes e registrando as justificativas de falsos positivos. Não aplicar downgrades/migrações automáticas sugeridos por `npm audit --force`.
- [ ] Atualizar `README.md`, arquitetura e `.env.example` com todas as variáveis efetivamente usadas: Umami público/relatórios, enquetes/Upstash, assistente, canais, Webmentions, WebSub e federação. Não incluir valores secretos.
- [ ] Documentar o estado de cada integração: funcional, desabilitada por configuração, dependente de conta ou indisponível por dados reais ausentes. Preparar as configurações possíveis e registrar apenas os passos externos que efetivamente restarem.
- [ ] Após os checks verdes, configurar os checks obrigatórios da branch principal e os recursos de alerta de dependências disponíveis, sem comprometer o fluxo de PR e merge.
- [ ] Integrar o trabalho das frentes 1–4 sem regressões, revisar o diff completo, abrir/atualizar o PR, aguardar o CI, integrar a branch e verificar o deploy público. Preservar este documento com os resultados e exceções reais.

### Ordem, dependências e critérios adicionais de aceite

1. Este registro antecede qualquer implementação desta frente. Usar worktree isolada; separar domínios independentes (analytics/interações, limites/publicação/corpus, protocolos) e integrar com revisão.
2. Rotas e inicialização precisam estar corrigidas antes de E2E/Lighthouse/produção. Umami e enquetes podem ser corrigidos independentemente. A publicação de conteúdo e os testes de URLs devem ser reconciliados com as frentes 1–2 antes da validação final.
3. Alterações em interfaces compartilhadas (catálogo público, configuração, limite de corpo) exigem testes dos consumidores. A documentação e os checkboxes finais devem refletir o código integrado, não apenas a conclusão de uma tarefa isolada.
4. A entrega exige lint, tipos, testes unitários, pacotes, build, E2E, comparação visual e Lighthouse aplicáveis, além de confirmação de 404 reais e das URLs do sitemap. Registrar comandos e resultados; não marcar um teste ignorado como executado.
5. Pendências que exigirem conta, consentimento ou dados do proprietário serão registradas e puladas conforme a autorização do usuário. Não bloquear as demais correções por essas dependências; não declarar essas integrações ativadas sem evidência.

### Registro da execução

- 17/10/2026: leitura integral do plano anterior e conciliação concluídas; frentes 5–10 registradas antes de iniciar sua implementação. Auditoria detalhada em `docs/project-state-2026-10-17.md`. Os checkboxes permanecem abertos até verificação.
- 17/10/2026: Frentes 1–4 concluídas e verificadas (`DiscoveryScreen.tsx`, `projects-data.ts`, `content-labels.ts`, `README.md`, `docs/architecture.md`, `.env.example`, `audit:case-studies` 0 pendências de métricas e `check:links` 17/17 links ativos).

---

## 5. Complemento do Claude — conciliação com as Frentes 5–10 e Frente 11 (17/10/2026)

Escrito **antes de qualquer implementação**, após a leitura integral das seções 1–4 e de `docs/project-state-2026-10-17.md`, sobre o `master` em `848b4cd`. As Frentes 5–10 estão sendo executadas em `.superpowers/worktrees/post-merge-reliability` (`fix/post-merge-reliability`). Esta seção **não altera nem assume nenhum item dessas frentes**: registra apenas o que elas não cobrem e os achados que podem ajudar quem as executa.

### Conciliação com o que já está planejado

| Proposta desta auditoria | Decisão |
| --- | --- |
| Corrigir o conflito `(pt)/[slug]` × `[locale]`, recuperar E2E e Lighthouse | Já é a **Frente 5**, em execução. Não será duplicada. |
| Exigir PR e checks verdes no `master` | Já é a **Frente 10**, item 4. |
| Documentar as variáveis lidas pelo código | Já é a **Frente 10**, item 2. Depois de `848b4cd` ainda faltam no `.env.example`: `ACTIVITYPUB_*` (6), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `INTERACTIONS_KEY`, `UMAMI_API_URL` e `NEXT_PUBLIC_QR_SERVICE_URL`. |
| Triagem do CodeQL | Já é a **Frente 10**, item 1. |
| Limpar worktrees e branches integrados | **Frente 4**, concluída. Esta frente usa um worktree próprio e o remove ao final. |
| Recuperar o desempenho no celular após a unificação | **Não coberto** (o desempenho do Lighthouse só avisa e não pôde ser medido com o servidor quebrado). Vira a **Frente 11.1**. |
| Tratar os PRs abertos do Dependabot (#8–#13) | **Não coberto** explicitamente. Vira a **Frente 11.2**, depois da Frente 5. |
| Ordem de ativação dos serviços e do conteúdo do proprietário | Complementa a **Frente 10**, item 3, que fecha a lista final. Vira a **Frente 11.3**. |
| Medir antes de criar novos recursos | **Não coberto.** Coerente com a conclusão de `docs/project-state-2026-10-17.md`. Vira a **Frente 11.4**. |

### Achados para quem executa as Frentes 5–10 (informativos, sem mudar o escopo delas)

- **E2E após a correção de rotas:** com as rotas PT explícitas aplicadas localmente sobre `5af653b`, `next start` respondeu 200 em `/`, `/links`, `/en/links`, `/agora` e `/blog`, e a suíte normal teve **103 aprovados, 3 ignorados (assistente sem chave) e 1 falha**. A falha é de seletor, não de produto: em `e2e/blog-reading.spec.ts:101`, `getByRole("button", { name: "Parar" })` também casa com o botão "Preparar rascunho" da proposta de correção. Usar `exact: true`.
- **GitHub:** Discussions desligadas (o giscus não funciona sem elas); nenhuma variável/secret de Actions (por isso `indexnow.yml` legado é pulado e o relatório mensal não roda); alertas e atualizações de segurança do Dependabot desligados.
- **Links removidos em `848b4cd`:** confirmados fora do ar em 17/10 às 20:00 UTC (VMageste com certificado inválido, PulseWatch 503, os demais 404 ou sem DNS). VMageste e PulseWatch são estudos de caso em destaque: ver a Frente 11.3.
- **Métricas e anos de `848b4cd`:** os rótulos novos descrevem escopo técnico, não resultado comercial, como pede a seção 4. Ainda assim, "20 bounded contexts" aparece igual em dois projetos, e os anos não têm fonte registrada: ver a Frente 11.3.

### Frente 11 — Desempenho móvel, dependências e operação depois desta leva

#### 11.1 Recuperar o desempenho no celular

Lighthouse mobile (4G lento simulado), mediana de 3 execuções, build local de produção. Antes: `feat/conversion-and-reach` (`3719a5a`). Depois da unificação: `5af653b` com a correção de rotas aplicada só localmente.

| Página | Antes da unificação | Depois da unificação |
| --- | --- | --- |
| `/` | 88 · TBT 351 ms · JS 206 KB | **83** · TBT 419 ms · JS 217 KB |
| `/blog` | 94 · TBT 121 ms · JS 225 KB | 93 · TBT 226 ms · JS 286 KB |
| Artigo | 96 · LCP 2,6 s · JS 225 KB | **91** · LCP 3,2 s · JS 286 KB |
| `/projetos/envrune` | 95 | 95 |
| `/trabalhe-comigo` | 97 | 94 |

Causa principal no blog: seis componentes interativos passaram a carregar em todo artigo, usados ou não (abas de código, enquete, gerador de citação, proposta de correção, modo leitura e webmentions), no mesmo pacote compartilhado.

- [ ] Carregar esses componentes sob demanda: só quando o artigo os usa, ou quando chegam perto da tela. O conteúdo e o funcionamento sem JavaScript ficam iguais.
- [ ] Investigar e recuperar a regressão da home (TBT 351 → 419 ms).
- [ ] Meta: home ≥ 88, `/blog` ≥ 94, artigo ≥ 95, sem perder pontos de acessibilidade, boas práticas ou SEO. Registrar antes e depois com o mesmo método.
- Limite de escopo: só a composição e a forma de carregar (`BlogArticle` e afins). A lógica interna das enquetes e das webmentions pertence às Frentes 6 e 9 e não será alterada aqui.

#### 11.2 PRs do Dependabot (depois que a Frente 5 deixar o CI verde)

- [ ] #8 (actions) e #9 (grupo minor/patch): integrar se o CI passar.
- [ ] Versões principais, avaliadas uma a uma, sem integração automática:
  - #12 `eslint-config-next` 16 acompanha o Next 16: adiar para uma migração planejada do Next;
  - #13 ESLint 10 depende da configuração do Next: adiar junto;
  - #10 TypeScript 7: avaliar separadamente;
  - #11 `@types/node` 26: manter os tipos alinhados ao Node do runtime e do CI (22), ignorando as versões principais acima dele em `.github/dependabot.yml`.
- Se a Frente 10 tratar essas atualizações, esta frente apenas confere o resultado.

#### 11.3 Ordem sugerida de ativação e pendências do proprietário

Nada abaixo será feito por agentes: exige conta, consentimento ou dados reais (seção 4). A Frente 10 fecha a lista final.

1. **Umami** (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`): sem ele não há nenhuma medição, e as UTMs não registram nada.
2. **Search Console e Bing**: verificação e envio do sitemap.
3. **IndexNow**: `INDEXNOW_KEY` na hospedagem e como variável do GitHub, ou confirmar que o caminho com chave versionada basta e aposentar o legado (ligado à Frente 8).
4. **Resend** (domínio verificado, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`): liga o briefing e as recomendações.
5. **Buttondown** (`BUTTONDOWN_API_KEY`): liga a newsletter.
6. **GitHub**: ativar alertas e atualizações de segurança do Dependabot; `UMAMI_API_KEY` (secret) e `UMAMI_WEBSITE_ID` (variável) para o relatório mensal.
7. Opcionais: limite de gasto e chave da Anthropic; DSN do Sentry; Discussions e giscus; Upstash para as enquetes.
8. **Conteúdo**:
   - pedir 3–5 recomendações por `/recomendar`;
   - responder as 4 perguntas de triagem que quiser tornar públicas;
   - escrever as notas do `/agora`;
   - confirmar os anos e as métricas de `848b4cd`;
   - dizer se VMageste e PulseWatch voltam ao ar (restaurar os links) ou não.

#### 11.4 Depois desta leva

- Não criar recursos novos por 4–6 semanas com a medição ligada. Decidir a próxima leva pelo relatório mensal e pelos funis.
- Revisar a superfície: integração que continuar desligada depois desse período deve ser ativada com configuração legítima ou removida. Código desligado é manutenção sem retorno.
- Fluxo entre agentes: cada frente em worktree próprio, com PR, CI verde e registro neste arquivo. Nada direto no `master`.

### Ordem e aceite da Frente 11

1. Execução em worktree próprio (`.superpowers/worktrees/claude-frente-11`), a partir deste commit. A correção de rotas da Frente 5 é usada **só localmente**, para medir, e nunca vai em commit desta frente. Quando a Frente 5 for integrada, a branch é atualizada sobre ela.
2. Nenhum arquivo do escopo das Frentes 5–10 é alterado. Se isso se tornar necessário, registrar aqui antes.
3. Aceite: lint, tipos, testes unitários, build, E2E completos e Lighthouse mobile com antes e depois registrados neste arquivo; PR aberto; nenhum teste ignorado contado como executado.

### Registro da execução (Frente 11)

- 17/10/2026: leitura integral das seções 1–4 e de `docs/project-state-2026-10-17.md`; conciliação feita; Frente 11 registrada antes de implementar. Checkboxes abertos até verificação.

---

## 6. Execução das Frentes 5–10 — Codex

### Conciliação durante o desenvolvimento

- A seção 5/Frente 11 foi lida integralmente e incorporada sem remoções pelo merge de `14464ba`. O trabalho de desempenho/PRs de dependências permanece no worktree dessa frente; não duplicar essas mudanças.
- As Frentes 1–4 de `848b4cd` foram integradas, preservando o Discovery Hub, QR local, currículos e remoções de links indisponíveis. A lista anterior de rotas em README/arquitetura continha páginas inexistentes; foi corrigida pelos arquivos reais (`blogroll`, `radar`, `leitura`, `principios`, `ia`, `habilidades`, `status`, `analytics` e `participar`).
- O artigo do EnvRune ainda faltava após aquela entrega. Foram criadas versões PT/EN/ES, apoiadas no commit público `c2aa0d1`, e definido `articleKey`; a regressão agora exige artigo traduzido para todos os dez cases.
- Os cinco anos acrescentados sem fonte documentada em `848b4cd` foram retirados: VMageste, DevAgent, PulseWatch, Eurologado e Praxis. Confirmar essas datas é uma pendência editorial, não um bloqueio técnico. O histórico da decisão foi preservado, e o checkbox anterior foi reaberto.
- Os badges técnicos e a apresentação passaram a dizer **escopo e resultados**, sem apresentar toda característica como número comercial. Depoimentos, episódios e métricas comerciais continuam exigindo conteúdo real e consentido. Não foram inventados resultados nem pessoas.
- `NEXT_PUBLIC_QR_SERVICE_URL` deixou de ser necessário com QR local. O modo ActivityPub nativo e suas variáveis antigas não são anunciados como federação completa: o caminho implementado é bridge HTTPS validado. IndexNow foi consolidado na chave pública versionada, sem `INDEXNOW_KEY` de ambiente.

### Implementação e evidência local

- Conflito de rotas reproduzido com o sorter real do Next (falha `[slug]` × `[locale]`), corrigido com doze aliases PT explícitos. Novos E2E cobrem as 36 páginas, metadados e caminhos ausentes.
- Analytics: Cloud `/v1`, métricas por caminho, timeout, cache/singleflight e somente agregados de artigos reconhecidos. Enquetes: Lua atômico no JSON existente, validação e rate limit limitado em memória. **12/12 testes focados**; Redis real verificou 30 votos simultâneos preservando nove existentes e outra enquete, além de recusar corrupção e arredondamento destrutivo.
- Corpos de formulários/assistente/publicação limitados por bytes do stream; auditoria sanitizada de recusas; capas da API validadas pelo sharp compartilhado; corpus extraído da AST com IDs corretos. **36/36 testes focados**. Modelo e beta existentes foram conferidos na documentação oficial, sem chamada paga.
- Gate público comum para sitemap/busca/llms/IndexNow; submissão cruza sitemap implantado; WebFinger valida conta e bridge; WebSub anuncia hub apenas configurado; leitura webmention.io exige aprovação; distribuição social simula por padrão. **40/40 testes focados**, sem enviar posts ou notificações externas nesses testes.
- Relatório mensal escapa Markdown/HTML e scripts locais abrem arquivos sem a antiga checagem separada de existência. Revisão dos 14 achados CodeQL em `docs/security-review-2026-10-17.md`; audit de produção: zero altas/críticas, cinco baixas e quatro moderadas, sem downgrades forçados.
- Validação integrada inicial após as mudanças: **275/275 testes unitários**, lint e **12/12 testes dos pacotes** passaram. Build, tipos, E2E, baselines visuais, Lighthouse, PR/CI e deploy ainda em validação; não são considerados concluídos por este registro parcial.

Configuração, limites por instância e passos externos estão em `docs/integrations.md`. A seção será completada com os resultados finais da entrega.
