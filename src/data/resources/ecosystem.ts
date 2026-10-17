import { tr, type ResourceEntry } from "./types"

export const ECOSYSTEM_VERSION = "1.0.0"
export const ECOSYSTEM_DATE = "2026-10-17"

export const ecosystemEntries: ResourceEntry[] = [
  {
    slug: "terminal",
    title: tr(
      "Ferramentas no terminal",
      "Tools in your terminal",
      "Herramientas en tu terminal"
    ),
    description: tr(
      "Compare JSON e confira chaves de ambiente usando arquivos locais e relatórios reproduzíveis.",
      "Compare JSON and check environment keys using local files and reproducible reports.",
      "Compara JSON y revisa claves de entorno con archivos locales e informes reproducibles."
    ),
  },
  {
    slug: "github-action",
    title: tr(
      "Automação para seu repositório",
      "Automation for your repository",
      "Automatización para tu repositorio"
    ),
    description: tr(
      "Leve a comparação de contratos e chaves para um workflow com resumo de execução.",
      "Bring contract and key comparison into a workflow with an execution summary.",
      "Lleva la comparación de contratos y claves a un workflow con resumen de ejecución."
    ),
  },
  {
    slug: "executar",
    title: tr(
      "Execute e edite o worker",
      "Run and edit the worker",
      "Ejecuta y edita el worker"
    ),
    description: tr(
      "Abra os fontes executáveis do starter no navegador ou rode os testes localmente.",
      "Open runnable starter sources in your browser or run the tests locally.",
      "Abre el código ejecutable del starter en el navegador o ejecuta sus pruebas localmente."
    ),
  },
  {
    slug: "api-bruno",
    title: tr(
      "Laboratório HTTP e Bruno",
      "HTTP and Bruno lab",
      "Laboratorio HTTP y Bruno"
    ),
    description: tr(
      "Pratique autenticação, paginação e respostas de erro em uma API local com dados fictícios.",
      "Practice authentication, pagination and error responses with a local API and fictional data.",
      "Practica autenticación, paginación y errores con una API local y datos ficticios."
    ),
  },
  {
    slug: "cenarios",
    title: tr(
      "Compartilhe um cenário de fila",
      "Share a queue scenario",
      "Comparte un escenario de cola"
    ),
    description: tr(
      "Preserve os parâmetros de um experimento em um link reproduzível.",
      "Preserve experiment parameters in a reproducible link.",
      "Conserva los parámetros de un experimento en un enlace reproducible."
    ),
  },
  {
    slug: "desafios",
    title: tr(
      "Desafios de engenharia",
      "Engineering challenges",
      "Desafíos de ingeniería"
    ),
    description: tr(
      "Resolva problemas de filas, idempotência e contratos com dicas e correção automática.",
      "Solve queue, idempotency and contract problems with hints and automatic grading.",
      "Resuelve problemas de colas, idempotencia y contratos con pistas y corrección automática."
    ),
  },
  {
    slug: "editor-diagramas",
    title: tr(
      "Adapte uma arquitetura",
      "Adapt an architecture",
      "Adapta una arquitectura"
    ),
    description: tr(
      "Edite componentes e conexões de diagramas e exporte sua própria versão.",
      "Edit diagram components and connections and export your own version.",
      "Edita componentes y conexiones de diagramas y exporta tu versión."
    ),
  },
  {
    slug: "colecoes",
    title: tr(
      "Monte sua coleção",
      "Build your collection",
      "Crea tu colección"
    ),
    description: tr(
      "Selecione recursos, organize uma leitura e compartilhe a seleção com seu time.",
      "Select resources, organize a reading list and share the selection with your team.",
      "Selecciona recursos, organiza una lectura y compártela con tu equipo."
    ),
  },
  {
    slug: "versoes",
    title: tr(
      "Versões e integridade",
      "Versions and integrity",
      "Versiones e integridad"
    ),
    description: tr(
      "Fixe uma versão dos materiais e confira os arquivos com o manifesto SHA-256.",
      "Pin a material version and verify its files with the SHA-256 manifest.",
      "Fija una versión de los materiales y verifica sus archivos con el manifiesto SHA-256."
    ),
  },
  {
    slug: "citacoes",
    title: tr("Cite um material", "Cite a resource", "Cita un material"),
    description: tr(
      "Gere referências em texto e BibTeX com autoria, origem e versão reais.",
      "Generate plain-text and BibTeX references with real authorship, source and version.",
      "Genera referencias en texto y BibTeX con autoría, origen y versión reales."
    ),
  },
  {
    slug: "trechos",
    title: tr(
      "Referências a trechos exatos",
      "References to exact passages",
      "Referencias a fragmentos exactos"
    ),
    description: tr(
      "Use links estáveis para parágrafos e blocos de código dos artigos.",
      "Use stable links to article paragraphs and code blocks.",
      "Usa enlaces estables a párrafos y bloques de código de los artículos."
    ),
  },
  {
    slug: "correcoes",
    title: tr(
      "Sugira uma correção",
      "Suggest a correction",
      "Sugiere una corrección"
    ),
    description: tr(
      "Leve trecho, idioma e contexto a uma proposta de revisão técnica ou de tradução.",
      "Bring a passage, language and context into a technical or translation review proposal.",
      "Lleva un fragmento, idioma y contexto a una propuesta de revisión técnica o de traducción."
    ),
  },
  {
    slug: "pedidos",
    title: tr(
      "Pedidos e próximos passos",
      "Requests and next steps",
      "Solicitudes y próximos pasos"
    ),
    description: tr(
      "Proponha recursos, acompanhe o estado das solicitações e vote no GitHub.",
      "Propose resources, follow request status and vote on GitHub.",
      "Propón recursos, sigue sus solicitudes y vota en GitHub."
    ),
  },
  {
    slug: "catalogo-api",
    title: tr(
      "Catálogo para integrações",
      "Catalogue for integrations",
      "Catálogo para integraciones"
    ),
    description: tr(
      "Consuma metadados públicos em JSON versionado e documentado.",
      "Consume public metadata through documented, versioned JSON.",
      "Consume metadatos públicos mediante JSON versionado y documentado."
    ),
  },
  {
    slug: "cartoes",
    title: tr(
      "Cartões para READMEs",
      "Cards for READMEs",
      "Tarjetas para READMEs"
    ),
    description: tr(
      "Incorpore um cartão SVG de um recurso em uma documentação ou repositório.",
      "Embed a resource SVG card in documentation or a repository.",
      "Integra una tarjeta SVG de un recurso en documentación o repositorios."
    ),
  },
  {
    slug: "links-qr",
    title: tr(
      "Links curtos e QR codes",
      "Short links and QR codes",
      "Enlaces cortos y códigos QR"
    ),
    description: tr(
      "Leve os recursos para slides e materiais impressos com origem de campanha identificada.",
      "Bring resources to slides and print with identified campaign attribution.",
      "Lleva los recursos a diapositivas e impresos con origen de campaña identificado."
    ),
  },
  {
    slug: "referencias",
    title: tr(
      "Quem citou este material",
      "Who referenced this material",
      "Quién citó este material"
    ),
    description: tr(
      "Proponha referências externas verificáveis e acompanhe sua revisão antes de publicação.",
      "Propose verifiable external references and follow review before publication.",
      "Propón referencias externas verificables y sigue su revisión antes de publicarlas."
    ),
  },
  {
    slug: "feeds",
    title: tr(
      "Acompanhe os lançamentos",
      "Follow resource releases",
      "Sigue los lanzamientos"
    ),
    description: tr(
      "Assine atualizações dos recursos por RSS, por coleção ou por material.",
      "Subscribe to resource updates via RSS, by collection or individual resource.",
      "Suscríbete a novedades por RSS, por colección o por material."
    ),
  },
  {
    slug: "contribuicoes",
    title: tr(
      "Contribuições verificáveis",
      "Verifiable contributions",
      "Contribuciones verificables"
    ),
    description: tr(
      "Explore contribuições públicas com fonte, estado e data verificáveis.",
      "Explore public contributions with verifiable source, status and date.",
      "Explora contribuciones públicas con fuente, estado y fecha verificables."
    ),
  },
  {
    slug: "indexnow",
    title: tr(
      "Descoberta com IndexNow",
      "Discovery with IndexNow",
      "Descubrimiento con IndexNow"
    ),
    description: tr(
      "Confira o processo para notificar mecanismos compatíveis sobre URLs alteradas.",
      "Inspect the process for notifying compatible engines about changed URLs.",
      "Consulta el proceso para avisar a motores compatibles de las URL modificadas."
    ),
  },
]
