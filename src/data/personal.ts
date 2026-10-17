/**
 * @file personal.ts
 * @description Single source of truth for all personal/portfolio data.
 *
 * RULES:
 * - All visible text that has a pt/en/es version must use `LocalizedText`.
 * - Never hardcode data in components — always reference `personalData` here.
 * - Name, contact links and availability live in `profile.ts`, and the project
 *   categories in `project-categories.ts`: small modules that client components
 *   import without downloading this whole file. `personalData` includes them.
 * - Project images go in `/public/` and are referenced as `/filename.png`.
 * - The `order` field in experience/education is a numeric `YYYYMM` value
 *   (e.g. 202501 = Jan 2025) used to sort the timeline in descending order.
 */

import type { Locale } from "@/lib/i18n";
import type { ProjectCategoryId } from "./project-categories";
import { profile } from "./profile";
import { projectsData } from "./projects-data";

export { projectCategories, type ProjectCategoryId } from "./project-categories";
export { projectsData };

type LocaleKey = Locale;

/**
 * A piece of text that has Brazilian Portuguese, English and Spanish versions.
 * Used for all user-visible content that varies by language.
 */
type LocalizedText = Record<LocaleKey, string>;

/** A link associated with a project, with a localized label. */
interface ProjectLink {
  label: LocalizedText;
  url: string;
}

/** A single "what makes this interesting" bullet on a case study page. */
interface CaseStudyHighlight {
  title: LocalizedText;
  description: LocalizedText;
}

/** One box in a case study's architecture flow. */
export interface CaseStudyDiagramStage {
  title: LocalizedText;
  /** What sits inside the stage — components, rules or outputs. */
  items?: LocalizedText[];
  /** Marks the stage the design hinges on, such as an approval gate. */
  emphasis?: boolean;
}

/** Text that reads the same in every locale, such as a product or protocol name. */
export const same = (text: string): LocalizedText => ({ pt: text, en: text, es: text });

/**
 * The long-form story behind a project, rendered at `/projetos/[slug]`.
 * Only projects worth a deep read carry one — the rest are grid cards.
 */
interface CaseStudy {
  /** What the product is and who it is for. */
  context: LocalizedText;
  /** The hard part — the reason the project was not trivial. */
  challenge: LocalizedText;
  /** The approach taken, in terms of decisions rather than features. */
  solution: LocalizedText;
  /** Notable engineering decisions, 3–6 of them. */
  highlights: CaseStudyHighlight[];
  /** Optional note on how the codebase is organised. */
  architecture?: LocalizedText;
  /**
   * The path data or work takes through the system, left to right. It draws
   * what the text above already states; it is not a place for new claims.
   */
  diagram?: CaseStudyDiagramStage[];
  /** `translationKey` of the blog article that tells this project's story at length. */
  articleKey?: string;
  /**
   * Hard numbers and scope claims — "~3M events/day", "500+ customers".
   * Stable source labels; descriptions are translated by localizeLabel at render
   * time while figures and technology names remain unchanged. Only add claims
   * that are true and defensible in an interview.
   */
  metrics?: string[];
}

/**
 * Represents a single project entry in the portfolio.
 *
 * There is exactly one list of projects. `featured: true` promotes an entry to
 * the case-study section on the homepage; everything else lands in the grid
 * below it — so no project is ever shown twice.
 */
export interface ProjectEntry {
  /** URL segment at `/projetos/[slug]`; also the React key. */
  slug: string;
  title: LocalizedText;
  /** One line, shown under the title on cards. */
  tagline: LocalizedText;
  description: LocalizedText;
  category: ProjectCategoryId;
  /**
   * Year or range, e.g. "2026" / "2024–2025". Optional on purpose: it is only
   * set where the date is actually known, never guessed.
   */
  year?: string;
  /** Array of technology/library names (not localized). */
  techStack: string[];
  links: ProjectLink[];
  /** Project status badge, e.g. "Em produção" / "In production". */
  status: LocalizedText;
  /** Path to image in /public, or an absolute URL (e.g. GitHub OpenGraph). */
  image: string;
  /** Promotes the project to the homepage case-study section. */
  featured?: boolean;
  /** Required for featured projects — powers `/projetos/[slug]`. */
  caseStudy?: CaseStudy;
}

/**
 * Display order for the featured case studies, by slug.
 *
 * Deliberately alternates the backend-heavy systems (which carry the hard
 * numbers) with the end-to-end products, and opens with the strongest scale
 * claim — the section is titled "Engineering Case Studies", so the first card
 * has to earn that title. A slug missing from this list still renders, just
 * after the ones listed here.
 */
export const featuredOrder: string[] = [
  "vmageste",
  "impressaomais3d",
  "envrune",
  "praxis",
  "pulsewatch",
  "digitaltechms",
  "eurologado",
  "dupla-face",
  "flora-psicologia",
  "devagent",
];

/**
 * A recommendation from someone who worked with Yago. Only real ones, quoted
 * with permission — a LinkedIn recommendation is the easiest source, and its
 * link goes in `url` so a reader can check it. Translations of `quote` should
 * be approved by the author; when there are none yet, repeat the original.
 */
export interface Testimonial {
  quote: LocalizedText;
  author: string;
  /** Their role, at the time and place they worked together. */
  role: LocalizedText;
  company?: string;
  /** Where the original can be read, such as the LinkedIn recommendation. */
  url?: string;
  /** Slug of the project it is about; the case study page shows it too. */
  project?: string;
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
  ...profile,
  headline: "Senior Software Engineer",
  location: "Embu-Guaçu, São Paulo, Brazil",
  experienceYears: 10,
  summary: "I'm a Senior Software Engineer working across fullstack development, systems architecture, and DevOps. I build frontends with React and Next.js and backends with Node.js, TypeScript, Python (Django and FastAPI), and Laravel, using PostgreSQL, MySQL, and MongoDB, alongside infrastructure and automation with Docker and Terraform. I've led engineering teams, migrated monoliths to event-driven architectures with Kafka processing millions of events per day, and shipped multi-tenant SaaS products from zero to hundreds of customers — connecting user experience, reliability, observability, and scale.",
  skills: [
    "Node.js",
    "TypeScript",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Docker",
    "Terraform",
    "DevOps",
    "NestJS",
    "Python",
    "Django",
    "FastAPI",
    "Laravel",
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
  /**
   * Shown on the homepage, the "work with me" page and, when `project` is
   * set, on that case study. Empty on purpose until there are real ones.
   */
  testimonials: [] as Testimonial[],
  experience: [
    {
      company: "Independente",
      position: {
        pt: "Engenheiro de Software Sênior & Desenvolvedor de IA",
        en: "Senior Software Engineer & AI Developer",
        es: "Ingeniero de software sénior y desarrollador de IA",
      },
      period: {
        pt: "jan 2026 - presente",
        en: "Jan 2026 - present",
        es: "ene. 2026 - actualidad",
      },
      description: {
        pt: "Atuação estratégica no desenvolvimento de produtos autônomos, ferramentas baseadas em Inteligência Artificial Generativa e automação avançada de fluxos de trabalho corporativos. Arquiteto criador do DevAgent (sistema autônomo de engenharia de software).",
        en: "Strategic work developing autonomous products, Generative AI-powered tools, and advanced corporate workflow automation. Architect and creator of DevAgent (autonomous software engineering system).",
        es: "Desarrollo estratégico de productos autónomos, herramientas basadas en IA generativa y automatización avanzada de procesos empresariales. Arquitecto y creador de DevAgent, un sistema autónomo de ingeniería de software.",
      },
      order: 202601,
    },
    {
      company: "TechWorkz.Digital",
      position: {
        pt: "CTO e Founder",
        en: "CTO & Founder",
        es: "Director de tecnología y fundador",
      },
      period: {
        pt: "set 2023 - jan 2026",
        en: "Sep 2023 - Jan 2026",
        es: "sept. 2023 - ene. 2026",
      },
      description: {
        pt: "Liderança técnica, definição de arquitetura, entrega ponta a ponta de soluções digitais e gestão de produto para clientes da TechWorkz.Digital.",
        en: "Technical leadership, architecture definition, end-to-end delivery of digital solutions, and product management for TechWorkz.Digital clients.",
        es: "Liderazgo técnico, definición de arquitecturas, desarrollo integral de soluciones digitales y gestión de productos para los clientes de TechWorkz.Digital.",
      },
      order: 202601,
    },
    {
      company: "Pulses",
      position: {
        pt: "Desenvolvedor Fullstack Sênior",
        en: "Senior Fullstack Developer",
        es: "Desarrollador fullstack sénior",
      },
      period: {
        pt: "fev 2023 - ago 2023",
        en: "Feb 2023 - Aug 2023",
        es: "feb. 2023 - ago. 2023",
      },
      description: {
        pt: "Desenvolvimento e manutenção de APIs REST com Node.js (NestJS) e PHP (Slim), além de contribuições em frontend Vue.js com foco em UX. Automação de infraestrutura com Terraform e atuação em squads ágeis com sprints e retrospectivas.",
        en: "Developed and maintained RESTful APIs using Node.js (NestJS) and PHP (Slim). Contributed to the Vue.js frontend to enhance UX and ship new features. Automated infrastructure with Terraform and collaborated in agile squads with sprints, reviews, and retrospectives.",
        es: "Desarrollo y mantenimiento de API REST con Node.js (NestJS) y PHP (Slim). Contribuciones al frontend en Vue.js para mejorar la experiencia de usuario y entregar nuevas funcionalidades. Automatización de infraestructura con Terraform y colaboración en equipos ágiles con sprints, revisiones y retrospectivas.",
      },
      order: 202308,
    },
    {
      company: "PixelPrime - Desenvolvimento Tecnológico",
      position: {
        pt: "Consultor Independente",
        en: "Independent Contractor",
        es: "Profesional independiente",
      },
      period: {
        pt: "jul 2021 - fev 2023",
        en: "Jul 2021 - Feb 2023",
        es: "jul. 2021 - feb. 2023",
      },
      description: {
        pt: "Entrega de soluções sob medida para diferentes clientes, cobrindo todo o ciclo de desenvolvimento web com múltiplas stacks e integrações.",
        en: "Worked as a freelance developer building custom solutions for companies, covering the full web development lifecycle across multiple stacks and integrations.",
        es: "Desarrollo de soluciones a medida para empresas como profesional independiente, abarcando todo el ciclo de desarrollo web con diversas tecnologías e integraciones.",
      },
      order: 202302,
    },
    {
      company: "Bebidas Online",
      position: {
        pt: "Gerente de Desenvolvimento de Software",
        en: "Software Development Manager",
        es: "Gerente de desarrollo de software",
      },
      period: {
        pt: "fev 2022 - jul 2022",
        en: "Feb 2022 - Jul 2022",
        es: "feb. 2022 - jul. 2022",
      },
      description: {
        pt: "Liderança de equipe com cinco desenvolvedores, definição de arquiteturas escaláveis e implementação de fluxos ágeis voltados a performance e qualidade.",
        en: "Led a team of five developers, defined scalable architectures, and implemented agile workflows focused on performance and quality.",
        es: "Liderazgo de un equipo de cinco desarrolladores, definición de arquitecturas escalables e implementación de procesos ágiles centrados en el rendimiento y la calidad.",
      },
      order: 202207,
    },
    {
      company: "Freelancer",
      position: {
        pt: "Desenvolvedor Web",
        en: "Web Developer",
        es: "Desarrollador web",
      },
      period: {
        pt: "ago 2015 - jun 2021",
        en: "Aug 2015 - Jun 2021",
        es: "ago. 2015 - jun. 2021",
      },
      description: {
        pt: "Criação de projetos web diversos, sempre alinhando expectativas de clientes, aprendizado contínuo e entrega de soluções confiáveis.",
        en: "Delivered a variety of freelance web projects, balancing client expectations, continuous learning, and reliable delivery.",
        es: "Entrega de diversos proyectos web como profesional independiente, equilibrando las expectativas de los clientes, el aprendizaje continuo y la fiabilidad de las entregas.",
      },
      order: 202106,
    },
    {
      company: "SorocabaCom",
      position: {
        pt: "Desenvolvedor Pleno",
        en: "Mid-level Developer",
        es: "Desarrollador de nivel intermedio",
      },
      period: {
        pt: "fev 2020 - set 2020",
        en: "Feb 2020 - Sep 2020",
        es: "feb. 2020 - sept. 2020",
      },
      description: {
        pt: "Atuação com Laravel e WordPress, apoiando também gestão de projetos e sucesso do cliente.",
        en: "Worked on Laravel and WordPress projects while supporting project management and client success efforts.",
        es: "Desarrollo de proyectos con Laravel y WordPress, con apoyo a la gestión de proyectos y al éxito de los clientes.",
      },
      order: 202009,
    },
    {
      company: "CompuSoftware",
      position: {
        pt: "Desenvolvedor Júnior",
        en: "Junior Developer",
        es: "Desarrollador júnior",
      },
      period: {
        pt: "jun 2019 - jan 2020",
        en: "Jun 2019 - Jan 2020",
        es: "jun. 2019 - ene. 2020",
      },
      description: {
        pt: "Manutenção de sistemas legados e desenvolvimento de novas funcionalidades utilizando Delphi, PL/SQL e Oracle Apex.",
        en: "Maintained legacy systems and developed new features using Delphi, PL/SQL, and Oracle Apex.",
        es: "Mantenimiento de sistemas heredados y desarrollo de nuevas funcionalidades con Delphi, PL/SQL y Oracle Apex.",
      },
      order: 202001,
    },
    {
      company: "web.art group",
      position: {
        pt: "Desenvolvedor Backend",
        en: "Backend Developer",
        es: "Desarrollador backend",
      },
      period: {
        pt: "fev 2018 - set 2018",
        en: "Feb 2018 - Sep 2018",
        es: "feb. 2018 - sept. 2018",
      },
      description: {
        pt: "Integração de novos clientes à plataforma interna da empresa utilizando PHP e MySQL.",
        en: "Integrated new clients into the company's internal PHP and MySQL platform.",
        es: "Integración de nuevos clientes en la plataforma interna de la empresa, desarrollada con PHP y MySQL.",
      },
      order: 201809,
    },
    {
      company: "Intersolid Software",
      position: {
        pt: "Estagiário de Desenvolvimento",
        en: "Software Development Intern",
        es: "Pasante de desarrollo de software",
      },
      period: {
        pt: "out 2016 - jul 2017",
        en: "Oct 2016 - Jul 2017",
        es: "oct. 2016 - jul. 2017",
      },
      description: {
        pt: "Evolução de sistemas internos com Delphi, C#, Firebird e SQLite, otimizando rotinas críticas.",
        en: "Improved internal systems using Delphi, C#, Firebird, and SQLite, optimizing critical routines.",
        es: "Mejora de sistemas internos con Delphi, C#, Firebird y SQLite, optimizando procesos críticos.",
      },
      order: 201707,
    }
  ] as ExperienceEntry[],
  education: [
    {
      degree: {
        pt: "Mestrado em Ciência da Computação (PPGCC)",
        en: "Master's in Computer Science (PPGCC)",
        es: "Maestría en Ciencias de la Computación (PPGCC)",
      },
      institution: "Universidade Federal de São Carlos (UFSCar)",
      period: {
        pt: "Em andamento",
        en: "In progress",
        es: "En curso",
      },
      description: {
        pt: "Pesquisa acadêmica de alto nível em Ciência da Computação em uma das instituições federais mais prestigiadas do Brasil, unindo o rigor científico à aplicação prática no desenvolvimento de software e Inteligência Artificial.",
        en: "High-level academic research in Computer Science at one of Brazil's most prestigious federal institutions, bridging scientific rigor with practical application in software engineering and Artificial Intelligence.",
        es: "Investigación académica de alto nivel en Ciencias de la Computación en una de las instituciones federales más prestigiosas de Brasil, combinando el rigor científico con la aplicación práctica en ingeniería de software e inteligencia artificial.",
      },
      order: 202602,
    },
    {
      degree: {
        pt: "Pós-graduação em Gerenciamento de Projetos",
        en: "Postgraduate in Project Management",
        es: "Posgrado en Gestión de Proyectos",
      },
      institution: "Senac Brasil",
      period: {
        pt: "2020 – 2022",
        en: "2020–2022",
        es: "2020–2022",
      },
      order: 202202,
    },
    {
      degree: {
        pt: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
        en: "Bachelor's Degree in Systems Analysis and Development",
        es: "Titulación superior en Análisis y Desarrollo de Sistemas",
      },
      institution: "Fatec Fernando Amaral de Almeida Prado",
      period: {
        pt: "2015 – 2018",
        en: "2015–2018",
        es: "2015–2018",
      },
      order: 201812,
    }
  ] as EducationEntry[],
  /**
   * Every project, in one list. `featured: true` promotes an entry to the
   * homepage case-study section and gives it a page at `/projetos/[slug]`;
   * the rest render in the filterable grid. Nothing appears twice.
   */
  projects: projectsData,
  specializations: [
    {
      category: { pt: "Inteligência Artificial & Agentes", en: "Artificial Intelligence & Agents", es: "Inteligencia artificial y agentes" },
      icon: "Brain",
      courses: [
        "Production AI Agents with JavaScript (LangChain, LangGraph)",
        "AI com Node.js, OpenAI, ChatGPT, LangChain & TypeScript",
        "Machine Learning in JavaScript with TensorFlow.js",
        "Deploy AI: Smarter LLMs, ML Ops & Cost Efficiency",
      ],
    },
    {
      category: { pt: "Arquitetura & Backend Escalável", en: "Architecture & Scalable Backend", es: "Arquitectura y backend escalable" },
      icon: "Server",
      courses: [
        "Domain-Driven Design (DDD) do Zero",
        "NestJS Microservices: Build & Deploy a Scalable Backend",
        "Docker Essentials",
      ],
    },
    {
      category: { pt: "Frontend & Qualidade de Software", en: "Frontend & Software Quality", es: "Frontend y calidad de software" },
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
