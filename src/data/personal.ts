/**
 * @file personal.ts
 * @description Single source of truth for all personal/portfolio data.
 *
 * RULES:
 * - All visible text that has a pt/en/es version must use `LocalizedText`.
 * - Never hardcode data in components — always reference `personalData` here.
 * - Project images go in `/public/` and are referenced as `/filename.png`.
 * - The `order` field in experience/education is a numeric `YYYYMM` value
 *   (e.g. 202501 = Jan 2025) used to sort the timeline in descending order.
 */

/** The supported locales for the portfolio. */
import type { Locale } from "@/lib/i18n";

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

/**
 * Stable filter keys for the project grid. The visible label for each one
 * lives in `projectCategories` below, so the filter never depends on
 * translated strings matching each other.
 */
export type ProjectCategoryId = "plataformas" | "arquitetura" | "ia" | "produtos";

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
const same = (text: string): LocalizedText => ({ pt: text, en: text, es: text });

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

/** Visible labels for each filter key, in all locales. */
export const projectCategories: { id: ProjectCategoryId; label: LocalizedText }[] = [
  {
    id: "plataformas",
    label: { pt: "Plataformas & E-commerce", en: "Platforms & E-commerce", es: "Plataformas y comercio electrónico" },
  },
  {
    id: "arquitetura",
    label: { pt: "Sistemas & Arquitetura", en: "Systems & Architecture", es: "Sistemas y arquitectura" },
  },
  {
    id: "ia",
    label: { pt: "IA & Automação", en: "AI & Automation", es: "IA y automatización" },
  },
  {
    id: "produtos",
    label: { pt: "Produtos sob medida", en: "Custom Products", es: "Productos a medida" },
  },
];

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
  socialLinks: {
    github: "https://github.com/YagoLagrottiBracco",
    linkedin: "https://www.linkedin.com/in/yago-lagrotti-bracco/",
    email: "yago.lagrotti@outlook.com",
    whatsapp: "https://wa.me/5517997642678",
    phone: "+55 17 99764-2678",
    domain: "lagrotti.dev"
  },
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
  projects: [
    // ---------------------------------------------------------------- featured
    {
      slug: "impressaomais3d",
      title: { pt: "ImpressãoMais3D", en: "ImpressãoMais3D", es: "ImpressãoMais3D" },
      tagline: {
        pt: "E-commerce de impressão 3D sob demanda",
        en: "On-demand 3D printing e-commerce",
        es: "Comercio electrónico de impresión 3D bajo demanda",
      },
      description: {
        pt: "Loja nacional de impressão 3D em FDM, resina e SLS: peça pronta do catálogo ou peça sob medida por upload de STL/OBJ/3MF, com orçamento, prova visual 3D, produção e entrega.",
        en: "Nationwide 3D printing store across FDM, resin and SLS: catalogue parts or custom parts via STL/OBJ/3MF upload, with quoting, 3D visual proof, production and delivery.",
        es: "Tienda de impresión 3D con cobertura nacional en FDM, resina y SLS: piezas de catálogo o personalizadas mediante archivos STL/OBJ/3MF, con presupuesto, prueba visual 3D, producción y entrega.",
      },
      category: "plataformas",
      year: "2026",
      techStack: [
        "Next.js 16",
        "TypeScript",
        "Supabase",
        "PostgreSQL",
        "Stripe",
        "Three.js",
        "React Three Fiber",
        "AI SDK",
        "Tailwind CSS v4",
        "Playwright",
        "Vitest",
      ],
      links: [{ label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://impressaomais3d.com.br" }],
      status: { pt: "Em produção", en: "In production", es: "En producción" },
      image: "/impressaomais3d.png",
      featured: true,
      caseStudy: {
        articleKey: "3d-printing-preview-approval-ecommerce-architecture",
        diagram: [
          {
            title: { pt: "Pedido", en: "Order", es: "Pedido" },
            items: [
              { pt: "Peça de catálogo", en: "Catalogue part", es: "Pieza de catálogo" },
              { pt: "Upload de STL, OBJ ou 3MF", en: "STL, OBJ or 3MF upload", es: "Archivo STL, OBJ o 3MF" },
            ],
          },
          {
            title: { pt: "Prova visual 3D", en: "3D visual proof", es: "Prueba visual 3D" },
            items: [
              { pt: "Gerada a partir do arquivo enviado", en: "Generated from the uploaded file", es: "Generada a partir del archivo enviado" },
              same("React Three Fiber"),
            ],
          },
          {
            title: { pt: "Aprovação do cliente", en: "Customer approval", es: "Aprobación del cliente" },
            items: [
              { pt: "Portão explícito do fluxo", en: "An explicit gate in the flow", es: "Requisito explícito del proceso" },
              { pt: "Registro auditável", en: "Auditable record", es: "Registro auditable" },
            ],
            emphasis: true,
          },
          {
            title: { pt: "Produção", en: "Production", es: "Producción" },
            items: [
              { pt: "Travada até a aprovação", en: "Locked until approval", es: "Bloqueada hasta la aprobación" },
              { pt: "FDM, resina e SLS", en: "FDM, resin and SLS", es: "FDM, resina y SLS" },
            ],
          },
          {
            title: { pt: "Entrega", en: "Delivery", es: "Entrega" },
            items: [
              { pt: "Envio ou retirada na loja", en: "Shipping or in-store pickup", es: "Envío o recogida en tienda" },
            ],
          },
        ],
        context: {
          pt: "Uma loja de impressão 3D vende duas coisas muito diferentes pelo mesmo carrinho: uma peça pronta de catálogo e uma peça que ainda não existe, enviada pelo cliente como arquivo 3D. As duas atravessam orçamento, produção, entrega e retirada na loja.",
          en: "A 3D printing store sells two very different things through the same cart: a catalogue part, and a part that does not exist yet, uploaded by the customer as a 3D file. Both run through quoting, production, delivery and in-store pickup.",
          es: "Una tienda de impresión 3D vende dos cosas muy distintas en el mismo carrito: una pieza de catálogo y una pieza que todavía no existe, enviada por el cliente como archivo 3D. Ambas pasan por presupuesto, producción, entrega o recogida en tienda.",
        },
        challenge: {
          pt: "Vender uma peça que ninguém viu ainda. O cliente precisa confiar no resultado antes de a produção começar — e, uma vez impressa, não há como desfazer. Some a isso um pedido que atravessa orçamento, arte, pagamento, produção e entrega, cada etapa com regra própria, e o risco real deixa de ser técnico e passa a ser de negócio: imprimir a coisa errada custa material e tempo.",
          en: "Selling a part nobody has seen yet. The customer must trust the result before production starts — and once printed, there is no undo. Add an order that crosses quoting, artwork, payment, production and delivery, each with its own rules, and the real risk stops being technical and becomes commercial: printing the wrong thing costs material and time.",
          es: "Vender una pieza que nadie ha visto todavía. El cliente debe confiar en el resultado antes de iniciar la producción y, una vez impresa, no hay vuelta atrás. Si a esto se suma un pedido que atraviesa presupuesto, diseño, pago, producción y entrega, cada etapa con sus propias reglas, el verdadero riesgo deja de ser técnico y pasa a ser comercial: imprimir la pieza equivocada cuesta material y tiempo.",
        },
        solution: {
          pt: "Uma prova visual 3D gerada automaticamente a partir do arquivo enviado, renderizada no navegador, que o cliente aprova antes de qualquer coisa ir para a impressora — a aprovação é um portão explícito no fluxo, não um aviso. Por baixo, um monólito modular com vinte bounded contexts, em que a fronteira entre módulos é verificada por ferramenta, não por combinado.",
          en: "A 3D visual proof generated automatically from the uploaded file and rendered in the browser, which the customer approves before anything reaches the printer — approval is an explicit gate in the flow, not a notice. Underneath, a modular monolith of twenty bounded contexts where module boundaries are enforced by tooling, not by convention.",
          es: "Una prueba visual 3D generada automáticamente a partir del archivo enviado y renderizada en el navegador, que el cliente aprueba antes de que nada llegue a la impresora: la aprobación es un requisito explícito del proceso, no un aviso. Por debajo, un monolito modular con veinte contextos delimitados cuyos límites se hacen cumplir mediante herramientas, no por convención.",
        },
        highlights: [
          {
            title: { pt: "Prova visual antes da produção", en: "Visual proof before production", es: "Prueba visual antes de producir" },
            description: {
              pt: "O arquivo enviado (STL, OBJ ou 3MF) é renderizado no navegador com React Three Fiber e vira uma prova que o cliente aprova ou rejeita. A produção fica travada até a aprovação — o que transforma uma discussão sobre expectativa em um registro auditável.",
              en: "The uploaded file (STL, OBJ or 3MF) is rendered in the browser with React Three Fiber and becomes a proof the customer approves or rejects. Production stays locked until approval — turning a conversation about expectations into an auditable record.",
              es: "El archivo enviado (STL, OBJ o 3MF) se renderiza en el navegador con React Three Fiber y se convierte en una prueba que el cliente aprueba o rechaza. La producción queda bloqueada hasta su aprobación, convirtiendo una conversación sobre expectativas en un registro auditable.",
            },
          },
          {
            title: { pt: "Fronteiras que o linter cobra", en: "Boundaries the linter enforces", es: "Límites que el linter hace cumplir" },
            description: {
              pt: "Cada módulo tem as camadas domain / application / infrastructure / presentation, e a camada de domínio não importa Supabase, Next ou React — isso é imposto por regra de ESLint (no-restricted-imports), não por disciplina. Módulos só se falam pela camada de aplicação.",
              en: "Each module has domain / application / infrastructure / presentation layers, and the domain layer imports no Supabase, Next or React — enforced by an ESLint rule (no-restricted-imports), not by discipline. Modules only talk through the application layer.",
              es: "Cada módulo tiene capas de dominio, aplicación, infraestructura y presentación. La capa de dominio no importa Supabase, Next ni React: lo garantiza una regla de ESLint (no-restricted-imports), no la disciplina del equipo. Los módulos solo se comunican a través de la capa de aplicación.",
            },
          },
          {
            title: { pt: "Autorização mora no banco", en: "Authorisation lives in the database", es: "La autorización reside en la base de datos" },
            description: {
              pt: "As permissões são políticas de Row Level Security no Postgres, não checagens espalhadas pela interface. A tela pode errar; a linha do banco continua protegida.",
              en: "Permissions are Row Level Security policies in Postgres, not checks scattered across the UI. The screen can be wrong; the database row stays protected.",
              es: "Los permisos son políticas de seguridad a nivel de fila (Row Level Security) en Postgres, no comprobaciones dispersas por la interfaz. La pantalla puede equivocarse; la fila de la base de datos sigue protegida.",
            },
          },
          {
            title: { pt: "Recusa deliberada de complexidade", en: "Deliberately refusing complexity", es: "Renunciar a la complejidad de forma deliberada" },
            description: {
              pt: "Sem microserviços, sem event bus, sem filas — e isso está escrito na arquitetura, com a justificativa. Saber quando não distribuir é uma decisão de projeto tão real quanto saber distribuir.",
              en: "No microservices, no event bus, no queues — and that is written down in the architecture, with the reasoning. Knowing when not to distribute is as real a design decision as knowing how to.",
              es: "Sin microservicios, bus de eventos ni colas, y esa decisión está documentada en la arquitectura junto con sus motivos. Saber cuándo no distribuir es una decisión de diseño tan real como saber cómo hacerlo.",
            },
          },
          {
            title: { pt: "Testado onde dói", en: "Tested where it hurts", es: "Pruebas en los puntos críticos" },
            description: {
              pt: "Vitest nas regras de negócio e uma suíte Playwright que cobre os fluxos de dinheiro e de produção: pagamento, prova visual, arte, expedição e o painel do revendedor.",
              en: "Vitest on business rules and a Playwright suite covering the money and production paths: payment, visual proof, artwork, fulfilment and the reseller panel.",
              es: "Vitest para las reglas de negocio y una suite de Playwright que cubre los flujos de dinero y producción: pagos, prueba visual, diseños, preparación de pedidos y panel de distribuidores.",
            },
          },
        ],
        architecture: {
          pt: "Monólito modular organizado por bounded context em src/modules/, com vinte contextos — entre eles catálogo, precificação, carrinho, pedido, pagamento, arte, prova visual, expedição, cupom, campanha, CRM e base de conhecimento da IA.",
          en: "Modular monolith organised by bounded context under src/modules/, with twenty contexts — among them catalogue, pricing, cart, order, payment, artwork, visual proof, fulfilment, coupons, campaigns, CRM and the AI knowledge base.",
          es: "Monolito modular organizado por contextos delimitados en src/modules/, con veinte contextos, entre ellos catálogo, precios, carrito, pedidos, pagos, diseños, prueba visual, preparación de pedidos, cupones, campañas, CRM y base de conocimiento de IA.",
        },
      },
    },
    {
      slug: "digitaltechms",
      title: { pt: "Digital Tech MS", en: "Digital Tech MS", es: "Digital Tech MS" },
      tagline: {
        pt: "Gráfica online com aprovação de arte e produção",
        en: "Online print shop with artwork approval and production",
        es: "Imprenta en línea con aprobación de diseños y producción",
      },
      description: {
        pt: "E-commerce de produtos gráficos personalizáveis: o cliente configura o produto, envia e aprova a arte e acompanha a produção até a entrega ou a retirada na loja.",
        en: "E-commerce for customisable print products: the customer configures the product, uploads and approves the artwork, and follows production through to delivery or in-store pickup.",
        es: "Comercio electrónico de productos gráficos personalizables: el cliente configura el producto, envía y aprueba el diseño y sigue la producción hasta la entrega o la recogida en tienda.",
      },
      category: "plataformas",
      year: "2026",
      techStack: [
        "Next.js 16",
        "TypeScript",
        "Supabase",
        "PostgreSQL",
        "Stripe",
        "Resend",
        "AI SDK",
        "Tailwind CSS v4",
        "Playwright",
        "Vitest",
      ],
      links: [{ label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://digitaltechms.com.br" }],
      status: { pt: "Em produção", en: "In production", es: "En producción" },
      image: "/digitaltechms.png",
      featured: true,
      caseStudy: {
        articleKey: "digital-tech-configurable-pricing-artwork-production",
        diagram: [
          {
            title: { pt: "Configuração", en: "Configuration", es: "Configuración" },
            items: [
              { pt: "Material, acabamento, dimensão e quantidade", en: "Material, finish, dimensions and quantity", es: "Material, acabado, dimensiones y cantidad" },
            ],
          },
          {
            title: { pt: "Preço no servidor", en: "Server-side price", es: "Precio en el servidor" },
            items: [
              { pt: "Recalculado antes de gravar o carrinho", en: "Recalculated before the cart is written", es: "Recalculado antes de guardar el carrito" },
              { pt: "Ou orçamento personalizado", en: "Or a custom quote", es: "O presupuesto a medida" },
            ],
          },
          {
            title: { pt: "Pedido", en: "Order", es: "Pedido" },
            items: [
              { pt: "Itens e preços congelados", en: "Items and prices frozen", es: "Artículos y precios fijados" },
            ],
          },
          {
            title: { pt: "Aprovação da arte", en: "Artwork approval", es: "Aprobación del diseño" },
            items: [
              { pt: "Explícita: só então libera a produção", en: "Explicit: only then is production released", es: "Explícita: solo entonces se habilita la producción" },
            ],
            emphasis: true,
          },
          {
            title: { pt: "Produção", en: "Production", es: "Producción" },
          },
          {
            title: { pt: "Entrega", en: "Delivery", es: "Entrega" },
            items: [
              { pt: "Envio ou retirada com código", en: "Shipping or pickup with a code", es: "Envío o recogida con código" },
            ],
          },
        ],
        context: {
          pt: "Uma gráfica vende cartão de visita, banner, adesivo e papelaria — produtos em que quase nada tem preço de prateleira e quase tudo depende de uma arte que o cliente manda.",
          en: "A print shop sells business cards, banners, stickers and stationery — products where almost nothing has a shelf price and almost everything depends on artwork the customer sends in.",
          es: "Una imprenta vende tarjetas de visita, lonas, adhesivos y papelería: productos en los que casi nada tiene un precio fijo y casi todo depende del diseño que envía el cliente.",
        },
        challenge: {
          pt: "Produto gráfico não tem preço fixo: ele varia por material, acabamento, dimensão e quantidade, e algumas combinações só fazem sentido sob orçamento. Ao mesmo tempo, imprimir é irreversível — uma arte errada aprovada por engano vira prejuízo material, não um bug que se corrige em produção.",
          en: "Print products have no fixed price: it varies by material, finish, dimensions and quantity, and some combinations only make sense as a custom quote. At the same time, printing is irreversible — wrong artwork approved by mistake becomes material loss, not a bug you patch in production.",
          es: "Los productos gráficos no tienen un precio fijo: varía según el material, el acabado, las dimensiones y la cantidad, y algunas combinaciones solo tienen sentido con un presupuesto a medida. Al mismo tiempo, imprimir es irreversible: un diseño incorrecto aprobado por error se convierte en pérdida de material, no en un fallo que se corrige en producción.",
        },
        solution: {
          pt: "Um motor de precificação sobre opções configuráveis, que calcula no servidor e recalcula antes de gravar o carrinho, com uma saída de escape para orçamento personalizado quando o produto não tem preço fixo. E um fluxo de arte com aprovação explícita, que só então libera a produção.",
          en: "A pricing engine over configurable options that calculates on the server and recalculates before writing the cart, with an escape hatch into custom quoting when a product has no fixed price. And an artwork flow with explicit approval, which only then releases production.",
          es: "Un motor de precios basado en opciones configurables que calcula en el servidor y vuelve a calcular antes de guardar el carrito, con una vía hacia presupuestos a medida cuando el producto no tiene precio fijo. Y un flujo de diseños con aprobación explícita que solo entonces habilita la producción.",
        },
        highlights: [
          {
            title: { pt: "Preço calculado no servidor", en: "Price calculated on the server", es: "Precio calculado en el servidor" },
            description: {
              pt: "O preço nunca vem do cliente. As opções configuráveis alimentam um motor de cálculo que roda no servidor e é recalculado antes de gravar o item no carrinho — o navegador não consegue negociar o próprio desconto.",
              en: "The price never comes from the client. Configurable options feed a calculation engine that runs on the server and is recalculated before the item is written to the cart — the browser cannot negotiate its own discount.",
              es: "El precio nunca procede del cliente. Las opciones configurables alimentan un motor de cálculo que se ejecuta en el servidor y vuelve a calcular antes de guardar el artículo en el carrito: el navegador no puede negociar su propio descuento.",
            },
          },
          {
            title: { pt: "Orçamento para o que não tem preço", en: "Quoting for what has no price", es: "Presupuestos para lo que no tiene precio" },
            description: {
              pt: "Produto sem preço fixo não fica de fora da loja: ele entra por um fluxo próprio de solicitação de orçamento, que o staff responde e o cliente aceita, sem sair da mesma conta e do mesmo histórico de pedidos.",
              en: "A product with no fixed price is not left out of the store: it enters through its own quote-request flow that staff answer and the customer accepts, without leaving the same account and order history.",
              es: "Un producto sin precio fijo no queda fuera de la tienda: entra en un flujo propio de solicitud de presupuesto que el equipo responde y el cliente acepta, sin salir de su cuenta ni del historial de pedidos.",
            },
          },
          {
            title: { pt: "Pedido como registro imutável", en: "The order as an immutable record", es: "El pedido como registro inmutable" },
            description: {
              pt: "Fechar o carrinho congela os itens e os preços em um pedido com número próprio e ciclo de status. O que foi combinado no momento da compra não muda depois, mesmo que o catálogo mude.",
              en: "Closing the cart freezes items and prices into an order with its own number and status cycle. What was agreed at purchase time does not change later, even if the catalogue does.",
              es: "Al cerrar el carrito, los artículos y precios quedan fijados en un pedido con número propio y ciclo de estados. Lo acordado en el momento de la compra no cambia después, aunque cambie el catálogo.",
            },
          },
          {
            title: { pt: "Retirada com código", en: "Pickup with a code", es: "Recogida con código" },
            description: {
              pt: "Quem opta por retirar na loja recebe um código que o staff resgata no balcão — o pedido só é dado como entregue contra esse resgate.",
              en: "Customers choosing in-store pickup get a code that staff redeem at the counter — the order is only marked delivered against that redemption.",
              es: "Los clientes que eligen recoger en tienda reciben un código que el equipo valida en el mostrador: el pedido solo se marca como entregado tras esa validación.",
            },
          },
        ],
        architecture: {
          pt: "Mesma base arquitetural do ImpressãoMais3D — monólito modular por bounded context, com a camada de domínio isolada por regra de ESLint. Este projeto foi a base de código que depois deu origem ao ImpressãoMais3D.",
          en: "The same architectural base as ImpressãoMais3D — a modular monolith by bounded context with the domain layer isolated by an ESLint rule. This codebase was the one that later gave rise to ImpressãoMais3D.",
          es: "La misma base arquitectónica que ImpressãoMais3D: un monolito modular por contextos delimitados con la capa de dominio aislada mediante una regla de ESLint. Este código fue el que posteriormente dio origen a ImpressãoMais3D.",
        },
      },
    },
    {
      slug: "dupla-face",
      title: { pt: "Estúdio Dupla Face", en: "Estúdio Dupla Face", es: "Estúdio Dupla Face" },
      tagline: {
        pt: "Site e portal do cliente para estúdio de arquitetura",
        en: "Website and client portal for an architecture studio",
        es: "Sitio web y portal de clientes para un estudio de arquitectura",
      },
      description: {
        pt: "Site institucional e plataforma de acompanhamento de obra para um estúdio de arquitetura de São Paulo, com planta interativa, portal do cliente e conversa em tempo real.",
        en: "Marketing site and project-tracking platform for a São Paulo architecture studio, with an interactive floor plan, a client portal and realtime messaging.",
        es: "Sitio de presentación y plataforma de seguimiento de proyectos para un estudio de arquitectura de São Paulo, con plano interactivo, portal de clientes y mensajería en tiempo real.",
      },
      category: "produtos",
      year: "2026",
      techStack: [
        "Next.js 16",
        "TypeScript",
        "Supabase",
        "PostgreSQL",
        "Row Level Security",
        "Supabase Realtime",
        "Zod",
        "Tailwind CSS v4",
      ],
      links: [{ label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://duplaface.arq.br" }],
      status: { pt: "Em produção", en: "In production", es: "En producción" },
      image: "/duplaface.png",
      featured: true,
      caseStudy: {
        articleKey: "dupla-face-architecture-portal-interactive-floorplan-rls",
        diagram: [
          {
            title: { pt: "Painel do estúdio", en: "Studio panel", es: "Panel del estudio" },
            items: [
              { pt: "Pontos marcados sobre a planta", en: "Pins dropped on the floor plan", es: "Marcadores sobre el plano" },
              { pt: "Publicação no site", en: "Publishing to the site", es: "Publicación en el sitio" },
            ],
          },
          {
            title: same("Supabase"),
            items: [
              { pt: "PostgreSQL com Row Level Security", en: "PostgreSQL with Row Level Security", es: "PostgreSQL con Row Level Security" },
              { pt: "Bucket privado de documentos", en: "Private document bucket", es: "Bucket privado de documentos" },
              same("Realtime"),
            ],
            emphasis: true,
          },
          {
            title: { pt: "Portal do cliente", en: "Client portal", es: "Portal de clientes" },
            items: [
              { pt: "Acesso só após aprovação", en: "Access only after approval", es: "Acceso solo tras la aprobación" },
              { pt: "Conversa em tempo real", en: "Realtime messaging", es: "Mensajería en tiempo real" },
              { pt: "Download com URL de 60 segundos", en: "Downloads through a 60-second URL", es: "Descargas con URL de 60 segundos" },
            ],
          },
        ],
        context: {
          pt: "O Estúdio Dupla Face trabalha com residências, interiores e cenografia, e define o próprio ofício por duas faces: a que se vê — luz, material, paisagem — e a que sustenta — desenho preciso e documentação que a obra entende.",
          en: "Estúdio Dupla Face works across homes, interiors and scenography, and defines its own craft by two faces: the one you see — light, material, landscape — and the one that holds it up: precise drawings and documentation the building site can follow.",
          es: "Estúdio Dupla Face trabaja en viviendas, interiores y escenografía, y define su oficio a través de dos caras: la visible —luz, materiales, paisaje— y la que la sostiene: planos precisos y documentación que se puede seguir en la obra.",
        },
        challenge: {
          pt: "Um projeto de arquitetura vira um monte de arquivo espalhado: plantas, desenhos técnicos, referências, fotos de obra e decisões combinadas por WhatsApp. O cliente não sabe onde olhar, e o estúdio repete a mesma informação por meses. O problema não era guardar arquivo — era dar a eles um lugar onde fizessem sentido juntos.",
          en: "An architecture project becomes a pile of scattered files: plans, technical drawings, references, site photos and decisions agreed over WhatsApp. The client does not know where to look, and the studio repeats the same information for months. The problem was not storing files — it was giving them a place where they make sense together.",
          es: "Un proyecto de arquitectura se convierte en una pila de archivos dispersos: planos, dibujos técnicos, referencias, fotos de obra y decisiones acordadas por WhatsApp. El cliente no sabe dónde buscar y el estudio repite la misma información durante meses. El problema no era almacenar archivos, sino darles un lugar donde tuvieran sentido juntos.",
        },
        solution: {
          pt: "A planta baixa virou a interface. O arquiteto marca um ponto sobre cada ambiente e acumula ali dentro quantos desenhos, imagens e textos quiser — a planta deixa de ser uma imagem e vira o índice do projeto. Em volta dela, um portal em que o cliente conversa com o estúdio e baixa documentos, e um painel em que o estúdio publica o que quiser mostrar no site.",
          en: "The floor plan became the interface. The architect drops a pin on each room and accumulates as many drawings, images and notes inside it as needed — the plan stops being a picture and becomes the project's index. Around it, a portal where the client talks to the studio and downloads documents, and a panel where the studio publishes what it wants shown on the site.",
          es: "El plano se convirtió en la interfaz. El arquitecto coloca un marcador en cada habitación y añade tantos dibujos, imágenes y notas como necesite: el plano deja de ser una imagen y pasa a ser el índice del proyecto. A su alrededor, un portal donde el cliente habla con el estudio y descarga documentos, y un panel donde el estudio publica lo que quiere mostrar en el sitio.",
        },
        highlights: [
          {
            title: { pt: "Marcação fiel em qualquer tela", en: "Pins that hold at any size", es: "Marcadores que se mantienen en cualquier tamaño" },
            description: {
              pt: "As coordenadas de cada ponto são gravadas em porcentagem da imagem, não em pixels. A marcação continua exatamente sobre o ambiente certo em qualquer largura de tela e em qualquer nível de zoom — detalhe pequeno que decide se a funcionalidade é usável no celular da obra.",
              en: "Each pin's coordinates are stored as a percentage of the image, not in pixels. The marker stays exactly over the right room at any screen width and any zoom level — a small detail that decides whether the feature is usable on a phone at the building site.",
              es: "Las coordenadas de cada marcador se guardan como porcentaje de la imagen, no en píxeles. El marcador permanece exactamente sobre la habitación correcta con cualquier ancho de pantalla y nivel de zoom: un pequeño detalle que determina si la funcionalidad resulta útil desde un móvil en la obra.",
            },
          },
          {
            title: { pt: "A proteção mora no banco", en: "Protection lives in the database", es: "La protección reside en la base de datos" },
            description: {
              pt: "Cada tabela tem Row Level Security, e as políticas partem de três funções: is_admin(), is_approved() e a posse da linha. Cliente aprovado enxerga apenas os próprios projetos, conversas e documentos — mesmo que a interface erre.",
              en: "Every table has Row Level Security, and the policies rest on three functions: is_admin(), is_approved() and row ownership. An approved client sees only their own projects, conversations and documents — even if the interface gets it wrong.",
              es: "Todas las tablas tienen seguridad a nivel de fila (Row Level Security), y las políticas se apoyan en tres funciones: is_admin(), is_approved() y la propiedad de cada fila. Un cliente aprobado solo ve sus propios proyectos, conversaciones y documentos, aunque la interfaz se equivoque.",
            },
          },
          {
            title: { pt: "Documento privado, link que expira", en: "Private documents, expiring links", es: "Documentos privados y enlaces con caducidad" },
            description: {
              pt: "Os documentos ficam em bucket privado com o identificador do cliente como primeiro nível do caminho, e o download passa por uma rota que revalida a posse antes de assinar uma URL de 60 segundos. Link vazado deixa de ser um problema um minuto depois.",
              en: "Documents live in a private bucket with the client id as the first path segment, and downloads go through a route that re-checks ownership before signing a 60-second URL. A leaked link stops being a problem a minute later.",
              es: "Los documentos se guardan en un bucket privado con el identificador del cliente como primer segmento de la ruta. Las descargas pasan por una ruta que vuelve a comprobar la propiedad antes de firmar una URL válida durante 60 segundos. Un enlace filtrado deja de ser un problema un minuto después.",
            },
          },
          {
            title: { pt: "Falha do banco não derruba o site", en: "A database blip does not take the site down", es: "Un fallo puntual de la base de datos no derriba el sitio" },
            description: {
              pt: "As requisições ao banco têm teto de tempo. Se ele não responde, as leituras do site público viram estado vazio e o erro vai para o log — a página continua de pé. Já as escritas falham de forma visível, porque ali o usuário precisa saber.",
              en: "Database calls are time-capped. If it does not answer, public-site reads degrade to an empty state and the error goes to the log — the page stays up. Writes, by contrast, fail loudly, because there the user needs to know.",
              es: "Las llamadas a la base de datos tienen un tiempo límite. Si no responde, las lecturas del sitio público muestran un estado vacío y el error queda registrado: la página sigue disponible. Las escrituras, en cambio, muestran el error de forma explícita, porque en ese caso el usuario necesita saberlo.",
            },
          },
          {
            title: { pt: "Acesso por aprovação", en: "Access by approval", es: "Acceso mediante aprobación" },
            description: {
              pt: "Todo cadastro nasce pendente e só vira acesso depois que um administrador aprova — o portal de um cliente nunca abre sozinho.",
              en: "Every sign-up starts pending and only becomes access after an administrator approves it — a client portal never opens on its own.",
              es: "Cada registro comienza pendiente y solo permite el acceso después de que un administrador lo apruebe: un portal de clientes nunca se abre por sí solo.",
            },
          },
        ],
      },
    },
    {
      slug: "flora-psicologia",
      title: { pt: "Flora Psicologia", en: "Flora Psicologia", es: "Flora Psicologia" },
      tagline: {
        pt: "Site, agendamento e blog para consultório de psicologia",
        en: "Website, booking and blog for a psychology practice",
        es: "Sitio web, reservas y blog para una consulta de psicología",
      },
      description: {
        pt: "Site profissional para psicóloga com agendamento online, painel de gestão e blog otimizado para busca — construído dentro das restrições éticas do CFP e da LGPD.",
        en: "Professional website for a psychologist with online booking, an admin panel and an SEO-optimised blog — built within Brazilian professional-ethics and data-protection constraints.",
        es: "Sitio profesional para una psicóloga con reservas en línea, panel de administración y blog optimizado para SEO, desarrollado dentro de las restricciones brasileñas de ética profesional y protección de datos.",
      },
      category: "produtos",
      year: "2026",
      techStack: [
        "Next.js 16",
        "TypeScript",
        "Supabase",
        "PostgreSQL",
        "Tailwind CSS v4",
        "SSG / ISR",
        "JSON-LD",
      ],
      links: [{ label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://florapsicologa.com.br" }],
      status: { pt: "Em produção", en: "In production", es: "En producción" },
      image: "/flora.png",
      featured: true,
      caseStudy: {
        articleKey: "flora-psychology-website-seo-ethics-lgpd",
        diagram: [
          {
            title: { pt: "Painel da psicóloga", en: "Psychologist's panel", es: "Panel de la psicóloga" },
            items: [
              { pt: "Editor de artigos com campos de SEO", en: "Article editor with SEO fields", es: "Editor de artículos con campos SEO" },
            ],
          },
          {
            title: { pt: "Publicação", en: "Publishing", es: "Publicación" },
            items: [
              same("SSG / ISR"),
              { pt: "JSON-LD, sitemap e robots", en: "JSON-LD, sitemap and robots", es: "JSON-LD, sitemap y robots" },
            ],
            emphasis: true,
          },
          {
            title: { pt: "Site público", en: "Public site", es: "Sitio público" },
            items: [
              { pt: "Páginas estáticas e rápidas", en: "Static, fast pages", es: "Páginas estáticas y rápidas" },
              { pt: "Registro profissional sempre visível", en: "Licence number always visible", es: "Registro profesional siempre visible" },
            ],
          },
          {
            title: { pt: "Agendamento", en: "Booking", es: "Reserva" },
            items: [
              { pt: "Fluxo curto, online", en: "A short online flow", es: "Proceso breve en línea" },
            ],
          },
        ],
        context: {
          pt: "Uma psicóloga atendendo online precisa ser encontrada por quem procura ajuda e precisa que agendar seja simples — sem que isso a coloque em conflito com as regras da profissão.",
          en: "A psychologist working online needs to be found by people looking for help, and needs booking to be simple — without putting her at odds with the rules of her profession.",
          es: "Una psicóloga que trabaja en línea necesita que la encuentren las personas que buscan ayuda y que reservar sea sencillo, sin entrar en conflicto con las normas de su profesión.",
        },
        challenge: {
          pt: "A maior parte das alavancas comuns de conversão está proibida. O Conselho Federal de Psicologia veda promessa de resultado e depoimento de paciente, que é justamente o que um site de serviço costuma usar para convencer. Ainda por cima, o que trafega ali é dado sensível de saúde, sob LGPD. O site precisava converter pela clareza, e não pelo apelo.",
          en: "Most of the usual conversion levers are off the table. Brazil's psychology council forbids promising outcomes and publishing patient testimonials — precisely what a service site normally leans on. On top of that, what flows through it is sensitive health data under Brazil's data-protection law. The site had to convert through clarity, not persuasion.",
          es: "La mayoría de los recursos habituales de conversión no se pueden utilizar. El consejo de psicología de Brasil prohíbe prometer resultados y publicar testimonios de pacientes, precisamente aquello en lo que suele apoyarse un sitio de servicios. Además, por el sitio circulan datos de salud sensibles según la legislación brasileña de protección de datos. La conversión debía lograrse con claridad, no con persuasión.",
        },
        solution: {
          pt: "A confiança foi construída com o que é permitido e verificável: CRP sempre visível, explicação honesta de como a terapia funciona, dúvidas frequentes respondidas sem rodeio e um agendamento curto. O ganho de alcance veio de SEO técnico bem feito, não de propaganda.",
          en: "Trust was built from what is allowed and verifiable: the professional licence number always visible, an honest explanation of how therapy works, frequently asked questions answered plainly, and a short booking flow. Reach came from solid technical SEO, not from advertising.",
          es: "La confianza se construyó a partir de lo permitido y verificable: número de registro profesional siempre visible, explicación honesta de cómo funciona la terapia, preguntas frecuentes respondidas con claridad y un proceso de reserva breve. El alcance vino de un SEO técnico sólido, no de la publicidad.",
        },
        highlights: [
          {
            title: { pt: "Conformidade ética como requisito", en: "Professional ethics as a requirement", es: "La ética profesional como requisito" },
            description: {
              pt: "Nenhuma promessa de cura, nenhum depoimento de paciente e o registro profissional visível em todas as páginas. A restrição virou diretriz de conteúdo desde o começo, em vez de uma revisão dolorosa no fim.",
              en: "No promises of cure, no patient testimonials, and the professional licence visible on every page. The constraint became a content guideline from the start, instead of a painful review at the end.",
              es: "Sin promesas de curación ni testimonios de pacientes, y con el registro profesional visible en todas las páginas. La restricción se convirtió en una pauta de contenido desde el principio, en lugar de una revisión costosa al final.",
            },
          },
          {
            title: { pt: "SEO local estruturado", en: "Structured local SEO", es: "SEO local estructurado" },
            description: {
              pt: "Dados estruturados JSON-LD de Psychologist, Person, WebSite e FAQPage, metadados por página com canonical, e sitemap e robots gerados automaticamente — com o painel administrativo marcado como noindex.",
              en: "JSON-LD structured data for Psychologist, Person, WebSite and FAQPage, per-page metadata with canonicals, and automatic sitemap and robots — with the admin panel marked noindex.",
              es: "Datos estructurados JSON-LD para Psychologist, Person, WebSite y FAQPage, metadatos por página con URL canónicas, y sitemap y robots automáticos, con el panel de administración marcado como noindex.",
            },
          },
          {
            title: { pt: "Blog que a profissional mantém sozinha", en: "A blog she maintains herself", es: "Un blog que ella misma mantiene" },
            description: {
              pt: "Editor de artigos com campos de SEO no próprio painel, publicando em SSG/ISR: as páginas são estáticas e rápidas, mas ela não depende de ninguém para publicar.",
              en: "An article editor with SEO fields in her own panel, publishing through SSG/ISR: pages are static and fast, but she does not depend on anyone to publish.",
              es: "Editor de artículos con campos SEO en su propio panel y publicación mediante SSG/ISR: las páginas son estáticas y rápidas, pero ella no depende de nadie para publicar.",
            },
          },
          {
            title: { pt: "Roda sem configuração nenhuma", en: "Runs with no configuration at all", es: "Funciona sin configuración" },
            description: {
              pt: "Sem o banco configurado, o site sobe em modo demonstração com dados de exemplo; ao conectar as credenciais, passa a usar dados reais sozinho. Isso torna o projeto apresentável desde o primeiro minuto e o desenvolvimento independente de credencial.",
              en: "With no database configured, the site boots in demo mode with sample data; once credentials are connected, it switches to real data on its own. That makes the project presentable from minute one and development free of credential setup.",
              es: "Sin una base de datos configurada, el sitio arranca en modo de demostración con datos de ejemplo; al conectar las credenciales, cambia automáticamente a datos reales. Esto permite presentar el proyecto desde el primer minuto y desarrollar sin configurar credenciales.",
            },
          },
        ],
      },
    },
    {
      slug: "vmageste",
      title: {
        pt: "VMageste — Marketing Analytics SaaS de Alta Volumetria",
        en: "VMageste — High-Volume Marketing Analytics SaaS",
        es: "VMageste — SaaS de analítica de marketing de gran volumen",
      },
      tagline: {
        pt: "~3 milhões de eventos por dia, multi-tenant",
        en: "~3 million events a day, multi-tenant",
        es: "~3 millones de eventos al día, multiinquilino",
      },
      description: {
        pt: "Plataforma que centraliza campanhas, leads e analytics de múltiplas fontes de tráfego em um painel só, com enriquecimento e deduplicação de leads, alertas e relatórios.",
        en: "Platform centralising campaigns, leads and analytics from multiple traffic sources in a single dashboard, with lead enrichment and deduplication, alerts and reports.",
        es: "Plataforma que centraliza campañas, contactos y analítica de múltiples fuentes de tráfico en un único panel, con enriquecimiento y deduplicación de contactos, alertas e informes.",
      },
      category: "arquitetura",
      techStack: [
        "Golang",
        "Apache Kafka",
        "ClickHouse",
        "NestJS",
        "PostgreSQL",
        "Redis",
        "Docker",
        "DDD",
      ],
      links: [{ label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://vmageste.com.br" }],
      status: { pt: "Em desenvolvimento", en: "In development", es: "En desarrollo" },
      image: "/vmageste.png",
      featured: true,
      caseStudy: {
        articleKey: "vmageste-kafka-clickhouse-millions-events",
        diagram: [
          {
            title: { pt: "Fontes de tráfego", en: "Traffic sources", es: "Fuentes de tráfico" },
            items: [
              same("Meta"),
              same("Google"),
              same("TikTok"),
            ],
          },
          {
            title: { pt: "Ingestão", en: "Ingestion", es: "Ingesta" },
            items: [
              same("Apache Kafka"),
              { pt: "Desacopla ingestão de processamento", en: "Decouples ingestion from processing", es: "Desacopla la ingesta del procesamiento" },
            ],
            emphasis: true,
          },
          {
            title: { pt: "Processamento", en: "Processing", es: "Procesamiento" },
            items: [
              { pt: "Consumidores em Golang", en: "Golang consumers", es: "Consumidores en Golang" },
              { pt: "Enriquecimento e deduplicação de leads", en: "Lead enrichment and deduplication", es: "Enriquecimiento y deduplicación de contactos" },
            ],
          },
          {
            title: { pt: "Armazenamento", en: "Storage", es: "Almacenamiento" },
            items: [
              { pt: "ClickHouse — consultas analíticas", en: "ClickHouse — analytical queries", es: "ClickHouse: consultas analíticas" },
              { pt: "PostgreSQL — transacional", en: "PostgreSQL — transactional", es: "PostgreSQL: transaccional" },
            ],
          },
          {
            title: { pt: "Produto", en: "Product", es: "Producto" },
            items: [
              { pt: "Dashboards em tempo real", en: "Real-time dashboards", es: "Paneles en tiempo real" },
              { pt: "Alertas e relatórios", en: "Alerts and reports", es: "Alertas e informes" },
            ],
          },
        ],
        metrics: ["~3M events/day", "Multi-tenant SaaS", "Kafka + ClickHouse", "Team leadership"],
        context: {
          pt: "Agências e times de performance vivem alternando entre os painéis de Meta, Google e TikTok, e reconciliando números que nunca batem. A plataforma junta essas fontes em um lugar só.",
          en: "Agencies and performance teams live switching between Meta, Google and TikTok dashboards, reconciling numbers that never quite match. The platform brings those sources into one place.",
          es: "Las agencias y los equipos de marketing de resultados alternan constantemente entre los paneles de Meta, Google y TikTok, conciliando cifras que nunca terminan de coincidir. La plataforma reúne esas fuentes en un solo lugar.",
        },
        challenge: {
          pt: "Ingerir ~3 milhões de eventos diários das APIs do Meta, Google e TikTok em uma plataforma multi-tenant, mantendo a latência do banco OLTP sob controle e os dashboards em tempo real responsivos, sem gargalos.",
          en: "Ingest ~3 million daily events from Meta, Google, and TikTok APIs into a multi-tenant platform while keeping OLTP latency under control and real-time dashboards responsive without bottlenecks.",
          es: "Ingerir unos 3 millones de eventos diarios de las API de Meta, Google y TikTok en una plataforma multiinquilino, manteniendo bajo control la latencia de OLTP y la capacidad de respuesta de los paneles en tiempo real, sin cuellos de botella.",
        },
        solution: {
          pt: "Liderei a migração do monolito Node.js para uma arquitetura de microserviços orientada a eventos. O Kafka desacopla ingestão de processamento; consumidores em Golang tratam os streams em escala; o ClickHouse absorve as queries analíticas para que o PostgreSQL cuide apenas do transacional. Padrão Strangler Fig para migrar sem downtime.",
          en: "I led the redesign from a Node.js monolith to an event-driven microservices architecture. Kafka decouples ingestion from processing; Golang consumers handle stream processing at scale; ClickHouse absorbs analytics queries so PostgreSQL handles only transactional workloads. Strangler Fig pattern for zero-downtime migration.",
          es: "Lideré el rediseño de un monolito en Node.js hacia una arquitectura de microservicios orientada a eventos. Kafka desacopla la ingesta del procesamiento; los consumidores en Golang procesan los flujos a escala; ClickHouse absorbe las consultas analíticas para que PostgreSQL se encargue únicamente de las cargas transaccionales. Patrón Strangler Fig para migrar sin interrupciones.",
        },
        highlights: [
          {
            title: { pt: "Migração sem parar o produto", en: "Migrating without stopping the product", es: "Migrar sin detener el producto" },
            description: {
              pt: "O padrão Strangler Fig permitiu substituir o monolito por partes, mantendo o sistema antigo no ar enquanto cada fatia migrava — em vez de uma reescrita de uma vez só, que é onde esse tipo de projeto costuma morrer.",
              en: "The Strangler Fig pattern allowed replacing the monolith piece by piece, keeping the old system running while each slice migrated — instead of a big-bang rewrite, which is where this kind of project usually dies.",
              es: "El patrón Strangler Fig permitió sustituir el monolito pieza a pieza, manteniendo el sistema anterior en funcionamiento mientras se migraba cada parte, en lugar de una reescritura de una sola vez, que es donde este tipo de proyectos suele fracasar.",
            },
          },
          {
            title: { pt: "Separar escrita de leitura analítica", en: "Splitting writes from analytical reads", es: "Separar las escrituras de las lecturas analíticas" },
            description: {
              pt: "Ingestão assíncrona sobre Kafka e consulta analítica em banco colunar. As duas cargas deixaram de competir pelo mesmo recurso, que era a causa real da lentidão.",
              en: "Asynchronous ingestion over Kafka and analytical querying on a columnar store. The two workloads stopped competing for the same resource, which was the real cause of the slowness.",
              es: "Ingesta asíncrona mediante Kafka y consultas analíticas en un almacén columnar. Ambas cargas dejaron de competir por el mismo recurso, que era la verdadera causa de la lentitud.",
            },
          },
          {
            title: { pt: "Lead limpo na entrada", en: "Clean leads at the door", es: "Contactos depurados desde la entrada" },
            description: {
              pt: "Enriquecimento e deduplicação acontecem no fluxo de ingestão, não em relatório. O time comercial recebe uma base já tratada, em vez de descobrir o duplicado na hora de ligar.",
              en: "Enrichment and deduplication happen in the ingestion pipeline, not in a report. The sales team receives an already-cleaned base instead of discovering duplicates while dialling.",
              es: "El enriquecimiento y la deduplicación ocurren en el proceso de ingesta, no en un informe. El equipo comercial recibe una base ya depurada, en lugar de descubrir duplicados mientras llama.",
            },
          },
        ],
      },
    },
    {
      slug: "devagent",
      title: { pt: "DevAgent — o Kanban autônomo", en: "DevAgent — the Autonomous Kanban", es: "DevAgent — el Kanban autónomo" },
      tagline: {
        pt: "Um agente que lê o card e abre o pull request",
        en: "An agent that reads the card and opens the pull request",
        es: "Un agente que lee la tarjeta y abre la solicitud de cambios",
      },
      description: {
        pt: "Sistema autônomo de engenharia de software: a IA lê os requisitos do card, escreve a lógica, roda os testes e entrega via pull request no GitHub.",
        en: "Autonomous software engineering system: the AI reads the card requirements, writes the logic, runs the tests and delivers through a GitHub pull request.",
        es: "Sistema autónomo de ingeniería de software: la IA lee los requisitos de la tarjeta, escribe la lógica, ejecuta las pruebas y entrega el resultado mediante una solicitud de cambios en GitHub.",
      },
      category: "ia",
      techStack: ["LLMs", "GitHub API", "TypeScript", "Automação"],
      links: [
        {
          label: { pt: "Repositório", en: "Repository", es: "Repositorio" },
          url: "https://github.com/YagoLagrottiBracco/dev-forge",
        },
      ],
      status: { pt: "Em desenvolvimento", en: "In development", es: "En desarrollo" },
      image: "/devagent.png",
      featured: true,
      caseStudy: {
        articleKey: "devagent-card-to-pull-request",
        diagram: [
          {
            title: { pt: "Card do quadro", en: "Board card", es: "Tarjeta del tablero" },
            items: [
              { pt: "O requisito como o time já escreve", en: "The requirement as the team already writes it", es: "El requisito tal como el equipo ya lo escribe" },
            ],
          },
          {
            title: { pt: "Agente", en: "Agent", es: "Agente" },
            items: [
              { pt: "Interpreta o requisito", en: "Interprets the requirement", es: "Interpreta el requisito" },
              { pt: "Escreve a implementação", en: "Writes the implementation", es: "Escribe la implementación" },
            ],
          },
          {
            title: { pt: "Testes", en: "Tests", es: "Pruebas" },
            items: [
              { pt: "Sem passar, não abre PR", en: "No pass, no PR", es: "Si no pasan, no abre PR" },
            ],
            emphasis: true,
          },
          {
            title: { pt: "Pull request", en: "Pull request", es: "Solicitud de cambios" },
            items: [
              { pt: "Diff revisável", en: "Reviewable diff", es: "Diff revisable" },
            ],
          },
          {
            title: { pt: "Revisão humana", en: "Human review", es: "Revisión humana" },
            items: [
              { pt: "O último passo continua com o time", en: "The final step stays with the team", es: "El paso final sigue en manos del equipo" },
            ],
          },
        ],
        context: {
          pt: "Em todo backlog existe uma faixa de tarefas que é simples, repetitiva e mesmo assim consome um desenvolvedor: o CRUD a mais, o campo novo no formulário, o ajuste de validação.",
          en: "Every backlog has a band of work that is simple, repetitive and still consumes a developer: one more CRUD, a new form field, a validation tweak.",
          es: "Todo backlog tiene tareas sencillas y repetitivas que aun así consumen tiempo de un desarrollador: otro CRUD, un nuevo campo de formulario, un ajuste de validación.",
        },
        challenge: {
          pt: "Eliminar o gargalo humano nesse tipo de tarefa sem abrir mão da revisão. Um agente que escreve código direto na branch principal é um risco; o valor só aparece se ele entrar pelo mesmo portão de qualidade que qualquer pessoa do time.",
          en: "Removing the human bottleneck on that kind of task without giving up review. An agent writing straight to the main branch is a liability; the value only shows up if it enters through the same quality gate as anyone else on the team.",
          es: "Eliminar el cuello de botella humano en ese tipo de tareas sin renunciar a la revisión. Un agente que escribe directamente en la rama principal es un riesgo; su valor solo aparece si pasa por el mismo control de calidad que cualquier persona del equipo.",
        },
        solution: {
          pt: "O agente age como um desenvolvedor virtual dentro do fluxo que já existe: puxa o card, interpreta o requisito, escreve a implementação, executa os testes e abre um pull request. A revisão humana continua sendo o último passo — o que muda é quem escreve o primeiro rascunho.",
          en: "The agent acts as a virtual developer inside the workflow that already exists: it pulls the card, interprets the requirement, writes the implementation, runs the tests and opens a pull request. Human review remains the final step — what changes is who writes the first draft.",
          es: "El agente actúa como desarrollador virtual dentro del flujo existente: toma la tarjeta, interpreta el requisito, escribe la implementación, ejecuta las pruebas y abre una solicitud de cambios. La revisión humana sigue siendo el paso final: lo que cambia es quién escribe el primer borrador.",
        },
        highlights: [
          {
            title: { pt: "Entrega pelo pull request, não pela branch", en: "Delivery by pull request, not by branch", es: "Entrega mediante solicitud de cambios, no en la rama" },
            description: {
              pt: "A saída do agente é sempre um PR. Isso mantém o histórico legível, o diff revisável e o poder de veto com o time — a automação acelera o começo do trabalho, não o fim dele.",
              en: "The agent's output is always a PR. That keeps history readable, the diff reviewable and veto power with the team — automation speeds up the start of the work, not the end of it.",
              es: "El resultado del agente es siempre una PR. Así se mantiene un historial legible, un diff revisable y el poder de veto en manos del equipo: la automatización acelera el inicio del trabajo, no su cierre.",
            },
          },
          {
            title: { pt: "O teste como portão", en: "Tests as the gate", es: "Las pruebas como requisito de entrega" },
            description: {
              pt: "O agente roda a suíte antes de entregar. Se não passa, ele não abre PR — o que evita transferir para a revisão humana um trabalho que a máquina já sabia estar errado.",
              en: "The agent runs the suite before delivering. If it does not pass, it does not open a PR — which avoids handing human review work the machine already knew was broken.",
              es: "El agente ejecuta la suite antes de entregar. Si no pasa, no abre una PR, evitando trasladar a la revisión humana un trabajo que la máquina ya sabía que fallaba.",
            },
          },
          {
            title: { pt: "O card como especificação", en: "The card as the spec", es: "La tarjeta como especificación" },
            description: {
              pt: "O requisito de entrada é o próprio card do quadro, do jeito que o time já escreve. Não há uma segunda linguagem de prompt para manter em dia.",
              en: "The input requirement is the board card itself, written the way the team already writes it. There is no second prompt language to keep in sync.",
              es: "El requisito de entrada es la propia tarjeta del tablero, escrita como el equipo ya acostumbra. No hay un segundo lenguaje de instrucciones que mantener sincronizado.",
            },
          },
        ],
      },
    },

    {
      slug: "pulsewatch",
      title: {
        pt: "PulseWatch — Plataforma de Monitoramento de E-commerce",
        en: "PulseWatch — E-commerce Monitoring Platform",
        es: "PulseWatch — Plataforma de monitorización de comercio electrónico",
      },
      tagline: {
        pt: "SaaS multi-tenant, 500+ clientes, engenheiro único",
        en: "Multi-tenant SaaS, 500+ customers, sole engineer",
        es: "SaaS multiinquilino, más de 500 clientes, un único ingeniero",
      },
      description: {
        pt: "SaaS multi-tenant de monitoramento de e-commerce com 500+ clientes. Workers de health-check configuráveis, motor de alertas por threshold e entrega multi-canal (email, SMS, Slack).",
        en: "Multi-tenant e-commerce monitoring SaaS with 500+ customers. Configurable health-check workers, threshold-based alerting engine, and multi-channel delivery (email, SMS, Slack).",
        es: "SaaS multiinquilino de monitorización de comercio electrónico con más de 500 clientes. Procesos configurables de comprobación de estado, motor de alertas basado en umbrales y notificaciones multicanal por correo electrónico, SMS y Slack.",
      },
      category: "arquitetura",
      techStack: ["Node.js", "TypeScript", "PostgreSQL", "Docker"],
      links: [{ label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://pulsewatch.click" }],
      status: { pt: "Em produção", en: "In production", es: "En producción" },
      image: "/pulsewatch.png",
      featured: true,
      caseStudy: {
        articleKey: "pulsewatch-reliable-ecommerce-monitoring-alerts",
        diagram: [
          {
            title: { pt: "Loja monitorada", en: "Monitored store", es: "Tienda monitorizada" },
            items: [
              { pt: "Estoque", en: "Stock", es: "Existencias" },
              { pt: "Pagamentos", en: "Payments", es: "Pagos" },
              same("API"),
            ],
          },
          {
            title: { pt: "Workers de health-check", en: "Health-check workers", es: "Procesos de comprobación de estado" },
            items: [
              { pt: "Configuráveis", en: "Configurable", es: "Configurables" },
            ],
          },
          {
            title: { pt: "Motor de alertas", en: "Alerting engine", es: "Motor de alertas" },
            items: [
              { pt: "Thresholds por cliente", en: "Per-customer thresholds", es: "Umbrales por cliente" },
            ],
            emphasis: true,
          },
          {
            title: { pt: "Notificação", en: "Notification", es: "Notificación" },
            items: [
              { pt: "E-mail", en: "Email", es: "Correo electrónico" },
              same("SMS"),
              same("Slack"),
            ],
          },
        ],
        metrics: ["500+ customers", "Node.js + TypeScript", "Multi-channel alerts"],
        context: {
          pt: "Lojas de e-commerce operam sem nenhuma camada de observabilidade entre os eventos da loja e o dono do negócio — quem vê que algo quebrou é o cliente, não a equipe.",
          en: "E-commerce stores run with no observability layer between store events and the business owner — the person who notices something broke is the customer, not the team.",
          es: "Las tiendas en línea funcionan sin una capa de observabilidad entre los eventos de la tienda y el propietario del negocio: quien detecta que algo ha fallado es el cliente, no el equipo.",
        },
        challenge: {
          pt: "Lojas perdem receita com falhas silenciosas: estoque zerado, erro de pagamento e queda de API ficam horas sem detecção. O problema não é a loja cair — é ninguém ficar sabendo enquanto a receita escoa.",
          en: "Stores silently lose revenue: stockouts, payment errors and API outages go undetected for hours. The problem is not the store breaking — it is nobody finding out while revenue drains.",
          es: "Las tiendas pierden ingresos silenciosamente: productos agotados, errores de pago y caídas de API pasan inadvertidos durante horas. El problema no es que la tienda falle, sino que nadie se entere mientras se pierden ingresos.",
        },
        solution: {
          pt: "Construí a plataforma inteira do zero, como engenheiro único: workers de health-check configuráveis, motor de alertas baseado em threshold e um pipeline de notificação multi-canal (email, SMS, Slack), com API em Node.js/TypeScript sobre PostgreSQL e dashboard em tempo real.",
          en: "I built the whole platform from scratch as sole engineer: configurable health-check workers, a threshold-based alerting engine and a multi-channel notification pipeline (email, SMS, Slack), with a Node.js/TypeScript API over PostgreSQL and a real-time dashboard.",
          es: "Construí toda la plataforma desde cero como único ingeniero: procesos configurables de comprobación de estado, un motor de alertas basado en umbrales y un sistema de notificaciones multicanal por correo electrónico, SMS y Slack, con una API en Node.js/TypeScript sobre PostgreSQL y un panel en tiempo real.",
        },
        highlights: [
          {
            title: { pt: "Alerta é o produto", en: "The alert is the product", es: "La alerta es el producto" },
            description: {
              pt: "O valor não está em coletar métrica, está em interromper a pessoa certa na hora certa. Por isso o pipeline de notificação é multi-canal e o threshold é configurável por cliente — um alerta que chega tarde ou no canal errado vale zero.",
              en: "The value is not in collecting metrics, it is in interrupting the right person at the right moment. That is why the notification pipeline is multi-channel and thresholds are per-customer — an alert that arrives late, or on the wrong channel, is worth nothing.",
              es: "El valor no está en recopilar métricas, sino en avisar a la persona adecuada en el momento oportuno. Por eso las notificaciones son multicanal y los umbrales se configuran por cliente: una alerta que llega tarde o por el canal equivocado no aporta nada.",
            },
          },
          {
            title: { pt: "Multi-tenant desde o primeiro dia", en: "Multi-tenant from day one", es: "Multiinquilino desde el primer día" },
            description: {
              pt: "O isolamento entre clientes foi decidido antes do primeiro cliente entrar, e não retrofitado depois — o que é o que permitiu chegar a 500+ contas sem uma reescrita no meio do caminho.",
              en: "Tenant isolation was decided before the first customer signed up rather than retrofitted later — which is what allowed growth to 500+ accounts without a rewrite along the way.",
              es: "El aislamiento entre clientes se decidió antes del primer registro, en lugar de añadirlo después. Eso permitió crecer hasta más de 500 cuentas sin reescribir el sistema por el camino.",
            },
          },
          {
            title: { pt: "Produto inteiro, um engenheiro", en: "A whole product, one engineer", es: "Un producto completo, un solo ingeniero" },
            description: {
              pt: "Do modelo de dados ao dashboard, passando por billing e entrega de alerta. Escopo assim obriga a escolher onde investir engenharia e onde aceitar o simples — e essa escolha é o trabalho.",
              en: "From the data model to the dashboard, taking in billing and alert delivery. That scope forces you to pick where to spend engineering and where to accept the simple option — and making that call is the job.",
              es: "Desde el modelo de datos hasta el panel, pasando por la facturación y la entrega de alertas. Ese alcance obliga a decidir dónde invertir esfuerzo de ingeniería y dónde aceptar la opción sencilla: tomar esa decisión forma parte del trabajo.",
            },
          },
        ],
      },
    },
    {
      slug: "eurologado",
      title: {
        pt: "Eurologado — SaaS de Compliance para Cosméticos na UE",
        en: "Eurologado — EU Cosmetics Compliance SaaS",
        es: "Eurologado — SaaS de cumplimiento normativo de cosméticos en la UE",
      },
      tagline: {
        pt: "100+ clientes, dossiê regulatório gerado com IA",
        en: "100+ customers, AI-assisted regulatory dossiers",
        es: "Más de 100 clientes, expedientes regulatorios asistidos por IA",
      },
      description: {
        pt: "SaaS de conformidade regulatória para marcas de cosméticos na União Europeia, com geração automática de dossiês (PIF), criação de documentos assistida por IA e validação de dados estruturados.",
        en: "Regulatory compliance SaaS for EU cosmetics brands, with automated dossier (PIF) generation, AI-assisted document creation and structured data validation.",
        es: "SaaS de cumplimiento normativo para marcas de cosméticos de la UE, con generación automatizada de expedientes PIF, creación de documentos asistida por IA y validación de datos estructurados.",
      },
      category: "ia",
      techStack: ["NestJS", "Next.js", "PostgreSQL", "LLM", "Docker"],
      links: [{ label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://pif.eurologado.eu" }],
      status: { pt: "Em produção", en: "In production", es: "En producción" },
      image: "/eurologado.png",
      featured: true,
      caseStudy: {
        articleKey: "eurologado-ai-compliance-cosmetics-pif-europe",
        diagram: [
          {
            title: { pt: "Dados do produto", en: "Product data", es: "Datos del producto" },
            items: [
              { pt: "Um dossiê (PIF) por SKU", en: "One dossier (PIF) per SKU", es: "Un expediente (PIF) por SKU" },
            ],
          },
          {
            title: { pt: "IA redige", en: "AI drafts", es: "La IA redacta" },
            items: [
              { pt: "Criação de documentos assistida", en: "Assisted document creation", es: "Creación asistida de documentos" },
            ],
          },
          {
            title: { pt: "Validação estruturada", en: "Structured validation", es: "Validación estructurada" },
            items: [
              { pt: "Decide se o dossiê está conforme", en: "Decides whether the dossier complies", es: "Decide si el expediente cumple" },
              { pt: "Aponta o que falta", en: "Flags what is missing", es: "Señala lo que falta" },
            ],
            emphasis: true,
          },
          {
            title: { pt: "Dossiê PIF", en: "PIF dossier", es: "Expediente PIF" },
            items: [
              { pt: "Completo e consistente", en: "Complete and consistent", es: "Completo y coherente" },
            ],
          },
          {
            title: { pt: "Equipe de compliance", en: "Compliance team", es: "Equipo de cumplimiento" },
            items: [
              { pt: "Dashboard em Next.js", en: "Next.js dashboard", es: "Panel en Next.js" },
            ],
          },
        ],
        metrics: ["100+ customers", "Sole engineer", "Full product ownership"],
        context: {
          pt: "Toda marca de cosmético vendendo na União Europeia precisa manter um Arquivo de Informação do Produto (PIF) para cada SKU. É obrigação legal, e o custo de errar é o produto sair de circulação.",
          en: "Every cosmetics brand selling in the EU must keep a Product Information File (PIF) for each SKU. It is a legal obligation, and the cost of getting it wrong is the product coming off the shelf.",
          es: "Toda marca de cosméticos que vende en la UE debe mantener un expediente de información sobre el producto (PIF) por cada SKU. Es una obligación legal, y el coste de equivocarse es que el producto sea retirado del mercado.",
        },
        challenge: {
          pt: "O processo é complexo e sujeito a erro, e historicamente é tocado em planilha e cadeia de e-mail. O difícil não é guardar o documento: é garantir que o dossiê esteja completo e consistente para cada SKU, e conseguir provar isso.",
          en: "The process is complex and error-prone, and has historically been run on spreadsheets and email chains. The hard part is not storing the document: it is guaranteeing the dossier is complete and consistent for every SKU — and being able to prove it.",
          es: "El proceso es complejo y propenso a errores, y tradicionalmente se ha gestionado con hojas de cálculo y cadenas de correos. Lo difícil no es almacenar el documento, sino garantizar que el expediente esté completo y sea coherente para cada SKU, y poder demostrarlo.",
        },
        solution: {
          pt: "Projetei e entreguei o produto inteiro como engenheiro único: uma API NestJS com pipeline de geração automática de dossiês, criação de documentos assistida por IA, validação de dados estruturados e um dashboard Next.js para as equipes de compliance.",
          en: "I designed and shipped the entire product as sole engineer: a NestJS API with an automated dossier generation pipeline, AI-assisted document creation, structured data validation and a Next.js dashboard for compliance teams.",
          es: "Diseñé y entregué todo el producto como único ingeniero: una API en NestJS con un proceso automatizado de generación de expedientes, creación de documentos asistida por IA, validación de datos estructurados y un panel en Next.js para los equipos de cumplimiento normativo.",
        },
        highlights: [
          {
            title: { pt: "IA que redige, validação que decide", en: "AI drafts, validation decides", es: "La IA redacta; la validación decide" },
            description: {
              pt: "O modelo ajuda a escrever o documento, mas quem diz se o dossiê está conforme é a validação estruturada — porque em contexto regulatório a saída precisa ser verificável, não plausível.",
              en: "The model helps write the document, but what decides whether the dossier is compliant is structured validation — because in a regulatory context the output has to be verifiable, not merely plausible.",
              es: "El modelo ayuda a redactar el documento, pero la validación estructurada determina si el expediente cumple los requisitos: en un contexto regulatorio, el resultado debe ser verificable, no solo plausible.",
            },
          },
          {
            title: { pt: "Detectar a falta, não só guardar", en: "Detecting what is missing, not just filing it", es: "Detectar lo que falta, no solo archivarlo" },
            description: {
              pt: "O sistema aponta a inconformidade em vez de esperar a auditoria apontar. Inverter esse momento é a diferença entre uma ferramenta de arquivo e uma ferramenta de compliance.",
              en: "The system flags the gap instead of waiting for an audit to find it. Flipping that moment is the difference between a filing tool and a compliance tool.",
              es: "El sistema señala las carencias en lugar de esperar a que las descubra una auditoría. Anticipar ese momento marca la diferencia entre una herramienta de archivo y una de cumplimiento normativo.",
            },
          },
          {
            title: { pt: "Do zero a 100+ clientes sozinho", en: "Zero to 100+ customers, solo", es: "De cero a más de 100 clientes, en solitario" },
            description: {
              pt: "Modelagem do domínio regulatório, API, pipeline de IA e interface — tudo entregue por uma pessoa, em um domínio onde entender a regra é metade do problema.",
              en: "Regulatory domain modelling, API, AI pipeline and interface — all delivered by one person, in a domain where understanding the rule is half the problem.",
              es: "Modelado del dominio regulatorio, API, flujo de IA e interfaz: todo entregado por una sola persona, en un ámbito donde comprender la norma es la mitad del problema.",
            },
          },
        ],
      },
    },

{
  "slug": "praxis",
  "title": {
    "pt": "Praxis",
    "en": "Praxis",
    "es": "Praxis"
  },
  "tagline": {
    "pt": "Do sonho à tarefa, com ciência e IA",
    "en": "From dreams to tasks, with science and AI",
    "es": "Del sueño a la tarea, con ciencia e IA"
  },
  "description": {
    "pt": "Plataforma de planejamento pessoal com mapas interativos 2D e 3D, colaboração em tempo real e um coach de IA para transformar sonhos em objetivos, metas, ações e tarefas.",
    "en": "Personal planning platform with interactive 2D and 3D maps, real-time collaboration and an AI coach to turn dreams into objectives, goals, actions and tasks.",
    "es": "Plataforma de planificación personal con mapas interactivos 2D y 3D, colaboración en tiempo real y un coach de IA para transformar sueños en objetivos, metas, acciones y tareas."
  },
  "category": "produtos",
  "techStack": [
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "React Flow",
    "Three.js",
    "Supabase",
    "PostgreSQL",
    "Stripe"
  ],
  "links": [
    {
      "label": {
        "pt": "Site",
        "en": "Live",
        "es": "Ver sitio"
      },
      "url": "https://usepraxis.online/"
    }
  ],
  "status": {
    "pt": "Em produção",
    "en": "In production",
    "es": "En producción"
  },
  "image": "/praxis.png",
  "featured": true,
  "caseStudy": {
    articleKey: "praxis-react-flow-threejs-goals-graphs-collaboration",
    diagram: [
      {
        title: { pt: "Uma árvore", en: "One tree", es: "Un árbol" },
        items: [
          { pt: "Cinco níveis, do sonho à tarefa", en: "Five levels, from dream to task", es: "Cinco niveles, del sueño a la tarea" },
          { pt: "PostgreSQL com RLS", en: "PostgreSQL with RLS", es: "PostgreSQL con RLS" },
        ],
        emphasis: true,
      },
      {
        title: { pt: "Sincronização", en: "Synchronisation", es: "Sincronización" },
        items: [
          same("Supabase Realtime"),
          { pt: "Um canal por mapa", en: "One channel per map", es: "Un canal por mapa" },
        ],
      },
      {
        title: { pt: "Três visualizações", en: "Three views", es: "Tres vistas" },
        items: [
          { pt: "Mapa 2D — React Flow", en: "2D map — React Flow", es: "Mapa 2D: React Flow" },
          { pt: "Lista", en: "List", es: "Lista" },
          { pt: "Constelação 3D — Three.js", en: "3D constellation — Three.js", es: "Constelación 3D: Three.js" },
        ],
      },
    ],
    "context": {
      "pt": "O Praxis conecta sonhos a tarefas em cinco níveis. Mapas visuais, acompanhamento de progresso e métodos como WOOP e planos se-então ajudam a organizar próximos passos concretos.",
      "en": "Praxis connects dreams to tasks across five levels. Visual maps, progress tracking and methods such as WOOP and if-then plans help organize concrete next steps.",
      "es": "Praxis conecta sueños con tareas en cinco niveles. Mapas visuales, seguimiento del progreso y métodos como WOOP y planes si-entonces ayudan a organizar próximos pasos concretos."
    },
    "challenge": {
      "pt": "Representar a mesma árvore em mapa 2D, lista e constelação 3D exige consistência de hierarquia e progresso. A edição colaborativa precisa respeitar permissões e impedir relações inválidas entre os nós.",
      "en": "Presenting the same tree as a 2D map, list and 3D constellation requires consistent hierarchy and progress. Collaborative editing must respect permissions and prevent invalid node relationships.",
      "es": "Representar el mismo árbol como mapa 2D, lista y constelación 3D exige coherencia en la jerarquía y el progreso. La edición colaborativa debe respetar permisos e impedir relaciones inválidas entre nodos."
    },
    "solution": {
      "pt": "React Flow renderiza o mapa e Three.js, carregado sob demanda, apresenta a constelação. Supabase reúne autenticação, PostgreSQL com RLS e sincronização Realtime. O produto inclui coach de IA opcional, assinaturas Stripe e instalação como PWA.",
      "en": "React Flow renders the map and on-demand Three.js presents the constellation. Supabase provides authentication, PostgreSQL with RLS and Realtime synchronization. The product includes an optional AI coach, Stripe subscriptions and PWA installation.",
      "es": "React Flow renderiza el mapa y Three.js, cargado bajo demanda, presenta la constelación. Supabase reúne autenticación, PostgreSQL con RLS y sincronización Realtime. El producto incluye un coach de IA opcional, suscripciones Stripe e instalación como PWA."
    },
    "highlights": [
      {
        "title": {
          "pt": "Três visualizações, uma árvore",
          "en": "Three views, one tree",
          "es": "Tres vistas, un árbol"
        },
        "description": {
          "pt": "Mapa, lista e constelação compartilham dados e cálculo de progresso. O layout automático organiza a hierarquia e as posições manuais preservam os ajustes do usuário.",
          "en": "Map, list and constellation share data and progress calculations. Automatic layout organizes the hierarchy while manual positions preserve user adjustments.",
          "es": "Mapa, lista y constelación comparten datos y cálculo del progreso. El diseño automático organiza la jerarquía y las posiciones manuales conservan los ajustes del usuario."
        }
      },
      {
        "title": {
          "pt": "Colaboração em tempo real",
          "en": "Real-time collaboration",
          "es": "Colaboración en tiempo real"
        },
        "description": {
          "pt": "Mapas compartilhados usam canais Realtime por mapa e políticas de acesso no PostgreSQL. Mudanças de pai são validadas para evitar ciclos e conexões entre níveis incompatíveis.",
          "en": "Shared maps use per-map Realtime channels and PostgreSQL access policies. Parent changes are validated to prevent cycles and connections between incompatible levels.",
          "es": "Los mapas compartidos usan canales Realtime por mapa y políticas de acceso en PostgreSQL. Los cambios de padre se validan para evitar ciclos y conexiones entre niveles incompatibles."
        }
      },
      {
        "title": {
          "pt": "Constelação 3D sob demanda",
          "en": "On-demand 3D constellation",
          "es": "Constelación 3D bajo demanda"
        },
        "description": {
          "pt": "Sonhos são distribuídos em uma esfera de Fibonacci e seus descendentes em cones orientados. Shaders exibem o progresso no preenchimento dos corpos.",
          "en": "Dreams are distributed across a Fibonacci sphere and their descendants within oriented cones. Shaders display progress through the fill of each body.",
          "es": "Los sueños se distribuyen en una esfera de Fibonacci y sus descendientes en conos orientados. Los shaders muestran el progreso mediante el relleno de cada cuerpo."
        }
      }
    ]
  }
},
    {
      slug: "envrune",
      title: { pt: "EnvRune", en: "EnvRune", es: "EnvRune" },
      tagline: {
        pt: "CLI open source que tira os segredos do .env",
        en: "Open-source CLI that gets secrets out of .env files",
        es: "CLI de código abierto que saca los secretos del .env",
      },
      description: {
        pt: "CLI em Go que troca o .env por um cofre criptografado: os segredos são referenciados por nome em um envrune.yml versionável e injetados direto no processo, com saída mascarada e compartilhamento em equipe criptografado de ponta a ponta.",
        en: "A Go CLI that replaces .env files with an encrypted vault: secrets are referenced by name in a versionable envrune.yml and injected straight into the process, with masked output and end-to-end encrypted team sharing.",
        es: "CLI en Go que sustituye el .env por una bóveda cifrada: los secretos se referencian por nombre en un envrune.yml versionable y se inyectan directamente en el proceso, con salida enmascarada y uso compartido en equipo cifrado de extremo a extremo.",
      },
      category: "arquitetura",
      year: "2026",
      techStack: [
        "Golang",
        "Argon2id",
        "XChaCha20-Poly1305",
        "MCP",
        "Next.js 16",
        "Supabase",
        "PostgreSQL",
        "Row Level Security",
        "age (X25519)",
        "Ed25519",
        "GoReleaser",
        "GitHub Actions",
      ],
      links: [
        {
          label: { pt: "Repositório", en: "Repository", es: "Repositorio" },
          url: "https://github.com/YagoLagrottiBracco/envrune",
        },
        {
          label: { pt: "EnvRune Cloud", en: "EnvRune Cloud", es: "EnvRune Cloud" },
          url: "https://envrune.vercel.app",
        },
      ],
      status: { pt: "Publicado", en: "Published", es: "Publicado" },
      image: "/envrune.png",
      featured: true,
      caseStudy: {
        diagram: [
          {
            title: { pt: "Valor secreto", en: "Secret value", es: "Valor secreto" },
          },
          {
            title: { pt: "Cofre criptografado", en: "Encrypted vault", es: "Bóveda cifrada" },
            items: [
              same("XChaCha20-Poly1305"),
              same("Argon2id"),
            ],
            emphasis: true,
          },
          {
            title: { pt: "Referência nomeada", en: "Named reference", es: "Referencia con nombre" },
            items: [
              same("shop.stripe.test-key"),
            ],
          },
          {
            title: same("envrune.yml"),
            items: [
              { pt: "Só nomes, versionável", en: "Names only, versionable", es: "Solo nombres, versionable" },
            ],
          },
          {
            title: { pt: "Processo", en: "Process", es: "Proceso" },
            items: [
              { pt: "Variáveis injetadas", en: "Variables injected", es: "Variables inyectadas" },
              { pt: "Saída mascarada", en: "Masked output", es: "Salida enmascarada" },
            ],
          },
        ],
        metrics: ["Open source (Apache-2.0)", "Windows, macOS & Linux", "End-to-end encrypted", "Sole engineer"],
        context: {
          pt: "Todo projeto tem um .env: um arquivo em texto puro, ao lado do código, que é copiado entre máquinas, aparece em prints e em logs e é o primeiro arquivo que um agente de IA lê. O EnvRune mantém o mesmo fluxo de trabalho — um nome para cada variável, um valor por ambiente — e move os valores para um cofre criptografado, que só os entrega aos processos que você inicia.",
          en: "Every project has a .env: a plain-text file sitting next to the code, copied between machines, showing up in screenshots and logs, and the first file an AI coding agent reads. EnvRune keeps the same workflow — a name for each variable, a value per environment — and moves the values into an encrypted vault that only hands them to the processes you start.",
          es: "Todo proyecto tiene un .env: un archivo en texto plano junto al código que se copia entre máquinas, aparece en capturas de pantalla y registros, y es el primer archivo que lee un agente de IA. EnvRune mantiene el mismo flujo de trabajo —un nombre para cada variable, un valor por entorno— y traslada los valores a una bóveda cifrada que solo los entrega a los procesos que tú inicias.",
        },
        challenge: {
          pt: "Ferramenta de segurança que atrapalha é abandonada: se rodar o projeto ficar mais difícil do que com o .env, o time volta para o .env. Cada proteção precisava custar quase nada no dia a dia e, mesmo assim, manter o valor fora do repositório, do terminal, dos logs e do contexto de um agente de IA. O passo seguinte é ainda mais difícil: compartilhar segredos com o time por meio de um servidor sem precisar confiar nele.",
          en: "A security tool that gets in the way gets abandoned: if running the project becomes harder than it was with a .env, the team goes back to the .env. Each protection had to cost almost nothing day to day and still keep the value out of the repository, the terminal, the logs and an AI agent's context. The next step is harder still: sharing secrets with a team through a server without having to trust it.",
          es: "Una herramienta de seguridad que estorba acaba abandonada: si ejecutar el proyecto resulta más difícil que con el .env, el equipo vuelve al .env. Cada protección debía costar casi nada en el día a día y, aun así, mantener el valor fuera del repositorio, de la terminal, de los registros y del contexto de un agente de IA. El siguiente paso es aún más difícil: compartir secretos con el equipo a través de un servidor sin tener que confiar en él.",
        },
        solution: {
          pt: "Construí sozinho uma CLI em Go, distribuída como um único binário. Os valores vivem em um cofre local cifrado com XChaCha20-Poly1305, com a chave protegida pela senha mestra via Argon2id; o projeto guarda só nomes, em um envrune.yml versionável; e o envrune run injeta as variáveis direto no processo e mascara a saída. Para times, o EnvRune Cloud é opcional e criptografado de ponta a ponta: o servidor guarda texto cifrado e nomes e, por padrão, não lê valor nenhum.",
          en: "I built a Go CLI on my own, shipped as a single binary. Values live in a local vault encrypted with XChaCha20-Poly1305, its key protected by the master password through Argon2id; the project keeps only names, in a versionable envrune.yml; and envrune run injects the variables straight into the process and masks its output. For teams, EnvRune Cloud is optional and end-to-end encrypted: the server stores ciphertext and names and, by default, cannot read a single value.",
          es: "Construí en solitario una CLI en Go, distribuida como un único binario. Los valores viven en una bóveda local cifrada con XChaCha20-Poly1305, con la clave protegida por la contraseña maestra mediante Argon2id; el proyecto solo guarda nombres, en un envrune.yml versionable; y envrune run inyecta las variables directamente en el proceso y enmascara la salida. Para equipos, EnvRune Cloud es opcional y está cifrado de extremo a extremo: el servidor almacena texto cifrado y nombres y, por defecto, no puede leer ningún valor.",
        },
        highlights: [
          {
            title: {
              pt: "Mascaramento que aguenta streaming",
              en: "Masking that survives streaming",
              es: "Enmascaramiento que resiste el streaming",
            },
            description: {
              pt: "Os valores injetados que o processo imprimir saem como ****, inclusive nas formas codificadas em URL e em base64. Como um valor pode chegar partido entre dois blocos de saída, o filtro retém apenas o final que ainda pode ser o começo de um segredo — e, no terminal, o processo roda em um pseudoterminal, então cores, barras de progresso e prompts continuam funcionando.",
              en: "Injected values the process prints come out as ****, including their URL-encoded and base64 forms. Because a value can arrive split across two chunks of output, the filter holds back only the tail that could still be the start of a secret — and in a terminal the process runs inside a pseudo-terminal, so colours, progress bars and prompts keep working.",
              es: "Los valores inyectados que el proceso imprima salen como ****, incluidas sus formas codificadas en URL y en base64. Como un valor puede llegar dividido entre dos bloques de salida, el filtro retiene solo el final que todavía podría ser el comienzo de un secreto; y, en una terminal, el proceso se ejecuta dentro de un pseudoterminal, de modo que los colores, las barras de progreso y los prompts siguen funcionando.",
            },
          },
          {
            title: {
              pt: "Agentes de IA executam, mas não leem",
              en: "AI agents can run, but not read",
              es: "Los agentes de IA ejecutan, pero no leen",
            },
            description: {
              pt: "O envrune mcp é um servidor MCP para Claude Code, Cursor e Copilot: o agente roda os testes ou sobe o servidor de desenvolvimento com os segredos injetados e recebe a saída mascarada. Nenhuma ferramenta devolve um valor, e só os comandos nomeados no envrune.yml podem ser executados — comando arbitrário vem desligado por padrão.",
              en: "envrune mcp is an MCP server for Claude Code, Cursor and Copilot: the agent runs the tests or starts the dev server with the secrets injected and gets masked output back. No tool returns a value, and only the commands named in envrune.yml can be run — arbitrary commands are off by default.",
              es: "envrune mcp es un servidor MCP para Claude Code, Cursor y Copilot: el agente ejecuta las pruebas o arranca el servidor de desarrollo con los secretos inyectados y recibe la salida enmascarada. Ninguna herramienta devuelve un valor, y solo pueden ejecutarse los comandos con nombre definidos en envrune.yml: los comandos arbitrarios vienen desactivados por defecto.",
            },
          },
          {
            title: {
              pt: "Um servidor que não lê nem se dá acesso",
              en: "A server that cannot read or grant itself access",
              es: "Un servidor que no lee ni se concede acceso",
            },
            description: {
              pt: "No EnvRune Cloud, a chave de cada ambiente é cifrada para cada dispositivo com age (X25519), e toda chave pública é alcançada por uma cadeia de assinaturas Ed25519 que termina em raízes fixadas pelo próprio time. Um servidor comprometido pode negar serviço ou ver quem buscou o quê; não consegue ler um valor nem fazer um cliente cifrar para uma chave que nenhum administrador assinou.",
              en: "In EnvRune Cloud, each environment's key is encrypted to every device with age (X25519), and every public key is reached through a chain of Ed25519 signatures ending at roots pinned by the team itself. A compromised server can refuse service or see who fetched what; it cannot read a value, or make a client encrypt to a key no admin signed.",
              es: "En EnvRune Cloud, la clave de cada entorno se cifra para cada dispositivo con age (X25519), y toda clave pública se alcanza a través de una cadena de firmas Ed25519 que termina en raíces fijadas por el propio equipo. Un servidor comprometido puede denegar el servicio o ver quién obtuvo qué; no puede leer un valor ni hacer que un cliente cifre para una clave que ningún administrador ha firmado.",
            },
          },
          {
            title: {
              pt: "Sair do time é perder o acesso futuro",
              en: "Leaving the team means losing future access",
              es: "Salir del equipo es perder el acceso futuro",
            },
            description: {
              pt: "Remover um membro gera chaves novas para cada ambiente que ele usava e recifra os valores atuais; depois, uma rotação guiada lista cada segredo que a pessoa chegou a buscar, até alguém trocar o valor ou decidir mantê-lo. Buscas, escritas e mudanças de acesso ficam em um log de auditoria somente de inserção, encadeado por SHA-256, que a CLI exporta e confere offline.",
              en: "Removing a member creates new keys for every environment they used and re-encrypts the current values; a guided rotation then lists each secret that person actually fetched, until someone replaces the value or decides to keep it. Fetches, writes and access changes land in an append-only audit log chained with SHA-256, which the CLI exports and verifies offline.",
              es: "Eliminar a un miembro genera claves nuevas para cada entorno que utilizaba y vuelve a cifrar los valores actuales; después, una rotación guiada enumera cada secreto que esa persona llegó a obtener, hasta que alguien sustituye el valor o decide mantenerlo. Las consultas, las escrituras y los cambios de acceso quedan en un registro de auditoría de solo inserción, encadenado con SHA-256, que la CLI exporta y verifica sin conexión.",
            },
          },
          {
            title: {
              pt: "A exceção declarada: usar sem ver",
              en: "The declared exception: use without seeing",
              es: "La excepción declarada: usar sin ver",
            },
            description: {
              pt: "Um segredo marcado como sensível nunca chega à máquina do desenvolvedor: o programa recebe um marcador, e um proxy em loopback — com uma autoridade certificadora que existe só em memória, durante aquele comando — desvia as requisições pelo servidor, que insere o valor real apenas para os hosts permitidos. É o único caso em que o servidor consegue ler um valor: escolhido por segredo, depois de um aviso, e documentado como tal.",
              en: "A secret marked sensitive never reaches the developer's machine: the program gets a placeholder, and a loopback proxy — with a certificate authority that exists only in memory, for that one command — detours its requests through the server, which puts the real value in only for the allowed hosts. It is the one case where the server can read a value: chosen per secret, after a warning, and documented as exactly that.",
              es: "Un secreto marcado como sensible nunca llega a la máquina del desarrollador: el programa recibe un marcador de posición, y un proxy en loopback —con una autoridad de certificación que solo existe en memoria, durante ese comando— desvía las peticiones a través del servidor, que inserta el valor real únicamente para los hosts permitidos. Es el único caso en que el servidor puede leer un valor: se elige por secreto, tras una advertencia, y está documentado como tal.",
            },
          },
          {
            title: {
              pt: "Limites escritos, não escondidos",
              en: "Limits written down, not hidden",
              es: "Límites por escrito, no ocultos",
            },
            description: {
              pt: "Cada proteção vem acompanhada do que ela não cobre: mascarar a saída evita acidentes, não um programa que quer vazar; o papel de consumidor impede descuidos, não a extração; e um servidor comprometido ainda vê metadados. Em ferramenta de segurança, prometer menos e cumprir faz parte do projeto.",
              en: "Every protection ships with what it does not cover: masking prevents accidents, not a program that wants to leak; the consumer role stops carelessness, not extraction; and a compromised server still sees metadata. In a security tool, promising less and delivering it is part of the design.",
              es: "Cada protección va acompañada de lo que no cubre: enmascarar la salida evita accidentes, no un programa que quiera filtrar datos; el rol de consumidor impide descuidos, no la extracción; y un servidor comprometido sigue viendo los metadatos. En una herramienta de seguridad, prometer menos y cumplirlo forma parte del diseño.",
            },
          },
        ],
        architecture: {
          pt: "Um módulo Go organizado em 23 pacotes internos por responsabilidade — entre eles vault, crypto, runner, redact, agent, keychain, team, cloud, cloudcrypto e sealproxy — com cerca de 290 testes. O EnvRune Cloud é um app Next.js sobre Supabase: Row Level Security decide quem pode buscar o texto cifrado, e a criptografia decide quem consegue ler. O CI roda a suíte unitária e a de integração, com o binário real, em Linux, macOS e Windows; as releases saem por GoReleaser e GitHub Actions como instaladores para os três sistemas, além de Homebrew, Scoop e um repositório apt assinado.",
          en: "A Go module organised into 23 internal packages by responsibility — among them vault, crypto, runner, redact, agent, keychain, team, cloud, cloudcrypto and sealproxy — with about 290 tests. EnvRune Cloud is a Next.js app on Supabase: Row Level Security decides who may fetch ciphertext, and encryption decides who can read it. CI runs the unit suite and the integration suite, against the real binary, on Linux, macOS and Windows; releases ship through GoReleaser and GitHub Actions as installers for all three systems, plus Homebrew, Scoop and a signed apt repository.",
          es: "Un módulo de Go organizado en 23 paquetes internos por responsabilidad —entre ellos vault, crypto, runner, redact, agent, keychain, team, cloud, cloudcrypto y sealproxy— con unas 290 pruebas. EnvRune Cloud es una aplicación Next.js sobre Supabase: la seguridad a nivel de fila (Row Level Security) decide quién puede obtener el texto cifrado, y el cifrado decide quién puede leerlo. La CI ejecuta la suite unitaria y la de integración, con el binario real, en Linux, macOS y Windows; las versiones se publican con GoReleaser y GitHub Actions como instaladores para los tres sistemas, además de Homebrew, Scoop y un repositorio apt firmado.",
        },
      },
    },

    // ------------------------------------------------------------------- grid
    {
      slug: "normify",
      title: { pt: "Normify", en: "Normify", es: "Normify" },
      tagline: {
        pt: "Gestão de normas e conformidade",
        en: "Standards and compliance management",
        es: "Gestión de normas y cumplimiento",
      },
      description: {
        pt: "Gestão de normas e conformidade com painéis de acompanhamento e automações de alerta.",
        en: "Compliance and policy management with tracking dashboards and alert automations.",
        es: "Gestión de cumplimiento normativo y políticas con paneles de seguimiento y alertas automatizadas.",
      },
      category: "arquitetura",
      techStack: ["Vue.js", "Node.js", "PostgreSQL"],
      links: [{ label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://normify.app" }],
      status: { pt: "MVP", en: "MVP", es: "MVP" },
      image: "/normify.png",
    },
    {
      slug: "agendify",
      title: { pt: "Agendify", en: "Agendify", es: "Agendify" },
      tagline: {
        pt: "Plataforma de agendamentos self-service",
        en: "Self-service scheduling platform",
        es: "Plataforma de reservas de autoservicio",
      },
      description: {
        pt: "Plataforma de agendamentos com notificações automáticas e gestão de clientes e disponibilidade.",
        en: "Scheduling platform with automated notifications and client and availability management.",
        es: "Plataforma de reservas con notificaciones automatizadas y gestión de clientes y disponibilidad.",
      },
      category: "arquitetura",
      techStack: ["React", "Node.js", "MongoDB"],
      links: [{ label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://agendify.me" }],
      status: { pt: "Em desenvolvimento", en: "In development", es: "En desarrollo" },
      image: "/agendify.png",
    },
    {
      slug: "99freelas-proposal-assistant",
      title: { pt: "99Freelas Proposal Assistant", en: "99Freelas Proposal Assistant", es: "Asistente de propuestas para 99Freelas" },
      tagline: {
        pt: "Extensão de Chrome que escreve propostas com IA",
        en: "Chrome extension that writes proposals with AI",
        es: "Extensión de Chrome que redacta propuestas con IA",
      },
      description: {
        pt: "Extensão nativa do Chrome que analisa o escopo da vaga e gera propostas comerciais personalizadas em segundos.",
        en: "Native Chrome extension that analyses job scope and generates personalised proposals in seconds.",
        es: "Extensión nativa de Chrome que analiza el alcance del trabajo y genera propuestas personalizadas en segundos.",
      },
      category: "ia",
      techStack: ["Chrome Extension", "AI APIs", "JavaScript"],
      links: [
        {
          label: { pt: "Chrome Web Store", en: "Chrome Web Store", es: "Chrome Web Store" },
          url: "https://chromewebstore.google.com/detail/gfejcpifdmhhfelnjbkaiblbfkfagcgn",
        },
      ],
      status: { pt: "Publicado", en: "Published", es: "Publicado" },
      image: "/99freelasprop.png",
    },
    {
      slug: "ikigai",
      title: { pt: "Ikigai IA", en: "Ikigai AI", es: "Ikigai AI" },
      tagline: {
        pt: "Motor de autoconhecimento guiado por LLM",
        en: "LLM-guided self-knowledge engine",
        es: "Motor de autoconocimiento guiado por modelos de lenguaje",
      },
      description: {
        pt: "Motor de análise interativa com LLMs voltado a desenvolvimento pessoal, cruzando as respostas do usuário com o framework Ikigai.",
        en: "Interactive analysis engine with LLMs focused on personal development, cross-referencing user answers with the Ikigai framework.",
        es: "Motor de análisis interactivo con modelos de lenguaje centrado en el desarrollo personal, que cruza las respuestas del usuario con el marco de Ikigai.",
      },
      category: "ia",
      techStack: ["LLMs", "Prompt Engineering", "Next.js"],
      links: [{ label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://florir.online/" }],
      status: { pt: "Em produção", en: "In production", es: "En producción" },
      image: "/ikigai.png",
    },
    {
      slug: "dreamerz",
      title: { pt: "Dreamerz", en: "Dreamerz", es: "Dreamerz" },
      tagline: {
        pt: "Objetivos e métricas de vida",
        en: "Life goals and metrics",
        es: "Metas y métricas personales",
      },
      description: {
        pt: "Plataforma para acompanhamento de objetivos e métricas de vida, com frontend Next.js e API em NestJS.",
        en: "Platform for tracking life goals and metrics, with a Next.js frontend and a NestJS API.",
        es: "Plataforma para dar seguimiento a metas y métricas personales, con frontend en Next.js y API en NestJS.",
      },
      category: "produtos",
      techStack: ["React", "Next.js", "Tailwind CSS", "NestJS", "PostgreSQL"],
      links: [
        { label: { pt: "Frontend", en: "Frontend", es: "Frontend" }, url: "https://github.com/YagoLagrottiBracco/dreamerz-front" },
        { label: { pt: "API", en: "API", es: "API" }, url: "https://github.com/YagoLagrottiBracco/dreamerz-api" },
      ],
      status: { pt: "Em produção", en: "In production", es: "En producción" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/dreamerz-front",
    },
    {
      slug: "meu-mundo-mental",
      title: { pt: "Meu Mundo Mental", en: "My World Mental", es: "My World Mental" },
      tagline: {
        pt: "Avaliação de saúde mental sob a NR-1",
        en: "Mental health assessment under Brazil's NR-1",
        es: "Evaluación de salud mental según la NR-1 de Brasil",
      },
      description: {
        pt: "Criador de formulários para avaliação de saúde mental no trabalho, seguindo os requisitos da NR-1.",
        en: "Form builder for workplace mental health assessment, following the requirements of Brazil's NR-1 regulation.",
        es: "Creador de formularios para evaluar la salud mental en el trabajo, siguiendo los requisitos de la normativa NR-1 de Brasil.",
      },
      category: "produtos",
      techStack: ["NestJS", "TypeScript", "Prisma"],
      links: [
        { label: { pt: "Repositório", en: "Repository", es: "Repositorio" }, url: "https://github.com/YagoLagrottiBracco/andre" },
      ],
      status: { pt: "Prototipagem", en: "Prototyping", es: "En fase de prototipo" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/andre",
    },
    {
      slug: "techworky-digital",
      title: { pt: "TechWorky Digital (Interno)", en: "TechWorky Digital (Internal)", es: "TechWorky Digital (interno)" },
      tagline: {
        pt: "Ferramentas internas de operação digital",
        en: "Internal digital operations tooling",
        es: "Herramientas internas para operaciones digitales",
      },
      description: {
        pt: "Ferramentas internas para operação digital e automação de processos da agência.",
        en: "Internal tools for digital operations and agency process automation.",
        es: "Herramientas internas para operaciones digitales y automatización de procesos de agencia.",
      },
      category: "produtos",
      techStack: ["Laravel", "MySQL", "Vue.js"],
      links: [
        {
          label: { pt: "Repositório", en: "Repository", es: "Repositorio" },
          url: "https://github.com/YagoLagrottiBracco/techworkydigital-interno",
        },
      ],
      status: { pt: "Em produção", en: "In production", es: "En producción" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/techworkydigital-interno",
    },
    {
      slug: "minhas-financas",
      title: { pt: "Minhas Finanças", en: "My Finances", es: "Mis finanzas" },
      tagline: {
        pt: "Controle financeiro pessoal",
        en: "Personal finance tracking",
        es: "Seguimiento de finanzas personales",
      },
      description: {
        pt: "Controle financeiro pessoal com categorização de lançamentos e relatórios de acompanhamento.",
        en: "Personal finance tracking with transaction categorisation and reporting.",
        es: "Seguimiento de finanzas personales con categorización de movimientos e informes.",
      },
      category: "produtos",
      techStack: ["React", "Node.js", "PostgreSQL"],
      links: [
        { label: { pt: "Site", en: "Live", es: "Ver sitio" }, url: "https://minhas-financas-murex.vercel.app" },
      ],
      status: { pt: "Em produção", en: "In production", es: "En producción" },
      image: "/minhas-financas.png",
    },
    {
      slug: "congresso",
      title: { pt: "Congresso", en: "Congresso", es: "Congresso" },
      tagline: {
        pt: "Gestão de eventos e inscrições",
        en: "Event and registration management",
        es: "Gestión de eventos e inscripciones",
      },
      description: {
        pt: "Gestão de eventos e inscrições, com frontend para participantes e API de orquestração.",
        en: "Event and registration management, with an attendee frontend and an orchestration API.",
        es: "Gestión de eventos e inscripciones, con frontend para participantes y una API de orquestación.",
      },
      category: "produtos",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Express", "PostgreSQL"],
      links: [
        { label: { pt: "Frontend", en: "Frontend", es: "Frontend" }, url: "https://github.com/YagoLagrottiBracco/congresso-front" },
        { label: { pt: "API", en: "API", es: "API" }, url: "https://github.com/YagoLagrottiBracco/congresso-api" },
      ],
      status: { pt: "Estável", en: "Stable", es: "Estable" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/congresso-front",
    },
    {
      slug: "tripsync",
      title: { pt: "TripSync", en: "TripSync", es: "TripSync" },
      tagline: {
        pt: "Roteiros de viagem colaborativos",
        en: "Collaborative travel itineraries",
        es: "Itinerarios de viaje colaborativos",
      },
      description: {
        pt: "Plataforma colaborativa de roteiros de viagem, com aplicativo mobile e backend sincronizado.",
        en: "Collaborative travel itinerary platform, with a mobile app and a synced backend.",
        es: "Plataforma colaborativa de itinerarios de viaje, con aplicación móvil y backend sincronizado.",
      },
      category: "produtos",
      techStack: ["React Native", "Expo", "TypeScript", "NestJS", "MongoDB"],
      links: [
        { label: { pt: "Mobile", en: "Mobile", es: "Móvil" }, url: "https://github.com/YagoLagrottiBracco/tripsync-mobile" },
        { label: { pt: "Backend", en: "Backend", es: "Backend" }, url: "https://github.com/YagoLagrottiBracco/tripsync-backend" },
      ],
      status: { pt: "Em desenvolvimento", en: "In development", es: "En desarrollo" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/tripsync-mobile",
    },
    {
      slug: "templates-web-mobile",
      title: { pt: "Templates Web & Mobile", en: "Web & Mobile Templates", es: "Plantillas web y móviles" },
      tagline: {
        pt: "Bases prontas para começar projeto",
        en: "Starter templates for new projects",
        es: "Plantillas iniciales para nuevos proyectos",
      },
      description: {
        pt: "Bases prontas para web (React/Vite) e mobile (React Native), com navegação, temas e componentes iniciais.",
        en: "Starter templates for web (React/Vite) and mobile (React Native), with navigation, theming and initial components.",
        es: "Plantillas iniciales para web (React/Vite) y móvil (React Native), con navegación, temas y componentes básicos.",
      },
      category: "produtos",
      techStack: ["React", "TypeScript", "Vite", "React Native"],
      links: [
        { label: { pt: "Web", en: "Web", es: "Web" }, url: "https://github.com/YagoLagrottiBracco/web" },
        { label: { pt: "Mobile", en: "Mobile", es: "Móvil" }, url: "https://github.com/YagoLagrottiBracco/mobile" },
      ],
      status: { pt: "Template", en: "Template", es: "Plantilla" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/web",
    },
  ] as ProjectEntry[],
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
