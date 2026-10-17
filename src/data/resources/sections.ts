import { tr, type ResourceSection } from "./types"

export const resourceSections: ResourceSection[] = [
  {
    slug: "ferramentas",
    title: tr("Ferramentas gratuitas", "Free tools", "Herramientas gratuitas"),
    description: tr(
      "Compare JSON e revise chaves de ambiente no navegador.",
      "Compare JSON and review environment keys in your browser.",
      "Compara JSON y revisa claves de entorno en el navegador."
    ),
  },
  {
    slug: "demos",
    title: tr("Demos interativas", "Interactive demos", "Demos interactivas"),
    description: tr(
      "Explore produtos reais e experimente filas, falhas e recuperação.",
      "Explore real products and experiment with queues, failures and recovery.",
      "Explora productos reales y experimenta con colas, fallos y recuperación."
    ),
  },
  {
    slug: "templates",
    title: tr(
      "Templates e código",
      "Templates and code",
      "Plantillas y código"
    ),
    description: tr(
      "Um worker executável e um registro de decisão para reutilizar.",
      "A runnable worker and a decision record to reuse.",
      "Un worker ejecutable y un registro de decisión reutilizable."
    ),
  },
  {
    slug: "benchmarks",
    title: tr("Benchmarks abertos", "Open benchmarks", "Benchmarks abiertos"),
    description: tr(
      "Medições locais com código, dados brutos e limites explícitos.",
      "Local measurements with source, raw data and explicit limitations.",
      "Mediciones locales con código, datos y limitaciones explícitas."
    ),
  },
  {
    slug: "diagramas",
    title: tr(
      "Diagramas de arquitetura",
      "Architecture diagrams",
      "Diagramas de arquitectura"
    ),
    description: tr(
      "Fluxos dos estudos de caso para estudar, baixar e citar.",
      "Case study flows to study, download and cite.",
      "Flujos de los casos para estudiar, descargar y citar."
    ),
  },
  {
    slug: "guias",
    title: tr("Guias de decisão", "Decision guides", "Guías de decisión"),
    description: tr(
      "Critérios e consequências para escolher uma arquitetura.",
      "Criteria and consequences for choosing an architecture.",
      "Criterios y consecuencias para elegir una arquitectura."
    ),
  },
  {
    slug: "temas",
    title: tr("Explore por assunto", "Explore by topic", "Explora por tema"),
    description: tr(
      "Projetos, artigos e recursos conectados por tema.",
      "Projects, articles and resources connected by topic.",
      "Proyectos, artículos y recursos conectados por tema."
    ),
  },
  {
    slug: "glossario",
    title: tr("Glossário aplicado", "Applied glossary", "Glosario aplicado"),
    description: tr(
      "Conceitos explicados com exemplos deste portfólio.",
      "Concepts explained using examples from this portfolio.",
      "Conceptos explicados con ejemplos de este portafolio."
    ),
  },
  {
    slug: "laboratorio",
    title: tr("Laboratório público", "Public lab", "Laboratorio público"),
    description: tr(
      "Hipóteses, experimentos executáveis e suas limitações.",
      "Hypotheses, runnable experiments and their limitations.",
      "Hipótesis, experimentos ejecutables y sus limitaciones."
    ),
  },
  {
    slug: "atualizacoes",
    title: tr(
      "Evolução dos projetos",
      "Project evolution",
      "Evolución de proyectos"
    ),
    description: tr(
      "Decisões documentadas e novos recursos, sem histórico inventado.",
      "Documented decisions and new resources, with no invented history.",
      "Decisiones documentadas y nuevos recursos, sin historia inventada."
    ),
  },
  {
    slug: "videos",
    title: tr(
      "Vídeos de demonstração",
      "Demo videos",
      "Vídeos de demostración"
    ),
    description: tr(
      "Veja as ferramentas em ação, com legendas e transcrição.",
      "See the tools in action, with captions and transcripts.",
      "Mira las herramientas en acción, con subtítulos y transcripción."
    ),
  },
  {
    slug: "carrosseis",
    title: tr(
      "Carrosséis dos projetos",
      "Project carousels",
      "Carruseles de proyectos"
    ),
    description: tr(
      "Sequências de imagens prontas para apresentar cada caso.",
      "Image sequences ready to present each case study.",
      "Secuencias de imágenes para presentar cada caso."
    ),
  },
  {
    slug: "imprensa",
    title: tr("Kit de apresentação", "Press kit", "Kit de presentación"),
    description: tr(
      "Biografia, identidade visual e referências em um lugar.",
      "Biography, visual identity and references in one place.",
      "Biografía, identidad visual y referencias en un solo lugar."
    ),
  },
  {
    slug: "palestras",
    title: tr(
      "Palestras e workshops",
      "Talks and workshops",
      "Charlas y talleres"
    ),
    description: tr(
      "Propostas de sessões técnicas com roteiro para organizadores.",
      "Technical session proposals with outlines for organizers.",
      "Propuestas de sesiones técnicas con guiones para organizadores."
    ),
  },
  {
    slug: "curadoria",
    title: tr("Para newsletters", "For newsletters", "Para newsletters"),
    description: tr(
      "Resumos editoriais, imagens e referências prontos para curadores.",
      "Editorial summaries, images and references ready for curators.",
      "Resúmenes editoriales, imágenes y referencias para curadores."
    ),
  },
  {
    slug: "colaboracoes",
    title: tr(
      "Colabore em público",
      "Collaborate in public",
      "Colabora en público"
    ),
    description: tr(
      "Briefs abertos para construir uma publicação em conjunto.",
      "Open briefs for creating a publication together.",
      "Briefs abiertos para crear una publicación conjunta."
    ),
  },
  {
    slug: "incorporar",
    title: tr(
      "Incorpore no seu site",
      "Embed on your site",
      "Integra en tu sitio"
    ),
    description: tr(
      "Ferramentas e demos com código de incorporação e atribuição.",
      "Tools and demos with embed code and attribution.",
      "Herramientas y demos con código de integración y atribución."
    ),
  },
  {
    slug: "comunidade",
    title: tr(
      "Feito com os recursos",
      "Built with the resources",
      "Creado con los recursos"
    ),
    description: tr(
      "Exemplos do autor e espaço para aplicações reais da comunidade.",
      "Author examples and a space for real community applications.",
      "Ejemplos del autor y espacio para usos reales de la comunidad."
    ),
  },
  {
    slug: "campanhas",
    title: tr(
      "Campanhas e encontros",
      "Campaigns and sessions",
      "Campañas y sesiones"
    ),
    description: tr(
      "Destinos diretos para o lançamento e uma oficina autoguiada.",
      "Direct destinations for the launch and a self-guided workshop.",
      "Destinos directos para el lanzamiento y un taller autoguiado."
    ),
  },
  {
    slug: "repositorios",
    title: tr("Código público", "Public code", "Código público"),
    description: tr(
      "Repositórios conhecidos, demonstrações e caminhos para contribuir.",
      "Known repositories, demonstrations and ways to contribute.",
      "Repositorios conocidos, demostraciones y formas de contribuir."
    ),
  },
]
