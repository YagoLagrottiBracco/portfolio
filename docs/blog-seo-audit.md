# Auditoria técnica do blog — 24/09/2026

## Resultado

**O blog ainda não está pronto para a estratégia de publicação e SEO pretendida.**
Foram executadas 71 verificações em cada ambiente: build de produção local em
http://localhost:3100 e site publicado em https://lagrotti.dev.
Em ambos: **30 passaram, 41 falharam, nenhum erro de rede**.

Os números são verificações da nossa baseline, não uma nota do Google, nem 41
problemas independentes. Incluem funcionalidades recomendadas (como dados
estruturados) e problemas repetidos por idioma. Não significam que todos os
itens sejam requisitos de indexação ou fatores diretos de ranking.

Esta entrega é uma auditoria e um teste reproduzível. **O código funcional do
blog não foi alterado e as falhas não foram corrigidas.**

## Evidências e prioridades

| Prioridade | Constatação | Consequência e correção proposta |
|---|---|---|
| Crítica | Os três artigos retornam canonical https://lagrotti.dev/blog. | O artigo aponta a listagem como representante, em conflito com as URLs do sitemap. Cada artigo deve ter canonical próprio no HTML do servidor. |
| Crítica | As URLs inglesa e espanhola retornam H1 “Bem-vindo ao meu blog” e html lang pt-BR. | O servidor entrega português em todas as versões. O idioma e o artigo devem ser determinados pela URL, não pelo localStorage ou idioma do navegador. |
| Alta | Todos os posts retornam título “Blog — Yago Lagrotti Bracco” e a mesma descrição genérica. | Os metadados específicos só são modificados por JavaScript. Gerar title, description, canonical e metadados sociais por artigo no servidor. |
| Alta | Markdown aparece como texto: não há H2/H3 do artigo e links permanecem na sintaxe Markdown. | Converter Markdown/MDX com um renderizador real e política explícita para HTML. Títulos, parágrafos, listas, links, imagens e código precisam de elementos semânticos. |
| Alta | Os arquivos src/content/blog/*.mdx não alimentam o blog. | Publicar um arquivo novo ali não cria um post. Atualmente a fonte é o array em src/lib/blog.ts. Adotar uma única fonte e validar frontmatter no build. |
| Alta | Não há hreflang entre traduções. O seletor altera o conteúdo sem navegar para outra URL. | Relacionar traduções existentes com links recíprocos; cada URL deve manter um idioma estável. HTML ou sitemap podem fornecer hreflang — não é obrigatório duplicar ambos. |
| Média | Open Graph herda título, URL e tipo website da página inicial. | Compartilhamentos representam o portfólio, não o artigo. Definir og:type article, URL, título, descrição, imagem e Twitter card por post. |
| Média | O único JSON-LD encontrado é Person. | Adicionar BlogPosting com autor identificável, título, imagem pertinente e datas verdadeiras. BreadcrumbList deve corresponder a breadcrumbs visíveis. A ausência desses schemas não impede indexação. |
| Média | Posts não possuem time datetime; não há updatedAt na modelagem. | Exibir data de publicação e, quando aplicável, atualização real. Alinhar datas visíveis, JSON-LD e lastmod, sem atualizá-las artificialmente em cada build. |
| Baixa | /zz/blog e /zz/blog/welcome-to-my-blog retornam 308 em vez de 404. | O parâmetro locale não é validado nos redirects do blog. Rejeitar idiomas inválidos e preservar apenas aliases conhecidos. |

### Causas no código

- src/app/blog/layout.tsx: canonical e metadados genéricos herdados pelos posts.
- src/app/blog/[slug]/page.tsx: Client Component, consulta por locale global,
  transformação de quebra de linha em br em vez de renderização Markdown.
- src/lib/blog.ts: conteúdo fixo duplicado; getPostBySlug troca a tradução
  pelo locale mesmo quando o slug pertence a outro idioma.
- src/contexts/TranslationContext.tsx: locale inicial pt e troca posterior por
  preferências do navegador/localStorage.
- src/components/atoms/LocalizedMetadata.tsx: título e descrição alterados no
  cliente, sem correspondência com canonical/Open Graph no servidor.
- src/app/[locale]/blog: redirects sem validação do locale.
- src/app/sitemap.ts: URLs dos posts presentes, mas sem relações de tradução.

### Observações adicionais da revisão estática

- O conteúdo principal começa com opacity: 0 nas animações. Isso pode deixar a
  leitura dependente da hidratação; requer verificação visual com JavaScript
  desativado. O texto existe no HTML — não confundir Client Component com
  ausência automática de renderização no servidor.
- Links de LinkedIn/GitHub no texto apontam para as páginas genéricas das
  plataformas. Usar os perfis reais do autor.
- Os posts atuais são apresentações curtas de 2024. Não são artigos técnicos
  completos; metadados e schemas não substituem conteúdo original útil.
- O JSON-LD global informa Embu-Guaçu, enquanto personalData informa São José
  do Rio Preto. Remover ou corrigir a localização após confirmar o dado atual.
- O README descreve um projeto bilíngue e não explica publicação do blog.
- Não há fluxo editorial de rascunhos, agendamento, imagem/alt, atualização ou
  validação de colisões de slug.

## O que passou

- Listagem e artigos retornam HTTP 200.
- Cada página testada possui um H1.
- Não foi encontrado noindex nas páginas publicadas testadas.
- robots.txt permite rastreamento e referencia o sitemap correto.
- Sitemap válido, com URLs únicas e os três artigos existentes.
- Post inexistente retorna HTTP 404.
- Aliases conhecidos testados retornam redirect permanente para o destino esperado.
- As solicitações com User-Agent Googlebot recebem os mesmos títulos e headings
  das solicitações comuns. Isso não simula o renderizador nem prova indexação pelo Google.

## Limites da validação

- Nenhum navegador está conectado à sessão: não foi possível medir hidratação,
  comportamento visual, acessibilidade renderizada, navegação real ou Lighthouse.
- A consulta ao PageSpeed Insights para o artigo português retornou HTTP 429
  RESOURCE_EXHAUSTED (quota da API). **Não há nota de performance, LCP, INP ou CLS
  obtida nesta auditoria.**
- Não há acesso ao Search Console: cobertura, canonical escolhido pelo Google,
  consultas, impressões, indexação e Core Web Vitals de campo não foram verificados.
- Google Rich Results Test não foi executado. Os testes inspecionam a presença de
  tipos JSON-LD; não constituem validação completa dos schemas.
- Não foram auditados backlinks, concorrência, intenção de busca por pauta ou
  potencial de palavras-chave. Isso pertence à etapa editorial.
- A baseline testa os três posts existentes. Ao substituir ou ampliar esse
  conjunto, atualizar as fixtures no script para os novos títulos/slugs.

## Implementação recomendada

Manter os slugs publicados em /blog/[slug] e resolver cada artigo pelo seu slug
exato no servidor. Disponibilizar listagens por idioma em URLs estáveis, sem
alterar o conteúdo de uma URL conforme o navegador.

Para o fluxo editorial, a opção mais simples é usar os arquivos Markdown/MDX
existentes como fonte única. Um painel administrativo é outra opção, mas exige
decisões adicionais de CMS, autenticação e hospedagem. A preferência foi
perguntada ao usuário e ainda não foi recebida durante esta auditoria.

A implementação deve incluir:

1. Fonte única de conteúdo, validação de slug, translationKey, locale, título,
   resumo, data, atualização opcional, capa/alt e rascunho. Rascunhos não devem
   aparecer em páginas públicas, sitemap ou alternates.
2. Conteúdo renderizado no servidor e publicável sem alterar componentes.
   Suporte a headings, listas, links, imagens, código e tabelas.
3. Metadados por URL, canonical, alternates somente para traduções existentes,
   Open Graph/Twitter e JSON-LD coerente com o conteúdo visível.
4. Autor visível com link para perfil, datas, breadcrumbs, links entre traduções,
   sumário quando útil e navegação para outros artigos relevantes.
5. Sitemap gerado da mesma fonte com datas reais; redirects e 404 corretos.
6. Testes de conteúdo, HTTP e HTML, incluindo rascunhos, traduções ausentes,
   slugs duplicados, datas inválidas, links, imagens e ausência de JavaScript.
7. Depois de publicar: Rich Results Test, inspeção de URL/Search Console,
   submissão do sitemap e medição de Core Web Vitals em campo.

Para cada novo post, definir intenção de busca e pergunta central; apresentar
experiência própria, exemplos executáveis, medições reproduzíveis e referências
primárias. Evitar títulos prometendo resultados não demonstrados, repetição
artificial de palavras-chave e datas de atualização fictícias. Não existe
tamanho universal de artigo nem configuração que garanta primeira posição.

## Como repetir os testes

Com um build de produção servido localmente:

```powershell
npm.cmd run build
npm.cmd run start -- --port 3100
# Em outro terminal:
python scripts/seo-audit.py --base-url http://localhost:3100 --output docs/seo-audit-local.json
python scripts/seo-audit.py --base-url https://lagrotti.dev --output docs/seo-audit-production.json
```

O script usa apenas a biblioteca padrão do Python. Retorna código 1 se houver
verificações reprovadas ou erros de rede. Os JSONs preservam a evidência de cada
verificação, ambiente e horário UTC.

## Referências primárias

- [Canonicalização — Google Search Central](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Versões localizadas e hreflang — Google Search Central](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Article/BlogPosting — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Core Web Vitals — Google Search Central](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [Conteúdo útil e confiável — Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
