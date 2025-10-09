type LocaleKey = 'pt' | 'en';

type LocalizedText = Record<LocaleKey, string>;

interface ProjectEntry {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  techStack: string[];
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
      techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"]
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
      techStack: ["Vue.js", "NestJS", "PostgreSQL", "Redis"]
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
      techStack: ["Laravel", "MySQL", "Docker", "Terraform"]
    }
  ] as ProjectEntry[]
};
