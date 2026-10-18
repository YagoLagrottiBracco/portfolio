# Playbook Sênior de Aquisição Passiva, Copywriting, Storytelling e Tráfego (`lagrotti.dev`)

Este documento consolida a arquitetura de **divulgação passiva, ranqueamento orgânico (SEO + GEO/LLMs), copywriting de conversão e gestão de tráfego de alta intenção** implementada no `lagrotti.dev` (Frentes 13, 14 e 15).

O objetivo é fazer com que o próprio ecossistema do site atue 24/7 como:
1. **Captador de tráfego qualificado** (buscas no Google, Bing, Perplexity, ChatGPT Search e Google AI Overviews).
2. **Qualificador técnico e comercial** (filtrando curiosos e respondendo objeções de recrutadores, CTOs, fundadores e empresas antes da primeira conversa).
3. **Motor de conversão sem atrito** (conduzindo o visitante da evidência técnica para o agendamento no Calendly, WhatsApp, LinkedIn ou envio de briefing em `/trabalhe-comigo`).

---

## 1. Arquitetura de Topic Clusters (SEO + GEO)

Para ranquear na primeira página do Google sem depender de prospecção ativa, o site opera em estrutura **Hub-and-Spoke (Pilar e Satélites)** nos três idiomas (`pt-BR`, `en-US`, `es`):

### Cluster 1 — Contratação Direta e Desenvolvimento de Sistemas Sob Medida (Fundo de Funil)
- **Página Transacional Principal (Money Page):**
  - PT: `https://lagrotti.dev/trabalhe-comigo`
  - EN: `https://lagrotti.dev/en/trabalhe-comigo`
  - ES: `https://lagrotti.dev/es/trabalhe-comigo`
  - **Schemas ativos:** `WebPage` + `ProfessionalService` (`OfferCatalog`) + `FAQPage` (10 perguntas e respostas reais em `#triagem`) + `BreadcrumbList`.
- **Artigo Pilar Comercial-Técnico (Meio/Fundo de Funil):**
  - PT: `/blog/como-contratar-programador-desenvolver-sistema-sob-medida`
  - EN: `/blog/how-to-hire-senior-developer-build-custom-software`
  - ES: `/blog/como-contratar-programador-desarrollar-sistema-a-medida`
- **Guia de Decisão Rápida (Featured Snippet / AI Overview Target):**
  - PT: `/recursos/guias/sistema-sob-medida`
  - EN: `/en/recursos/guias/sistema-sob-medida`
  - ES: `/es/recursos/guias/sistema-sob-medida`

### Cluster 2 — Busca por Programador / Desenvolvedor por Tecnologia Específica
- **Hub de Tecnologias:** `/stack` (`/en/stack`, `/es/stack`) com `CollectionPage` + `ItemList` + `BreadcrumbList`.
- **Landing Pages por Tecnologia (`/stack/[slug]`):**
  - Capturam buscas exatas como *"Programador Node.js"*, *"Desenvolvedor TypeScript"*, *"Programador React / Next.js"*, *"Programador Python"*, *"Programador PHP / Laravel"*, *"Engenheiro de Software Kafka / PostgreSQL"*.
  - Cada página cruza automaticamente **projetos reais + experiência profissional em empresas + artigos técnicos + CTA direto de contratação**.
  - Recebem autoridade direta da Home (`/`, `/en`, `/es`) através dos links internos nas seções `TechStack` e `About`.

### Cluster 3 — Prova de Engenharia em Produção (E-E-A-T)
- **10 Estudos de Caso Completos (`/projetos/[slug]`):**
  - `vmageste` (~3M eventos/dia com Kafka e ClickHouse)
  - `pulsewatch` (18 mil verificações/minuto em 120+ lojas)
  - `impressaomais3d` (e-commerce sob medida com precificação geométrica e Pix/cartão)
  - `dupla-face` (portal multi-tenant com PostgreSQL Row Level Security)
  - `envrune` (cofre criptografado Argon2id + XChaCha20-Poly1305 e servidor MCP)
  - `eurologado`, `devagent`, `praxis`, `tripsync`, `retomavenda`
- **Currículo Indexável e Cartão Digital:** `/curriculo`, `/habilidades`, `/cartao`, `/principios`, `/agora` e `/llms.txt`.

---

## 2. Rotina de Indexação Passiva (Google Search Console + Bing Webmaster Tools)

Para acelerar a subida de posição após cada deploy na `master`:

1. **Submissão do Sitemap Principal:**
   - No Google Search Console e no Bing Webmaster Tools (que também alimenta o índice do ChatGPT Search), mantenha cadastrado:
     - `https://lagrotti.dev/sitemap.xml`
   - O sitemap já declara `xhtml:link rel="alternate" hreflang` para `pt-BR`, `en-US`, `es` e `x-default`, com prioridades hierárquicas (`1.0` na Home, `0.9` em `/trabalhe-comigo`, Estudos de Caso e `/curriculo`, `0.85` em `/stack/[slug]`, `/habilidades` e `/recursos`).
2. **Inspeção de URL Prioritária (Solicitar Indexação):**
   - Sempre que publicar ou atualizar páginas estratégicas, solicite indexação imediata no Search Console para estas 8 URLs-chave:
     1. `https://lagrotti.dev`
     2. `https://lagrotti.dev/trabalhe-comigo`
     3. `https://lagrotti.dev/blog/como-contratar-programador-desenvolver-sistema-sob-medida`
     4. `https://lagrotti.dev/recursos/guias/sistema-sob-medida`
     5. `https://lagrotti.dev/stack`
     6. `https://lagrotti.dev/stack/typescript`
     7. `https://lagrotti.dev/stack/nodejs`
     8. `https://lagrotti.dev/curriculo`
3. **Sinais Externos de Autoridade (`sameAs` e Backlinks Naturais):**
   - O Schema `Person` em `RootDocument.tsx` conecta `lagrotti.dev` ao GitHub e ao LinkedIn.
   - Mantenha a URL `https://lagrotti.dev/trabalhe-comigo?utm_source=linkedin&utm_medium=profile&utm_campaign=passive-bio` no link em destaque do perfil do LinkedIn e `https://lagrotti.dev` na bio do GitHub e nos READMEs dos pacotes públicos (`envrune`, `setive`, `scriptc`).

---

## 3. Sindicação Passiva e Parâmetros UTM Padronizados

O sistema possui validação e persistência de atribuição (`first-touch` e `last-touch`) em `src/lib/utm.ts` e `src/lib/attribution.ts`. Todo visitante que entra por um artigo ou recurso e navega até `/trabalhe-comigo` preserva a origem da conversão no envio do formulário (`BriefForm`) e nos eventos do Umami (`trackEvent`).

### Links Passivos Recomendados para Perfis Fixos (Configure uma vez, colha sempre)

| Superfície Fixa | URL com UTM Padronizado | Objetivo no Funil |
| :--- | :--- | :--- |
| **LinkedIn (Link do Topo do Perfil)** | `https://lagrotti.dev/trabalhe-comigo?utm_source=linkedin&utm_medium=profile&utm_campaign=always-on` | Conversão direta (vagas sênior e projetos sob medida) |
| **LinkedIn (Seção Em Destaque — 1)** | `https://lagrotti.dev/blog/como-contratar-programador-desenvolver-sistema-sob-medida?utm_source=linkedin&utm_medium=featured&utm_campaign=pillar-guide` | Qualificação de empresas/CTOs via storytelling técnico |
| **LinkedIn (Seção Em Destaque — 2)** | `https://lagrotti.dev/curriculo?utm_source=linkedin&utm_medium=featured&utm_campaign=web-cv` | Triagem rápida de recrutadores e download de PDF por foco |
| **GitHub Profile / Bio** | `https://lagrotti.dev?utm_source=github&utm_medium=profile&utm_campaign=always-on` | Autoridade técnica e descoberta de estudos de caso |
| **Assinatura de E-mail / WhatsApp Business** | `https://lagrotti.dev/cartao?utm_source=signature&utm_medium=direct&utm_campaign=always-on` | Salvamento de vCard e retorno para `/trabalhe-comigo` |

---

## 4. Estrutura Enxuta de Tráfego Pago de Intenção Exata (Opcional — Google Ads Search)

Caso deseje combinar o tráfego orgânico com uma campanha passiva de baixo orçamento no Google Ads focada exclusivamente em **fundo de funil (intenção transacional exata)**, utilize a estrutura abaixo:

### Configurações da Campanha
- **Rede:** Apenas Rede de Pesquisa do Google (*desativar Rede de Display e Parceiros de Pesquisa*).
- **Correspondência de Palavras-Chave:** Apenas **Exata `[...]`** e **de Frase `"..."`** (nunca correspondência ampla).
- **Página de Destino:** `https://lagrotti.dev/trabalhe-comigo?utm_source=google&utm_medium=cpc&utm_campaign=search-high-intent`

### Grupo de Anúncios 1 — Desenvolvimento de Sistema Sob Medida (B2B)
- **Palavras-chave positivas:**
  - `[contratar programador]`
  - `[contratar desenvolvedor full stack]`
  - `[desenvolvedor de sistemas sob medida]`
  - `[programador para criar sistema]`
  - `[programador freelancer sênior]`
  - `"desenvolvimento de sistema web sob medida"`
  - `"programador node.js typescript sênior"`
- **Palavras-chave negativas obrigatórias (proteção de orçamento):**
  - `curso`, `faculdade`, `salário`, `estágio`, `júnior`, `grátis`, `gratuito`, `download`, `template`, `wordpress barato`, `wix`, `99freelas`, `workana`, `vaga júnior`, `como aprender a programar`.

### Copy do Anúncio Responsivo de Pesquisa (Alinhada ao `work-with-me.ts`)
- **Títulos:**
  1. `Programador e Eng. de Software Sênior`
  2. `Sistemas Sob Medida do Zero à Produção`
  3. `Mais de 10 Anos de Experiência Real`
  4. `Node.js, TypeScript, React e Python`
  5. `Escopo por Escrito e Entregas Curtas`
  6. `Arquitetura, Backend, Frontend e DevOps`
- **Descrições:**
  1. `Desenvolvimento de sistemas sob medida, SaaS multi-tenant e evolução de arquitetura em produção. Agende 30 min ou envie seu briefing.`
  2. `Mais de 10 anos entregando produtos críticos de ponta a ponta. Código documentado no seu repositório, testes e operação confiável.`

---

## 5. Monitoramento Passivo de Funil (`/analytics` e Relatório Semanal)

O relatório automatizado (`npm run traffic:report`, implementado em `src/lib/umami-report.ts` e `scripts/traffic-weekly-report.ts`) acompanha a saúde do funil sem exigir análise manual diária:

1. **Atração (Topo):** Visitas orgânicas em `/`, `/blog/*`, `/stack/*` e `/recursos/guias/*`.
2. **Consideração (Meio):** Leitura de estudos de caso (`/projetos/*`), uso de ferramentas interativas e visualização de `/trabalhe-comigo`.
3. **Conversão (Fundo):** Eventos `contact_click` (`calendly`, `whatsapp`, `linkedin`, `email`), `brief_submitted` (`BriefForm`) e `cv_download` (`full`, `backend`, `frontend`, `ai`).

