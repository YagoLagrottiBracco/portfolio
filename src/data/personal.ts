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

/** Visible labels for each filter key, in both locales. */
export const projectCategories: { id: ProjectCategoryId; label: LocalizedText }[] = [
  {
    id: "plataformas",
    label: { pt: "Plataformas & E-commerce", en: "Platforms & E-commerce" },
  },
  {
    id: "arquitetura",
    label: { pt: "Sistemas & Arquitetura", en: "Systems & Architecture" },
  },
  {
    id: "ia",
    label: { pt: "IA & Automação", en: "AI & Automation" },
  },
  {
    id: "produtos",
    label: { pt: "Produtos sob medida", en: "Custom Products" },
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
  /**
   * Every project, in one list. `featured: true` promotes an entry to the
   * homepage case-study section and gives it a page at `/projetos/[slug]`;
   * the rest render in the filterable grid. Nothing appears twice.
   */
  projects: [
    // ---------------------------------------------------------------- featured
    {
      slug: "impressaomais3d",
      title: { pt: "ImpressãoMais3D", en: "ImpressãoMais3D" },
      tagline: {
        pt: "E-commerce de impressão 3D sob demanda",
        en: "On-demand 3D printing e-commerce",
      },
      description: {
        pt: "Loja nacional de impressão 3D em FDM, resina e SLS: peça pronta do catálogo ou peça sob medida por upload de STL/OBJ/3MF, com orçamento, prova visual 3D, produção e entrega.",
        en: "Nationwide 3D printing store across FDM, resin and SLS: catalogue parts or custom parts via STL/OBJ/3MF upload, with quoting, 3D visual proof, production and delivery.",
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
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://impressaomais3d.com.br" }],
      status: { pt: "Em produção", en: "In production" },
      image: "/impressaomais3d.png",
      featured: true,
      caseStudy: {
        context: {
          pt: "Uma loja de impressão 3D vende duas coisas muito diferentes pelo mesmo carrinho: uma peça pronta de catálogo e uma peça que ainda não existe, enviada pelo cliente como arquivo 3D. As duas atravessam orçamento, produção, entrega e retirada na loja.",
          en: "A 3D printing store sells two very different things through the same cart: a catalogue part, and a part that does not exist yet, uploaded by the customer as a 3D file. Both run through quoting, production, delivery and in-store pickup.",
        },
        challenge: {
          pt: "Vender uma peça que ninguém viu ainda. O cliente precisa confiar no resultado antes de a produção começar — e, uma vez impressa, não há como desfazer. Some a isso um pedido que atravessa orçamento, arte, pagamento, produção e entrega, cada etapa com regra própria, e o risco real deixa de ser técnico e passa a ser de negócio: imprimir a coisa errada custa material e tempo.",
          en: "Selling a part nobody has seen yet. The customer must trust the result before production starts — and once printed, there is no undo. Add an order that crosses quoting, artwork, payment, production and delivery, each with its own rules, and the real risk stops being technical and becomes commercial: printing the wrong thing costs material and time.",
        },
        solution: {
          pt: "Uma prova visual 3D gerada automaticamente a partir do arquivo enviado, renderizada no navegador, que o cliente aprova antes de qualquer coisa ir para a impressora — a aprovação é um portão explícito no fluxo, não um aviso. Por baixo, um monólito modular com vinte bounded contexts, em que a fronteira entre módulos é verificada por ferramenta, não por combinado.",
          en: "A 3D visual proof generated automatically from the uploaded file and rendered in the browser, which the customer approves before anything reaches the printer — approval is an explicit gate in the flow, not a notice. Underneath, a modular monolith of twenty bounded contexts where module boundaries are enforced by tooling, not by convention.",
        },
        highlights: [
          {
            title: { pt: "Prova visual antes da produção", en: "Visual proof before production" },
            description: {
              pt: "O arquivo enviado (STL, OBJ ou 3MF) é renderizado no navegador com React Three Fiber e vira uma prova que o cliente aprova ou rejeita. A produção fica travada até a aprovação — o que transforma uma discussão sobre expectativa em um registro auditável.",
              en: "The uploaded file (STL, OBJ or 3MF) is rendered in the browser with React Three Fiber and becomes a proof the customer approves or rejects. Production stays locked until approval — turning a conversation about expectations into an auditable record.",
            },
          },
          {
            title: { pt: "Fronteiras que o linter cobra", en: "Boundaries the linter enforces" },
            description: {
              pt: "Cada módulo tem as camadas domain / application / infrastructure / presentation, e a camada de domínio não importa Supabase, Next ou React — isso é imposto por regra de ESLint (no-restricted-imports), não por disciplina. Módulos só se falam pela camada de aplicação.",
              en: "Each module has domain / application / infrastructure / presentation layers, and the domain layer imports no Supabase, Next or React — enforced by an ESLint rule (no-restricted-imports), not by discipline. Modules only talk through the application layer.",
            },
          },
          {
            title: { pt: "Autorização mora no banco", en: "Authorisation lives in the database" },
            description: {
              pt: "As permissões são políticas de Row Level Security no Postgres, não checagens espalhadas pela interface. A tela pode errar; a linha do banco continua protegida.",
              en: "Permissions are Row Level Security policies in Postgres, not checks scattered across the UI. The screen can be wrong; the database row stays protected.",
            },
          },
          {
            title: { pt: "Recusa deliberada de complexidade", en: "Deliberately refusing complexity" },
            description: {
              pt: "Sem microserviços, sem event bus, sem filas — e isso está escrito na arquitetura, com a justificativa. Saber quando não distribuir é uma decisão de projeto tão real quanto saber distribuir.",
              en: "No microservices, no event bus, no queues — and that is written down in the architecture, with the reasoning. Knowing when not to distribute is as real a design decision as knowing how to.",
            },
          },
          {
            title: { pt: "Testado onde dói", en: "Tested where it hurts" },
            description: {
              pt: "Vitest nas regras de negócio e uma suíte Playwright que cobre os fluxos de dinheiro e de produção: pagamento, prova visual, arte, expedição e o painel do revendedor.",
              en: "Vitest on business rules and a Playwright suite covering the money and production paths: payment, visual proof, artwork, fulfilment and the reseller panel.",
            },
          },
        ],
        architecture: {
          pt: "Monólito modular organizado por bounded context em src/modules/, com vinte contextos — entre eles catálogo, precificação, carrinho, pedido, pagamento, arte, prova visual, expedição, cupom, campanha, CRM e base de conhecimento da IA.",
          en: "Modular monolith organised by bounded context under src/modules/, with twenty contexts — among them catalogue, pricing, cart, order, payment, artwork, visual proof, fulfilment, coupons, campaigns, CRM and the AI knowledge base.",
        },
      },
    },
    {
      slug: "digitaltechms",
      title: { pt: "Digital Tech MS", en: "Digital Tech MS" },
      tagline: {
        pt: "Gráfica online com aprovação de arte e produção",
        en: "Online print shop with artwork approval and production",
      },
      description: {
        pt: "E-commerce de produtos gráficos personalizáveis: o cliente configura o produto, envia e aprova a arte e acompanha a produção até a entrega ou a retirada na loja.",
        en: "E-commerce for customisable print products: the customer configures the product, uploads and approves the artwork, and follows production through to delivery or in-store pickup.",
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
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://digitaltechms.com.br" }],
      status: { pt: "Em produção", en: "In production" },
      image: "/digitaltechms.png",
      featured: true,
      caseStudy: {
        context: {
          pt: "Uma gráfica vende cartão de visita, banner, adesivo e papelaria — produtos em que quase nada tem preço de prateleira e quase tudo depende de uma arte que o cliente manda.",
          en: "A print shop sells business cards, banners, stickers and stationery — products where almost nothing has a shelf price and almost everything depends on artwork the customer sends in.",
        },
        challenge: {
          pt: "Produto gráfico não tem preço fixo: ele varia por material, acabamento, dimensão e quantidade, e algumas combinações só fazem sentido sob orçamento. Ao mesmo tempo, imprimir é irreversível — uma arte errada aprovada por engano vira prejuízo material, não um bug que se corrige em produção.",
          en: "Print products have no fixed price: it varies by material, finish, dimensions and quantity, and some combinations only make sense as a custom quote. At the same time, printing is irreversible — wrong artwork approved by mistake becomes material loss, not a bug you patch in production.",
        },
        solution: {
          pt: "Um motor de precificação sobre opções configuráveis, que calcula no servidor e recalcula antes de gravar o carrinho, com uma saída de escape para orçamento personalizado quando o produto não tem preço fixo. E um fluxo de arte com aprovação explícita, que só então libera a produção.",
          en: "A pricing engine over configurable options that calculates on the server and recalculates before writing the cart, with an escape hatch into custom quoting when a product has no fixed price. And an artwork flow with explicit approval, which only then releases production.",
        },
        highlights: [
          {
            title: { pt: "Preço calculado no servidor", en: "Price calculated on the server" },
            description: {
              pt: "O preço nunca vem do cliente. As opções configuráveis alimentam um motor de cálculo que roda no servidor e é recalculado antes de gravar o item no carrinho — o navegador não consegue negociar o próprio desconto.",
              en: "The price never comes from the client. Configurable options feed a calculation engine that runs on the server and is recalculated before the item is written to the cart — the browser cannot negotiate its own discount.",
            },
          },
          {
            title: { pt: "Orçamento para o que não tem preço", en: "Quoting for what has no price" },
            description: {
              pt: "Produto sem preço fixo não fica de fora da loja: ele entra por um fluxo próprio de solicitação de orçamento, que o staff responde e o cliente aceita, sem sair da mesma conta e do mesmo histórico de pedidos.",
              en: "A product with no fixed price is not left out of the store: it enters through its own quote-request flow that staff answer and the customer accepts, without leaving the same account and order history.",
            },
          },
          {
            title: { pt: "Pedido como registro imutável", en: "The order as an immutable record" },
            description: {
              pt: "Fechar o carrinho congela os itens e os preços em um pedido com número próprio e ciclo de status. O que foi combinado no momento da compra não muda depois, mesmo que o catálogo mude.",
              en: "Closing the cart freezes items and prices into an order with its own number and status cycle. What was agreed at purchase time does not change later, even if the catalogue does.",
            },
          },
          {
            title: { pt: "Retirada com código", en: "Pickup with a code" },
            description: {
              pt: "Quem opta por retirar na loja recebe um código que o staff resgata no balcão — o pedido só é dado como entregue contra esse resgate.",
              en: "Customers choosing in-store pickup get a code that staff redeem at the counter — the order is only marked delivered against that redemption.",
            },
          },
        ],
        architecture: {
          pt: "Mesma base arquitetural do ImpressãoMais3D — monólito modular por bounded context, com a camada de domínio isolada por regra de ESLint. Este projeto foi a base de código que depois deu origem ao ImpressãoMais3D.",
          en: "The same architectural base as ImpressãoMais3D — a modular monolith by bounded context with the domain layer isolated by an ESLint rule. This codebase was the one that later gave rise to ImpressãoMais3D.",
        },
      },
    },
    {
      slug: "dupla-face",
      title: { pt: "Estúdio Dupla Face", en: "Estúdio Dupla Face" },
      tagline: {
        pt: "Site e portal do cliente para estúdio de arquitetura",
        en: "Website and client portal for an architecture studio",
      },
      description: {
        pt: "Site institucional e plataforma de acompanhamento de obra para um estúdio de arquitetura de São Paulo, com planta interativa, portal do cliente e conversa em tempo real.",
        en: "Marketing site and project-tracking platform for a São Paulo architecture studio, with an interactive floor plan, a client portal and realtime messaging.",
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
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://duplaface.arq.br" }],
      status: { pt: "Em produção", en: "In production" },
      image: "/duplaface.png",
      featured: true,
      caseStudy: {
        context: {
          pt: "O Estúdio Dupla Face trabalha com residências, interiores e cenografia, e define o próprio ofício por duas faces: a que se vê — luz, material, paisagem — e a que sustenta — desenho preciso e documentação que a obra entende.",
          en: "Estúdio Dupla Face works across homes, interiors and scenography, and defines its own craft by two faces: the one you see — light, material, landscape — and the one that holds it up: precise drawings and documentation the building site can follow.",
        },
        challenge: {
          pt: "Um projeto de arquitetura vira um monte de arquivo espalhado: plantas, desenhos técnicos, referências, fotos de obra e decisões combinadas por WhatsApp. O cliente não sabe onde olhar, e o estúdio repete a mesma informação por meses. O problema não era guardar arquivo — era dar a eles um lugar onde fizessem sentido juntos.",
          en: "An architecture project becomes a pile of scattered files: plans, technical drawings, references, site photos and decisions agreed over WhatsApp. The client does not know where to look, and the studio repeats the same information for months. The problem was not storing files — it was giving them a place where they make sense together.",
        },
        solution: {
          pt: "A planta baixa virou a interface. O arquiteto marca um ponto sobre cada ambiente e acumula ali dentro quantos desenhos, imagens e textos quiser — a planta deixa de ser uma imagem e vira o índice do projeto. Em volta dela, um portal em que o cliente conversa com o estúdio e baixa documentos, e um painel em que o estúdio publica o que quiser mostrar no site.",
          en: "The floor plan became the interface. The architect drops a pin on each room and accumulates as many drawings, images and notes inside it as needed — the plan stops being a picture and becomes the project's index. Around it, a portal where the client talks to the studio and downloads documents, and a panel where the studio publishes what it wants shown on the site.",
        },
        highlights: [
          {
            title: { pt: "Marcação fiel em qualquer tela", en: "Pins that hold at any size" },
            description: {
              pt: "As coordenadas de cada ponto são gravadas em porcentagem da imagem, não em pixels. A marcação continua exatamente sobre o ambiente certo em qualquer largura de tela e em qualquer nível de zoom — detalhe pequeno que decide se a funcionalidade é usável no celular da obra.",
              en: "Each pin's coordinates are stored as a percentage of the image, not in pixels. The marker stays exactly over the right room at any screen width and any zoom level — a small detail that decides whether the feature is usable on a phone at the building site.",
            },
          },
          {
            title: { pt: "A proteção mora no banco", en: "Protection lives in the database" },
            description: {
              pt: "Cada tabela tem Row Level Security, e as políticas partem de três funções: is_admin(), is_approved() e a posse da linha. Cliente aprovado enxerga apenas os próprios projetos, conversas e documentos — mesmo que a interface erre.",
              en: "Every table has Row Level Security, and the policies rest on three functions: is_admin(), is_approved() and row ownership. An approved client sees only their own projects, conversations and documents — even if the interface gets it wrong.",
            },
          },
          {
            title: { pt: "Documento privado, link que expira", en: "Private documents, expiring links" },
            description: {
              pt: "Os documentos ficam em bucket privado com o identificador do cliente como primeiro nível do caminho, e o download passa por uma rota que revalida a posse antes de assinar uma URL de 60 segundos. Link vazado deixa de ser um problema um minuto depois.",
              en: "Documents live in a private bucket with the client id as the first path segment, and downloads go through a route that re-checks ownership before signing a 60-second URL. A leaked link stops being a problem a minute later.",
            },
          },
          {
            title: { pt: "Falha do banco não derruba o site", en: "A database blip does not take the site down" },
            description: {
              pt: "As requisições ao banco têm teto de tempo. Se ele não responde, as leituras do site público viram estado vazio e o erro vai para o log — a página continua de pé. Já as escritas falham de forma visível, porque ali o usuário precisa saber.",
              en: "Database calls are time-capped. If it does not answer, public-site reads degrade to an empty state and the error goes to the log — the page stays up. Writes, by contrast, fail loudly, because there the user needs to know.",
            },
          },
          {
            title: { pt: "Acesso por aprovação", en: "Access by approval" },
            description: {
              pt: "Todo cadastro nasce pendente e só vira acesso depois que um administrador aprova — o portal de um cliente nunca abre sozinho.",
              en: "Every sign-up starts pending and only becomes access after an administrator approves it — a client portal never opens on its own.",
            },
          },
        ],
      },
    },
    {
      slug: "flora-psicologia",
      title: { pt: "Flora Psicologia", en: "Flora Psicologia" },
      tagline: {
        pt: "Site, agendamento e blog para consultório de psicologia",
        en: "Website, booking and blog for a psychology practice",
      },
      description: {
        pt: "Site profissional para psicóloga com agendamento online, painel de gestão e blog otimizado para busca — construído dentro das restrições éticas do CFP e da LGPD.",
        en: "Professional website for a psychologist with online booking, an admin panel and an SEO-optimised blog — built within Brazilian professional-ethics and data-protection constraints.",
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
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://florapsicologa.com.br" }],
      status: { pt: "Em produção", en: "In production" },
      image: "/flora.png",
      featured: true,
      caseStudy: {
        context: {
          pt: "Uma psicóloga atendendo online precisa ser encontrada por quem procura ajuda e precisa que agendar seja simples — sem que isso a coloque em conflito com as regras da profissão.",
          en: "A psychologist working online needs to be found by people looking for help, and needs booking to be simple — without putting her at odds with the rules of her profession.",
        },
        challenge: {
          pt: "A maior parte das alavancas comuns de conversão está proibida. O Conselho Federal de Psicologia veda promessa de resultado e depoimento de paciente, que é justamente o que um site de serviço costuma usar para convencer. Ainda por cima, o que trafega ali é dado sensível de saúde, sob LGPD. O site precisava converter pela clareza, e não pelo apelo.",
          en: "Most of the usual conversion levers are off the table. Brazil's psychology council forbids promising outcomes and publishing patient testimonials — precisely what a service site normally leans on. On top of that, what flows through it is sensitive health data under Brazil's data-protection law. The site had to convert through clarity, not persuasion.",
        },
        solution: {
          pt: "A confiança foi construída com o que é permitido e verificável: CRP sempre visível, explicação honesta de como a terapia funciona, dúvidas frequentes respondidas sem rodeio e um agendamento curto. O ganho de alcance veio de SEO técnico bem feito, não de propaganda.",
          en: "Trust was built from what is allowed and verifiable: the professional licence number always visible, an honest explanation of how therapy works, frequently asked questions answered plainly, and a short booking flow. Reach came from solid technical SEO, not from advertising.",
        },
        highlights: [
          {
            title: { pt: "Conformidade ética como requisito", en: "Professional ethics as a requirement" },
            description: {
              pt: "Nenhuma promessa de cura, nenhum depoimento de paciente e o registro profissional visível em todas as páginas. A restrição virou diretriz de conteúdo desde o começo, em vez de uma revisão dolorosa no fim.",
              en: "No promises of cure, no patient testimonials, and the professional licence visible on every page. The constraint became a content guideline from the start, instead of a painful review at the end.",
            },
          },
          {
            title: { pt: "SEO local estruturado", en: "Structured local SEO" },
            description: {
              pt: "Dados estruturados JSON-LD de Psychologist, Person, WebSite e FAQPage, metadados por página com canonical, e sitemap e robots gerados automaticamente — com o painel administrativo marcado como noindex.",
              en: "JSON-LD structured data for Psychologist, Person, WebSite and FAQPage, per-page metadata with canonicals, and automatic sitemap and robots — with the admin panel marked noindex.",
            },
          },
          {
            title: { pt: "Blog que a profissional mantém sozinha", en: "A blog she maintains herself" },
            description: {
              pt: "Editor de artigos com campos de SEO no próprio painel, publicando em SSG/ISR: as páginas são estáticas e rápidas, mas ela não depende de ninguém para publicar.",
              en: "An article editor with SEO fields in her own panel, publishing through SSG/ISR: pages are static and fast, but she does not depend on anyone to publish.",
            },
          },
          {
            title: { pt: "Roda sem configuração nenhuma", en: "Runs with no configuration at all" },
            description: {
              pt: "Sem o banco configurado, o site sobe em modo demonstração com dados de exemplo; ao conectar as credenciais, passa a usar dados reais sozinho. Isso torna o projeto apresentável desde o primeiro minuto e o desenvolvimento independente de credencial.",
              en: "With no database configured, the site boots in demo mode with sample data; once credentials are connected, it switches to real data on its own. That makes the project presentable from minute one and development free of credential setup.",
            },
          },
        ],
      },
    },
    {
      slug: "vmageste",
      title: { pt: "vmageste", en: "vmageste" },
      tagline: {
        pt: "Plataforma SaaS de marketing analytics",
        en: "Marketing analytics SaaS platform",
      },
      description: {
        pt: "Plataforma que centraliza campanhas, leads e analytics de múltiplas fontes de tráfego em um painel só, com enriquecimento e deduplicação de leads, alertas e relatórios.",
        en: "Platform centralising campaigns, leads and analytics from multiple traffic sources in a single dashboard, with lead enrichment and deduplication, alerts and reports.",
      },
      category: "arquitetura",
      techStack: [
        "Golang",
        "Apache Kafka",
        "NestJS",
        "ClickHouse",
        "Next.js",
        "Redis",
        "PostgreSQL",
        "Clean Architecture",
        "DDD",
      ],
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://vmageste.com.br" }],
      status: { pt: "Em desenvolvimento", en: "In development" },
      image: "/vmageste.png",
      featured: true,
      caseStudy: {
        context: {
          pt: "Agências e times de performance vivem alternando entre os painéis de Meta, Google e TikTok, e reconciliando números que nunca batem. A plataforma junta essas fontes em um lugar só.",
          en: "Agencies and performance teams live switching between Meta, Google and TikTok dashboards, reconciling numbers that never quite match. The platform brings those sources into one place.",
        },
        challenge: {
          pt: "Ingestão massiva de dados de várias plataformas ao mesmo tempo, com cálculos que precisam responder em tempo real. O monolito original fazia a ingestão e a consulta competirem pelo mesmo banco — quanto mais dado entrava, mais lento ficava justamente o painel que justificava o produto.",
          en: "Massive data ingestion from several platforms at once, with calculations that must answer in real time. The original monolith made ingestion and querying compete for the same database — the more data came in, the slower the very dashboard that justified the product became.",
        },
        solution: {
          pt: "Redesenho arquitetural pelo padrão Strangler Fig, migrando o monolito para uma arquitetura orientada a eventos de forma incremental, sem parar o produto. A ingestão passou a ser assíncrona sobre Kafka e a leitura analítica foi para um banco colunar, separando as duas cargas que antes brigavam.",
          en: "An architectural redesign using the Strangler Fig pattern, migrating the monolith to an event-driven architecture incrementally, without stopping the product. Ingestion became asynchronous over Kafka and analytical reads moved to a columnar database, separating the two workloads that used to fight each other.",
        },
        highlights: [
          {
            title: { pt: "Migração sem parar o produto", en: "Migrating without stopping the product" },
            description: {
              pt: "O padrão Strangler Fig permitiu substituir o monolito por partes, mantendo o sistema antigo no ar enquanto cada fatia migrava — em vez de uma reescrita de uma vez só, que é onde esse tipo de projeto costuma morrer.",
              en: "The Strangler Fig pattern allowed replacing the monolith piece by piece, keeping the old system running while each slice migrated — instead of a big-bang rewrite, which is where this kind of project usually dies.",
            },
          },
          {
            title: { pt: "Separar escrita de leitura analítica", en: "Splitting writes from analytical reads" },
            description: {
              pt: "Ingestão assíncrona sobre Kafka e consulta analítica em banco colunar. As duas cargas deixaram de competir pelo mesmo recurso, que era a causa real da lentidão.",
              en: "Asynchronous ingestion over Kafka and analytical querying on a columnar store. The two workloads stopped competing for the same resource, which was the real cause of the slowness.",
            },
          },
          {
            title: { pt: "Lead limpo na entrada", en: "Clean leads at the door" },
            description: {
              pt: "Enriquecimento e deduplicação acontecem no fluxo de ingestão, não em relatório. O time comercial recebe uma base já tratada, em vez de descobrir o duplicado na hora de ligar.",
              en: "Enrichment and deduplication happen in the ingestion pipeline, not in a report. The sales team receives an already-cleaned base instead of discovering duplicates while dialling.",
            },
          },
        ],
      },
    },
    {
      slug: "devagent",
      title: { pt: "DevAgent — o Kanban autônomo", en: "DevAgent — the Autonomous Kanban" },
      tagline: {
        pt: "Um agente que lê o card e abre o pull request",
        en: "An agent that reads the card and opens the pull request",
      },
      description: {
        pt: "Sistema autônomo de engenharia de software: a IA lê os requisitos do card, escreve a lógica, roda os testes e entrega via pull request no GitHub.",
        en: "Autonomous software engineering system: the AI reads the card requirements, writes the logic, runs the tests and delivers through a GitHub pull request.",
      },
      category: "ia",
      techStack: ["LLMs", "GitHub API", "TypeScript", "Automação"],
      links: [],
      status: { pt: "Em desenvolvimento", en: "In development" },
      image: "/devagent.png",
      featured: true,
      caseStudy: {
        context: {
          pt: "Em todo backlog existe uma faixa de tarefas que é simples, repetitiva e mesmo assim consome um desenvolvedor: o CRUD a mais, o campo novo no formulário, o ajuste de validação.",
          en: "Every backlog has a band of work that is simple, repetitive and still consumes a developer: one more CRUD, a new form field, a validation tweak.",
        },
        challenge: {
          pt: "Eliminar o gargalo humano nesse tipo de tarefa sem abrir mão da revisão. Um agente que escreve código direto na branch principal é um risco; o valor só aparece se ele entrar pelo mesmo portão de qualidade que qualquer pessoa do time.",
          en: "Removing the human bottleneck on that kind of task without giving up review. An agent writing straight to the main branch is a liability; the value only shows up if it enters through the same quality gate as anyone else on the team.",
        },
        solution: {
          pt: "O agente age como um desenvolvedor virtual dentro do fluxo que já existe: puxa o card, interpreta o requisito, escreve a implementação, executa os testes e abre um pull request. A revisão humana continua sendo o último passo — o que muda é quem escreve o primeiro rascunho.",
          en: "The agent acts as a virtual developer inside the workflow that already exists: it pulls the card, interprets the requirement, writes the implementation, runs the tests and opens a pull request. Human review remains the final step — what changes is who writes the first draft.",
        },
        highlights: [
          {
            title: { pt: "Entrega pelo pull request, não pela branch", en: "Delivery by pull request, not by branch" },
            description: {
              pt: "A saída do agente é sempre um PR. Isso mantém o histórico legível, o diff revisável e o poder de veto com o time — a automação acelera o começo do trabalho, não o fim dele.",
              en: "The agent's output is always a PR. That keeps history readable, the diff reviewable and veto power with the team — automation speeds up the start of the work, not the end of it.",
            },
          },
          {
            title: { pt: "O teste como portão", en: "Tests as the gate" },
            description: {
              pt: "O agente roda a suíte antes de entregar. Se não passa, ele não abre PR — o que evita transferir para a revisão humana um trabalho que a máquina já sabia estar errado.",
              en: "The agent runs the suite before delivering. If it does not pass, it does not open a PR — which avoids handing human review work the machine already knew was broken.",
            },
          },
          {
            title: { pt: "O card como especificação", en: "The card as the spec" },
            description: {
              pt: "O requisito de entrada é o próprio card do quadro, do jeito que o time já escreve. Não há uma segunda linguagem de prompt para manter em dia.",
              en: "The input requirement is the board card itself, written the way the team already writes it. There is no second prompt language to keep in sync.",
            },
          },
        ],
      },
    },

    // ------------------------------------------------------------------- grid
    {
      slug: "eurologado",
      title: { pt: "Eurologado (Compliance AI)", en: "Eurologado (Compliance AI)" },
      tagline: {
        pt: "Conformidade de cosméticos na União Europeia",
        en: "EU cosmetics regulatory compliance",
      },
      description: {
        pt: "Sistema completo para conformidade de cosméticos na Europa, gerando dossiês automaticamente, detectando inconformidades e usando IA na criação de documentos.",
        en: "End-to-end compliance system for EU cosmetics, auto-generating dossiers, detecting issues, and using AI for document creation.",
      },
      category: "ia",
      techStack: ["Next.js", "NestJS", "PostgreSQL", "LLM"],
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://pif.eurologado.eu" }],
      status: { pt: "Em produção", en: "In production" },
      image: "/eurologado.png",
    },
    {
      slug: "pulsewatch",
      title: { pt: "PulseWatch", en: "PulseWatch" },
      tagline: {
        pt: "Monitor de e-commerce com alerta imediato",
        en: "E-commerce monitoring with instant alerts",
      },
      description: {
        pt: "Monitor de e-commerce com alertas imediatos sobre queda de vendas, estoque zerado e erros críticos que tiram a loja do ar.",
        en: "Ecommerce monitor with instant alerts for sales drop-offs, stockouts, and critical errors taking the store down.",
      },
      category: "arquitetura",
      techStack: ["Node.js", "TypeScript", "PostgreSQL"],
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://pulsewatch.click" }],
      status: { pt: "Em desenvolvimento", en: "In development" },
      image: "/pulsewatch.png",
    },
    {
      slug: "normify",
      title: { pt: "Normify", en: "Normify" },
      tagline: {
        pt: "Gestão de normas e conformidade",
        en: "Standards and compliance management",
      },
      description: {
        pt: "Gestão de normas e conformidade com painéis de acompanhamento e automações de alerta.",
        en: "Compliance and policy management with tracking dashboards and alert automations.",
      },
      category: "arquitetura",
      techStack: ["Vue.js", "Node.js", "PostgreSQL"],
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://normify.app" }],
      status: { pt: "MVP", en: "MVP" },
      image: "/normify.png",
    },
    {
      slug: "agendify",
      title: { pt: "Agendify", en: "Agendify" },
      tagline: {
        pt: "Plataforma de agendamentos self-service",
        en: "Self-service scheduling platform",
      },
      description: {
        pt: "Plataforma de agendamentos com notificações automáticas e gestão de clientes e disponibilidade.",
        en: "Scheduling platform with automated notifications and client and availability management.",
      },
      category: "arquitetura",
      techStack: ["React", "Node.js", "MongoDB"],
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://agendify.me" }],
      status: { pt: "Em desenvolvimento", en: "In development" },
      image: "/agendify.png",
    },
    {
      slug: "99freelas-proposal-assistant",
      title: { pt: "99Freelas Proposal Assistant", en: "99Freelas Proposal Assistant" },
      tagline: {
        pt: "Extensão de Chrome que escreve propostas com IA",
        en: "Chrome extension that writes proposals with AI",
      },
      description: {
        pt: "Extensão nativa do Chrome que analisa o escopo da vaga e gera propostas comerciais personalizadas em segundos.",
        en: "Native Chrome extension that analyses job scope and generates personalised proposals in seconds.",
      },
      category: "ia",
      techStack: ["Chrome Extension", "AI APIs", "JavaScript"],
      links: [
        {
          label: { pt: "Chrome Web Store", en: "Chrome Web Store" },
          url: "https://chromewebstore.google.com/detail/gfejcpifdmhhfelnjbkaiblbfkfagcgn",
        },
      ],
      status: { pt: "Publicado", en: "Published" },
      image: "/99freelasprop.png",
    },
    {
      slug: "ikigai",
      title: { pt: "Ikigai IA", en: "Ikigai AI" },
      tagline: {
        pt: "Motor de autoconhecimento guiado por LLM",
        en: "LLM-guided self-knowledge engine",
      },
      description: {
        pt: "Motor de análise interativa com LLMs voltado a desenvolvimento pessoal, cruzando as respostas do usuário com o framework Ikigai.",
        en: "Interactive analysis engine with LLMs focused on personal development, cross-referencing user answers with the Ikigai framework.",
      },
      category: "ia",
      techStack: ["LLMs", "Prompt Engineering", "Next.js"],
      links: [{ label: { pt: "Site", en: "Live" }, url: "https://florir.online/" }],
      status: { pt: "Em produção", en: "In production" },
      image: "/ikigai.png",
    },
    {
      slug: "dreamerz",
      title: { pt: "Dreamerz", en: "Dreamerz" },
      tagline: {
        pt: "Objetivos e métricas de vida",
        en: "Life goals and metrics",
      },
      description: {
        pt: "Plataforma para acompanhamento de objetivos e métricas de vida, com frontend Next.js e API em NestJS.",
        en: "Platform for tracking life goals and metrics, with a Next.js frontend and a NestJS API.",
      },
      category: "produtos",
      techStack: ["React", "Next.js", "Tailwind CSS", "NestJS", "PostgreSQL"],
      links: [
        { label: { pt: "Frontend", en: "Frontend" }, url: "https://github.com/YagoLagrottiBracco/dreamerz-front" },
        { label: { pt: "API", en: "API" }, url: "https://github.com/YagoLagrottiBracco/dreamerz-api" },
      ],
      status: { pt: "Em produção", en: "In production" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/dreamerz-front",
    },
    {
      slug: "meu-mundo-mental",
      title: { pt: "Meu Mundo Mental", en: "My World Mental" },
      tagline: {
        pt: "Avaliação de saúde mental sob a NR-1",
        en: "Mental health assessment under Brazil's NR-1",
      },
      description: {
        pt: "Criador de formulários para avaliação de saúde mental no trabalho, seguindo os requisitos da NR-1.",
        en: "Form builder for workplace mental health assessment, following the requirements of Brazil's NR-1 regulation.",
      },
      category: "produtos",
      techStack: ["NestJS", "TypeScript", "Prisma"],
      links: [
        { label: { pt: "Repositório", en: "Repository" }, url: "https://github.com/YagoLagrottiBracco/andre" },
      ],
      status: { pt: "Prototipagem", en: "Prototyping" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/andre",
    },
    {
      slug: "techworky-digital",
      title: { pt: "TechWorky Digital (Interno)", en: "TechWorky Digital (Internal)" },
      tagline: {
        pt: "Ferramentas internas de operação digital",
        en: "Internal digital operations tooling",
      },
      description: {
        pt: "Ferramentas internas para operação digital e automação de processos da agência.",
        en: "Internal tools for digital operations and agency process automation.",
      },
      category: "produtos",
      techStack: ["Laravel", "MySQL", "Vue.js"],
      links: [
        {
          label: { pt: "Repositório", en: "Repository" },
          url: "https://github.com/YagoLagrottiBracco/techworkydigital-interno",
        },
      ],
      status: { pt: "Em produção", en: "In production" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/techworkydigital-interno",
    },
    {
      slug: "minhas-financas",
      title: { pt: "Minhas Finanças", en: "My Finances" },
      tagline: {
        pt: "Controle financeiro pessoal",
        en: "Personal finance tracking",
      },
      description: {
        pt: "Controle financeiro pessoal com categorização de lançamentos e relatórios de acompanhamento.",
        en: "Personal finance tracking with transaction categorisation and reporting.",
      },
      category: "produtos",
      techStack: ["React", "Node.js", "PostgreSQL"],
      links: [
        { label: { pt: "Site", en: "Live" }, url: "https://minhas-financas-murex.vercel.app" },
      ],
      status: { pt: "Em produção", en: "In production" },
      image: "/minhas-financas.png",
    },
    {
      slug: "congresso",
      title: { pt: "Congresso", en: "Congresso" },
      tagline: {
        pt: "Gestão de eventos e inscrições",
        en: "Event and registration management",
      },
      description: {
        pt: "Gestão de eventos e inscrições, com frontend para participantes e API de orquestração.",
        en: "Event and registration management, with an attendee frontend and an orchestration API.",
      },
      category: "produtos",
      techStack: ["React", "TypeScript", "Tailwind CSS", "Express", "PostgreSQL"],
      links: [
        { label: { pt: "Frontend", en: "Frontend" }, url: "https://github.com/YagoLagrottiBracco/congresso-front" },
        { label: { pt: "API", en: "API" }, url: "https://github.com/YagoLagrottiBracco/congresso-api" },
      ],
      status: { pt: "Estável", en: "Stable" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/congresso-front",
    },
    {
      slug: "tripsync",
      title: { pt: "TripSync", en: "TripSync" },
      tagline: {
        pt: "Roteiros de viagem colaborativos",
        en: "Collaborative travel itineraries",
      },
      description: {
        pt: "Plataforma colaborativa de roteiros de viagem, com aplicativo mobile e backend sincronizado.",
        en: "Collaborative travel itinerary platform, with a mobile app and a synced backend.",
      },
      category: "produtos",
      techStack: ["React Native", "Expo", "TypeScript", "NestJS", "MongoDB"],
      links: [
        { label: { pt: "Mobile", en: "Mobile" }, url: "https://github.com/YagoLagrottiBracco/tripsync-mobile" },
        { label: { pt: "Backend", en: "Backend" }, url: "https://github.com/YagoLagrottiBracco/tripsync-backend" },
      ],
      status: { pt: "Em desenvolvimento", en: "In development" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/tripsync-mobile",
    },
    {
      slug: "templates-web-mobile",
      title: { pt: "Templates Web & Mobile", en: "Web & Mobile Templates" },
      tagline: {
        pt: "Bases prontas para começar projeto",
        en: "Starter templates for new projects",
      },
      description: {
        pt: "Bases prontas para web (React/Vite) e mobile (React Native), com navegação, temas e componentes iniciais.",
        en: "Starter templates for web (React/Vite) and mobile (React Native), with navigation, theming and initial components.",
      },
      category: "produtos",
      techStack: ["React", "TypeScript", "Vite", "React Native"],
      links: [
        { label: { pt: "Web", en: "Web" }, url: "https://github.com/YagoLagrottiBracco/web" },
        { label: { pt: "Mobile", en: "Mobile" }, url: "https://github.com/YagoLagrottiBracco/mobile" },
      ],
      status: { pt: "Template", en: "Template" },
      image: "https://opengraph.githubassets.com/1/YagoLagrottiBracco/web",
    },
  ] as ProjectEntry[],
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
