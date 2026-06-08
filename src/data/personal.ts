/**
 * @file personal.ts
 * @description Single source of truth for all personal/portfolio data.
 *
 * RULES:
 * - All visible text that has a pt/en version must use `LocalizedText`.
 * - Never hardcode data in components — always reference `personalData` here.
 * - Project images go in `/public/` and are referenced as `/filename.png`.
 * - The `order` field in experience/education is a numeric `YYYYMM` value
 *   (e.g. 202501 = Jan 2025) used to sort the timeline in descending order.
 */

/** The two supported locales for the portfolio. */
type LocaleKey = 'pt' | 'en';

/**
 * A piece of text that has a Brazilian Portuguese and an English version.
 * Used for all user-visible content that varies by language.
 */
type LocalizedText = Record<LocaleKey, string>;

/** A link associated with a project, with a localized label. */
interface ProjectLink {
  label: LocalizedText;
  url: string;
}

/** Represents a single project entry in the portfolio. */
interface ProjectEntry {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  /** Array of technology/library names (not localized). */
  techStack: string[];
  links: ProjectLink[];
  /** Project status badge, e.g. "Em produção" / "In production". */
  status: LocalizedText;
  /** Path to image in /public, or an absolute URL (e.g. GitHub OpenGraph). */
  image: string;
}

/** Represents a professional experience entry for the timeline. */
interface ExperienceEntry {
  company: string;
  position: LocalizedText;
  /** Human-readable period, e.g. "set 2023 - atual" / "Sep 2023 - present". */
  period: LocalizedText;
  description: LocalizedText;
  /**
   * Numeric sort key in YYYYMM format (e.g. 202501 = Jan 2025).
   * The Experience component sorts all entries descending by this value.
   */
  order: number;
}

/** Represents an education entry for the timeline. */
interface EducationEntry {
  degree: LocalizedText;
  institution: string;
  period: LocalizedText;
  description?: LocalizedText;
  /** See `ExperienceEntry.order` for conventions. */
  order: number;
}

export const personalData = {
  name: "Yago Lagrotti Bracco",
  headline: "Senior Backend Engineer",
  location: "São José do Rio Preto, São Paulo, Brazil",
  experienceYears: 10,
  summary: "Senior Backend Engineer with 10+ years of experience designing and building distributed, event-driven systems. Core stack: Node.js, TypeScript, PostgreSQL, Docker. I've led engineering teams, migrated production monoliths to Kafka-based event-driven architectures processing millions of events per day, and shipped multi-tenant SaaS products from zero to hundreds of customers — always with a focus on reliability, observability, and real-world scale.",
  skills: [
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "Docker",
    "NestJS",
    "Apache Kafka",
    "Golang",
    "Redis",
    "ClickHouse",
    "Event-Driven Architecture",
    "Microservices",
    "Clean Architecture",
    "DDD",
    "Next.js",
    "React",
    "Git"
  ],
  certifications: [
    "NLW Expert – Node.js",
    "NLW Expert – React",
    "Node.js do Zero à Maestria",
    "TypeScript do Básico ao Avançado (com React, Express)",
    "JavaScript Unit Testing – The Practical Guide"
  ],
  socialLinks: {
    github: "https://github.com/YagoLagrottiBracco",
    linkedin: "https://www.linkedin.com/in/yago-lagrotti-bracco/",
    email: "yago.lagrotti@outlook.com",
    whatsapp: "https://wa.me/5517997642678",
    domain: "lagrotti.dev"
  },
  experience: [
    {
      company: "Independent",
      position: {
        pt: "Engenheiro de Software Sênior — Backend & Sistemas Distribuídos",
        en: "Senior Backend Engineer — Distributed Systems",
      },
      period: {
        pt: "jan 2026 - presente",
        en: "Jan 2026 - present",
      },
      description: {
        pt: "Arquitetura e desenvolvimento de sistemas backend distribuídos. Liderando a migração do VMageste de monolito para arquitetura event-driven com Kafka e ClickHouse, processando ~3 milhões de eventos por dia. Construindo o PulseWatch (500+ clientes) e o Eurologado (100+ clientes) como engenheiro principal.",
        en: "Designing and building distributed backend systems. Leading VMageste's migration from monolith to event-driven architecture with Kafka and ClickHouse, processing ~3 million events per day. Building PulseWatch (500+ customers) and Eurologado (100+ customers) as sole engineer on each product.",
      },
      order: 202601,
    },
    {
      company: "TechWorkz Digital",
      position: {
        pt: "Líder Técnico & Co-fundador",
        en: "Engineering Lead & Co-founder",
      },
      period: {
        pt: "set 2023 - jan 2025",
        en: "Sep 2023 - Jan 2025",
      },
      description: {
        pt: "Definição de arquitetura técnica e liderança de equipes de engenharia na entrega de produtos SaaS para múltiplos clientes. Estabeleceu padrões de infraestrutura backend, implementou pipelines de CI/CD e guiou a adoção de microserviços e Clean Architecture.",
        en: "Defined technical architecture and led engineering teams delivering SaaS products for multiple clients. Established backend infrastructure standards, implemented CI/CD pipelines, and drove adoption of microservices and Clean Architecture patterns across squads.",
      },
      order: 202501,
    },
    {
      company: "Pulses",
      position: {
        pt: "Desenvolvedor Backend Sênior",
        en: "Senior Backend Developer",
      },
      period: {
        pt: "fev 2023 - ago 2023",
        en: "Feb 2023 - Aug 2023",
      },
      description: {
        pt: "Desenvolvimento e manutenção de APIs REST com Node.js (NestJS) e PHP (Slim). Automação de infraestrutura com Terraform e atuação em squads ágeis.",
        en: "Developed and maintained RESTful APIs using Node.js (NestJS) and PHP (Slim). Automated infrastructure with Terraform and collaborated in agile squads with sprints and retrospectives.",
      },
      order: 202308,
    },
    {
      company: "PixelPrime - Desenvolvimento Tecnológico",
      position: {
        pt: "Consultor Independente",
        en: "Independent Contractor",
      },
      period: {
        pt: "jul 2021 - fev 2023",
        en: "Jul 2021 - Feb 2023",
      },
      description: {
        pt: "Entrega de soluções sob medida para diferentes clientes, cobrindo todo o ciclo de desenvolvimento web com múltiplas stacks e integrações.",
        en: "Built custom solutions for clients across the full web development lifecycle, handling everything from API design to deployment across multiple stacks.",
      },
      order: 202302,
    },
    {
      company: "Bebidas Online",
      position: {
        pt: "Gerente de Desenvolvimento de Software",
        en: "Software Development Manager",
      },
      period: {
        pt: "fev 2022 - jul 2022",
        en: "Feb 2022 - Jul 2022",
      },
      description: {
        pt: "Liderança de equipe com cinco desenvolvedores, definição de arquiteturas escaláveis e implementação de fluxos ágeis voltados a performance e qualidade.",
        en: "Led a team of five developers, defined scalable architectures, and implemented agile workflows focused on performance and quality.",
      },
      order: 202207,
    },
    {
      company: "Freelancer",
      position: {
        pt: "Desenvolvedor Web",
        en: "Web Developer",
      },
      period: {
        pt: "ago 2015 - jun 2021",
        en: "Aug 2015 - Jun 2021",
      },
      description: {
        pt: "Criação de projetos web diversos, sempre alinhando expectativas de clientes, aprendizado contínuo e entrega de soluções confiáveis.",
        en: "Delivered a variety of web projects, balancing client expectations, continuous learning, and reliable delivery.",
      },
      order: 202106,
    },
    {
      company: "SorocabaCom",
      position: {
        pt: "Desenvolvedor Pleno",
        en: "Mid-level Developer",
      },
      period: {
        pt: "fev 2020 - set 2020",
        en: "Feb 2020 - Sep 2020",
      },
      description: {
        pt: "Atuação com Laravel e WordPress, apoiando também gestão de projetos e sucesso do cliente.",
        en: "Worked on Laravel and WordPress projects while supporting project management and client success efforts.",
      },
      order: 202009,
    },
    {
      company: "CompuSoftware",
      position: {
        pt: "Desenvolvedor Júnior",
        en: "Junior Developer",
      },
      period: {
        pt: "jun 2019 - jan 2020",
        en: "Jun 2019 - Jan 2020",
      },
      description: {
        pt: "Manutenção de sistemas legados e desenvolvimento de novas funcionalidades utilizando Delphi, PL/SQL e Oracle Apex.",
        en: "Maintained legacy systems and developed new features using Delphi, PL/SQL, and Oracle Apex.",
      },
      order: 202001,
    },
    {
      company: "web.art group",
      position: {
        pt: "Desenvolvedor Backend",
        en: "Backend Developer",
      },
      period: {
        pt: "fev 2018 - set 2018",
        en: "Feb 2018 - Sep 2018",
      },
      description: {
        pt: "Integração de novos clientes à plataforma interna da empresa utilizando PHP e MySQL.",
        en: "Integrated new clients into the company's internal PHP and MySQL platform.",
      },
      order: 201809,
    },
    {
      company: "Intersolid Software",
      position: {
        pt: "Estagiário de Desenvolvimento",
        en: "Software Development Intern",
      },
      period: {
        pt: "out 2016 - jul 2017",
        en: "Oct 2016 - Jul 2017",
      },
      description: {
        pt: "Evolução de sistemas internos com Delphi, C#, Firebird e SQLite, otimizando rotinas críticas.",
        en: "Improved internal systems using Delphi, C#, Firebird, and SQLite, optimizing critical routines.",
      },
      order: 201707,
    }
  ] as ExperienceEntry[],
  education: [
    {
      degree: {
        pt: "Mestrado em Ciência da Computação (PPGCC)",
        en: "Master's in Computer Science (PPGCC)",
      },
      institution: "Universidade Federal de São Carlos (UFSCar)",
      period: {
        pt: "Em andamento",
        en: "In progress",
      },
      description: {
        pt: "Pesquisa acadêmica em Ciência da Computação em uma das instituições federais mais prestigiadas do Brasil.",
        en: "Academic research in Computer Science at one of Brazil's most prestigious federal universities.",
      },
      order: 202602,
    },
    {
      degree: {
        pt: "Pós-graduação em Gerenciamento de Projetos",
        en: "Postgraduate in Project Management",
      },
      institution: "Senac Brasil",
      period: {
        pt: "2020 – 2022",
        en: "2020–2022",
      },
      order: 202202,
    },
    {
      degree: {
        pt: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
        en: "Bachelor's Degree in Systems Analysis and Development",
      },
      institution: "Fatec Fernando Amaral de Almeida Prado",
      period: {
        pt: "2015 – 2018",
        en: "2015–2018",
      },
      order: 201812,
    }
  ] as EducationEntry[],
  projects: [
    {
      id: "vmageste",
      title: {
        pt: "VMageste — Marketing Analytics SaaS",
        en: "VMageste — Marketing Analytics SaaS",
      },
      description: {
        pt: "Plataforma multi-tenant de analytics de marketing com arquitetura event-driven. Ingestão de ~3 milhões de eventos/dia via Kafka, armazenamento analítico em ClickHouse, processamento em Golang e API NestJS.",
        en: "Multi-tenant marketing analytics SaaS with event-driven architecture. Ingests ~3 million events/day via Kafka, analytics storage in ClickHouse, stream processing in Golang, NestJS API.",
      },
      techStack: ["Golang", "Apache Kafka", "ClickHouse", "NestJS", "PostgreSQL", "Docker", "DDD"],
      links: [
        {
          label: { pt: "Site", en: "Live" },
          url: "https://vmageste.com.br"
        }
      ],
      status: {
        pt: "Em desenvolvimento",
        en: "In development",
      },
      image: "/vmageste.png"
    },
    {
      id: "pulsewatch",
      title: {
        pt: "PulseWatch — Monitoramento de E-commerce",
        en: "PulseWatch — E-commerce Monitoring",
      },
      description: {
        pt: "SaaS multi-tenant de monitoramento de e-commerce com 500+ clientes. Workers de health-check configuráveis, motor de alertas por threshold e entrega multi-canal (email, SMS, Slack).",
        en: "Multi-tenant e-commerce monitoring SaaS with 500+ customers. Configurable health-check workers, threshold-based alerting engine, and multi-channel delivery (email, SMS, Slack).",
      },
      techStack: ["Node.js", "TypeScript", "PostgreSQL", "Docker"],
      links: [
        {
          label: { pt: "Site", en: "Live" },
          url: "https://pulsewatch.click"
        }
      ],
      status: {
        pt: "Em desenvolvimento",
        en: "In development",
      },
      image: "/pulsewatch.png"
    },
    {
      id: "eurologado",
      title: {
        pt: "Eurologado — Compliance de Cosméticos UE",
        en: "Eurologado — EU Cosmetics Compliance",
      },
      description: {
        pt: "SaaS para conformidade de cosméticos na Europa com 100+ clientes. Geração automática de dossiês PIF, validação de dados e dashboard para equipes de compliance.",
        en: "EU cosmetics compliance SaaS with 100+ customers. Automated PIF dossier generation, structured data validation, and compliance team dashboard.",
      },
      techStack: ["NestJS", "Next.js", "PostgreSQL", "LLM", "Docker"],
      links: [
        {
          label: { pt: "Site", en: "Live" },
          url: "https://pif.eurologado.eu"
        }
      ],
      status: {
        pt: "Em produção",
        en: "In production",
      },
      image: "/eurologado.png"
    },
    {
      id: "normify",
      title: {
        pt: "Normify",
        en: "Normify",
      },
      description: {
        pt: "Gestão de normas e conformidade com painéis e automações.",
        en: "Compliance and policy management with dashboards and automations.",
      },
      techStack: ["Vue.js", "Node.js", "PostgreSQL"],
      links: [
        {
          label: { pt: "Site", en: "Live" },
          url: "https://normify.app"
        }
      ],
      status: {
        pt: "MVP",
        en: "MVP",
      },
      image: "/normify.png"
    },
    {
      id: "agendify",
      title: {
        pt: "Agendify",
        en: "Agendify",
      },
      description: {
        pt: "Plataforma de agendamentos com notificações e gestão de clientes.",
        en: "Scheduling platform with notifications and client management.",
      },
      techStack: ["React", "Node.js", "MongoDB"],
      links: [
        {
          label: { pt: "Site", en: "Live" },
          url: "https://agendify.me"
        }
      ],
      status: {
        pt: "Em desenvolvimento",
        en: "In development",
      },
      image: "/agendify.png"
    },
    {
      id: "dreamerz",
      title: {
        pt: "Dreamerz",
        en: "Dreamerz",
      },
      description: {
        pt: "Plataforma para objetivos e métricas de vida com frontend Next.js e API NestJS.",
        en: "Platform for life goals and metrics with Next.js frontend and NestJS API.",
      },
      techStack: ["React", "Next.js", "Tailwind CSS", "Node.js", "NestJS", "PostgreSQL"],
      links: [
        {
          label: { pt: "Frontend", en: "Frontend" },
          url: "https://github.com/YagoLagrottiBracco/dreamerz-front"
        },
        {
          label: { pt: "API", en: "API" },
          url: "https://github.com/YagoLagrottiBracco/dreamerz-api"
        }
      ],
      status: {
        pt: "Em produção",
        en: "In production",
      },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/dreamerz-front"
    },
    {
      id: "andre",
      title: {
        pt: "Meu Mundo Mental",
        en: "My World Mental",
      },
      description: {
        pt: "Criador de formulários para avaliação de saúde mental seguindo o NR-1.",
        en: "Form builder for mental health assessment following the NR-1.",
      },
      techStack: ["NestJS", "TypeScript", "Prisma"],
      links: [
        {
          label: { pt: "Repositório", en: "Repository" },
          url: "https://github.com/YagoLagrottiBracco/andre"
        }
      ],
      status: {
        pt: "Prototipagem",
        en: "Prototyping",
      },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/andre"
    },
    {
      id: "techworkydigital-interno",
      title: {
        pt: "TechWorky Digital (Interno)",
        en: "TechWorky Digital (Internal)",
      },
      description: {
        pt: "Ferramentas internas para operação digital e automações.",
        en: "Internal tools for digital operations and automations.",
      },
      techStack: ["Laravel", "MySQL", "Vue.js"],
      links: [
        {
          label: { pt: "Repositório", en: "Repository" },
          url: "https://github.com/YagoLagrottiBracco/techworkydigital-interno"
        }
      ],
      status: {
        pt: "Em produção",
        en: "In production",
      },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/techworkydigital-interno"
    },
    {
      id: "minhas-financas",
      title: {
        pt: "Minhas Finanças",
        en: "My Finances",
      },
      description: {
        pt: "Controle financeiro pessoal com categorização e relatórios.",
        en: "Personal finance tracking with categorization and reports.",
      },
      techStack: ["React", "Node.js", "PostgreSQL"],
      links: [
        {
          label: { pt: "Site", en: "Live" },
          url: "https://minhas-financas-murex.vercel.app"
        }
      ],
      status: {
        pt: "Em produção",
        en: "In production",
      },
      image: "/minhas-financas.png"
    },
    {
      id: "congresso",
      title: {
        pt: "Congresso",
        en: "Congresso",
      },
      description: {
        pt: "Gestão de eventos e inscrições, com frontend para participantes e API para orquestração.",
        en: "Event and registration management with attendee frontend and orchestration API.",
      },
      techStack: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "PostgreSQL"],
      links: [
        {
          label: { pt: "Frontend", en: "Frontend" },
          url: "https://github.com/YagoLagrottiBracco/congresso-front"
        },
        {
          label: { pt: "API", en: "API" },
          url: "https://github.com/YagoLagrottiBracco/congresso-api"
        }
      ],
      status: {
        pt: "Estável",
        en: "Stable",
      },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/congresso-front"
    },
    {
      id: "tripsync",
      title: {
        pt: "TripSync",
        en: "TripSync",
      },
      description: {
        pt: "Plataforma colaborativa de roteiros de viagem com app mobile e backend sincronizado.",
        en: "Collaborative travel itinerary platform with mobile app and synced backend.",
      },
      techStack: ["React Native", "Expo", "TypeScript", "Node.js", "NestJS", "MongoDB"],
      links: [
        {
          label: { pt: "Mobile", en: "Mobile" },
          url: "https://github.com/YagoLagrottiBracco/tripsync-mobile"
        },
        {
          label: { pt: "Backend", en: "Backend" },
          url: "https://github.com/YagoLagrottiBracco/tripsync-backend"
        }
      ],
      status: {
        pt: "Em desenvolvimento",
        en: "In development",
      },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/tripsync-mobile"
    },
    {
      id: "templates-web-mobile",
      title: {
        pt: "Templates Web & Mobile",
        en: "Web & Mobile Templates",
      },
      description: {
        pt: "Bases prontas para web (React/Vite) e mobile (React Native) com navegação, temas e componentes iniciais.",
        en: "Starter templates for web (React/Vite) and mobile (React Native) with navigation, theming, and initial components.",
      },
      techStack: ["React", "TypeScript", "Vite", "React Native"],
      links: [
        {
          label: { pt: "Web", en: "Web" },
          url: "https://github.com/YagoLagrottiBracco/web"
        },
        {
          label: { pt: "Mobile", en: "Mobile" },
          url: "https://github.com/YagoLagrottiBracco/mobile"
        }
      ],
      status: {
        pt: "Template",
        en: "Template",
      },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/web"
    }
  ] as ProjectEntry[],
  featuredProjects: [
    {
      id: "vmageste",
      category: { pt: "Sistemas Distribuídos & Arquitetura", en: "Distributed Systems & Architecture" },
      title: { pt: "VMageste — Marketing Analytics SaaS de Alta Volumetria", en: "VMageste — High-Volume Marketing Analytics SaaS" },
      challenge: {
        pt: "Ingerir ~3 milhões de eventos diários das APIs do Meta, Google e TikTok em uma plataforma multi-tenant, mantendo a latência do banco OLTP sob controle e os dashboards em tempo real responsivos sem gargalos.",
        en: "Ingest ~3 million daily events from Meta, Google, and TikTok APIs into a multi-tenant platform while keeping OLTP latency under control and real-time dashboards responsive without bottlenecks."
      },
      solution: {
        pt: "Liderou a migração do monolito Node.js para uma arquitetura de microserviços orientada a eventos. Kafka desacopla ingestão do processamento; consumidores em Golang tratam os streams em escala; ClickHouse absorve as queries analíticas para que o PostgreSQL gerencie apenas dados transacionais. Padrão Strangler Fig para migração zero-downtime.",
        en: "Led the redesign from a Node.js monolith to an event-driven microservices architecture. Kafka decouples ingestion from processing; Golang consumers handle stream processing at scale; ClickHouse absorbs analytics queries so PostgreSQL handles only transactional workloads. Applied the Strangler Fig Pattern for zero-downtime migration."
      },
      metrics: ["~3M events/day", "Multi-tenant SaaS", "Kafka + ClickHouse", "Team leadership"],
      techStack: ["Golang", "Apache Kafka", "ClickHouse", "NestJS", "PostgreSQL", "Docker", "DDD"],
      image: "/vmageste.png",
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://vmageste.com.br" }]
    },
    {
      id: "pulsewatch",
      category: { pt: "Engenharia de Produto SaaS", en: "SaaS Product Engineering" },
      title: { pt: "PulseWatch — Plataforma de Monitoramento de E-commerce", en: "PulseWatch — E-commerce Monitoring Platform" },
      challenge: {
        pt: "Lojas de e-commerce perdem receita com falhas silenciosas — estoque zerado, erros de pagamento e downtime de APIs ficam horas sem serem detectados porque não há uma camada de observabilidade entre os eventos da loja e os donos do negócio.",
        en: "E-commerce stores silently lose revenue from stockouts, payment errors, and API outages that go undetected for hours — there's no observability layer between store events and business owners."
      },
      solution: {
        pt: "Construiu uma plataforma SaaS multi-tenant do zero como engenheiro único. Workers de health-check configuráveis, motor de alertas baseado em thresholds e pipeline de notificação multi-canal (email, SMS, Slack). API Node.js/TypeScript com PostgreSQL e dashboard em tempo real.",
        en: "Built a multi-tenant monitoring SaaS from scratch as sole engineer. Designed configurable health-check workers, a threshold-based alerting engine, and a multi-channel notification pipeline (email, SMS, Slack). Node.js/TypeScript API backed by PostgreSQL with a real-time dashboard."
      },
      metrics: ["500+ customers", "Node.js + TypeScript", "Multi-channel alerts"],
      techStack: ["Node.js", "TypeScript", "PostgreSQL", "Docker"],
      image: "/pulsewatch.png",
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://pulsewatch.click" }]
    },
    {
      id: "eurologado",
      category: { pt: "Engenharia de Produto Full-Stack", en: "Full-Stack Product Engineering" },
      title: { pt: "Eurologado — SaaS de Compliance para Cosméticos na UE", en: "Eurologado — EU Cosmetics Compliance SaaS" },
      challenge: {
        pt: "Marcas de cosméticos na UE precisam manter Arquivos de Informação do Produto (PIFs) para cada SKU — um processo complexo e sujeito a erros, historicamente gerenciado com planilhas e e-mails fragmentados.",
        en: "EU cosmetics brands must maintain Product Information Files (PIFs) for every SKU — a complex, error-prone process historically managed with spreadsheets and fragmented email chains."
      },
      solution: {
        pt: "Projetou e entregou o produto completo como engenheiro único: API NestJS com pipeline de geração automática de dossiês, criação de documentos assistida por IA, validação de dados estruturados e dashboard Next.js para equipes de compliance.",
        en: "Designed and shipped the entire product as sole engineer: a NestJS API with an automated dossier generation pipeline, AI-assisted document creation, structured data validation, and a Next.js dashboard for compliance teams."
      },
      metrics: ["100+ customers", "Sole engineer", "Full product ownership"],
      techStack: ["NestJS", "Next.js", "PostgreSQL", "LLM", "Docker"],
      image: "/eurologado.png",
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://pif.eurologado.eu" }]
    }
  ],
  specializations: [
    {
      category: { pt: "Arquitetura & Backend Escalável", en: "Architecture & Scalable Backend" },
      icon: "Server",
      courses: [
        "Domain-Driven Design (DDD) do Zero",
        "NestJS Microservices: Build & Deploy a Scalable Backend",
        "Docker Essentials",
      ],
    },
    {
      category: { pt: "Inteligência Artificial & Agentes", en: "Artificial Intelligence & Agents" },
      icon: "Brain",
      courses: [
        "Production AI Agents with JavaScript (LangChain, LangGraph)",
        "AI com Node.js, OpenAI, ChatGPT, LangChain & TypeScript",
        "Machine Learning in JavaScript with TensorFlow.js",
        "Deploy AI: Smarter LLMs, ML Ops & Cost Efficiency",
      ],
    },
    {
      category: { pt: "Frontend & Qualidade de Software", en: "Frontend & Software Quality" },
      icon: "Code2",
      courses: [
        "React.js & Next.js Completo (do Básico ao Avançado)",
        "JavaScript Unit Testing (The Practical Guide)",
        "Cypress End-to-End Testing",
        "UX Design Focus",
      ],
    },
  ],
};
