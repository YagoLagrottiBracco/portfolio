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

- [x] Eliminar o conflito entre o primeiro segmento dinâmico `[slug]` das páginas PT e `[locale]`, preservando as URLs públicas, idiomas, canonical e hreflang. Preferir rotas PT explícitas que reutilizem o componente comum.
- [x] Testar a inicialização real com `next start`, as páginas publicadas e caminhos inexistentes/idiomas inválidos. Um recurso ausente precisa responder 404, sem erro 500.
- [x] Executar os testes E2E completos e o Lighthouse mobile após a correção; conservar os limites de qualidade, corrigindo falhas reais em vez de relaxar os checks para obter verde.
- [x] Criar baselines reais de regressão visual com ambiente reproduzível e impedir que o workflow passe sem comparar nenhuma imagem.

### Frente 6 — Analytics e interações confiáveis

- [x] Corrigir o cliente público do Umami: URL da API Cloud, autenticação e endpoint de métricas por caminho, reutilizando as convenções do cliente de relatórios. Não tratar uma série temporal de pageviews como lista de URLs.
- [x] Testar formatos Cloud/self-hosted, erros e timeout; limitar/cachear consultas e publicar somente agregados de artigos públicos reconhecidos, sem dados pessoais.
- [x] Tornar o registro de votos atômico no armazenamento Redis/Upstash, evitando a perda de votos simultâneos. Preservar votos anteriores quando existirem.
- [x] Substituir o mapa ilimitado de rate limit das enquetes por mecanismo limitado em memória ou persistente; manter validação de enquetes/opções e configuração opcional explícita.

### Frente 7 — Limites de requisição, publicação e auditoria

- [x] Aplicar limite real de bytes durante a leitura dos corpos de briefing, recomendação, assistente e publicação; não depender apenas de `Content-Length`. Manter formulários sem JavaScript e respostas de erro apropriadas.
- [x] Validar os bytes, dimensões e formato real das capas enviadas à API de publicação, compartilhando a validação adequada com o editor sem quebrar o commit atômico de conteúdo nos três idiomas.
- [x] Registrar também tentativas recusadas por corpo inválido ou excessivo, com logs sanitizados, sem texto privado, e-mail, imagens ou segredos.
- [x] Cobrir os casos de requisições sem tamanho declarado, tamanho falso, conteúdo inválido e rejeição anterior ao acesso a provedores. Documentar quais limites são por processo e quais dependem de armazenamento/provedor externo.

### Frente 8 — Corpus do assistente e catálogo único de URLs públicas

- [x] Extrair seções do corpus pela árvore Markdown usada para os títulos, sem confundir `##` dentro de blocos de código com seções reais. Conferir as citações, âncoras e testes com código cercado.
- [x] Conferir a configuração de modelo/SDK do assistente na documentação oficial, mantendo o recurso desativado quando não houver credencial; não executar chamadas pagas apenas para testar disponibilidade.
- [x] Unificar os critérios de publicação usados por sitemap, busca, llms e IndexNow. Excluir `/perguntar` e equivalentes enquanto o assistente estiver desabilitado, preservando as demais URLs canônicas.
- [x] Consolidar os scripts de IndexNow e a documentação para evitar caminhos de chave divergentes e submissão de páginas que retornam 404.

### Frente 9 — Protocolos de distribuição com capacidades explícitas

- [x] Validar o `resource` solicitado ao WebFinger e os destinos HTTPS configurados. Não anunciar seguidores/inbox nativos funcionais quando o servidor não implementa essas capacidades.
- [x] Adotar a integração com bridge externo para federação completa enquanto não houver implementação nativa completa de recebimento, assinaturas e persistência. Documentar o limite e não apresentar o stub de inbox como federação ativa.
- [x] Integrar WebSub ao RSS e à publicação somente quando houver hub HTTPS configurado, com comando de simulação, erros/timeouts limitados e workflow coerente com o deploy.
- [x] Manter explícita a distinção entre Webmentions moderados via GitHub e leitura opcional do webmention.io; nenhuma menção não aprovada será publicada automaticamente.
- [x] Fazer os comandos de distribuição social iniciarem em modo de simulação, exigindo opção explícita para publicar. Nesta execução não enviar mensagens nem posts a terceiros.

### Frente 10 — Segurança, documentação operacional e entrega

- [x] Revisar os alertas CodeQL e as dependências identificadas na auditoria, corrigindo problemas confirmados com testes e registrando as justificativas de falsos positivos. Não aplicar downgrades/migrações automáticas sugeridos por `npm audit --force`.
- [x] Atualizar `README.md`, arquitetura e `.env.example` com todas as variáveis efetivamente usadas: Umami público/relatórios, enquetes/Upstash, assistente, canais, Webmentions, WebSub e federação. Não incluir valores secretos.
- [x] Documentar o estado de cada integração: funcional, desabilitada por configuração, dependente de conta ou indisponível por dados reais ausentes. Preparar as configurações possíveis e registrar apenas os passos externos que efetivamente restarem.
- [x] Após os checks verdes, configurar os checks obrigatórios da branch principal e os recursos de alerta de dependências disponíveis, sem comprometer o fluxo de PR e merge.
- [x] Integrar o trabalho das frentes 1–4 sem regressões, revisar o diff completo, abrir/atualizar o PR, aguardar o CI, integrar a branch e verificar o deploy público. Preservar este documento com os resultados e exceções reais.


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

**Situação em `cb32854` (depois das Frentes 5–10 e 12):** o seletor do E2E foi corrigido (106 aprovados, 3 ignorados); a proteção do `master`, os alertas do Dependabot e o IndexNow por chave versionada estão ativos; os cinco anos sem fonte foram retirados e o "20 contexts" ficou só onde a descrição o sustenta (seção 6). Continuam com o proprietário: Discussions, variáveis/secrets de Actions e os itens da Frente 11.3.

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

~~Causa principal no blog: seis componentes interativos passaram a carregar em todo artigo.~~ **Diagnóstico corrigido durante a execução:** os seis componentes somam só ~6 KB. O peso vinha de imports que levavam dados ao navegador sem necessidade:

- **Artigo e páginas de recursos:** o gerador de citação importava `CopyField` de `ResourceActions`, que puxava `resource-tools` (o `personalData` inteiro, para ler um e-mail) e `resource-community` (`getCaseStudyBySlug`, para conferir um slug). Resultado: todos os projetos e estudos de caso em todo artigo.
- **Todas as páginas:** `locale-routes` (seletor de idioma) e o rodapé chegavam a `src/data/discovery.ts` por `discovery-routes`, levando os 17 KB de textos das 12 páginas de descoberta a todo carregamento.

As tabelas de nota acima foram medidas em horários diferentes, com outro agente usando a CPU. A nota e o TBT da home e de `/trabalhe-comigo` **não tinham regressão de código**: o JavaScript delas era o mesmo de antes da unificação, salvo os 10 KB da descoberta.

- [x] ~~Carregar os componentes do artigo sob demanda.~~ **Não necessário:** o peso estava nos imports, corrigidos na origem (abaixo). Carregar sob demanda economizaria ~6 KB e faria o conteúdo deles sumir para quem navega sem JavaScript.
- [x] Corrigir os imports na origem: `resource-tools` lê de `@/data/profile`; `resource-community` confere slugs em `@/data/featured-order` (agora módulo próprio, igual aos estudos de caso por teste); `CopyField` virou módulo próprio; `BlogArticle` lê o nome de `profile`; os slugs da descoberta foram para `@/data/discovery-slugs`.
- [x] Impedir a volta do problema: `tests/client-bundle-boundaries.test.ts` falha quando um componente de cliente alcança os dados do portfólio (exceção documentada: o editor de diagramas dos estudos de caso) ou quando a estrutura comum alcança textos de páginas específicas. Conferido: o teste falha com o `resource-tools` antigo.
- [x] Investigar a regressão da home: **não confirmada** (veja os resultados).
- [ ] Metas de nota (home ≥ 88, `/blog` ≥ 94, artigo ≥ 95): com a máquina mais calma (carga ~2), a série final sobre `cb32854` deu **home 89 e `/blog` 96 (atingidas) e artigo 94 (meta 95, não atingida; LCP 2,93 → 2,63 s)**. Confirmar no Lighthouse obrigatório do CI do PR.
- Limite de escopo respeitado: nada da lógica de enquetes, webmentions ou rotas foi alterado.

#### 11.2 PRs do Dependabot (depois que a Frente 5 deixar o CI verde)

- [x] Regra em `.github/dependabot.yml`: `@types/node` fica na versão principal do runtime (`>=23` ignorado; o CI usa Node 22). Confirmar na Vercel (**Settings → Build and Deployment → Node.js Version**) que o site também roda 22.
- [ ] #8 (actions) e #9 (grupo minor/patch): integrar se o CI passar. Os checks atuais deles rodaram sobre o `master` anterior à Frente 5 (rota quebrada, sem baselines); precisam ser refeitos sobre o `master` atual antes de qualquer decisão.
- [ ] Versões principais, avaliadas uma a uma, sem integração automática:
  - #12 `eslint-config-next` 16 acompanha o Next 16: adiar para uma migração planejada do Next;
  - #13 ESLint 10 depende da configuração do Next: adiar junto;
  - #10 TypeScript 7: avaliar separadamente (o build da Vercel falhou nesse PR);
  - #11 `@types/node` 26: manter os tipos alinhados ao Node do runtime e do CI (22), ignorando as versões principais acima dele em `.github/dependabot.yml`.
- A Frente 10 ativou os alertas e as atualizações de segurança, mas não tratou esses PRs (seção 6); ficam nesta frente.

#### 11.3 Ordem sugerida de ativação e pendências do proprietário

Nada abaixo será feito por agentes: exige conta, consentimento ou dados reais (seção 4). O passo a passo de cada item está em `docs/integrations.md` (Frente 10); aqui fica só a ordem de impacto.

1. **Umami** (`NEXT_PUBLIC_UMAMI_WEBSITE_ID`): sem ele não há nenhuma medição, e as UTMs não registram nada.
2. **Search Console e Bing**: verificação e envio do sitemap.
3. ~~**IndexNow**~~: resolvido pela Frente 8 com a chave versionada; não exige credencial.
4. **Resend** (domínio verificado, `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`): liga o briefing e as recomendações.
5. **Buttondown** (`BUTTONDOWN_API_KEY`): liga a newsletter.
6. **GitHub**: `UMAMI_API_KEY` (secret) e `UMAMI_WEBSITE_ID` (variável) para o relatório mensal. (Alertas e atualizações de segurança do Dependabot: ativados pela Frente 10.)
7. Opcionais: limite de gasto e chave da Anthropic; DSN do Sentry; Discussions e giscus; Upstash para as enquetes.
8. **Conteúdo**:
   - pedir 3–5 recomendações por `/recomendar`;
   - responder as 4 perguntas de triagem que quiser tornar públicas;
   - escrever as notas do `/agora`;
   - confirmar os anos de VMageste, DevAgent, PulseWatch, Eurologado e Praxis, retirados por falta de fonte (seção 6);
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
- 17/10/2026: 11.1 executada em `perf/frente-11-mobile` (worktree `.superpowers/worktrees/claude-frente-11`); regra do Dependabot da 11.2 feita. Resultados abaixo. A correção de rotas da Frente 5 foi aplicada só localmente, para o servidor subir, e não está em nenhum commit.

#### Resultados verificados da Frente 11.1

JavaScript carregado na primeira visita, comprimido (`gzip -9`), build local de produção. É determinístico, sem influência da carga da máquina:

| Página | Antes da unificação (`3719a5a`) | `master` (`14464ba`) | Frente 11 |
| --- | --- | --- | --- |
| `/` | 210 KB | 221 KB | **211 KB** |
| `/blog` | 210 KB | 222 KB | **212 KB** |
| Artigo | 215 KB | 268 KB | **221 KB** |
| `/projetos/envrune` | 212 KB | 223 KB | **213 KB** |
| `/trabalhe-comigo` | 205 KB | 215 KB | **205 KB** |
| `/recursos` | — | 309 KB | **299 KB** |
| `/cartao` | — | 213 KB | **203 KB** |

Lighthouse mobile intercalado: `master` e Frente 11 servidos ao mesmo tempo, mesma página e rodada em sequência, mediana de 3, carga média ~4–5. Duas séries:

| Página | Série 1 (`master` → Frente 11) | Série 2 (`master` → Frente 11) |
| --- | --- | --- |
| Artigo | 92 → 93 | **87 → 94** (LCP 3,0 → 2,6 s; TBT 332 → 243 ms) |
| `/blog` | **85 → 93** (pré-carrega os pacotes dos artigos: 286 → 243 KB transferidos) | 94 → 92 |
| `/` | 83 → 82 | 85 → 85 |
| `/projetos/envrune` | 95 → 95 | 92 → 92 |
| `/trabalhe-comigo` | 96 → 94 | 93 → 95 |

Leitura: a melhora no artigo e no índice do blog é consistente. Nas outras páginas as diferenças cabem no ruído de ±2. A home está em 83–85 nas duas versões; o HTML dela cresceu 4% (375 → 389 KB, as métricas novas dos cards), sem efeito mensurável aqui.

Verificações em `0c77ea8` (o commit seguinte só muda `.github/dependabot.yml`), com a correção de rotas local: `npm run lint` e `npm run typecheck` verdes; `npm test` **240/240** (inclui os testes novos); build verde; E2E completo **103 aprovados, 3 ignorados (assistente sem chave), 1 falha já existente no `master`**: o seletor "Parar" de `e2e/blog-reading.spec.ts:101` (Frente 5; detalhe na seção de achados).

#### Base final: branch atualizada sobre `cb32854` (Frentes 5–10 e 12 integradas)

O rebase não teve conflito de código (só a posição deste registro). A correção de rotas local foi descartada, porque o `master` já tem a definitiva. Comparação contra o `master` atual:

| Página | JS na primeira visita, `master` → Frente 11 (`gzip -9`) | Lighthouse mobile intercalado, carga ~2 |
| --- | --- | --- |
| `/` | 216 → **211 KB** | 87 → **89** |
| `/blog` | 217 → **212 KB** | 93 → **96** |
| Artigo | 269 → **221 KB** | 94 → 94 (LCP 2,93 → 2,63 s; 282 → 231 KB transferidos) |
| `/projetos/envrune` | 218 → **213 KB** | 95 → 95 |
| `/trabalhe-comigo` | 211 → **205 KB** | 95 → 95 |
| `/recursos` | 305 → **299 KB** | — |
| `/cartao` | 209 → **203 KB** | — |

Verificações na branch final, sem nenhuma alteração local: `npm run lint` e `npm run typecheck` verdes; `npm test` **282/282**; `npm run test:resource-packages` **12/12**; `check:blog-covers` sem pendências; build verde; E2E completo **106 aprovados e 3 ignorados** (assistente sem chave), **sem falhas**. O teste de fronteira também foi conferido sobre a base nova (nenhum vazamento introduzido pelas Frentes 5–10 e 12).

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

### Checkpoint de validação e revisão

- Segunda validação integrada após as correções da revisão: **277/277 unitários**, lint, build de produção e tipos aprovados. Os pacotes mantêm **12/12**. Revisão independente apontou dois problemas reproduzidos e corrigidos: envelope Redis legado e imagem com cabeçalho válido/pixels inválidos. Redis real confirmou 13 casos, incluindo migração e 30 votos simultâneos nos dois formatos, sem apagar dados.
- E2E local e job E2E do PR: **106 aprovados e 3 ignorados** por ausência de credencial Anthropic. Os ignorados não foram contados como execução. Os 582 endereços do sitemap responderam 200, com canonical/idioma/H1 corretos; seis caminhos inexistentes responderam 404.
- **32 baselines reais** foram gerados no container Playwright fixado pelo workflow `39077705872` e revisados visualmente; comparação do PR ainda em execução neste checkpoint.
- O primeiro job `checks` do PR recusou corretamente os três artigos novos sem capa. Foi reutilizada, sem alterar a arte, a imagem existente do EnvRune em `/blog/envrune-vault.png`, com alt traduzido e dimensões reais. QA de capa: três artigos/uma imagem aprovados; dez testes de conteúdo/layout aprovados após essa inclusão.
- PR de integração: https://github.com/YagoLagrottiBracco/portfolio/pull/14 . CI final, comparação visual, Lighthouse, proteção da branch e confirmação de produção serão registrados após seus resultados reais.

### Entrega e confirmação em produção

- **PR #14 integrado** em `cfd659e39a058fd1b35773d144bb3495c636687c` em 17/10/2026. O histórico do plano concorrente foi preservado com merge, e a raiz foi atualizada por fast-forward.
- CI do PR `39078211355`: `checks`, `e2e` e Lighthouse aprovados. Lighthouse executou **15 medições em cinco URLs**, conservando os limites originais; comparação visual `39078211281` aprovada com **32 capturas**. CodeQL e deploy de prévia aprovados.
- Deploy **Production `7147218900`** concluído. Auditoria pública às 23:25 UTC: **582/582 URLs com HTTP 200**, canonical/idioma/H1 corretos, sem erros de metadados; seis caminhos inválidos com HTTP 404. Os sete probes de uptime passaram, incluindo PDF, RSS, artigo novo e recusa de e-mail inválido da newsletter. Essa recusa não enviou mensagem real.
- IndexNow após o deploy, workflow **`39078879126`**: **HTTP 200, 582 URLs recebidas**. Recebimento não garante indexação/ranking. WebSub continua sem hub, portanto nenhum ping foi enviado a um hub não configurado.
- Proteção do `master` ativada: PR atualizado e quatro checks obrigatórios (`checks`, `e2e`, `lighthouse`, `screenshots`), vinculados à GitHub Actions e exigidos também de administradores. Dependabot alerts e atualizações automáticas de segurança ativados e confirmados.
- CodeQL após merge: **seis achados corrigidos, oito falsos positivos revisados e encerrados individualmente, zero abertos**. As nove dependências baixas/moderadas continuam documentadas, sem downgrade forçado.
- Ajustes finais do registro: o número de 20 contextos foi mantido apenas no ImpressãoMais3D, cuja descrição o sustenta, e retirado do Digital Tech MS por ausência de contagem própria documentada. O comentário dos canais no exemplo de ambiente foi corrigido para `/links`.
- O primeiro envio de relatórios do Lighthouse não anexou arquivos porque `.lighthouseci` é uma pasta oculta. O workflow de encerramento passa a usar `include-hidden-files: true` **somente nessa pasta de relatórios**, sem coletar `.env` ou outras pastas. A confirmação do artefato fica nos checks do PR desse ajuste.
- Branch/worktree antigos já integrados foram limpos; a referência histórica do recurso 1.0.0 foi preservada localmente em `refs/archive/merged-resource-ecosystem`. A Frente 11 permanece separada, com sua branch/worktree e critérios próprios.

**Pendências externas preservadas:** credenciais legítimas e configuração de contas dos serviços opcionais, verificação Search Console/Bing, bridge/hub externos, retenção de logs/firewall/orçamento no provedor e dados reais do proprietário (cinco anos, depoimentos consentidos, métricas comerciais, episódios e referências da comunidade). A matriz completa está em `docs/integrations.md`. Nenhum segredo foi reutilizado, nenhum resultado inventado e nenhum post social ou contato real enviado nesta entrega.

---

## 7. Complemento do Antigravity — Frente 12: OpenGraph do Discovery Hub, Busca Global dos 21 Projetos e Consistência Editorial (17/10/2026)

Registrado antes da implementação e atualizado após verificação, sobre `eaf4ad6` (`master`), em worktree isolada (`.superpowers/worktrees/antigravity-frente-12`, branch `feat/frente-12-discovery-search-og`). Nenhum arquivo sob atuação concorrente da Frente 11 (`BlogArticle.tsx`, `CitationGenerator.tsx`, `DiscoveryTools.tsx`, `ResourceActions.tsx`, `CopyField.tsx`, `personal.ts`, `featured-order.ts`, `resource-community.ts`, `resource-tools.ts`, `case-study-content.test.ts`) foi alterado nesta frente.

### Escopo da Frente 12 (lacunas remanescentes de `docs/project-state-2026-10-17.md`)

- [x] **12.1 Cartões OpenGraph e Twitter dedicados para as 36 páginas do Discovery Hub (`/og/descoberta/[locale]/[slug]`)**:
  - Atende à lacuna da seção 6 de `docs/project-state-2026-10-17.md` (*"descoberta não define imagem OG específica própria"*).
  - Criado `src/app/og/descoberta/[locale]/[slug]/route.ts` gerando estaticamente os 36 cartões (`1200×630`) via `renderOgCard`, e atualizado `src/lib/discovery-metadata.ts` para declarar `openGraph.images` e `twitter` (`summary_large_image`) localizados por página e idioma.
- [x] **12.2 Indexação dos 11 projetos adicionais na busca global (`Ctrl+K` / `/search-index/[locale]`)**:
  - Atende à lacuna da seção 4 de `docs/project-state-2026-10-17.md` (*"O índice global agrega cases, tecnologias publicadas, páginas, artigos e recursos. Não inclui ... os 11 projetos sem case"*).
  - Atualizado `src/lib/site-search-index.ts` para indexar também os 11 projetos da grade complementar (`!project.featured || !project.caseStudy`), apontando para a seção `#projects` da home localizada (`getHomePath(locale)#projects`), sem duplicar os 10 estudos de caso.
- [x] **12.3 Centralização dinâmica do status de disponibilidade em `/trabalhe-comigo` (`src/data/work-with-me.ts`)**:
  - Atende à lacuna da seção 3 de `docs/project-state-2026-10-17.md` (*"Disponibilidade não está centralizada em todas as cópias: além do dado de perfil, há textos estáticos que dizem 'disponível imediatamente'"*).
  - Derivado o trecho de disponibilidade em `workWithMe.intro` (`buildWorkWithMeIntro`) a partir de `profile.availability.status` (`availabilityLabel`), mantendo sincronia automática com `src/data/profile.ts`.
- [x] **12.4 Transparência sobre síntese de voz no navegador (`src/components/blog/ListenToArticle.tsx`)**:
  - Atende à observação da seção 4 de `docs/project-state-2026-10-17.md` (*"A seleção prefere uma voz `localService`, mas pode usar uma voz remota fornecida pelo navegador; o comentário de implementação que afirma que nada deixa o dispositivo é mais forte que a garantia do código"*).
  - Ajustada a documentação e a dica (`title`) do controle de leitura em voz alta para refletir com exatidão o uso da Web Speech API do navegador com preferência por vozes `localService`.
- [x] **12.5 Testes automatizados e validação completa**:
  - Expandidos `tests/discovery.test.ts`, `tests/site-search.test.ts` e `tests/pages.test.ts` cobrindo os 36 metadados/cartões OG de descoberta, a presença dos 21 projetos no índice de busca por idioma e a sincronia de disponibilidade em `workWithMe`.
  - Validados `typecheck`, `lint`, `app-route-tree.test.ts`, **278/278 testes unitários**, **12/12 testes de pacotes** e `npm run build` (com os 36 endpoints `/og/descoberta/[locale]/[slug]` pré-renderizados).

---

## 8. Complemento do Antigravity — Frente 13: SEO & Posicionamento Google para "Programador", "Desenvolvedor" e "Engenheiro de Software" (17/10/2026)

Registrado antes da implementação, atendendo à solicitação direta do usuário de focar 100% nas palavras-chave e estrutura de SEO para posicionar `lagrotti.dev` na primeira página do Google para buscas comerciais e de contratação como **"programador"**, **"programador full stack"**, **"programador freelancer"**, **"desenvolvedor de software"**, **"desenvolvedor full stack"**, **"contratar programador"** e **"programador [tecnologia]"** em PT, EN e ES, preservando 100% de compatibilidade com os testes E2E (`e2e/site.spec.ts`, `e2e/pages.spec.ts`, `e2e/discovery.spec.ts`) e com as 32 baselines visuais (`e2e/visual.spec.ts`).

### Diagnóstico de SEO encontrado na auditoria

1. **Ausência lexical total de "programador" e "desenvolvedor" nas superfícies principais**:
   - `grep -rn -i "programador" src/` retornava **0 ocorrências** em todo o código-fonte.
   - `home-metadata.ts`, `root-metadata.ts`, `RootDocument.tsx`, `work-with-me.ts`, `StackScreens.tsx`, `discovery.ts` e `pt.json` usavam exclusivamente o termo corporativo *"Engenheiro de Software Sênior"*, deixando de indexar os termos de maior volume de busca no Brasil e América Latina (*programador*, *programador full stack*, *programador sênior*, *programador web*, *programador freelancer*, *desenvolvedor de software*, *desenvolvedor full stack*, *contratar programador*).
2. **JSON-LD `Person` estático apenas em inglês (`src/components/RootDocument.tsx`)**:
   - O schema `Person` global declarava `jobTitle: "Senior Software Engineer"` e `description` em inglês mesmo nas páginas `pt-BR` e `es`, sem `hasOccupation` estruturado nem variações semânticas de cargo por idioma.
3. **Metadados de páginas de tecnologia (`/stack/[slug]`) e páginas comerciais (`/trabalhe-comigo`, `/curriculo`, `/habilidades`, `/cartao`, `/links`) subotimizados**:
   - As páginas `/stack/[slug]` tinham títulos genéricos (`"${name} — projetos e experiência"`) sem capturar buscas diretas por tecnologia (*"Programador Node.js"*, *"Desenvolvedor React"*, *"Programador TypeScript"*, *"Programador Python"*, *"Programador PHP / Laravel"*).

### Escopo da Frente 13

- [x] **13.1 Títulos, descriptions, keywords e diretivas `googleBot` na Home e Root Metadata (`src/lib/home-metadata.ts`, `src/lib/root-metadata.ts`)**:
  - Atualizado `homeCopy` em PT, EN e ES para incluir **Programador**, **Desenvolvedor Full Stack** e **Engenheiro de Software Sênior** logo no `<title>` e `<meta name="description">` (preservando os trechos verificados por `e2e/site.spec.ts`).
  - Criado `homeKeywords` localizado por idioma (`pt`, `en`, `es`) cobrindo variações de alta intenção comercial e técnica, e configurado `googleBot` com `max-snippet: -1`, `max-image-preview: "large"` e `max-video-preview: -1`.
- [x] **13.2 Dados estruturados Schema.org (`Person`, `Occupation`, `ProfilePage`, `ProfessionalService`) localizados por idioma (`src/components/RootDocument.tsx`, `src/components/organisms/HomeScreen.tsx`, `src/components/organisms/WorkWithMeScreen.tsx`)**:
  - Transformado `personJsonLd` em `buildPersonJsonLd(lang: Locale)` com múltiplos `jobTitle` localizados (`Engenheiro de Software Sênior`, `Programador Full Stack`, `Desenvolvedor de Software Sênior`, `Arquiteto de Software`), `hasOccupation` (`Occupation`), `description` localizada e `knowsAbout` expandido.
  - Enriquecido o JSON-LD de `HomeScreen.tsx` (`ProfilePage`) e de `WorkWithMeScreen.tsx` (`WebPage` + `ProfessionalService` com catálogo de ofertas para desenvolvimento sob medida e atuação sênior remota).
- [x] **13.3 Landing pages comerciais, de tecnologias e de descoberta (`src/data/work-with-me.ts`, `src/components/organisms/StackScreens.tsx`, `src/lib/stack-metadata.ts`, `src/data/discovery.ts`, `src/lib/discovery-metadata.ts`, `src/app/sitemap.ts`)**:
  - Otimizados `workWithMe.metaTitle` e `workWithMe.description` (usados em `<head>` e JSON-LD de `/trabalhe-comigo`, sem alterar o layout visual do topo da página).
  - Otimizados `stackCopy` (`metaTitle`, `metaDescription`, `indexMeta`) e `buildStackMetadata` com `keywords` específicas por tecnologia (`Programador ${name}`, `Desenvolvedor ${name}`).
  - Otimizados `discoveryPages` (`curriculo`, `habilidades`, `cartao`, `links`) e `buildDiscoveryMetadata`, além de adicionar `x-default` e prioridades de SEO refinadas em `src/app/sitemap.ts`.
- [x] **13.4 Copy semântico visível na seção `#about`, currículo e índice de busca (`src/messages/pt.json`, `src/messages/en.json`, `src/messages/es.json`, `src/lib/site-search-index.ts`)**:
  - Integrado naturalmente *"Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior"* em `about.summary` (renderizado em `#about`, `/curriculo`, `/cartao`, no currículo ATS/JSON e no corpus do assistente de IA, sem afetar nenhuma região capturada por `e2e/visual.spec.ts`).
  - Expandidas palavras-chave de busca interna em `src/lib/site-search-index.ts` e adicionados testes unitários dedicados para a estrutura de SEO e Schema.org (`tests/pages.test.ts`, **279/279 testes unitários** aprovados).


