# Crescimento — newsletter, distribuição e conteúdo

O que o site já faz para trazer leitores e transformá-los em conversa, e o que depende de um passo seu.

## Newsletter

O formulário aparece no fim de cada artigo e no índice do blog **só quando `BUTTONDOWN_API_KEY` está configurada**. Sem a chave, nada é mostrado.

1. Crie a newsletter em <https://buttondown.com> (o plano grátis basta para começar).
2. Em **Settings → API**, copie a chave e salve como `BUTTONDOWN_API_KEY` na Vercel (Production). Faça um novo deploy.
3. Teste se inscrevendo com um e-mail seu. Chega um e-mail de confirmação: ninguém entra na lista sem confirmar (*double opt-in*).

Como funciona (`src/lib/newsletter.ts`, `POST /api/newsletter`):

- cada inscrição chega ao Buttondown com `referrer_url` (a página), `utm_source`, `utm_medium` e `utm_campaign` da visita, e em `metadata` o idioma e a origem da primeira visita. No Buttondown dá para ver quais posts e quais links trazem assinantes;
- a resposta é a mesma para quem já era assinante e para quem não era, para que o formulário não sirva para descobrir quem assina;
- funciona sem JavaScript: o formulário volta para a mesma página com `#newsletter-<status>`, e a mensagem certa aparece;
- proteções: limite de 5 tentativas por hora por IP, checagem de origem e um campo invisível que só robôs preenchem.

**Enviando edições.** No plano grátis, cada edição é escrita e enviada no próprio Buttondown. Use links com UTM: `npm run utm -- email --medium newsletter --campaign 2026-10 --path /blog/<slug>`. O envio automático de cada artigo novo a partir do RSS (*RSS-to-email*) é um recurso pago do Buttondown; se assinar, aponte para `https://lagrotti.dev/blog/feed.xml`.

## Compartilhamento

Cada artigo termina com botões de LinkedIn, WhatsApp, X, e-mail, copiar link e, no celular, o compartilhamento nativo. Todos levam UTMs: `utm_source=<rede>`, `utm_medium=share` e `utm_campaign=<translationKey do artigo>`. As três versões de idioma do mesmo artigo somam na mesma campanha. O clique também vira o evento `article_share`.

O botão **Imprimir ou salvar PDF** usa a folha de estilo de impressão (`globals.css`): papel branco em qualquer tema, sem navegação e com o endereço impresso ao lado de cada link externo.

## Republicar em outras plataformas

Republicar com `canonical` apontando para cá traz leitores de outra comunidade sem que o Google trate a cópia como concorrente.

**dev.to**

```bash
npm run crosspost -- <slug>                               # mostra o Markdown pronto
DEVTO_API_KEY=… npm run crosspost -- <slug> --draft       # cria um rascunho na sua conta
DEVTO_API_KEY=… npm run crosspost -- <slug> --draft --ai some_ai
```

O rascunho sai com `canonical_url`, links e imagens absolutos, até 4 tags no formato do dev.to e, no fim, "Publicado originalmente em lagrotti.dev" com link `utm_source=devto`. Nada é publicado sozinho: revise e publique no dev.to. A opção `--ai` preenche a declaração de uso de IA do dev.to (`no_ai`, `some_ai`, `fully_autonomous`). A chave fica em <https://dev.to/settings/extensions>.

**Medium.** Use **Import a story** (medium.com/p/import) com a URL do artigo: o Medium define o canonical sozinho.

**Hashnode.** Ao publicar, preencha **Original article URL** nas configurações do post.

Espere alguns dias depois de publicar aqui antes de republicar, para o Google indexar o original primeiro.

## Indexação para buscadores e IA

- `/sitemap.xml` lista todas as páginas, com `hreflang` e a data de atualização dos artigos e dos índices do blog.
- `/llms.txt` é um mapa do site em Markdown para assistentes de IA, gerado a partir dos mesmos dados das páginas (`src/lib/llms.ts`).
- O IndexNow avisa o Bing a cada deploy (veja [operations.md](operations.md#indexação)).
- **Por que não há `FAQPage` nem `HowTo`.** O Google deixou de mostrar resultados ricos de HowTo em 2023 e de FAQ em 2026, então esse markup não traria nada. Em vez disso, o `BlogPosting` de cada artigo aponta para a mesma entidade `Person` do resto do site e declara `keywords` e o blog a que pertence.

## Conteúdo que só você pode completar

**Depoimentos.** `personalData.testimonials` (em `src/data/personal.ts`) começa vazio, e a seção não aparece enquanto não houver um. Use só depoimentos reais e autorizados. As recomendações do LinkedIn são a fonte mais fácil, e o link delas vai em `url`, para quem quiser conferir. Com `project` preenchido, o depoimento aparece também no estudo de caso.

```ts
testimonials: [
  {
    quote: { pt: "…", en: "…", es: "…" }, // traduções aprovadas pelo autor
    author: "Nome Sobrenome",
    role: { pt: "CTO", en: "CTO", es: "CTO" },
    company: "Empresa",
    url: "https://www.linkedin.com/in/…/details/recommendations/",
    project: "pulsewatch",
  },
],
```

**Números nos estudos de caso.** `npm run audit:case-studies` lista o que falta em cada um (métricas, ano, artigo, diagrama, depoimento). Hoje 6 de 10 estão sem métricas. Só entram números verdadeiros e defensáveis numa entrevista.

**Trabalhe comigo** (`src/data/work-with-me.ts`) e **Privacidade** (`src/data/privacy.ts`) repetem o que o site já afirma e o que o código faz. Mude o texto da privacidade no mesmo commit em que mudar analytics, armazenamento no navegador, newsletter ou as APIs de escrita.
