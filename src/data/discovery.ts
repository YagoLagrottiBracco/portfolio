import type { Locale } from "@/lib/i18n"

import type { DiscoverySlug } from "./discovery-slugs"

export { discoverySlugs, isDiscoverySlug, type DiscoverySlug } from "./discovery-slugs"

type LocalizedText = Record<Locale, string>

const tr = (pt: string, en: string, es: string): LocalizedText => ({ pt, en, es })

export const discoveryPages: Record<DiscoverySlug, { title: LocalizedText; description: LocalizedText }> = {
  links: {
    title: tr("Todos os caminhos", "Every path", "Todos los caminos"),
    description: tr(
      "Central de links, projetos, artigos e contatos de Yago Lagrotti Bracco — Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior.",
      "Central directory of links, projects, articles, and contacts for Yago Lagrotti Bracco — Senior Software Engineer, Full-Stack Developer, and Programmer.",
      "Directorio central de enlaces, proyectos, artículos y contactos de Yago Lagrotti Bracco — Programador, Desarrollador Full Stack e Ingeniero de Software Sénior."
    ),
  },
  blogroll: {
    title: tr("Blogs que vale a pena acompanhar", "Blogs worth following", "Blogs que vale la pena seguir"),
    description: tr(
      "Seleção editorial de fontes técnicas curada por Yago Lagrotti Bracco (Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior), com feed OPML para assinar.",
      "Editorial selection of technical sources curated by Yago Lagrotti Bracco (Senior Software Engineer, Full-Stack Developer, and Programmer), with an OPML feed to subscribe.",
      "Selección editorial de fuentes técnicas curada por Yago Lagrotti Bracco (Programador, Desarrollador Full Stack e Ingeniero de Software Sénior), con feed OPML para suscribirse."
    ),
  },
  radar: {
    title: tr("Radar de engenharia", "Engineering radar", "Radar de ingeniería"),
    description: tr(
      "Links externos comentados sobre arquitetura, produto e operação por Yago Lagrotti Bracco — Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior.",
      "Commented external links about architecture, product, and operations by Yago Lagrotti Bracco — Senior Software Engineer, Full-Stack Developer, and Programmer.",
      "Enlaces externos comentados sobre arquitectura, producto y operación por Yago Lagrotti Bracco — Programador, Desarrollador Full Stack e Ingeniero de Software Sénior."
    ),
  },
  leitura: {
    title: tr("Estante técnica", "Technical shelf", "Estantería técnica"),
    description: tr(
      "Referências fundamentais de engenharia de software, arquitetura e sistemas recomendadas por Yago Lagrotti Bracco.",
      "Foundational software engineering, architecture, and systems references recommended by Yago Lagrotti Bracco.",
      "Referencias fundamentales de ingeniería de software, arquitectura y sistemas recomendadas por Yago Lagrotti Bracco."
    ),
  },
  principios: {
    title: tr("Princípios de engenharia", "Engineering principles", "Principios de ingeniería"),
    description: tr(
      "Critérios práticos de arquitetura, desenvolvimento full stack, entrega e operação adotados por Yago Lagrotti Bracco.",
      "Practical architecture, full-stack development, delivery, and operations criteria practiced by Yago Lagrotti Bracco.",
      "Criterios prácticos de arquitectura, desarrollo full stack, entrega y operación practicados por Yago Lagrotti Bracco."
    ),
  },
  ia: {
    title: tr("Uso responsável de IA", "Responsible AI use", "Uso responsable de IA"),
    description: tr(
      "Política de limites, privacidade, revisão humana e transparência no uso de IA em engenharia de software por Yago Lagrotti Bracco.",
      "Policy on boundaries, privacy, human review, and transparency when using AI in software engineering by Yago Lagrotti Bracco.",
      "Política de límites, privacidad, revisión humana y transparencia en el uso de IA en ingeniería de software por Yago Lagrotti Bracco."
    ),
  },
  habilidades: {
    title: tr("Matriz de competências", "Skills matrix", "Matriz de competencias"),
    description: tr(
      "Matriz de competências de Yago Lagrotti Bracco (Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior), com evidências concretas em projetos, experiências e artigos.",
      "Skills matrix of Yago Lagrotti Bracco (Senior Software Engineer, Full-Stack Developer, and Programmer), pointing to concrete evidence across projects, experience, and articles.",
      "Matriz de competencias de Yago Lagrotti Bracco (Programador, Desarrollador Full Stack e Ingeniero de Software Sénior), con evidencias concretas en proyectos, experiencia y artículos."
    ),
  },
  status: {
    title: tr("Status dos projetos", "Project status", "Estado de los proyectos"),
    description: tr(
      "Verificação pública de disponibilidade dos sistemas e endereços em produção mantidos por Yago Lagrotti Bracco.",
      "Public availability checks for production systems and URLs maintained by Yago Lagrotti Bracco.",
      "Comprobación pública de disponibilidad de los sistemas y direcciones en producción mantenidos por Yago Lagrotti Bracco."
    ),
  },
  analytics: {
    title: tr("Audiência aberta", "Open audience", "Audiencia abierta"),
    description: tr(
      "Métricas agregadas e sem dados pessoais sobre o uso do portfólio de engenharia de Yago Lagrotti Bracco.",
      "Aggregated, personal-data-free metrics about usage of Yago Lagrotti Bracco's engineering portfolio.",
      "Métricas agregadas y sin datos personales sobre el uso del portafolio de ingeniería de Yago Lagrotti Bracco."
    ),
  },
  cartao: {
    title: tr("Cartão digital", "Digital card", "Tarjeta digital"),
    description: tr(
      "Cartão digital de Yago Lagrotti Bracco — Programador Sênior, Desenvolvedor Full Stack e Engenheiro de Software — com contatos essenciais, vCard e QR Code para salvar direto no celular.",
      "Digital card of Yago Lagrotti Bracco — Senior Software Engineer, Full-Stack Developer, and Programmer — with essential contacts, vCard, and QR Code to save directly on a phone.",
      "Tarjeta digital de Yago Lagrotti Bracco — Programador Sénior, Desarrollador Full Stack e Ingeniero de Software — con contactos esenciales, vCard y código QR para guardar directamente en el teléfono."
    ),
  },
  curriculo: {
    title: tr("Currículo na web", "Web résumé", "Currículum web"),
    description: tr(
      "Currículo web completo de Yago Lagrotti Bracco — Programador, Desenvolvedor Full Stack e Engenheiro de Software Sênior — em versão HTML acessível e indexável dos mesmos dados do PDF.",
      "Complete web résumé of Yago Lagrotti Bracco — Senior Software Engineer, Full-Stack Developer, and Programmer — in an accessible, indexable HTML version of the same data as the PDF.",
      "Currículum web completo de Yago Lagrotti Bracco — Programador, Desarrollador Full Stack e Ingeniero de Software Sénior — en versión HTML accesible e indexable de los mismos datos del PDF."
    ),
  },
  participar: {
    title: tr("Participe das próximas pautas", "Join the next topics", "Participa en los próximos temas"),
    description: tr(
      "Vote nos próximos temas técnicos de arquitetura, desenvolvimento full stack e engenharia de software no blog de Yago Lagrotti Bracco.",
      "Vote on upcoming technical topics across architecture, full-stack development, and software engineering on Yago Lagrotti Bracco's blog.",
      "Vota los próximos temas técnicos de arquitectura, desarrollo full stack e ingeniería de software en el blog de Yago Lagrotti Bracco."
    ),
  },
}

export const blogroll = [
  {
    name: "GitHub Engineering",
    url: "https://github.blog/engineering/",
    feedUrl: "https://github.blog/engineering/feed/",
    description: tr("Relatos práticos de sistemas e plataformas usados em grande escala.", "Practical stories about large-scale systems and platforms.", "Relatos prácticos sobre sistemas y plataformas a gran escala."),
  },
  {
    name: "AWS Builders' Library",
    url: "https://aws.amazon.com/builders-library/",
    description: tr("Artigos aprofundados sobre disponibilidade, filas, caches e operação.", "Deep articles on availability, queues, caches and operations.", "Artículos profundos sobre disponibilidad, colas, cachés y operación."),
  },
  {
    name: "Julia Evans",
    url: "https://jvns.ca/",
    feedUrl: "https://jvns.ca/atom.xml",
    description: tr("Explicações visuais e diretas sobre sistemas, redes e debugging.", "Direct visual explanations of systems, networking and debugging.", "Explicaciones visuales y directas sobre sistemas, redes y depuración."),
  },
  {
    name: "Addy Osmani",
    url: "https://addyosmani.com/",
    feedUrl: "https://addyosmani.com/rss.xml",
    description: tr("Engenharia de frontend, performance e liderança técnica.", "Frontend engineering, performance and technical leadership.", "Ingeniería frontend, rendimiento y liderazgo técnico."),
  },
  {
    name: "Dan Abramov",
    url: "https://overreacted.io/",
    feedUrl: "https://overreacted.io/rss.xml",
    description: tr("Ensaios profundos sobre React, abstrações e decisões de design.", "Deep essays on React, abstractions and design decisions.", "Ensayos profundos sobre React, abstracciones y decisiones de diseño."),
  },
] as const

export const radarEditions = [
  {
    edition: "01",
    date: "2026-10-17",
    title: tr("Fundamentos que sustentam sistemas distribuídos", "Fundamentals behind distributed systems", "Fundamentos que sostienen los sistemas distribuidos"),
    links: [
      {
        title: "The Amazon Builders' Library",
        url: "https://aws.amazon.com/builders-library/",
        note: tr("Coleção madura sobre idempotência, timeouts, caches e falhas parciais.", "A mature collection on idempotency, timeouts, caches and partial failure.", "Colección madura sobre idempotencia, timeouts, cachés y fallos parciales."),
      },
      {
        title: "How to do distributed locking",
        url: "https://martin.kleppmann.com/2016/02/08/how-to-do-distributed-locking.html",
        note: tr("Análise rigoroso dos limites e pressupostos de locks distribuídos.", "A rigorous analysis of the limits and assumptions behind distributed locks.", "Análisis riguroso de los límites y supuestos de los bloqueos distribuidos."),
      },
      {
        title: "JavaScript event loop",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
        note: tr("Referência essencial para entender concorrência no runtime do navegador.", "Essential reference for concurrency in the browser runtime.", "Referencia esencial para entender la concurrencia en el runtime del navegador."),
      },
      {
        title: "Webmentions",
        url: "https://indieweb.org/Webmention",
        note: tr("Padrão aberto para conectar respostas e menções entre sites independentes.", "Open standard for connecting replies and mentions across independent sites.", "Estándar abierto para conectar respuestas y menciones entre sitios independientes."),
      },
    ],
  },
] as const

export const readingShelf = [
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    note: tr("Base sólida para modelar consistência, particionamento, streams e trade-offs de sistemas reais.", "A solid base for modelling consistency, partitioning, streams and real-system trade-offs.", "Base sólida para modelar consistencia, partición, streams y compromisos de sistemas reales."),
  },
  {
    title: "Site Reliability Engineering",
    author: "Google",
    note: tr("Coleção aberta sobre confiabilidade, observabilidade, incidentes e operação de longo prazo.", "Open collection on reliability, observability, incidents and long-term operations.", "Colección abierta sobre fiabilidad, observabilidad, incidentes y operación a largo plazo."),
  },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas & Andrew Hunt",
    note: tr("Princípios práticos para manter código adaptável e feedback constante.", "Practical principles for keeping code adaptable and feedback loops short.", "Principios prácticos para mantener código adaptable y ciclos de retroalimentación cortos."),
  },
  {
    title: "Refactoring",
    author: "Martin Fowler",
    note: tr("Vocabulário estruturado para melhorar design sem alterar comportamento observável.", "Structured vocabulary for improving design without changing observable behaviour.", "Vocabulario estructurado para mejorar el diseño sin cambiar el comportamiento observable."),
  },
] as const

export const engineeringPrinciples = [
  {
    title: tr("Comece pelo problema", "Start from the problem", "Empieza por el problema"),
    body: tr(
      "Antes da stack, entenda restrições, risco de negócio e comportamento esperado. No Fiz Meu Site, isso significou escolher um gerador estático exportável em vez de criar um SaaS com banco e assinatura desnecessários.",
      "Before the stack, understand constraints, business risk and expected behaviour. In Fiz Meu Site, that meant choosing an exportable static generator instead of building a SaaS with an unnecessary database and recurring billing.",
      "Antes del stack, entiende restricciones, riesgo de negocio y comportamiento esperado. En Fiz Meu Site, eso significó elegir un generador estático exportable en lugar de crear un SaaS con base de datos y suscripción innecesarias."
    ),
  },
  {
    title: tr("Reduza estados compartilhados", "Reduce shared state", "Reduce el estado compartido"),
    body: tr(
      "Cada estado novo é uma fonte potencial de falha. Prefira fronteiras explícitas e dados auditáveis, como o isolamento multi-tenant via Row Level Security no PostgreSQL no portal Dupla Face e o cofre criptografado do EnvRune.",
      "Every new state is a potential failure source. Prefer explicit boundaries and auditable data, such as PostgreSQL Row Level Security tenant isolation in the Dupla Face portal and EnvRune's encrypted vault.",
      "Cada estado nuevo es una fuente potencial de fallo. Prefiere límites explícitos y datos auditables, como el aislamiento multi-tenant mediante Row Level Security en PostgreSQL en el portal Dupla Face y la bóveda cifrada de EnvRune."
    ),
  },
  {
    title: tr("Automatize o que se repete", "Automate what repeats", "Automatiza lo que se repite"),
    body: tr(
      "Testes, deploy, verificações de ambiente e rotinas manuais recorrentes devem virar ferramentas determinísticas — do planejamento seguro de ambiente no Setive aos pipelines de validação deste próprio portfólio.",
      "Tests, deploys, environment checks and recurring manual routines should become deterministic tools — from safe environment planning in Setive to the validation pipelines of this portfolio itself.",
      "Pruebas, despliegues, verificaciones de entorno y rutinas manuales recurrentes deben convertirse en herramientas deterministas — desde la planificación segura en Setive hasta los pipelines de validación de este mismo portafolio."
    ),
  },
  {
    title: tr("Opere o que construir", "Operate what you build", "Opera lo que construyes"),
    body: tr(
      "Logs, métricas, confirmação de alertas, filas de reprocessamento e recuperação fazem parte do produto desde o primeiro deploy, como nas 18 mil verificações por minuto do Pulsewatch e no pipeline Kafka + ClickHouse do VMageste.",
      "Logs, metrics, alert confirmation, retry queues and recovery are part of the product from the first deploy, as in Pulsewatch's 18,000 checks per minute and VMageste's Kafka + ClickHouse pipeline.",
      "Registros, métricas, confirmación de alertas, colas de reprocesamiento y recuperación forman parte del producto desde el primer despliegue, como en las 18 mil verificaciones por minuto de Pulsewatch y el pipeline Kafka + ClickHouse de VMageste."
    ),
  },
  {
    title: tr("Prefira simplicidade comprovada", "Prefer proven simplicity", "Prefiere la sencillez probada"),
    body: tr(
      "Complexidade exige justificativa operacional clara, não entusiasmo arquitetural. Comece com fronteiras bem definidas em um monólito modular (como no ImpressãoMais3D) e extraia serviços apenas quando escala ou isolamento exigirem.",
      "Complexity needs clear operational justification, not architectural enthusiasm. Start with clean boundaries in a modular monolith (as in ImpressãoMais3D) and extract services only when scale or isolation demands it.",
      "La complejidad necesita una justificación operativa clara, no entusiasmo arquitectónico. Empieza con límites claros en un monolito modular (como en ImpressãoMais3D) y extrae servicios solo cuando la escala o el aislamiento lo exijan."
    ),
  },
  {
    title: tr("Revisão humana permanece", "Human review remains", "La revisión humana permanece"),
    body: tr(
      "Agentes e LLMs aceleram rascunhos e automações, mas contratos de dados, segurança, contexto de negócio e responsabilidade final em produção continuam inegociavelmente humanos.",
      "Agents and LLMs speed up drafts and automation, but data contracts, security boundaries, business context and final production accountability remain non-negotiably human.",
      "Los agentes y LLMs aceleran borradores y automatizaciones, pero los contratos de datos, la seguridad, el contexto de negocio y la responsabilidad final en producción siguen siendo innegociablemente humanos."
    ),
  },
] as const

export const aiPolicy = [
  {
    title: tr("Privacidade antes da conveniência", "Privacy before convenience", "Privacidad antes que conveniencia"),
    body: tr("Dados pessoais, segredos, credenciais e código proprietário não devem ser enviados a ferramentas externas sem autorização explícita.", "Personal data, secrets, credentials and proprietary code must not be sent to external tools without explicit authorisation.", "Los datos personales, secretos, credenciales y código propietario no deben enviarse a herramientas externas sin autorización explícita."),
  },
  {
    title: tr("IA como assistente, não decisor", "AI as an assistant, not the decision maker", "IA como asistente, no decisor"),
    body: tr("Sugestões são verificadas por contexto, testes, fontes e revisão humana antes de entrarem em produção.", "Suggestions are checked against context, tests, sources and human review before entering production.", "Las sugerencias se verifican con contexto, pruebas, fuentes y revisión humana antes de entrar en producción."),
  },
  {
    title: tr("Transparência no uso", "Transparency in use", "Transparencia en el uso"),
    body: tr("Quando IA participa da criação de conteúdo ou código, isso deve ser revisado e sinalizado conforme o contexto do material.", "When AI participates in content or code creation, that use should be reviewed and disclosed according to the material's context.", "Cuando la IA participa en la creación de contenido o código, ese uso se revisa y se indica según el contexto del material."),
  },
  {
    title: tr("Segurança em todo fluxo", "Security across the workflow", "Seguridad en todo el flujo"),
    body: tr("Saídas de modelos são tratadas como entrada não confiável: validação, limites e revisão continuam obrigatórios.", "Model outputs are treated as untrusted input: validation, boundaries and review remain mandatory.", "Las salidas de los modelos se tratan como entradas no fiables: validación, límites y revisión siguen siendo obligatorios."),
  },
] as const

export const topicProposals = [
  {
    id: "agentes-producao",
    title: tr("Agentes de IA em produção", "AI agents in production", "Agentes de IA en producción"),
    description: tr("Limites, segurança, observabilidade e rollback para sistemas com ferramentas autônomas.", "Boundaries, security, observability and rollback for systems with autonomous tools.", "Límites, seguridad, observabilidad y rollback para sistemas con herramientas autónomas."),
  },
  {
    id: "streaming-dados",
    title: tr("Kafka, ClickHouse e métricas em escala", "Kafka, ClickHouse and metrics at scale", "Kafka, ClickHouse y métricas a escala"),
    description: tr("Padrões de ingestão, agregação e consulta usados em sistemas orientados a eventos.", "Ingestion, aggregation and query patterns used in event-driven systems.", "Patrones de ingesta, agregación y consulta usados en sistemas orientados a eventos."),
  },
  {
    id: "monolitos-modulares",
    title: tr("Monólitos modulares", "Modular monoliths", "Monolitos modulares"),
    description: tr("Como impor fronteiras internas sem pagar o custo operacional prematuro de microserviços.", "How to enforce internal boundaries without paying the premature operational cost of microservices.", "Cómo imponer límites internos sin pagar el coste operativo prematuro de los microservicios."),
  },
  {
    id: "observabilidade",
    title: tr("Observabilidade para times pequenos", "Observability for small teams", "Observabilidad para equipos pequeños"),
    description: tr("Métricas, logs e alertas úteis sem construir uma plataforma corporativa.", "Useful metrics, logs and alerts without building a corporate platform.", "Métricas, registros y alertas útiles sin construir una plataforma corporativa."),
  },
] as const

export const articlePoll = {
  id: "engenharia-2026",
  options: [
    { id: "agentes", label: tr("Agentes e ferramentas de IA", "Agents and AI tools", "Agentes y herramientas de IA") },
    { id: "arquitetura", label: tr("Arquitetura orientada a eventos", "Event-driven architecture", "Arquitectura orientada a eventos") },
    { id: "produto", label: tr("Produto de ponta a ponta", "End-to-end product", "Producto de principio a fin") },
    { id: "operacao", label: tr("Operação e confiabilidade", "Operations and reliability", "Operación y fiabilidad") },
  ],
} as const

export const channelLabels = {
  whatsapp: tr("Canal no WhatsApp", "WhatsApp channel", "Canal de WhatsApp"),
  telegram: tr("Canal no Telegram", "Telegram channel", "Canal de Telegram"),
  follow: tr("Acompanhar publicações", "Follow publications", "Seguir publicaciones"),
}
