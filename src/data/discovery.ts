import type { Locale } from "@/lib/i18n"

type LocalizedText = Record<Locale, string>

const tr = (pt: string, en: string, es: string): LocalizedText => ({ pt, en, es })

export const discoverySlugs = [
  "links",
  "blogroll",
  "radar",
  "leitura",
  "principios",
  "ia",
  "habilidades",
  "status",
  "analytics",
  "cartao",
  "curriculo",
  "participar",
] as const

export type DiscoverySlug = (typeof discoverySlugs)[number]

export function isDiscoverySlug(value: string): value is DiscoverySlug {
  return discoverySlugs.some(slug => slug === value)
}

export const discoveryPages: Record<DiscoverySlug, { title: LocalizedText; description: LocalizedText }> = {
  links: {
    title: tr("Todos os caminhos", "Every path", "Todos los caminos"),
    description: tr("Um endereço enxuto para perfis, conteúdo e projetos.", "One lean address for profiles, content and projects.", "Una dirección breve para perfiles, contenidos y proyectos."),
  },
  blogroll: {
    title: tr("Blogs que vale a pena acompanhar", "Blogs worth following", "Blogs que vale la pena seguir"),
    description: tr("Uma seleção editorial de fontes técnicas consistentes, com feed OPML para assinar.", "An editorial selection of consistent technical sources, with an OPML feed to subscribe.", "Una selección editorial de fuentes técnicas consistentes, con feed OPML para suscribirse."),
  },
  radar: {
    title: tr("Radar de engenharia", "Engineering radar", "Radar de ingeniería"),
    description: tr("Links externos comentados sobre arquitetura, produto e operação.", "Commented external links about architecture, product and operations.", "Enlaces externos comentados sobre arquitectura, producto y operación."),
  },
  leitura: {
    title: tr("Estante técnica", "Technical shelf", "Estantería técnica"),
    description: tr("Referências fundamentais e por que consultá-las.", "Foundational references and why they are worth consulting.", "Referencias fundamentales y por qué consultarlas."),
  },
  principios: {
    title: tr("Princípios de engenharia", "Engineering principles", "Principios de ingeniería"),
    description: tr("Critérios práticos que orientam decisões de arquitetura, entrega e operação.", "Practical criteria guiding architecture, delivery and operations decisions.", "Criterios prácticos que orientan decisiones de arquitectura, entrega y operación."),
  },
  ia: {
    title: tr("Uso responsável de IA", "Responsible AI use", "Uso responsable de IA"),
    description: tr("Limites, privacidade, revisão humana e transparência no uso de ferramentas de IA.", "Boundaries, privacy, human review and transparency when using AI tools.", "Límites, privacidad, revisión humana y transparencia en el uso de herramientas de IA."),
  },
  habilidades: {
    title: tr("Matriz de competências", "Skills matrix", "Matriz de competencias"),
    description: tr("Cada competência aponta para evidências concretas em projetos, experiências e artigos.", "Every skill points to concrete evidence across projects, experience and articles.", "Cada competencia apunta a evidencias concretas en proyectos, experiencia y artículos."),
  },
  status: {
    title: tr("Status dos projetos", "Project status", "Estado de los proyectos"),
    description: tr("Verificação pontual e pública de disponibilidade dos endereços em produção.", "Public point-in-time availability checks for production URLs.", "Comprobación pública y puntual de disponibilidad de las direcciones en producción."),
  },
  analytics: {
    title: tr("Audiência aberta", "Open audience", "Audiencia abierta"),
    description: tr("Métricas agregadas e sem dados pessoais sobre o uso do site.", "Aggregated, personal-data-free metrics about site usage.", "Métricas agregadas y sin datos personales sobre el uso del sitio."),
  },
  cartao: {
    title: tr("Cartão digital", "Digital card", "Tarjeta digital"),
    description: tr("Contatos essenciais, vCard e QR Code para salvar direto no celular.", "Essential contacts, vCard and QR Code to save directly on a phone.", "Contactos esenciales, vCard y código QR para guardar directamente en el teléfono."),
  },
  curriculo: {
    title: tr("Currículo na web", "Web résumé", "Currículum web"),
    description: tr("Versão HTML acessível e indexável dos mesmos dados do PDF.", "Accessible, indexable HTML version of the same data as the PDF.", "Versión HTML accesible e indexable de los mismos datos del PDF."),
  },
  participar: {
    title: tr("Participe das próximas pautas", "Join the next topics", "Participa en los próximos temas"),
    description: tr("Vote em temas técnicos e acompanhe resultados agregados.", "Vote on technical topics and follow aggregated results.", "Vota temas técnicos y sigue los resultados agregados."),
  },
}

export const blogroll = [
  {
    name: "GitHub Engineering",
    url: "https://github.blog/engineering/",
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
    description: tr("Explicações visuais e diretas sobre sistemas, redes e debugging.", "Direct visual explanations of systems, networking and debugging.", "Explicaciones visuales y directas sobre sistemas, redes y depuración."),
  },
  {
    name: "Addy Osmani",
    url: "https://addyosmani.com/",
    description: tr("Engenharia de frontend, performance e liderança técnica.", "Frontend engineering, performance and technical leadership.", "Ingeniería frontend, rendimiento y liderazgo técnico."),
  },
  {
    name: "Dan Abramov",
    url: "https://overreacted.io/",
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
    body: tr("Antes da stack, entenda restrições, risco de negócio e comportamento esperado.", "Before the stack, understand constraints, business risk and expected behaviour.", "Antes del stack, entiende restricciones, riesgo de negocio y comportamiento esperado."),
  },
  {
    title: tr("Reduza estados compartilhados", "Reduce shared state", "Reduce el estado compartido"),
    body: tr("Cada estado novo é uma fonte potencial de falha. Prefira fronteiras explícitas e dados auditáveis.", "Every new state is a potential failure source. Prefer explicit boundaries and auditable data.", "Cada estado nuevo es una fuente potencial de fallo. Prefiere límites explícitos y datos auditables."),
  },
  {
    title: tr("Automatize o que se repete", "Automate what repeats", "Automatiza lo que se repite"),
    body: tr("Testes, deploy, verificações e rotinas manuais recorrentes devem virar ferramentas.", "Tests, deploys, checks and recurring manual routines should become tools.", "Pruebas, despliegues, verificaciones y rutinas manuales recurrentes deben convertirse en herramientas."),
  },
  {
    title: tr("Opere o que construir", "Operate what you build", "Opera lo que construyes"),
    body: tr("Logs, métricas, alertas e recuperação fazem parte do produto, não de uma fase posterior.", "Logs, metrics, alerts and recovery are part of the product, not a later phase.", "Registros, métricas, alertas y recuperación son parte del producto, no una fase posterior."),
  },
  {
    title: tr("Prefira simplicidade comprovada", "Prefer proven simplicity", "Prefiere la sencillez probada"),
    body: tr("Complexidade precisa de justificativa operacional clara, não de entusiasmo arquitetural.", "Complexity needs clear operational justification, not architectural enthusiasm.", "La complejidad necesita una justificación operativa clara, no entusiasmo arquitectónico."),
  },
  {
    title: tr("Revisão humana permanece", "Human review remains", "La revisión humana permanece"),
    body: tr("Ferramentas aceleram decisões, mas responsabilidade, contexto e julgamento continuam humanos.", "Tools speed up decisions, but responsibility, context and judgement remain human.", "Las herramientas aceleran decisiones, pero la responsabilidad, el contexto y el criterio siguen siendo humanos."),
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
