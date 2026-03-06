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
  headline: "Engenheiro de Software Sênior & Arquiteto de IA",
  location: "São José do Rio Preto, São Paulo, Brazil",
  experienceYears: 10,
  summary: "Minha jornada na engenharia de software passou por diversas fases, desde a criação de interfaces modernas até o desenho de infraestruturas pesadas. Atualmente, meu foco é resolver problemas que exigem alta disponibilidade e processamento assíncrono, unindo as melhores práticas de Clean Architecture e DDD com o poder disruptivo da Inteligência Artificial.",
  skills: [
    "TypeScript",
    "Next.js",
    "NestJS",
    "Golang",
    "Apache Kafka",
    "ClickHouse",
    "Docker",
    "Node.js",
    "React",
    "Clean Architecture",
    "DDD",
    "Event-Driven Architecture",
    "LLM / AI Agents",
    "PostgreSQL",
    "Redis",
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
      company: "Independente",
      position: {
        pt: "Engenheiro de Software Sênior & Desenvolvedor de IA",
        en: "Senior Software Engineer & AI Developer",
      },
      period: {
        pt: "jan 2026 - presente",
        en: "Jan 2026 - present",
      },
      description: {
        pt: "Atuação estratégica no desenvolvimento de produtos autônomos, ferramentas baseadas em Inteligência Artificial Generativa e automação avançada de fluxos de trabalho corporativos. Arquiteto criador do DevAgent (sistema autônomo de engenharia de software).",
        en: "Strategic work developing autonomous products, Generative AI-powered tools, and advanced corporate workflow automation. Architect and creator of DevAgent (autonomous software engineering system).",
      },
      order: 202601,
    },
    {
      company: "TechWorkz.Digital",
      position: {
        pt: "CTO e Founder",
        en: "CTO & Founder",
      },
      period: {
        pt: "set 2023 - jan 2025",
        en: "Sep 2023 - Jan 2025",
      },
      description: {
        pt: "Liderança técnica, definição de arquitetura, entrega ponta a ponta de soluções digitais e gestão de produto para clientes da TechWorkz.Digital.",
        en: "Technical leadership, architecture definition, end-to-end delivery of digital solutions, and product management for TechWorkz.Digital clients.",
      },
      order: 202501,
    },
    {
      company: "Pulses",
      position: {
        pt: "Desenvolvedor Fullstack Sênior",
        en: "Senior Fullstack Developer",
      },
      period: {
        pt: "fev 2023 - ago 2023",
        en: "Feb 2023 - Aug 2023",
      },
      description: {
        pt: "Desenvolvimento e manutenção de APIs REST com Node.js (NestJS) e PHP (Slim), além de contribuições em frontend Vue.js com foco em UX. Automação de infraestrutura com Terraform e atuação em squads ágeis com sprints e retrospectivas.",
        en: "Developed and maintained RESTful APIs using Node.js (NestJS) and PHP (Slim). Contributed to the Vue.js frontend to enhance UX and ship new features. Automated infrastructure with Terraform and collaborated in agile squads with sprints, reviews, and retrospectives.",
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
        en: "Worked as a freelance developer building custom solutions for companies, covering the full web development lifecycle across multiple stacks and integrations.",
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
        en: "Delivered a variety of freelance web projects, balancing client expectations, continuous learning, and reliable delivery.",
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
        pt: "Pesquisa acadêmica de alto nível em Ciência da Computação em uma das instituições federais mais prestigiadas do Brasil, unindo o rigor científico à aplicação prática no desenvolvimento de software e Inteligência Artificial.",
        en: "High-level academic research in Computer Science at one of Brazil's most prestigious federal institutions, bridging scientific rigor with practical application in software engineering and Artificial Intelligence.",
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
      id: "eurologado",
      title: {
        pt: "Eurologado (Compliance AI)",
        en: "Eurologado (Compliance AI)",
      },
      description: {
        pt: "Sistema completo para conformidade de cosméticos na Europa, gerando automaticamente dossiês, detectando inconformidades e usando IA para criação de documentos.",
        en: "End-to-end compliance system for EU cosmetics, auto-generating dossiers, detecting issues, and using AI for document creation.",
      },
      techStack: ["Next.js", "NestJS", "PostgreSQL", "LLM"],
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
      id: "pulsewatch",
      title: {
        pt: "PulseWatch",
        en: "PulseWatch",
      },
      description: {
        pt: "Monitor de e-commerce com alertas imediatos sobre queda de vendas, estoque zerado e erros críticos que tiram a loja do ar.",
        en: "Ecommerce monitor with instant alerts for sales drop-offs, stockouts, and critical errors taking the store down.",
      },
      techStack: ["Node.js", "TypeScript", "PostgreSQL"],
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
      id: "vmageste",
      title: {
        pt: "vmageste",
        en: "vmageste",
      },
      description: {
        pt: "Plataforma integrada de gestão e automação de marketing que centraliza campanhas, leads e analytics em um único painel. Conecta fontes de tráfego, organiza dados em dashboards, enriquece e deduplica leads, e envia alertas e relatórios para decisões rápidas.",
        en: "Integrated marketing management and automation platform centralizing campaigns, leads, and analytics in one dashboard. Connects traffic sources, organizes data into performance dashboards, enriches and deduplicates leads, and provides alerts and reports for quick decisions.",
      },
      techStack: ["Next.js", "NestJS", "Redis", "RabbitMQ", "PostgreSQL"],
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
      category: { pt: "Sistemas & Arquitetura", en: "Systems & Architecture" },
      title: { pt: "vmageste — Plataforma de Marketing Analytics SaaS", en: "vmageste — Marketing Analytics SaaS Platform" },
      challenge: {
        pt: "Ingestão massiva de dados de múltiplas plataformas (Meta, Google, TikTok) e cálculos em tempo real sem gargalar o banco de dados.",
        en: "Massive data ingestion from multiple platforms (Meta, Google, TikTok) and real-time calculations without bottlenecking the database."
      },
      solution: {
        pt: "Redesenho arquitetural (Padrão Strangler Fig) migrando de um monolito para uma Arquitetura Orientada a Eventos.",
        en: "Architectural redesign (Strangler Fig Pattern) migrating from a monolith to an Event-Driven Architecture."
      },
      techStack: ["Golang", "Apache Kafka", "NestJS", "ClickHouse", "Clean Architecture", "DDD"],
      image: "/vmageste.png",
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://vmageste.com.br" }]
    },
    {
      id: "pulsewatch",
      category: { pt: "Sistemas & Arquitetura", en: "Systems & Architecture" },
      title: { pt: "PulseWatch — Monitor de E-commerce", en: "PulseWatch — E-commerce Monitor" },
      challenge: {
        pt: "Lojas online perdem receita silenciosamente por quedas de vendas, estoque zerado e erros críticos que passam despercebidos por horas.",
        en: "Online stores silently lose revenue from sales drop-offs, stockouts, and critical errors that go unnoticed for hours."
      },
      solution: {
        pt: "SaaS de monitoramento contínuo com alertas imediatos via múltiplos canais, permitindo intervenção antes que o impacto financeiro escale.",
        en: "Continuous monitoring SaaS with instant multi-channel alerts, enabling intervention before financial impact escalates."
      },
      techStack: ["Node.js", "TypeScript", "PostgreSQL"],
      image: "/pulsewatch.png",
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://pulsewatch.click" }]
    },
    {
      id: "normify",
      category: { pt: "Sistemas & Arquitetura", en: "Systems & Architecture" },
      title: { pt: "Normify — Gestão de Conformidade", en: "Normify — Compliance Management" },
      challenge: {
        pt: "Equipes de compliance gerenciam normas em planilhas e e-mails, sem visibilidade centralizada do status de conformidade.",
        en: "Compliance teams manage norms in spreadsheets and emails, with no centralized view of compliance status."
      },
      solution: {
        pt: "Plataforma MVP com painéis de conformidade, automações de alertas e rastreamento de normas, reduzindo o risco regulatório.",
        en: "MVP platform with compliance dashboards, alert automations, and norm tracking that reduces regulatory risk."
      },
      techStack: ["Vue.js", "Node.js", "PostgreSQL"],
      image: "/normify.png",
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://normify.app" }]
    },
    {
      id: "agendify",
      category: { pt: "Sistemas & Arquitetura", en: "Systems & Architecture" },
      title: { pt: "Agendify — Plataforma de Agendamentos", en: "Agendify — Scheduling Platform" },
      challenge: {
        pt: "Pequenas empresas gerenciam agendamentos manualmente via WhatsApp, resultando em conflitos e no-shows sem controle.",
        en: "Small businesses manage bookings manually via WhatsApp, leading to scheduling conflicts and uncontrolled no-shows."
      },
      solution: {
        pt: "Plataforma de agendamentos self-service com notificações automáticas e gestão completa de clientes e disponibilidade.",
        en: "Self-service scheduling platform with automated notifications and full client and availability management."
      },
      techStack: ["React", "Node.js", "MongoDB"],
      image: "/agendify.png",
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://agendify.me" }]
    },
    {
      id: "devagent",
      category: { pt: "Automação & Agentes de IA", en: "Automation & AI Agents" },
      title: { pt: "DevAgent | O Kanban Autônomo", en: "DevAgent | The Autonomous Kanban" },
      challenge: {
        pt: "Eliminar o gargalo humano no ciclo de desenvolvimento de features simples e repetitivas.",
        en: "Eliminate the human bottleneck in the development cycle of simple, repetitive features."
      },
      solution: {
        pt: "Sistema integrado que atua como um desenvolvedor virtual: a IA lê os requisitos do card, escreve a lógica, executa testes e realiza a entrega via PR no GitHub.",
        en: "Integrated system acting as a virtual developer: AI reads card requirements, writes logic, runs tests, and delivers via GitHub PR."
      },
      techStack: ["LLMs", "GitHub API", "Automação", "TypeScript"],
      image: "/devagent.png",
      links: []
    },
    {
      id: "99freelas",
      category: { pt: "Automação & Agentes de IA", en: "Automation & AI Agents" },
      title: { pt: "99Freelas Proposal Assistant", en: "99Freelas Proposal Assistant" },
      challenge: {
        pt: "Criar propostas comerciais personalizadas e persuasivas consome tempo valioso de freelancers.",
        en: "Creating personalized, persuasive commercial proposals consumes precious freelancer time."
      },
      solution: {
        pt: "Extensão nativa do Chrome que usa IA para analisar o escopo de vagas e gerar propostas personalizadas em segundos.",
        en: "Native Chrome extension using AI to analyze job scope and generate personalized proposals in seconds."
      },
      techStack: ["Chrome Extension", "AI APIs", "JavaScript"],
      image: "/99freelasprop.png",
      links: [{ label: { pt: "Chrome Web Store", en: "Chrome Web Store" }, url: "https://chromewebstore.google.com/detail/gfejcpifdmhhfelnjbkaiblbfkfagcgn" }]
    },
    {
      id: "ikigai",
      category: { pt: "Automação & Agentes de IA", en: "Automation & AI Agents" },
      title: { pt: "Ikigai IA", en: "Ikigai AI" },
      challenge: {
        pt: "Tornar o framework Ikigai de autoconhecimento acessível e personalizado via conversação.",
        en: "Making the Ikigai self-knowledge framework accessible and personalized through conversation."
      },
      solution: {
        pt: "Motor de análise interativa com LLMs focado em desenvolvimento pessoal. Usa engenharia de prompt avançada para cruzar dados com o framework Ikigai.",
        en: "Interactive analysis engine with LLMs focused on personal development. Uses advanced prompt engineering to cross-reference data with the Ikigai framework."
      },
      techStack: ["LLMs", "Prompt Engineering", "Next.js"],
      image: "/ikigai.png",
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://florir.online/" }]
    }
  ],
  specializations: [
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
      category: { pt: "Arquitetura & Backend Escalável", en: "Architecture & Scalable Backend" },
      icon: "Server",
      courses: [
        "Domain-Driven Design (DDD) do Zero",
        "NestJS Microservices: Build & Deploy a Scalable Backend",
        "Docker Essentials",
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
