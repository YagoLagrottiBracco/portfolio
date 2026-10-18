/**
 * @file screening.ts
 * @description The questions every recruiter asks before the first call,
 * answered on `/trabalhe-comigo#triagem`. Answers restate what the site already
 * says (contact section, summary, experience). The ones only Yago can give —
 * contract model, salary, English level, relocation — start as `null` and stay
 * hidden until filled in.
 */
import type { Locale } from "@/lib/i18n"

type LocalizedText = Record<Locale, string>

export interface ScreeningAnswer {
  id: string
  question: LocalizedText
  /** `null` hides the question until there is a real answer. */
  answer: LocalizedText | null
}

export const screening: ScreeningAnswer[] = [
  {
    id: "location",
    question: { pt: "Onde você está e em que fuso?", en: "Where are you based, and in which time zone?", es: "¿Dónde vives y en qué huso horario?" },
    answer: { pt: "Embu-Guaçu, São Paulo, Brasil. UTC-3, sem horário de verão.", en: "Embu-Guaçu, São Paulo, Brazil. UTC-3, no daylight saving time.", es: "Embu-Guaçu, São Paulo, Brasil. UTC-3, sin horario de verano." },
  },
  {
    id: "remote",
    question: { pt: "Trabalha remoto?", en: "Do you work remotely?", es: "¿Trabajas en remoto?" },
    answer: {
      pt: "Sim, procuro vagas remotas e projetos sob medida como Programador Sênior, Desenvolvedor Full Stack e Engenheiro de Software.",
      en: "Yes, I am looking for remote roles and custom projects as a Senior Software Engineer, Full-Stack Developer, and Programmer.",
      es: "Sí, busco puestos remotos y proyectos a medida como Programador Sénior, Desarrollador Full Stack e Ingeniero de Software.",
    },
  },
  {
    id: "seniority",
    question: { pt: "Qual a sua senioridade?", en: "What is your seniority?", es: "¿Cuál es tu seniority?" },
    answer: {
      pt: "Programador Sênior, Desenvolvedor Full Stack e Engenheiro de Software Sênior, com mais de 10 anos desenvolvendo produtos de ponta a ponta.",
      en: "Senior Software Engineer, Full-Stack Developer, and Programmer, with more than 10 years building products end to end.",
      es: "Programador sénior, desarrollador full stack e ingeniero de software sénior, con más de 10 años desarrollando productos de punta a punta.",
    },
  },
  {
    id: "leadership",
    question: { pt: "Já liderou times?", en: "Have you led teams?", es: "¿Has liderado equipos?" },
    answer: { pt: "Sim: fui CTO e fundador da TechWorkz.Digital (2023–2026) e gerente de desenvolvimento na Bebidas Online, liderando cinco desenvolvedores.", en: "Yes: I was CTO and founder of TechWorkz.Digital (2023–2026) and Software Development Manager at Bebidas Online, leading five developers.", es: "Sí: fui director de tecnología y fundador de TechWorkz.Digital (2023–2026) y gerente de desarrollo en Bebidas Online, al frente de cinco desarrolladores." },
  },
  {
    id: "stack",
    question: { pt: "Qual é a sua stack principal?", en: "What is your main stack?", es: "¿Cuál es tu stack principal?" },
    answer: { pt: "Node.js e TypeScript no backend, React e Next.js no frontend, PostgreSQL, além de Python (Django, FastAPI), Laravel, Kafka, Docker e Terraform.", en: "Node.js and TypeScript on the backend, React and Next.js on the frontend, PostgreSQL, plus Python (Django, FastAPI), Laravel, Kafka, Docker and Terraform.", es: "Node.js y TypeScript en el backend, React y Next.js en el frontend, PostgreSQL, además de Python (Django, FastAPI), Laravel, Kafka, Docker y Terraform." },
  },
  {
    id: "languages",
    question: { pt: "Em que idiomas trabalha?", en: "Which languages do you work in?", es: "¿En qué idiomas trabajas?" },
    answer: { pt: "Português, inglês e espanhol.", en: "Portuguese, English and Spanish.", es: "Portugués, inglés y español." },
  },
  {
    id: "custom-project",
    question: {
      pt: "Como funciona a contratação para desenvolver um sistema sob medida ou produto do zero?",
      en: "How does hiring work for building custom software or a product from scratch?",
      es: "¿Cómo funciona la contratación para desarrollar un sistema a medida o un producto desde cero?",
    },
    answer: {
      pt: "Começamos por uma conversa de 30 minutos e um escopo por escrito (o que entra, o que fica de fora e os critérios de aceite). Trabalho da arquitetura e modelagem de dados ao frontend, backend, pagamentos, infraestrutura e deploy em produção, com entregas curtas para acompanhamento contínuo.",
      en: "We start with a 30-minute call and a written scope (what is in, what is out, and the acceptance criteria). I handle everything from architecture and data modeling to frontend, backend, payments, infrastructure, and production deployment, in short iterations you can follow closely.",
      es: "Empezamos con una llamada de 30 minutos y un alcance por escrito (qué entra, qué queda fuera y los criterios de aceptación). Trabajo desde la arquitectura y el modelado de datos hasta el frontend, backend, pagos, infraestructura y despliegue en producción, con entregas cortas para un seguimiento continuo.",
    },
  },
  {
    id: "legacy-and-scale",
    question: {
      pt: "Você assume sistemas em produção com gargalos de performance, código legado ou migração de arquitetura?",
      en: "Do you take on production systems with performance bottlenecks, legacy code, or architecture migration?",
      es: "¿Asumes sistemas en producción con cuellos de botella de rendimiento, código legado o migración de arquitectura?",
    },
    answer: {
      pt: "Sim. Já conduzi a transição de monolitos para arquiteturas orientadas a eventos com Kafka e ClickHouse (~3 milhões de eventos/dia no VMageste), isolamento multi-tenant com Row Level Security no PostgreSQL (Dupla Face) e monitoramento de alta frequência (18 mil verificações/minuto no Pulsewatch) sem interromper a operação.",
      en: "Yes. I have led transitions from monoliths to event-driven architectures with Kafka and ClickHouse (~3 million events/day in VMageste), multi-tenant isolation with PostgreSQL Row Level Security (Dupla Face), and high-frequency monitoring (18,000 checks/minute in Pulsewatch) without stopping production.",
      es: "Sí. He liderado la transición de monolitos a arquitecturas orientadas a eventos con Kafka y ClickHouse (~3 millones de eventos/día en VMageste), aislamiento multi-tenant con Row Level Security en PostgreSQL (Dupla Face) y monitoreo de alta frecuencia (18 mil verificaciones/minuto en Pulsewatch) sin detener la operación.",
    },
  },
  {
    id: "delivery-and-handoff",
    question: {
      pt: "Como acompanho o andamento das entregas e como o código fica documentado para o time?",
      en: "How do I track delivery progress and how is the codebase documented for the team?",
      es: "¿Cómo sigo el avance de las entregas y cómo queda documentado el código para el equipo?",
    },
    answer: {
      pt: "O código nasce no repositório do projeto com testes automatizados, CI/CD, decisões de arquitetura registradas (ADRs), diagramas e instruções claras de execução e operação, garantindo autonomia total para a sua equipe evoluir o sistema.",
      en: "Code lives in your repository from day one with automated tests, CI/CD, recorded architectural decisions (ADRs), diagrams, and clear runbooks, ensuring your team has full autonomy to operate and evolve the system.",
      es: "El código nace en el repositorio del proyecto con pruebas automatizadas, CI/CD, decisiones de arquitectura registradas (ADRs), diagramas e instrucciones claras de ejecución y operación, garantizando autonomía total para que tu equipo evolucione el sistema.",
    },
  },
  {
    id: "first-step",
    question: {
      pt: "Qual é o primeiro passo para avaliar uma vaga sênior ou orçar um projeto sob medida?",
      en: "What is the first step to discuss a senior role or scope a custom project?",
      es: "¿Cuál es el primer paso para evaluar un puesto sénior o presupuestar un proyecto a medida?",
    },
    answer: {
      pt: "Você pode agendar direto pelo Calendly nesta página, chamar no WhatsApp ou LinkedIn, ou enviar o contexto pelo formulário abaixo. Respondo pessoalmente em português, inglês ou espanhol.",
      en: "You can book a time directly on Calendly on this page, reach out on WhatsApp or LinkedIn, or send the context through the brief form below. I reply personally in Portuguese, English, or Spanish.",
      es: "Puedes agendar directamente en Calendly en esta página, escribir por WhatsApp o LinkedIn, o enviar el contexto en el formulario de abajo. Respondo personalmente en portugués, inglés o español.",
    },
  },
  {
    id: "contract",
    question: { pt: "Qual modelo de contratação você aceita?", en: "Which contract models do you accept?", es: "¿Qué modelo de contratación aceptas?" },
    answer: null,
  },
  {
    id: "salary",
    question: { pt: "Qual a sua pretensão salarial?", en: "What are your salary expectations?", es: "¿Cuál es tu expectativa salarial?" },
    answer: null,
  },
  {
    id: "english-level",
    question: { pt: "Qual o seu nível de inglês?", en: "What is your English level?", es: "¿Cuál es tu nivel de inglés?" },
    answer: null,
  },
  {
    id: "relocation",
    question: { pt: "Aceita mudança de cidade ou viagens?", en: "Would you relocate or travel?", es: "¿Aceptas mudarte o viajar?" },
    answer: null,
  },
]

export const screeningCopy: Record<Locale, { title: string; intro: string; start: string }> = {
  pt: { title: "Respostas rápidas para recrutadores", intro: "O que recrutadores, lideranças técnicas e empresas costumam perguntar antes da primeira conversa.", start: "Quando pode começar?" },
  en: { title: "Quick answers for recruiters", intro: "What recruiters, engineering leaders, and companies usually ask before the first call.", start: "When can you start?" },
  es: { title: "Respuestas rápidas para reclutadores", intro: "Lo que reclutadores, líderes técnicos y empresas suelen preguntar antes de la primera conversación.", start: "¿Cuándo puedes empezar?" },
}
