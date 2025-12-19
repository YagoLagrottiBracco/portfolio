type LocaleKey = 'pt' | 'en';

type LocalizedText = Record<LocaleKey, string>;

interface ProjectLink {
  label: LocalizedText;
  url: string;
}

interface ProjectEntry {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  techStack: string[];
  links: ProjectLink[];
  status: LocalizedText;
  image: string;
}

interface ExperienceEntry {
  company: string;
  position: LocalizedText;
  period: LocalizedText;
  description: LocalizedText;
  order: number;
}

interface EducationEntry {
  degree: LocalizedText;
  institution: string;
  period: LocalizedText;
  order: number;
}

export const personalData = {
  name: "Yago Lagrotti Bracco",
  headline: "Desenvolvedor Fullstack",
  location: "São José do Rio Preto, São Paulo, Brazil",
  experienceYears: 8,
  summary: "Desenvolvedor Fullstack especializado em Node.js (NestJS, Express), PHP (Laravel, Slim) e Vue.js. Experiência sólida em arquitetura de projetos, gestão de equipes e desenvolvimento de software escalável. Pós-graduado em Gerenciamento de Projetos (práticas PMI). Busco criar soluções digitais de alto impacto, elegantes e eficientes por meio de tecnologias web modernas.",
  skills: [
    "Node.js (NestJS, Express)",
    "PHP (Laravel, Slim)",
    "Vue.js",
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "Tailwind",
    "SQL/NoSQL",
    "Docker",
    "Terraform",
    "Git",
    "Agile methodologies",
    "Team leadership",
    "Clean architecture"
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
    domain: "lagrotti.dev"
  },
  experience: [
    {
      company: "TechWorkz.Digital",
      position: {
        pt: "CTO e Founder",
        en: "CTO & Founder",
      },
      period: {
        pt: "set 2023 - atual",
        en: "Sep 2023 - present",
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
        pt: "Desenvolvedor Web",
        en: "Web Developer",
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
      id: "portfolio",
      title: {
        pt: "Portfólio Pessoal",
        en: "Personal Portfolio",
      },
      description: {
        pt: "Aplicação Next.js com design responsivo, animações e suporte multilíngue para apresentar trajetória profissional e projetos em destaque.",
        en: "Next.js application with responsive design, animations, and multilingual support showcasing my professional journey and featured projects.",
      },
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      links: [
        {
          label: { pt: "Repositório", en: "Repository" },
          url: "https://github.com/YagoLagrottiBracco/portfolio"
        }
      ],
      status: {
        pt: "Em produção",
        en: "In production",
      },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/portfolio"
    },
    {
      id: "pulsewatch",
      title: {
        pt: "PulseWatch",
        en: "PulseWatch",
      },
      description: {
        pt: "Monitoramento de saúde com alertas e trilhas de acompanhamento.",
        en: "Health monitoring with alerts and follow-up journeys.",
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
      id: "delivery-api",
      title: {
        pt: "Delivery API",
        en: "Delivery API",
      },
      description: {
        pt: "Plataforma de logística com Laravel e Docker, integração a gateways de pagamento e monitoramento de pedidos em múltiplos canais.",
        en: "Logistics platform built with Laravel and Docker, featuring payment gateway integrations and multi-channel order monitoring.",
      },
      techStack: ["Laravel", "MySQL", "Docker", "Terraform"],
      links: [],
      status: {
        pt: "Em desenvolvimento",
        en: "In development",
      },
      image: "https://via.placeholder.com/600x360?text=Delivery+API"
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
      id: "web",
      title: {
        pt: "Template Web",
        en: "Web Template",
      },
      description: {
        pt: "Base web modular para projetos front-end rápidos.",
        en: "Modular web base for fast front-end projects.",
      },
      techStack: ["React", "TypeScript", "Vite"],
      links: [
        {
          label: { pt: "Repositório", en: "Repository" },
          url: "https://github.com/YagoLagrottiBracco/web"
        }
      ],
      status: {
        pt: "Template",
        en: "Template",
      },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/web"
    },
    {
      id: "mobile",
      title: {
        pt: "Template Mobile",
        en: "Mobile Template",
      },
      description: {
        pt: "Base mobile para apps React Native com navegação e temas.",
        en: "Mobile base for React Native apps with navigation and theming.",
      },
      techStack: ["React Native", "TypeScript"],
      links: [
        {
          label: { pt: "Repositório", en: "Repository" },
          url: "https://github.com/YagoLagrottiBracco/mobile"
        }
      ],
      status: {
        pt: "Template",
        en: "Template",
      },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/mobile"
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
      id: "team-insights",
      title: {
        pt: "Team Insights",
        en: "Team Insights",
      },
      description: {
        pt: "Dashboard analítica para equipes de RH com Vue.js e NestJS, oferecendo métricas em tempo real, trilhas de engajamento e alertas proativos.",
        en: "Analytics dashboard for HR teams built with Vue.js and NestJS, delivering real-time metrics, engagement journeys, and proactive alerts.",
      },
      techStack: ["Vue.js", "NestJS", "PostgreSQL", "Redis"],
      links: [],
      status: {
        pt: "MVP",
        en: "MVP",
      },
      image: "https://via.placeholder.com/600x360?text=Team+Insights"
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
      id: "cosmetics-compliance-ai",
      title: {
        pt: "Cosmetics Compliance AI",
        en: "Cosmetics Compliance AI",
      },
      description: {
        pt: "Sistema completo para conformidade de cosméticos na Europa, gerando automaticamente dossiês, detectando inconformidades e usando IA para criação de documentos.",
        en: "End-to-end compliance system for EU cosmetics, auto-generating dossiers, detecting issues, and using AI for document creation.",
      },
      techStack: ["Next.js", "NestJS", "PostgreSQL", "LLM"],
      links: [],
      status: {
        pt: "Em produção",
        en: "In production",
      },
      image: "https://via.placeholder.com/600x360?text=Sem+imagem+disponivel"
    }
  ] as ProjectEntry[]
};
