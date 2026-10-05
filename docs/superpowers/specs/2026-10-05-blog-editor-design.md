# Editor visual e apresentação do blog

## Objetivo e decisões aceitas

Permitir que o proprietário crie, revise e edite artigos pelo navegador, com uma experiência visual e uma apresentação pública mais rica. Os artigos continuam em Markdown/MDX no repositório, em português, inglês e espanhol. O fluxo do ChatGPT Work continua apto a publicar diretamente pela API atual. O editor também deve conseguir abrir os artigos gerados pelo cron e melhorá-los depois.

A área de edição fica no próprio site e é privada. Os arquivos Git continuam sendo a fonte de verdade; não haverá banco de dados nem migração dos 54 arquivos atuais. Um artigo corresponde a um `translationKey` e reúne exatamente três versões, uma por idioma. Novos artigos podem ser salvos como rascunho; uma alteração em artigo já público só se torna pública quando o proprietário escolhe **Publicar alterações**.

## Escolha de arquitetura

O editor usa [Milkdown Crepe](https://milkdown.dev/docs/guide/using-crepe), que edita Markdown visualmente e oferece recursos de código, tabelas e imagens. A implementação mantém uma aba **Markdown** para ajustes e para qualquer conteúdo que o modo visual não represente fielmente. Ao abrir um post, converte o Markdown para o documento visual e de volta; se texto ou blocos se perderem, abre somente a aba Markdown para aquele corpo. Após uma edição visual, valida novamente a serialização antes de salvar. O corpo salvo continua sendo Markdown compatível com o `react-markdown` e `remark-gfm` já usados pelo site. O título permanece fora do corpo, como o único H1.

O caminho alternativo seria migrar para um CMS externo. Isso criaria outra fonte de verdade e exigiria adaptar o cron e o deploy. Uma ferramenta local evitaria autenticação web, mas perderia a edição pelo navegador. A solução integrada reaproveita GitHub, deploy, SEO e contrato de publicação existentes.

## Experiência do proprietário

- `/admin/blog`: lista privada de conjuntos de artigos, inclusive rascunhos, com idioma, data, status e busca por título ou slug.
- `/admin/blog/new` e `/admin/blog/[translationKey]`: formulário com abas PT/EN/ES, título, slug, resumo, data, tags, capa com texto alternativo, corpo visual e aba Markdown. O formulário mostra prévia pública por idioma e estado de alterações não salvas.
- A barra do editor permite H2/H3, negrito, itálico, links, listas, citação, divisor, bloco de código com linguagem, tabela e imagem. Não oferece H1 no corpo. A inserção de imagem pede texto alternativo e aceita HTTPS ou arquivo PNG/JPEG/WebP/AVIF de até 5 MB. Uma legenda opcional usa o título da imagem em Markdown (`![alt](url "Legenda")`); se o editor visual não preservar esse título, a aba Markdown permite editá-lo. A capa exige dimensões reais.
- O formulário mostra orientações editoriais sem impor uma fórmula ao texto: resumo específico, subtítulos claros, imagens com texto alternativo, links de fontes quando houver afirmações externas, código com linguagem e prévia nos três idiomas.
- **Salvar rascunho** grava as três versões com `draft: true`. **Publicar** exige os três idiomas completos e mostra os erros por campo. Uma edição de artigo já publicado permanece local no navegador até **Publicar alterações**; não retira a versão pública do ar durante a edição.
- Antes do commit, o editor mostra a prévia final renderizada com o mesmo componente público. Rascunhos e prévias privadas recebem `noindex` e nunca entram no sitemap ou na listagem pública.

## Acesso e proteção

O login usa GitHub OAuth por meio de [Auth.js](https://authjs.dev/getting-started/installation), com sessão protegida, sem banco. A autorização compara o ID estável da conta GitHub com `BLOG_ADMIN_GITHUB_ID`, configurado no servidor. Páginas, leitura de rascunhos, prévias e rotas de gravação verificam a sessão no servidor. As mutações exigem token CSRF vinculado à sessão, origem permitida e JSON com tipo correto; o navegador nunca recebe `BLOG_GITHUB_TOKEN` nem `BLOG_API_KEY`. O endpoint `/api/blog/publish` continua com seu Bearer token e não é transformado em rota de sessão.

Variáveis adicionais: `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` e `BLOG_ADMIN_GITHUB_ID`. A área de edição não exibe controles de administração para visitantes e não depende de esconder links para ser protegida.

## Dados e publicação

Um serviço de repositório no servidor lista, lê e grava os arquivos `src/content/blog/*.mdx` via GitHub. A leitura usa a branch configurada por `BLOG_GITHUB_BRANCH`. O editor desserializa frontmatter com as regras de `src/lib/blog-content.ts`, preserva campos existentes e edita apenas o conjunto selecionado. Slugs continuam únicos globalmente, e `translationKey` é estável depois da criação. Renomear slug altera o caminho do arquivo e requer redirecionamento da URL antiga; por isso, nesta entrega, o slug de artigo publicado fica bloqueado.

Salvar ou publicar gera um único commit para os três arquivos e imagens novas. O servidor valida o payload e o Markdown, compara os identificadores dos arquivos lidos com o estado atual da branch e devolve `409` se houve alteração concorrente. O editor mantém o texto local e oferece recarregar ou comparar antes de tentar de novo. Falhas de GitHub mostram erro sem alegar publicação; sucesso exibe o commit e o estado **aguardando deploy**. Uma publicação só aparece no site após o deploy usual.

Arquivos de imagem enviados pelo editor recebem nome determinístico por hash em `public/blog/` e são incluídos no mesmo commit. Referências no Markdown usam o caminho público final. A imagem de capa mantém o formato de frontmatter atual e pode ser compartilhada pelas três versões. URLs remotas devem ser HTTPS. O servidor valida tipo, tamanho, dimensões e caminho; Markdown recebido do navegador não pode incluir HTML executável ou protocolos perigosos em links e imagens.

O contrato de `POST /api/blog/publish` permanece compatível para o ChatGPT Work: `translationKey`, `articles.pt/en/es`, `image`, `draft` e resposta HTTP continuam aceitos. O cron segue publicando diretamente se enviar `draft: false` ou omitir o campo. Se enviar `draft: true` nos três idiomas, o conjunto entra na lista privada para revisão. O editor também mostra conjuntos com status misto se a API receber `draft` diferente entre idiomas, sem mudar o comportamento atual dessa API.

## Apresentação pública

O artigo público ganha sumário com âncoras H2/H3, tipografia e espaçamento mais legíveis, tratamento responsivo para tabelas, blocos de código com destaque e botão de cópia, imagens no corpo com legenda quando informada e seção de referências quando o autor a escrever no Markdown. A capa e o resumo ganham hierarquia visual melhor, preservando URL, idioma, dados estruturados, canonical, hreflang e sitemap. A listagem pode destacar a capa quando houver, sem esconder posts sem imagem.

O renderizador usa uma lista restrita de elementos Markdown/GFM. Não executa HTML/MDX arbitrário nem script inserido pelo editor ou pelo cron. Componentes de código, imagem e links têm tratamento acessível e responsivo. A experiência de leitura funciona sem JavaScript; o botão de cópia é melhoria progressiva.

## Erros, testes e critérios de aceite

- Rota privada retorna 401/redirect para visitantes; usuário GitHub diferente do ID autorizado recebe 403. O Bearer da API do cron continua funcionando independentemente da sessão web.
- Abrir, salvar e reabrir os 54 arquivos atuais não perde blocos de código, links, listas, citações, tabelas, idiomas ou frontmatter. A conversão visual que não conseguir preservar conteúdo é bloqueada, com opção de edição Markdown.
- Criar rascunho e publicar cada conjunto produz três arquivos válidos; rascunhos não aparecem em listagem, páginas públicas ou sitemap. Editar artigo publicado só altera o site após o commit de publicação e o deploy.
- Dois editores usando a mesma versão não sobrescrevem um ao outro: o segundo recebe conflito e preserva sua edição local.
- Upload inválido, slug duplicado, Markdown inseguro, idioma incompleto e falha de GitHub geram erro claro sem commit parcial.
- Testes de parsing e publicação existentes continuam passando. Novos testes cobrem autorização, leitura e atualização GitHub, conflito, preservação de Markdown, uploads e renderização dos principais blocos. Executar lint, testes, build e inspeção visual em desktop e mobile.

## Limites desta entrega

Não inclui colaboração em tempo real, tradução automática, agendamento de publicação, métricas editoriais, comentários, histórico visual de revisões ou troca de CMS. O histórico de versões permanece no GitHub. O cron continua responsável pela qualidade factual do texto que envia; a interface fornece revisão e prévia quando o proprietário optar por usá-las.
