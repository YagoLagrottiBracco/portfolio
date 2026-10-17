# Crescimento — newsletter, conversas, distribuição e conteúdo

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

## Conversas: agendamento, briefing e recomendações

**Agendamento (Calendly).** `/trabalhe-comigo#agendar` mostra a agenda do link em `profile.ts` (`socialLinks.calendly`) dentro da página. O widget só é baixado quando a pessoa clica em "Ver horários disponíveis", e a reserva leva as UTMs da visita. Escolher um horário e concluir viram os eventos `meeting_slot_selected` e `meeting_booked`, que formam o funil **Trabalhe comigo → agendamento**. O plano grátis do Calendly permite embutir a agenda; não há nada para configurar além do link.

**Briefing e recomendações (Resend).** Os dois formulários mandam um e-mail para você e só aparecem com a configuração completa:

1. Crie a conta em <https://resend.com> e, em **Domains**, adicione `lagrotti.dev`. Copie os registros DNS (SPF, DKIM) para onde o domínio é gerenciado e espere a verificação.
2. Em **API Keys**, crie uma chave com permissão *Sending access*.
3. Na Vercel (Production): `RESEND_API_KEY` com a chave, `CONTACT_TO` com o e-mail que recebe e `CONTACT_FROM` com um remetente do domínio verificado (`lagrotti.dev <contato@lagrotti.dev>`). Faça um deploy.
4. Envie um briefing de teste em `/trabalhe-comigo#briefing`.

Os e-mails chegam com **Responder** apontando para quem escreveu. Cada formulário aceita 3 envios por hora por IP, confere a origem, tem um campo invisível contra robôs e funciona sem JavaScript.

- **Briefing** (`/trabalhe-comigo#briefing`): o assunto (vaga, projeto ou outro), nome, e-mail, empresa (opcional) e a mensagem. Vira o evento `brief_submitted` com o assunto.
- **Recomendações** (`/recomendar`, `/en/recomendar`, `/es/recomendar`): página fora do sitemap e do menu, com `noindex`. Mande o link para quem trabalhou com você. O formulário exige consentimento explícito para publicar; o e-mail que chega traz o trecho pronto para colar em `personalData.testimonials`, com as traduções marcadas como `TODO`. Traduza, confirme a tradução com a pessoa e publique. Sem o Resend configurado, a página oferece o e-mail como caminho.

## Para recrutadores

- **Respostas de triagem** (`/trabalhe-comigo#triagem`, dados em `src/data/screening.ts`): local e fuso, remoto, senioridade, liderança, stack, idiomas e quando pode começar (que vem da disponibilidade em `profile.ts`). Quatro respostas só você pode dar e começam como `null`, escondidas: **modelo de contrato**, **pretensão salarial**, **nível de inglês** e **mudança de cidade**. Preencha as que quiser tornar públicas, nos três idiomas.
- **Currículo por foco**: além do geral (`/cv/pt`), há `/cv/pt/backend`, `/cv/pt/fullstack`, `/cv/pt/ia` e `/cv/pt/lideranca` (e os de `en` e `es`), que reordenam competências e projetos (`src/lib/cv-focus.ts`).
- **Formatos legíveis por máquina**: `/cv/pt/plain.txt` (texto para colar em formulários de candidatura), `/cv/pt/resume.json` ([JSON Resume](https://jsonresume.org)) e `/contato.vcf` (cartão de contato). Os links ficam em `/trabalhe-comigo`.
- **Páginas de tecnologia** (`/stack`, `/stack/[slug]`): cada tecnologia com pelo menos 3 evidências (projetos, empregos, artigos) ganha uma página que junta tudo. O catálogo e os apelidos ficam em `src/data/stack.ts`.
- **Modo apresentação** (`/projetos/[slug]/apresentar`): o estudo de caso em slides, para mostrar numa entrevista com a tela compartilhada. Setas ou toque passam os slides, `F` liga a tela cheia, e imprimir gera um slide por página.

## Pergunte ao portfólio (Claude)

`/perguntar` responde perguntas sobre o seu trabalho usando só o conteúdo do site, com cada afirmação ligada à fonte (estudo de caso ou trecho de artigo). A página e o link em `/trabalhe-comigo` só existem com `ANTHROPIC_API_KEY` configurada.

1. Em <https://console.anthropic.com>, crie uma chave em **API Keys** e defina um **limite de gasto mensal** em **Settings → Limits**. É ele que garante a conta, não o código.
2. Na Vercel (Production): `ANTHROPIC_API_KEY`. Opcionais: `ASK_DAILY_LIMIT` (perguntas por dia por instância da função, padrão 100) e `ASK_MODEL` (padrão `claude-opus-5-5`). Faça um deploy.
3. Faça algumas perguntas e confira as fontes citadas.

Como funciona (`src/lib/ask/`): cada pergunta leva o perfil e os dez estudos de caso (cerca de 8 mil tokens, em cache entre perguntas) e os 4 trechos de artigo mais relevantes para ela. A resposta chega em streaming. Limites: 8 perguntas por hora por IP e o teto diário. O site não registra o texto das perguntas; a página de privacidade avisa que elas são enviadas à Anthropic. Não foi testado contra a API real neste repositório: confirme com a sua chave antes de divulgar a página.

## Comentários nos artigos (giscus)

Os comentários usam as Discussions do GitHub. Cada artigo tem um único tópico, compartilhado pelas três versões de idioma. A seção só aparece com as quatro variáveis preenchidas:

1. No repositório, ative **Settings → General → Features → Discussions**. Crie a categoria **Comentários** do tipo *Announcement*: só você e o giscus abrem tópicos.
2. Instale o app em <https://github.com/apps/giscus> para esse repositório.
3. Em <https://giscus.app>, informe o repositório e a categoria, e copie `data-repo-id` e `data-category-id`.
4. Na Vercel: `NEXT_PUBLIC_GISCUS_REPO`, `NEXT_PUBLIC_GISCUS_REPO_ID`, `NEXT_PUBLIC_GISCUS_CATEGORY` e `NEXT_PUBLIC_GISCUS_CATEGORY_ID`. Faça um deploy.

O giscus só carrega quando o leitor chega perto do fim do artigo e acompanha o tema do site.

## Áudio e podcast

Cada artigo tem **Ouvir**, que lê o texto com a voz do navegador, trecho por trecho, destacando o que está sendo lido. Não depende de nada externo.

Para publicar uma gravação de verdade, que também vira episódio do podcast (`/blog/podcast.xml`, `/en/blog/podcast.xml`, `/es/blog/podcast.xml`):

1. Grave a leitura e exporte em MP3, mono, 64 a 96 kbps.
2. Hospede o arquivo num endereço HTTPS público, como o Vercel Blob ou um bucket. Evite `public/`: áudio pesa no repositório.
3. Acrescente o episódio em `src/data/podcast.ts`: `translationKey` e `locale` do artigo, `audioUrl`, `bytes` (`stat -c %s arquivo.mp3`), `durationSeconds` e `publishedAt`. O artigo passa a mostrar o player e o feed sai do 404.
4. Cadastre o feed uma vez no Apple Podcasts Connect e no Spotify for Creators.

## Página "agora"

`/agora` mostra disponibilidade, trabalho atual, estudos de caso e artigos recentes, tudo a partir dos dados. As notas livres (o que você está lendo, aprendendo ou explorando) ficam em `src/data/now.ts`, nos três idiomas, e começam vazias. Atualize `updatedAt` ao mexer.

## Indexação para buscadores e IA

- `/sitemap.xml` lista todas as páginas, com `hreflang` e a data de atualização dos artigos e dos índices do blog.
- `/llms.txt` é um mapa do site em Markdown para assistentes de IA, gerado a partir dos mesmos dados das páginas (`src/lib/llms.ts`).
- O IndexNow avisa o Bing a cada deploy (veja [operations.md](operations.md#indexação)).
- **Por que não há `FAQPage` nem `HowTo`.** O Google deixou de mostrar resultados ricos de HowTo em 2023 e de FAQ em 2026, então esse markup não traria nada. Em vez disso, o `BlogPosting` de cada artigo aponta para a mesma entidade `Person` do resto do site e declara `keywords` e o blog a que pertence.

## Conteúdo que só você pode completar

**Depoimentos.** `personalData.testimonials` (em `src/data/personal.ts`) começa vazio, e a seção não aparece enquanto não houver um. Use só depoimentos reais e autorizados. Os dois caminhos mais fáceis são mandar o link de `/recomendar` (o e-mail já chega com o trecho pronto) e as recomendações do LinkedIn, cujo link vai em `url`, para quem quiser conferir. Com `project` preenchido, o depoimento aparece também no estudo de caso.

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

**Respostas de triagem, notas do "agora" e episódios do podcast**: veja as seções acima. Todas começam vazias de propósito.

**Trabalhe comigo** (`src/data/work-with-me.ts`) e **Privacidade** (`src/data/privacy.ts`) repetem o que o site já afirma e o que o código faz. Mude o texto da privacidade no mesmo commit em que mudar analytics, armazenamento no navegador, newsletter ou as APIs de escrita.
