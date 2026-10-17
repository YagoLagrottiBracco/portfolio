# Recursos: distribuição, adaptação e participação

Esta entrega acrescenta vinte recursos à biblioteca em `/recursos/ecossistema`, `/en/recursos/ecossistema` e `/es/recursos/ecossistema`. As vinte coleções anteriores permanecem disponíveis; a nova coleção reúne estes vinte fluxos.

| # | Entrada em `/recursos/ecossistema/` | Implementação |
| --- | --- | --- |
| 1 | `terminal` | CLI independente, pacote TGZ instalável, arquivos/stdin limitados, comparação JSON e verificação de chaves `.env`, códigos de saída e relatórios. |
| 2 | `github-action` | Action composta independente com CLI incluída, entradas por variáveis de ambiente e resumo sem conteúdo dos arquivos. |
| 3 | `executar` | Projeto worker executável, demonstração HTTP/CLI, testes e lançamento no StackBlitz a partir da pasta pública real. |
| 4 | `api-bruno` | API didática local com autenticação, paginação e erros; treze requisições/assertivas Bruno e testes HTTP. Dados fictícios. |
| 5 | `cenarios` | Links com parâmetros limitados de fila, revisão antes de aplicar e reprodução determinística a partir de estado vazio. |
| 6 | `desafios` | Seis desafios traduzidos, correção automática, dicas graduais, explicações e progresso local apagável. |
| 7 | `editor-diagramas` | Componentes e conexões editáveis a partir dos casos, limites explícitos e exportação SVG/Mermaid com escape. |
| 8 | `colecoes` | Coleções nomeadas de recursos reais, armazenamento local, importação revisável, link compartilhável e Markdown. |
| 9 | `versoes` | Distribuições `1.0.0`, manifesto com tamanho/SHA-256/compatibilidade e proteção contra sobrescrita de versões com bytes diferentes. |
| 10 | `citacoes` | Referências em texto e BibTeX de artigos e recursos, com autoria, origem, data e versão quando aplicável. Também disponível nos artigos. |
| 11 | `trechos` | Âncoras derivadas do conteúdo nos parágrafos e blocos de código, com link e cópia acessíveis. Alterar o próprio conteúdo pode alterar sua âncora. |
| 12 | `correcoes` | Seleção de trecho e rascunho revisável de correção/tradução com URL e idioma reais. Disponível em artigos e páginas individuais de recursos. |
| 13 | `pedidos` | Mural com issues públicas e votos reais do GitHub, estados, cache, snapshot datado e formulário de solicitação. |
| 14 | `catalogo-api` | `/api/resources/v1`, filtros de idioma/coleção, esquema JSON, CORS somente leitura e ETag/cache. |
| 15 | `cartoes` | SVG seguro para READMEs de um recurso escolhido, preview, download e Markdown de incorporação. |
| 16 | `links-qr` | Redirecionamentos curtos com destinos permitidos, atribuição de campanha, QR codes SVG reais e download. |
| 17 | `referencias` | Entrada manual de referências, receptor Webmention com fila configurável, verificação de backlink e revisão antes de publicar. |
| 18 | `feeds` | RSS por idioma, coleção ou recurso, com GUIDs de versão, datas e links reais. Descoberta anunciada nos metadados dos recursos. |
| 19 | `contribuicoes` | Consulta pública reproduzível de PRs integrados em repositórios de outras pessoas/organizações, com fonte e data. Resultado vazio é exibido sem inventar trabalhos. |
| 20 | `indexnow` | Chave pública, comando de simulação/envio e workflow após deploy de produção; valida origem das URLs e verifica a chave antes de enviar. |

## Uso e reprodução

```sh
npm run resources:build
npm run test:resource-packages
npm test
npm run lint
npm run typecheck
npm run build
npm run test:e2e

# Apenas simula; --submit faz o envio depois de verificar a chave em produção:
npm run indexnow

# Atualiza somente a partir de fontes públicas verificáveis:
npm run resources:refresh
```

Os fontes, limites e comandos específicos estão em [resource-distributions.md](resource-distributions.md), [resource-studio.md](resource-studio.md) e [resource-participation.md](resource-participation.md). Os arquivos congelados de distribuição ficam em `public/recursos/releases/1.0.0/`. Para uma mudança de bytes após publicação, mantenha os arquivos existentes e crie outra versão.

## Contas e participação externa

O pacote TGZ hospedado funciona sem publicação no registro npm. Publicar no registro requer autenticação npm, indisponível nesta sessão. A listagem no GitHub Marketplace requer as etapas e o aceite da conta; não é apresentada como concluída sem essa evidência.

A Action foi publicada em [resource-contract-checks](https://github.com/YagoLagrottiBracco/resource-contract-checks), com as tags `v1` e `v1.0.0`, a [release 1.0.0](https://github.com/YagoLagrottiBracco/resource-contract-checks/releases/tag/v1.0.0) e execução real aprovada em Node 20 e 22. O código da release corresponde ao commit `44b484f7eba8e5b074713eb753e2ae18db434aa6`, que pode ser usado para fixar a versão no workflow.

O receptor automático Webmention exige `WEBMENTION_GITHUB_TOKEN` na hospedagem, com permissão para criar issues somente no repositório do portfólio. Sem essa configuração, responde **503**, informa o estado real e oferece o envio manual pelo formulário do GitHub. A configuração também habilita a descoberta pelo header HTTP `Link`. Uma referência só aparece após buscar a origem por HTTPS com DNS/IP público fixado, conferir o backlink e passar pela revisão do mantenedor. Não há referências fictícias.

O mural começa sem pedidos de visitantes. A consulta de contribuições retornou zero PRs públicos com os critérios definidos. Essas páginas, os comandos de atualização e os fluxos estão implementados; votos, referências e trabalhos externos dependem de registros reais. Nenhuma mensagem de divulgação foi enviada a terceiros.

## Verificação e publicação

Verificação integrada em 17/10/2026: **161 testes da aplicação, 12 testes dos pacotes e 35 testes de navegador passaram**, além de lint, TypeScript e build de produção. Os testes incluem instalação real do TGZ e execução da Action fora do workspace. Os cinco artefatos da release conferem com o manifesto; os 74 ZIPs existentes passaram na verificação de CRC e caminhos. A coleção e o editor também foram inspecionados visualmente em desktop e celular, sem erros de JavaScript nas telas verificadas.

A auditoria HTTP do build validou **372 páginas de recursos** nos três idiomas, com canonical, idioma, hreflang, imagem social e descoberta RSS; conferiu os 21 destinos de download do catálogo, os cinco arquivos imutáveis e quatro rotas inválidas com 404. A revisão independente não deixou achados materiais pendentes.

A publicação segue o fluxo de PR para `master`, checks do GitHub e deploy Vercel. Os registros públicos de CI e deployment do repositório documentam o resultado de cada revisão. Depois do deploy, a auditoria HTTP deve ser repetida em `https://lagrotti.dev`, e o IndexNow só pode enviar URLs quando a chave pública estiver disponível. As interfaces descrevem separadamente as integrações que ainda dependem de conta ou configuração externa.
