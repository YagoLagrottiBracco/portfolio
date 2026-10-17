# Estado verificado do portfólio — 17/10/2026

Levantamento do código, dados, rotas, respostas HTTP, navegador, testes e GitHub. Referência publicada: **`5af653b86fc37c5733c568f6cf56f75effef2e06`**, branch `master`, conferida novamente às **20:17 UTC / 17:17 de Brasília**. As referências de implementação descrevem essa revisão; as edições locais posteriores estão separadas abaixo. É uma fotografia, e resultados externos podem mudar.

## 1. Situação da entrega

- O diretório principal estava limpo, em `master`, igual ao `origin/master` e ao master remoto. As quatro frentes de trabalho foram integradas. As branches/worktrees antigas permanecem, mas sua existência não representa trabalho necessariamente pendente de integração.
- A Vercel publicou essa revisão em Production, com status de sucesso às **20:05:53 UTC**.
- O [CI dessa mesma revisão](https://github.com/YagoLagrottiBracco/portfolio/actions/runs/39065113638) **falhou**: `checks` passou, `e2e` e `lighthouse` falharam. Deploy publicado e CI aprovado são estados diferentes neste momento.
- A branch `master` está **sem proteção**, sem checks obrigatórios e sem rulesets. O deploy não foi impedido pelo CI vermelho.
- Foram consultados código e arquivos de exemplo de configuração. Segredos reais não foram lidos, formulários não foram enviados e nenhuma campanha, publicação social, assinatura ou pergunta paga à IA foi executada nesta auditoria.

**Edição local concorrente:** durante a pesquisa apareceram `UPDATE.md` e alterações ainda não commitadas em `src/components/discovery/DiscoveryScreen.tsx`, preservadas. O plano lista expansão do hub, revisão de cases/links, documentação/configuração e limpeza de branches/worktrees. O diff do componente já troca o RSS fixo por idioma, amplia o hub, adiciona QR local e expõe ATS/PDFs focados no CV HTML. Isso é trabalho local em andamento, não parte do deploy auditado; os resultados de teste e produção abaixo não certificam esse diff posterior. Este relatório também é um arquivo novo, ainda não commitado.

Arquitetura atual: **Next.js 15.5.27 / App Router, React 19.1.0, TypeScript 5.9.3 e Tailwind 4.1.14**, conforme lockfile. Conteúdo e perfil ficam em TS/JSON/MDX; o GitHub funciona como fonte de edição/publicação do blog, com geração estática e APIs de servidor. Editor Milkdown/Crepe 7.22.2, PDF via pdf-lib, imagens via Next/sharp, SVG QR via qrcode, autenticação NextAuth/GitHub e Anthropic SDK 0.131.0 para o assistente opcional. Os testes usam node:test, Playwright 1.63.0 e axe 4.13.0; o CI usa Node 22. Não há banco de dados geral do portfólio: os fluxos externos têm persistências específicas descritas abaixo.

## 2. Números reais

| Item | Quantidade e interpretação |
| --- | --- |
| Idiomas | Português, inglês e espanhol |
| Projetos | **21**: 10 cases destacados e 11 cards adicionais |
| Cases | 10, com 30 páginas localizadas; todos têm diagrama; 9 têm artigo associado |
| Artigos | **21 textos distintos, com 63 versões publicadas**; não são 63 assuntos diferentes |
| Artigos com capa | 4 grupos / 12 arquivos localizados |
| Atualizações de artigos | Nenhum dos 63 arquivos possui `updatedAt` |
| Competências / catálogo técnico | 24 competências; 24 tecnologias cadastradas, das quais **20** atingem o critério de publicação |
| Experiência e formação | 10 experiências, 3 formações, 5 certificações e 11 cursos em 3 grupos |
| Recursos | **21 coleções, 102 entradas por idioma, 372 URLs** incluindo índices e coleções |
| Descoberta | 12 tipos de página, em 3 idiomas: 36 URLs |
| PDFs de currículo | **15**: geral e 4 focos, em 3 idiomas |
| Arquivos de recursos | 341 arquivos versionados, somando 55.366.987 bytes |
| Vídeos | 6 gravações WebM: fila e JSON, nos 3 idiomas; com legendas e pôsteres |
| Carrosséis | 150 PNGs, distribuídos em 30 ZIPs |
| Diagramas exportados | 30 SVGs + 30 PNGs |
| Kits de curadoria | 30 ZIPs |
| Desafios | 6 questões técnicas com correção determinística |
| Depoimentos | **0** publicados |
| Podcast | **0** episódios gravados |
| Participação externa | 0 usos comunitários aprovados, 0 referências aprovadas, 0 contribuições externas integradas verificadas, 0 pedidos no snapshot |

Fontes centrais: `src/data/personal.ts`, `src/data/projects-data.ts`, `src/data/stack.ts`, `src/lib/blog-content.ts`, `src/data/resources/sections.ts`, `src/data/discovery.ts` e datasets de participação.

## 3. Perfil, contratação e apresentação profissional

| Área | Implementação existente | Limite ou estado atual |
| --- | --- | --- |
| Home | Hero, tecnologias, cases, recursos, apresentação, projetos filtráveis, experiência, formação, cursos e contato | Publicada nos 3 idiomas |
| Preferências e navegação | Temas claro/escuro, idioma, menu móvel, skip link, teclado, respeito a movimento reduzido e suporte a Save-Data/preferência local | Não equivalem a instalação com cache offline |
| Projetos | Cards, categorias, stack, estado editorial, links e imagens | O estado “em produção” é um dado editorial; não comprova disponibilidade atual do endereço |
| Cases | Contexto, desafio, solução, decisões, diagrama, stack, artigo, recursos, cases anterior/próximo e CTA | “Telas do projeto” reutiliza a capa; não é uma galeria própria com várias telas |
| Números dos cases | 14 rótulos em `metrics`, distribuídos em 4 cases | Só 3 são números explícitos de escala: ~3M eventos/dia, 500+ clientes e 100+ clientes. Os demais descrevem stack, escopo ou responsabilidade |
| Depoimentos | Componentes na home, serviços e cases; fluxo de coleta preparado | Array vazio; os componentes não aparecem |
| Trabalhe comigo | Vaga remota e projeto sob medida, áreas de atuação, processo, triagem, Calendly, CV e canais | A página existe; briefing depende de Resend |
| Triagem | 7 respostas visíveis, incluindo início | 4 perguntas ocultas por resposta nula: contratação, salário, inglês e mudança/viagens |
| Agora | Disponibilidade, trabalho atual, 5 cases com ano 2026 e 3 artigos recentes | Notas pessoais vazias; disponibilidade editorial atual `available` |
| Calendly | Widget opt-in, UTMs, eventos de seleção/agendamento e alternativa de link externo | A agenda só carrega após clique. Não foi feita reserva nem confirmada disponibilidade de horários |
| Briefing | Projeto/vaga, contato, empresa, prazo, contexto, link, consentimento, honeypot e fallback sem JS | Em produção a página de serviços não mostrou formulário; o gate exige `RESEND_API_KEY` e `CONTACT_TO` |
| Recomendar | Relação profissional, texto, resultados verificáveis, fonte e permissões de publicação/tradução | `/recomendar` responde 200, mas não mostrou formulário; publicação do depoimento seria manual, após e-mail recebido |
| Tecnologias | Páginas com projetos, trabalhos, artigos, competências e tecnologias relacionadas | 20 páginas técnicas × 3 idiomas, mais os 3 índices. Redis, Python, PHP e Terraform não atingem o limiar de 3 evidências |
| Timeline | Filtro por tecnologia nas experiências | Baseado nas menções existentes nas descrições; formação é independente |

Os 10 cases são VMageste, ImpressãoMais3D, EnvRune, Praxis, PulseWatch, Digital Tech MS, Eurologado, Estúdio Dupla Face, Flora Psicologia e DevAgent. EnvRune é o único sem `articleKey` associado.

Os outros 11 projetos são Normify, Agendify, 99Freelas Proposal Assistant, Ikigai IA, Dreamerz, Meu Mundo Mental, TechWorky Digital, Minhas Finanças, Congresso, TripSync e Templates Web & Mobile.

Disponibilidade não está centralizada em todas as cópias: além do dado de perfil, há textos estáticos que dizem “disponível imediatamente”. Alterar apenas o dado de disponibilidade não atualizaria todos esses textos.

### Currículo e contato

- PDF gerado dos dados: português, inglês e espanhol; focos `backend`, `fullstack`, `ia` e `lideranca`. Os focos priorizam competências e até 6 cases; o geral conserva os 10.
- CV HTML em `/curriculo`, texto simples para ATS em `/cv/{locale}/plain.txt`, JSON Resume em `/cv/{locale}/resume.json` e alias `/api/resume/{locale}`.
- vCard em `/contato.vcf` e alias `/api/vcard`; cartão digital em `/cartao`.
- Canais de contato existentes: GitHub, LinkedIn, e-mail, telefone, WhatsApp e Calendly.
- Briefings e recomendações são e-mails no Resend, com Reply-To e idempotência; não há CRM ou banco próprio de leads nesse fluxo.
- `/recomendar` é `noindex` e fica fora do sitemap, porém tem link público em “Trabalhe comigo”; não é acessível exclusivamente por convite privado.

Fontes: `src/components/organisms/{HomeScreen,WorkWithMeScreen,NowScreen,CaseStudyView,StackScreens}.tsx`, `src/lib/{cv,cv-focus,cv-formats,inbox,brief,recommendation}.ts`.

## 4. Blog, leitura, busca e administração

### Conteúdo e leitor

Há 21 grupos completos PT/EN/ES, publicados entre 04/05 e 13/10/2026. Não há drafts ou artigos futuros no conjunto atual. As versões em português têm aproximadamente 1.197–1.944 palavras, por contagem simples. Os assuntos incluem os produtos/cases, arquitetura distribuída, agentes, MCP, IA local, Python/FastAPI, Jev, Kimi, ScriptC, RetomaVenda, Fiz Meu Site e Setive.

O leitor possui:

- outline H2/H3, âncoras de títulos, metadados, tags, duração estimada, progresso e tempo restante;
- modo leitura, troca de idiomas e comparação lado a lado em `/comparar/{slug}/{locale}`, com `noindex`;
- Markdown GFM, tabelas, syntax highlighting, cópia de código, legendas e suporte a blocos em abas;
- links permanentes de parágrafo/código/imagem, citações em texto/BibTeX e propostas de correção contextual;
- relacionados por tags, CTA, referências, enquete, compartilhamento LinkedIn/WhatsApp/X/e-mail, cópia, compartilhamento nativo e impressão/PDF;
- escolha de artigo aleatório e bloco de artigos mais lidos, este último dependente da integração de métricas;
- leitura em voz alta por síntese do navegador, pausa/retomada, velocidades e destaque do bloco;
- suporte a áudio gravado, podcast, comentários giscus, Webmentions e newsletter, com os gates descritos abaixo.

Os artigos atuais não usam imagens Markdown no corpo nem blocos `tabs`, embora essas capacidades existam. As capas aparecem em somente 4 grupos: Clean Architecture, ScriptC, Fiz Meu Site e Setive. Nenhum arquivo atual tem data de revisão `updatedAt`.

Síntese de voz não equivale a podcast gravado. A seleção prefere uma voz `localService`, mas pode usar uma voz remota fornecida pelo navegador; o comentário de implementação que afirma que nada deixa o dispositivo é mais forte que a garantia do código.

### Busca

- Busca do blog combina texto e tag, ignora acentos/caixa, consulta título/resumo/tags/subtítulos e preserva `?q=`.
- Busca global abre por botão, Ctrl/Cmd+K ou `/`, carrega índice por idioma sob demanda e mostra até 10 resultados, com teclado.
- O índice global agrega cases, tecnologias publicadas, páginas, artigos e recursos. Não inclui o corpo integral dos artigos nem os 11 projetos sem case.

### Editor e publicação

- Admin GitHub OAuth, com allowlist por ID numérico, lista/busca por grupo de tradução, novo artigo e edição.
- Fontes e drafts são lidos do GitHub, com preservação de frontmatter desconhecido.
- Editor visual Milkdown/Crepe, modo Markdown e fallback para fonte quando a conversão não preserva o documento; sem LaTeX no editor visual.
- Campos editoriais, capa compartilhada, upload, imagens inline com alt, prévia com o componente real e exigência de abrir as 3 prévias antes de publicar pela UI.
- Rascunho/publicação e atualização de publicado; aviso de alterações não salvas; conflito 409 preserva o texto em memória.
- Commit atômico dos 3 idiomas, proteção de versões/blobs e slugs publicados imutáveis. O retorno é `deployment-pending`: o deploy seguinte publica o conteúdo.
- Não há ação de excluir/despublicar, autosave persistente, tradução automática no editor ou campo visual para editar `updatedAt`.
- API Bearer separada em `POST /api/blog/publish`, com limite e gravação GitHub. Não possui a mesma validação forte de conteúdo/imagem do caminho do admin.

Fontes: `src/components/blog/`, `src/components/blog-admin/`, `src/lib/blog-*`, `src/lib/site-search*` e `src/app/api/blog/publish/route.ts`.

## 5. Biblioteca: todas as 21 coleções

| Coleção | Entradas por idioma | O que entrega |
| --- | ---: | --- |
| ecossistema | 20 | Distribuição, adaptação, descoberta e participação descritas abaixo |
| ferramentas | 2 | Comparador JSON e revisor de chaves `.env`, executados localmente no navegador |
| demos | 3 | Modelo de fila e demos opt-in de Dupla Face e Flora |
| templates | 2 | Worker TypeScript executável e modelo ADR |
| benchmarks | 1 | Medição de clonagem JSON, script, amostras, ambiente e limites |
| diagramas | 10 | Diagramas reais dos cases, SVG/PNG nos 3 idiomas |
| guias | 3 | Filas, fronteiras de serviços e validação de IA |
| temas | 3 | Coleções temáticas de casos/artigos/recursos |
| glossario | 6 | Conceitos aplicados com exemplos |
| laboratorio | 2 | Experimentos reproduzíveis de sobrecarga e clonagem |
| atualizacoes | 11 | Lançamento da biblioteca e decisões dos 10 cases |
| videos | 2 | Demonstrações de fila e JSON, gravadas em 3 idiomas |
| carrosseis | 10 | Cinco slides por case e idioma |
| imprensa | 1 | Bio, foto com procedência, contato e regras de uso |
| palestras | 2 | Materiais de palestra de 30 min e oficina de 60 min, com exercícios e gabarito |
| curadoria | 10 | Kits editoriais por case |
| colaboracoes | 1 | Brief de reprodução do benchmark e proposta revisável |
| incorporar | 3 | Previews e snippets para os iframes JSON/env/fila |
| comunidade | 2 | Exemplo identificado do autor e convite à submissão; não são dois usos externos |
| campanhas | 2 | Landing pages e campanha de 30 dias: 90 textos PT/EN/ES, calendários e checklist local |
| repositorios | 6 | Propostas de contribuição com evidência de código e links públicos |

### Os 20 fluxos do ecossistema

| Rota após `/recursos/ecossistema/` | Capacidade e limite |
| --- | --- |
| terminal | CLI real, arquivos/stdin até 200 KB, JSON/env, saídas 0/1/2; TGZ hospedado; sem telemetria. Relatório JSON pode conter os valores comparados |
| github-action | Composite Action independente, entradas seguras e resumo só com estado/contagens; repositório, tags `v1`/`v1.0.0` e release públicos |
| executar | Worker MJS real, Node 20+, navegador/terminal, retries/deduplicação; memória local, IDs limitados a 1.000, sem broker durável; link externo StackBlitz |
| api-bruno | API HTTP local com dados fictícios e 13 requisições Bruno, autenticação, paginação, validação e erros |
| cenarios | Cenário limitado de fila, URL compartilhável e aplicação explícita antes da reprodução |
| desafios | 6 questões corrigidas por regras, dicas, explicações e progresso local apagável; sem execução de código do visitante |
| editor-diagramas | Editor dos fluxos reais dos cases, até 16 nós/32 conexões, exportação SVG/Mermaid; mudanças só na sessão |
| colecoes | Até 10 coleções locais de 40 IDs reais, importação revisável, URL e Markdown |
| versoes | 5 artefatos imutáveis 1.0.0, manifesto, tamanhos, hashes e proteção contra sobrescrita |
| citacoes | Texto/BibTeX de artigos e recursos, com metadados reais |
| trechos | Âncoras por hash do conteúdo. Inserção anterior não relacionada preserva ID; editar o trecho pode mudá-lo |
| correcoes | Trecho, sugestão, URL/idioma e rascunho revisável de issue; não publica automaticamente |
| pedidos | Issues e reações reais do GitHub, cache de 5 minutos e snapshot explícito |
| catalogo-api | JSON v1, filtros, schema, CORS, ETag/304; o catálogo não lista todos os downloads gerados como metadados individuais |
| cartoes | SVG seguro para README, preview e Markdown |
| links-qr | 8 destinos permitidos, redirecionamentos 307 e QR SVG local |
| referencias | Entrada manual e receptor Webmention moderado, com fila GitHub configurável |
| feeds | RSS por idioma/coleção/recurso; versão/data global 1.0.0/17-10-2026, sem histórico individual por entrada |
| contribuicoes | Consulta reproduzível de contribuições públicas integradas em repositórios de outros donos; dataset atual vazio |
| indexnow | Chave pública, pré-verificação, dry-run e envio após deploy; funcionamento verificado no GitHub |

A CLI ainda não está no registro npm: consulta pública retornou 404; o TGZ funciona como distribuição. A Action está publicada em [resource-contract-checks](https://github.com/YagoLagrottiBracco/resource-contract-checks/releases/tag/v1.0.0); ambas as tags apontam para `44b484f7eba8e5b074713eb753e2ae18db434aa6`. A listagem no Marketplace não foi comprovada.

Coexistem **dois workers diferentes**: o ZIP legado de templates é TypeScript, Node 22+, com dependências; o ZIP 1.0.0 é MJS, Node 20+, sem dependências. No deploy auditado também coexistem dois mecanismos de QR: serviço externo configurável no cartão digital e gerador local no ecossistema. A edição local posterior já altera o cartão para QR local, mas não foi publicada nesta fotografia.

Todos os 5 artefatos locais da release conferem com tamanho e SHA-256 do manifesto. As 6 propostas de contribuição têm referências fixadas de código; não são tarefas aprovadas por mantenedores nem contribuições já realizadas. Há 9 URLs de repositórios públicos distribuídas entre os 6 cards da coleção.

## 6. Descoberta, alcance e assinaturas

As 12 páginas de descoberta existem nos 3 idiomas:

| Slug | Conteúdo / estado |
| --- | --- |
| links | Hub de caminhos, canais opcionais e artigos recentes |
| blogroll | 5 fontes técnicas e exportação OPML |
| radar | 1 edição editorial com 4 links comentados |
| leitura | 4 livros/referências |
| principios | 6 princípios de engenharia |
| ia | 4 políticas de uso de IA |
| habilidades | Evidências de competências em projetos, trabalho e artigos |
| status | Checagem pontual dos endereços de projetos |
| analytics | Painel agregado; atualmente mostra não configurado |
| cartao | Contatos, vCard e QR externo configurável |
| curriculo | CV HTML acessível/indexável |
| participar | 4 pautas propostas e enquete; backend atualmente não configurado |

- RSS do blog: 3 feeds, cada um com 21 versões do respectivo idioma, resumos e UTMs; não são feeds de artigo integral.
- RSS de recursos: filtros e descoberta nos metadados; OPML público com 7 outlines: 3 feeds próprios e 4 fontes externas com feed.
- Newsletter: cadastro real no Buttondown, atribuição e fallback sem JS; a edição de newsletters não é enviada por esse endpoint. Formulário não está visível na produção observada.
- Giscus: integração lazy, tema sincronizado e discussão comum por `translationKey`; seção não visível no artigo verificado.
- Podcast: arrays de episódios vazios e feeds 404; síntese do navegador funciona separadamente.
- Dev.to: script prepara Markdown e só cria rascunho com opção explícita; não é republicação automática já realizada.
- Distribuição social: script para Mastodon, Telegram, Bluesky e LinkedIn, com credenciais externas. Sem workflow ou comando npm que o agende; o modo padrão pode enviar, portanto não foi executado nesta auditoria.
- WebSub: há script de ping, mas não workflow/comando npm integrado nem anúncio `rel=hub` nos feeds. Não está completo como sistema de assinatura WebSub.
- ActivityPub: WebFinger, actor e outbox condicionais existem. Em produção estão 404/não configurados. A implementação nativa é parcial: inbox sempre 501, followers anunciado sem rota, sem fluxo completo de Follow/Accept/entrega assinada/persistência de seguidores; WebFinger não valida o `resource` solicitado.
- Webmentions são **duas integrações independentes**: `/api/webmention` recebe/modera em issues GitHub; `/api/webmentions` lê menções no webmention.io para artigos. Não há sincronização automática entre seus datasets.

SEO existente: canonical, idioma/hreflang, sitemap, robots, OG/Twitter, imagens específicas de blog/case/serviços/stack, dados estruturados em áreas implementadas e `llms.txt`. Os recursos compartilham um cartão de engenharia; descoberta não define imagem OG específica própria. `llms.txt` referencia coleções e páginas, não todas as 102 entradas de recursos individualmente. O manifesto e ícones móveis existem; não foi encontrado mecanismo de cache offline/service worker.

## 7. Ativação realmente observada em produção

| Integração | Evidência pública atual | Condição no código |
| --- | --- | --- |
| Umami do navegador | Script `data-website-id` ausente no HTML observado | `NEXT_PUBLIC_UMAMI_WEBSITE_ID` |
| Analytics públicos / mais lidos | `/api/analytics/popular`: 503, `configured:false` | `UMAMI_API_KEY` + `UMAMI_WEBSITE_ID` |
| Newsletter | Sem formulário no blog/artigo observado | `BUTTONDOWN_API_KEY` |
| Briefing e recomendações | Páginas 200, mas sem os formulários | `RESEND_API_KEY` + `CONTACT_TO`; remetente opcional |
| Pergunte ao portfólio | `/perguntar`: 404 | `ANTHROPIC_API_KEY` |
| Enquetes | GET de `proximas-pautas`: `configured:false`, 0 votos | `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` |
| Webmention GitHub | GET `/api/webmention`: `configured:false` | `WEBMENTION_GITHUB_TOKEN` |
| Webmention.io | Nenhuma menção exibida no artigo consultado | `WEBMENTION_IO_TOKEN` e registros externos |
| Giscus | Seção ausente no artigo observado | Conjunto `NEXT_PUBLIC_GISCUS_*` completo |
| ActivityPub | WebFinger/actor/outbox 404 | Bridge externo ou variáveis `ACTIVITYPUB_*`; implementação nativa ainda parcial |
| Podcast | Feed 404 e dataset vazio | Adicionar episódios gravados reais |
| IndexNow da release | Chave pública 200 e envio automático aceito | Caminho ativo com chave versionada |
| IndexNow legado | `/indexnow-key.txt`: 404; passo legado do workflow ignorado | `INDEXNOW_KEY` em hosting e variável do GitHub |
| Admin | `/admin/blog` redireciona para login | OAuth/allowlist/token GitHub; login e gravação não foram efetuados |
| Sentry | Código de captura existe; entrega não verificada | `NEXT_PUBLIC_SENTRY_DSN` válido |
| Search Console/Bing | Meta tags de verificação ausentes no HTML observado | Não comprova falta de posse: verificação por DNS/painéis não foi consultada |

Não se pode deduzir todos os valores da Vercel lendo o repositório. As observações acima descrevem respostas e interfaces; não são uma leitura dos segredos da hospedagem. No escopo de repositório, as listas de nomes de secrets/variables do GitHub estavam vazias; credenciais de organização, environment e provedores não foram auditadas.

`.env.example` está incompleto: faltam configurações de ActivityPub, ambos os Webmentions, WebSub, Upstash/enquetes, distribuição social e canais/QR opcionais. Também afirma que credenciais Umami são usadas só por scripts, embora `src/lib/public-analytics.ts` as leia no servidor.

## 8. Qualidade, segurança e operação

### Verificações executadas nesta pesquisa

Os checks locais foram executados antes da edição concorrente em `DiscoveryScreen.tsx`. O CI e o levantamento HTTP pertencem à revisão publicada `5af653b`.

| Verificação | Resultado |
| --- | --- |
| `npm test` | **239 passaram**, 0 falhas, 0 ignorados |
| `npm run test:resource-packages` | **12 passaram** |
| `npm run lint` | Passou |
| `npm run typecheck` | Passou |
| Build | Passou no job `checks` do CI exato; não foi necessário refazer o build local para a auditoria |
| Catálogo E2E | 107 testes em 12 arquivos no modo normal; inventariados, não aprovados pelo CI atual |
| Servidor local | `next start` na porta isolada respondeu 500 em `/blog`, com o conflito de parâmetros abaixo |
| Sitemap público | **579/579 URLs com 200**, canonical igual à URL, idioma declarado e exatamente um H1 |
| Rotas inválidas públicas | 6/6 responderam **500**, não 404 |
| Inspeção Chromium móvel | 9 páginas representativas, sem erro JS ou overflow horizontal observado; não substitui a suíte completa |
| Dependências de produção | `npm audit --omit=dev`: 5 baixas + 4 moderadas; **0 altas/críticas** |

As 579 URLs são 372 de recursos, 63 artigos, 30 cases, 63 de tecnologias, 36 de descoberta e 15 demais. Isso não cobre todos os endpoints, formatos de CV, apresentações, embeds, caminhos condicionais ou combinações de parâmetros possíveis.

### Falha atual de roteamento

O erro reproduzido localmente e registrado no CI é:

```text
You cannot use different slug names for the same dynamic path ('slug' !== 'locale').
```

Há um segmento dinâmico de primeiro nível `(pt)/[slug]` ao lado de `[locale]`, além das páginas dinâmicas dentro da árvore localizada. A falha ocorre no roteamento do servidor; não é um teste de produto simplesmente esperando uma frase antiga. `playwright.config.ts` aguarda um servidor que não responde corretamente, e o Lighthouse recebe HTTP 500. Ainda não houve correção nesta auditoria.

Em produção, estas URLs inexistentes retornaram 500: `/blog/no-such-audit-article`, `/recursos/no-such-audit-section`, `/en/no-such-audit-page`, `/no-such-audit-page`, `/stack/no-such-audit-tech` e `/projetos/no-such-audit-case`. As páginas estáticas conhecidas funcionaram na mesma verificação.

### Controles implementados

- OAuth GitHub, ID numérico permitido, JWT, CSRF por sessão, origem e content type, comparação segura de tokens.
- Gravações Git sem force e controle de versões no admin; conteúdo público só muda após deploy.
- CSP, nosniff, políticas de referrer/permissões, controle de framing e COOP; embeds têm exceção intencional. Referrer permanece `strict-origin-when-cross-origin`.
- Rate limit por instância e logs de auditoria no console; não constituem quota distribuída ou retenção durável sem infraestrutura adicional.
- Upload admin verifica bytes/dimensões com `sharp`; o caminho Bearer de publicação não tem a mesma validação forte.
- Verificador Webmention limita corpo, valida DNS/IP público, fixa IP e TLS, revalida redirects, exige backlink e aprovação antes de publicar.
- Animações CSS, separação de dados e imagens Next em AVIF/WebP estão implementadas. Não há score Lighthouse atual válido devido à falha do servidor.

### Automação existente e o que foi efetivamente observado

| Automação | Situação |
| --- | --- |
| CI lint/unit/pacotes/audit/build/types | Job `checks` aprovado na revisão auditada |
| Playwright + axe WCAG 2.1 A/AA | Definidos; execução atual bloqueada pelo servidor |
| Lighthouse mobile | 5 páginas, 3 medições; performance 85 como aviso, acessibilidade/SEO 95 e práticas 90 bloqueantes; execução atual inválida |
| Regressão visual | Workflow e testes existem, mas não há imagens de referência; comparações foram ignoradas em execução que terminou verde |
| Uptime | Workflow horário, retries e issues; nenhum histórico de execução retornado na consulta |
| Links de projetos/artigos | Workflow semanal com issues; nenhum histórico retornado |
| Relatório Umami | Workflow mensal; nenhum histórico retornado e sem credenciais no escopo de repo consultado |
| Dependabot de versões | Configurado e ativo; havia 6 PRs abertos, números 8–13, só de dependências |
| Dependabot security alerts/updates | **Desabilitados**, apesar da configuração de atualização de versões |
| CodeQL | Execução aprovada; **14 alertas abertos**, ainda exigindo triagem |
| Secret scanning / push protection | Habilitados; 0 alertas abertos na consulta |
| IndexNow | [Execução atual aprovada](https://github.com/YagoLagrottiBracco/portfolio/actions/runs/39065270966), HTTP 200, 582 URLs recebidas |

CodeQL não equivale a 14 vulnerabilidades exploráveis confirmadas: 7 alertas são classificados como testes, 4 referem-se a possíveis condições de corrida em scripts locais e os restantes incluem logging/escape de Markdown/fluxo DOM do editor. O fluxo DOM apontado renderiza texto escapado por React; precisa de triagem, não de uma alegação automática de XSS confirmado.

## 9. Lacunas concretas para a próxima intervenção

| Prioridade | Achado | Evidência / ação necessária |
| --- | --- | --- |
| Imediata | Rotas dinâmicas conflitam, bloqueiam E2E/Lighthouse e caminhos inválidos retornam 500 | Reconciliar `(pt)/[slug]` com `[locale]`, validar `next start`, 404 e suíte completa antes de novas publicações |
| Alta | Master sem proteção e deploy possível com CI vermelho | Definir checks obrigatórios e uma política de promoção consistente com o fluxo desejado |
| Alta | 9 de 26 endereços na checagem pública de projetos sem resposta válida | Revisar os links, o acesso público e os estados editoriais; timeout/404/503 de uma checagem não provam indisponibilidade permanente |
| Alta | Funcionalidades de conversão/medição existem mas estão inativas | Escolher e configurar provedores; verificar realmente cadastro, entrega e eventos com acesso autorizado às contas |
| Alta | Analytics públicos possuem defeitos além do gate | Corrigir base Cloud e separar série temporal de ranking por caminho antes de ativar o painel |
| Alta | Enquetes usam leitura/incremento/regravação integral não atômica | Evitar perda de votos concorrentes; limitar/limpar o Map separado de IPs antes de escalar |
| Média | Regressão visual verde sem comparações | Gerar/revisar baselines reais e então executar a comparação |
| Média | Configuração/documentação não acompanha os recursos integrados | Atualizar `.env.example`, operações e diferenças entre mecanismos duplicados |
| Média | IndexNow envia 3 URLs da IA desabilitada | Enviou 582; sitemap tem 579. Extras são `/perguntar`, `/en/perguntar` e `/es/perguntar`, atualmente 404. O helper ignora o gate usado pelo sitemap |
| Média | ActivityPub/WebSub ainda parciais | Não anunciar federação/assinatura completas sem implementar e validar os fluxos ausentes |
| Média | Corpus IA divide por regex diferente do parser do outline | Os exemplos Markdown com `##` dentro de code fences no artigo DevAgent geram seções falsas e desalinhamento de citações; corrigir antes de ativar |
| Média | Defesas de payload/publicação não uniformes | Forms/IA dependem de Content-Length antes de parse; API Bearer não tem teto total nem o mesmo decode de imagem do admin |
| Editorial | Dados de prova social e manutenção vazios | 0 depoimentos/usos externos/referências/podcast, 0 updatedAt, perguntas de triagem sem resposta e métricas quantitativas concentradas em 3 cases |

### Detalhes da integração Umami

`src/lib/public-analytics.ts:20,36` constrói por padrão `https://api.umami.is/api/websites/...`, enquanto a [base Cloud documentada](https://docs.umami.is/docs/cloud/api-key) é `https://api.umami.is/v1`. Além disso, trata o campo `x` de [pageviews agrupados no tempo](https://docs.umami.is/docs/api-reference/get-website-pageviews) como caminho de página, antes de cruzá-lo com URLs de artigos. O [endpoint de métricas por dimensão](https://docs.umami.is/docs/api-reference/get-website-metrics) é uma capacidade diferente. A incompatibilidade está no código; não foi feita consulta autenticada a uma conta Umami real. O cliente separado do relatório mensal usa o caminho Cloud correto.

### Links externos que falharam na checagem pontual

A resposta de `/api/status` às 20:09 UTC registrou **17 válidos / 26 verificados**. Falharam: VMageste e Agendify sem status HTTP; PulseWatch 503; Normify, florir.online, Minhas Finanças e os links GitHub TechWorky Digital/`web`/`mobile` com 404. Repositório privado também pode retornar 404 ao público: isso pede corrigir a apresentação do link, não torná-lo público automaticamente.

### Limites da IA e de persistência

O assistente tem recuperação lexical, streaming e citações de fontes reais, corpus de perfil/cases e trechos de artigos. Está desabilitado publicamente. O modelo padrão e o beta são identificadores literais no código, cuja disponibilidade no provedor não foi comprovada nesta pesquisa. O limite diário de 100 é por instância, não um teto financeiro global da conta.

Logs em console, Maps de rate limit e estado do worker não equivalem a persistência distribuída. Newsletter depende do Buttondown; leads/depoimentos, do Resend; enquetes, do Upstash; referências moderadas, de issues GitHub. Essas fronteiras devem ser consideradas na operação.

## 10. O que esta pesquisa corrige na avaliação anterior

Não falta integrar as quatro frentes: isso já foi feito. Também não faltam busca global, CVs por foco/ATS/JSON, serviços, páginas por tecnologia, modo apresentação, ferramentas, kits, participação, automações de qualidade ou distribuição em código. Muitas dessas capacidades já existem; algumas não estão ativadas, outras estão incompletas, e há uma regressão concreta de roteamento.

A próxima prioridade sustentada pelas evidências é **restabelecer servidor/404/CI, tornar os checks efetivos e ativar de forma verificável as integrações escolhidas**. A campanha e os materiais de divulgação já estão preparados. Publicar mais funcionalidades antes de resolver esses pontos não é a recomendação desta auditoria.

Os logs/JSONs auxiliares desta pesquisa foram preservados em `.superpowers/audit-current-state/`; o relatório é a única inclusão de documentação no código nesta etapa.
