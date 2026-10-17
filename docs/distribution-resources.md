# Recursos para divulgação do portfólio

A biblioteca fica em `/recursos`, `/en/recursos` e `/es/recursos`. A home, a navegação e os dez estudos de caso apontam para os materiais correspondentes. Cada coleção e recurso tem HTML renderizado no servidor, canonical e versões por idioma; as páginas públicas entram no sitemap. As versões incorporáveis usam `noindex` e preservam crédito visível.

## As vinte entregas

| # | Recurso | Rota em português | Material entregue |
| --- | --- | --- | --- |
| 1 | Ferramentas gratuitas | `/recursos/ferramentas` | Comparador JSON com caminhos e tipos de mudança; revisor de chaves `.env` sem valores no relatório |
| 2 | Demonstrações interativas | `/recursos/demos` | Modelo local de filas; produtos originais Dupla Face e Flora, carregados somente após escolha do visitante |
| 3 | Templates | `/recursos/templates` | Worker TypeScript executável e testado, CI de exemplo, README PT/EN/ES, licença MIT; ADR por idioma |
| 4 | Benchmark reproduzível | `/recursos/benchmarks/json-clone` | Script independente, 180 amostras, CSV/JSON, ambiente, medianas e limites |
| 5 | Galeria de diagramas | `/recursos/diagramas` | Dez fluxos derivados dos casos, SVG e PNG em três idiomas, atribuição CC BY 4.0 |
| 6 | Guias de decisão | `/recursos/guias` | Filas, fronteiras de serviços e validação de saídas de IA, com alternativas e referências |
| 7 | Páginas por assunto | `/recursos/temas` | Três coleções com artigos, casos e recursos selecionados pelo assunto |
| 8 | Glossário aplicado | `/recursos/glossario` | Seis conceitos com exemplos ligados ao portfólio |
| 9 | Laboratório público | `/recursos/laboratorio` | Sobrecarga executável e experimento de clonagem, com hipótese, protocolo e limites |
| 10 | Evolução dos projetos | `/recursos/atualizacoes` | Lançamento da biblioteca e decisões documentadas dos dez casos; sem atribuir datas históricas desconhecidas |
| 11 | Vídeos curtos | `/recursos/videos` | Duas gravações reais por idioma, WebM, legendas VTT, poster e transcrição |
| 12 | Carrosséis | `/recursos/carrosseis` | Cinco slides para cada caso em cada idioma: 150 PNGs, ZIPs, texto alternativo e referência |
| 13 | Kit público de apresentação | `/recursos/imprensa/yago` | Bio por idioma, foto original do perfil público verificado, monograma, cartão, contato, procedência e regras de uso |
| 14 | Palestras e workshops | `/recursos/palestras` | Guias completos de 30/60 minutos, exercícios, gabaritos, caderno do participante e alternativas offline em três idiomas |
| 15 | Pacotes para curadores | `/recursos/curadoria` | Trinta ZIPs com resumo editorial, imagem do caso, referência canônica e créditos |
| 16 | Colaboração | `/recursos/colaboracoes/reproduzir-benchmark` | Brief de reprodução, critérios de método/crédito e propostas por e-mail ou issue pública revisável |
| 17 | Incorporação | `/recursos/incorporar` | Previews e snippets de iframe para JSON, ambiente e fila; três idiomas e atribuição |
| 18 | Galeria de usos | `/recursos/comunidade` | Exemplo do autor identificado, JSON com crédito/autorização, issue form, importador validado e workflow que abre PR em rascunho após revisão |
| 19 | Campanha de divulgação | `/recursos/campanhas` | Duas páginas de destino; 30 textos completos por idioma, links UTM, calendário ICS, ZIP e checklist local |
| 20 | Código público | `/recursos/repositorios` | Seis tarefas propostas, com arquivos/linhas fixados por commit, critérios de aceite e rascunhos de issue; nove repositórios verificados |

## Reproduzir os materiais

```bash
# Diagramas, carrosséis, kits, templates, legendas, campanha e sessões.
# Não grava vídeos nem repete medições.
npm run resources:build

# Uma nova medição, com ambiente e dados brutos. Substitui os resultados publicados.
node scripts/benchmark-json.mjs public/recursos/downloads
cp scripts/benchmark-json.mjs public/recursos/downloads/benchmark-json.mjs

# Grava as ferramentas reais em três idiomas. Requer Chromium e FFmpeg do Playwright.
npx playwright install chromium ffmpeg
npm run dev -- -p 3461
# Em outro terminal:
node scripts/record-resource-demos.mjs http://localhost:3461
```

O starter deve ser verificado depois de descompactar, com `npm install`, `npm test`, `npm run typecheck` e `npm start`. Seu estado é local à execução e ele não inclui broker durável nem garantia de exatamente uma vez. O README descreve os limites de idempotência e transações.

## Conteúdo e manutenção

- `src/data/resources/sections.ts`: vinte coleções, títulos e descrições.
- `src/data/resources/editorial.ts`: guias, glossário e assuntos.
- `src/data/resources/collections.ts`: ferramentas, demos, templates, experimentos, sessões e campanhas.
- `src/data/resources/project-demos.ts`: produtos externos e instruções verificadas de exploração.
- `src/data/resources/contribution-tasks.ts`: propostas com evidência vinculada a commits.
- `src/data/resources/campaign-plan.ts`: 30 publicações, traduções, datas e exportações.
- `src/data/resources/community.json`: entradas externas revisadas; inicialmente vazio.
- `src/lib/resource-catalog.ts`: conecta esse conteúdo aos dados existentes dos projetos.
- `src/components/resources`: páginas, ferramentas locais, propostas, incorporação e entradas nos estudos de caso.
- `public/recursos`: arquivos prontos para servir; os vídeos só são carregados ao reproduzir.

O lançamento usa a data editorial explícita 2026-10-17. Novos registros de evolução devem ter data verificável. O benchmark mantém seu próprio timestamp de execução. Alterações nos casos exigem regenerar os arquivos editoriais. A licença dos textos/diagramas autorais é CC BY 4.0; screenshots e marcas de clientes não recebem essa licença. Código do starter: MIT.

## O que depende de pessoas ou contas externas

Os convites, materiais e fluxos estão implementados. Nenhum colaborador, uso externo, palestra passada ou publicação de terceiro foi inventado. A primeira publicação em colaboração e as primeiras entradas externas da galeria dependem de participantes reais, revisão e autorização. Os 90 textos localizados e os calendários estão prontos; publicar em redes/newsletters requer acesso às contas, e realizar uma palestra requer aceite e participantes. Nada foi enviado a terceiros.

O kit inclui a foto original de 422 × 422 pixels do perfil GitHub de Yago, sem edição ou ampliação. A procedência acompanha os ZIPs; a foto e as marcas de terceiros não recebem a licença CC BY dos diagramas. O catálogo usa um snapshot de acesso público verificado anonimamente em 2026-10-17; três links que retornaram 404 foram excluídos da nova coleção. As seis tarefas são propostas baseadas em código inspecionado, ainda sem aprovação dos mantenedores. Veja [a verificação das fontes](source-verification-contributions.md) e [a procedência das demos](real-project-demos.md).

As propostas ficam na memória do navegador e geram rascunhos de e-mail e GitHub, além de JSON para download. Apenas o envio explícito no GitHub cria uma issue pública. Os campos das ferramentas não são enviados, armazenados em localStorage nem anexados a eventos de analytics. O checklist da campanha guarda somente IDs das marcações no dispositivo.

## Revisar uma aplicação da comunidade

O formulário de issue exige JSON e autorização marcada em seção própria. O importador rejeita links inseguros, recursos desconhecidos, dados sem os três idiomas, falta de autorização e slugs duplicados. A autorização contida no texto da proposta não substitui o checkbox.

```bash
# Validação sem gravar dados:
npm run resources:import -- --input proposta.json

# Após conferir autoria e consentimento, uma issue revisada recebe
# o label community-approved. O workflow cria uma branch e um PR em rascunho.
# Conferir o diff e o preview; integrar pelo fluxo normal do site.

# Alternativa manual, com revisão e evidência explícitas:
npm run resources:import -- --issue 123 --approve --reviewer YagoLagrottiBracco
```

O label `community-approved` foi criado no repositório. A permissão do GitHub Actions para criar PRs foi habilitada, mantendo o padrão geral de token somente leitura; o workflow recebe escrita apenas no job que prepara o PR. Não há merge ou publicação automática das submissões. Não foram criadas issues fictícias para preencher a galeria.

## Verificação da primeira etapa (2026-10-17)

- `npm test`: 86 testes passaram.
- `npm run lint`, `npm run typecheck` e `npm run build`: concluídos com sucesso.
- Playwright contra o build de produção: 23 testes passaram, incluindo os testes existentes.
- Auditoria HTTP de 303 páginas de recursos: status, canonical, origem da imagem social e idioma corretos; quatro URLs inválidas retornaram 404.
- 64 arquivos ZIP: diretórios e CRCs verificados. Starter extraído: três testes, typecheck e demonstração executados com sucesso.
- Seis vídeos de produção: reprodução e cinco cues de legenda por vídeo verificados no navegador. Inspeção de layout em desktop, celular e temas claro/escuro.

Os resultados finais da etapa de conclusão e a publicação estão registrados em [distribution-completion.md](distribution-completion.md).
