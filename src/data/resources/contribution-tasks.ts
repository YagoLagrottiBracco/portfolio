import type { Locale } from "@/lib/i18n"
import { tr } from "./types"

type ContributionText = ReturnType<typeof tr>
export type ContributionProjectSlug =
  | "devagent" | "envrune" | "dreamerz" | "meu-mundo-mental" | "congresso" | "tripsync"

export interface ContributionSource {
  repository: string
  commit: string
  path: string
  startLine: number
  endLine: number
  role: "target" | "context"
  url: string
}

export interface ContributionTask {
  id: string
  projectSlug: ContributionProjectSlug
  repository: string
  title: ContributionText
  evidence: ContributionText
  size: "S" | "M"
  estimate: ContributionText
  skills: readonly string[]
  sources: readonly ContributionSource[]
  acceptanceCriteria: readonly ContributionText[]
  issueDraftUrls: Record<Locale, string>
}

/** Read-only public repository inspection; proposals, not published or accepted issues. */
export const contributionVerifiedOn = "2026-10-17"

const snapshots = {
  "dev-forge": "dabb49843b69bb4f9fbb18e4994f27ec9336ce18",
  envrune: "c2aa0d1807862b21b1db757048df703fbe839486",
  "dreamerz-front": "51efb503a97a8d9159d19edb60ccde44c8442c08",
  "dreamerz-api": "541490969f046cd5c7910015933540ae84e62e80",
  andre: "41b801131ffa3727c5f218ffa84fa1142c60c1ad",
  "congresso-front": "8abed2d12d208261a024d0cc0435c29620b451ae",
  "congresso-api": "f31b0d0f31cf5c49bfd9434d9033b4a130f885f8",
  "tripsync-mobile": "f17fa63cd1f61eb386a6dec67d86ed1e93f92697",
  "tripsync-backend": "0583d8796989e083cb1c161de91bc89fe3e15732",
} as const

function source(
  repo: keyof typeof snapshots,
  path: string,
  startLine: number,
  endLine: number,
  role: ContributionSource["role"] = "target",
): ContributionSource {
  const repository = `YagoLagrottiBracco/${repo}`
  const commit = snapshots[repo]
  return { repository, commit, path, startLine, endLine, role,
    url: `https://github.com/${repository}/blob/${commit}/${path}#L${startLine}-L${endLine}` }
}

const draftCopy = {
  notice: tr(
    "Proposta editorial baseada em leitura do código. Ainda não é uma issue publicada nem uma tarefa aprovada pela manutenção. Confira a versão atual e as issues antes de enviar.",
    "Editorial proposal based on source inspection. This is not a published issue or a maintainer-approved task. Check the current version and existing issues before submitting.",
    "Propuesta editorial basada en la revisión del código. Todavía no es una issue publicada ni una tarea aprobada por mantenimiento. Revisa la versión actual y las issues antes de enviar.",
  ),
  evidence: tr("Comportamento observado", "Observed behavior", "Comportamiento observado"),
  sources: tr("Arquivos inspecionados", "Inspected files", "Archivos revisados"),
  criteria: tr("Critérios de aceite", "Acceptance criteria", "Criterios de aceptación"),
  scope: tr("Tamanho e conhecimentos", "Size and skills", "Tamaño y conocimientos"),
  verified: tr("Inspeção", "Inspected", "Revisión"),
}

function withDraft(task: Omit<ContributionTask, "issueDraftUrls">): ContributionTask {
  const draft = (locale: Locale) => {
    const body = [
      draftCopy.notice[locale],
      `${draftCopy.verified[locale]}: ${contributionVerifiedOn}`,
      `## ${draftCopy.evidence[locale]}\n${task.evidence[locale]}`,
      `## ${draftCopy.sources[locale]}\n${task.sources.map((item) => `- [${item.repository}/${item.path}](${item.url})`).join("\n")}`,
      `## ${draftCopy.criteria[locale]}\n${task.acceptanceCriteria.map((item) => `- [ ] ${item[locale]}`).join("\n")}`,
      `## ${draftCopy.scope[locale]}\n${task.size} · ${task.estimate[locale]} · ${task.skills.join(", ")}`,
    ].join("\n\n")
    return `https://github.com/${task.repository}/issues/new?${new URLSearchParams({ title: task.title[locale], body })}`
  }
  return { ...task, issueDraftUrls: tr(draft("pt"), draft("en"), draft("es")) }
}

export const contributionTasks: readonly ContributionTask[] = [
  withDraft({
    id: "devagent-queue-request-states",
    projectSlug: "devagent",
    repository: "YagoLagrottiBracco/dev-forge",
    title: tr("Distinguir carregamento, erro e fila vazia", "Distinguish loading, failure and an empty queue", "Distinguir carga, error y cola vacía"),
    evidence: tr(
      "TaskQueue começa com uma lista vazia, mostra a mensagem de fila vazia antes da resposta e chama api.tasks.list().then sem tratar rejeições. O cliente de API lança um erro em respostas HTTP inválidas; a tela não oferece recuperação.",
      "TaskQueue starts with an empty array, shows the empty-queue message before the response, and calls api.tasks.list().then without handling rejection. The API client throws on unsuccessful HTTP responses; the card offers no recovery.",
      "TaskQueue empieza con una lista vacía, muestra la cola vacía antes de recibir la respuesta y llama a api.tasks.list().then sin gestionar rechazos. El cliente de API lanza errores HTTP; la tarjeta no ofrece recuperación.",
    ),
    size: "S",
    estimate: tr("2–4 horas", "2–4 hours", "2–4 horas"),
    skills: ["React", "TypeScript", "HTTP"],
    sources: [
      source("dev-forge", "apps/web/src/components/agents/task-queue.tsx", 9, 34),
      source("dev-forge", "apps/web/src/lib/api.ts", 19, 34, "context"),
    ],
    acceptanceCriteria: [
      tr("Reproduzir com uma requisição pendente e uma rejeitada; adicionar estados explícitos de carregamento e erro no cartão.", "Reproduce with a pending request and a rejected request; add explicit loading and error states to the card.", "Reproducir con una petición pendiente y otra rechazada; añadir estados explícitos de carga y error a la tarjeta."),
      tr("Exibir a fila vazia apenas após sucesso sem tarefas TODO; manter o filtro TODO e o limite de cinco itens.", "Show an empty queue only after success with no TODO tasks; preserve the TODO filter and five-item limit.", "Mostrar la cola vacía solo tras una respuesta correcta sin tareas TODO; mantener el filtro TODO y el límite de cinco elementos."),
      tr("Oferecer um botão de tentar novamente acessível por teclado; uma nova resposta válida deve substituir o erro.", "Offer a keyboard-accessible retry button; a successful retry must replace the error state.", "Ofrecer un botón de reintento accesible por teclado; una respuesta correcta debe sustituir el estado de error."),
      tr("Cobrir resposta pendente, erro HTTP, recuperação, sucesso vazio e sucesso com mais de cinco tarefas em testes de componente.", "Cover pending, HTTP failure, recovery, empty success and success with more than five tasks in component tests.", "Cubrir carga pendiente, error HTTP, recuperación, éxito vacío y éxito con más de cinco tareas en pruebas del componente."),
    ],
  }),
  withDraft({
    id: "envrune-diff-reference-changes",
    projectSlug: "envrune",
    repository: "YagoLagrottiBracco/envrune",
    title: tr("Mostrar referências diferentes no diff de ambientes", "Show changed references in environment diffs", "Mostrar referencias distintas al comparar entornos"),
    evidence: tr(
      "diff.go agrupa variáveis ausentes e referências idênticas, mas não imprime uma variável presente nos dois ambientes com referências diferentes. O teste existente já usa DATABASE_URL com shop.db.dev e shop.db.prod sem verificar essa diferença na saída.",
      "diff.go groups missing variables and identical references, but omits a variable present in both environments with different references. The existing test already uses DATABASE_URL with shop.db.dev and shop.db.prod without checking that difference in the output.",
      "diff.go agrupa variables ausentes y referencias idénticas, pero omite las variables presentes en ambos entornos con referencias distintas. La prueba existente usa DATABASE_URL con shop.db.dev y shop.db.prod sin comprobar esa diferencia en la salida.",
    ),
    size: "S",
    estimate: tr("2–4 horas", "2–4 hours", "2–4 horas"),
    skills: ["Go", "CLI", "YAML"],
    sources: [
      source("envrune", "internal/cli/diff.go", 33, 69),
      source("envrune", "internal/cli/workspace_test.go", 443, 469),
    ],
    acceptanceCriteria: [
      tr("Estender a fixture existente para exigir DATABASE_URL e suas referências de origem e destino em uma seção de diferenças.", "Extend the existing fixture to require DATABASE_URL and its source and destination references in a differences section.", "Ampliar la fixture existente para exigir DATABASE_URL y sus referencias de origen y destino en una sección de diferencias."),
      tr("Listar em ordem alfabética as variáveis presentes em ambos os ambientes que apontam para referências distintas.", "List variables present in both environments with different references in alphabetical order.", "Listar por orden alfabético las variables presentes en ambos entornos que apuntan a referencias distintas."),
      tr("Preservar os códigos de saída atuais: referências distintas com as mesmas chaves continuam com código 0; chaves ausentes continuam com código 1.", "Preserve current exit codes: different references with matching keys still return 0; missing keys still return 1.", "Conservar los códigos actuales: referencias distintas con las mismas claves devuelven 0; las claves ausentes devuelven 1."),
      tr("Executar go test ./internal/cli; confirmar que o diff funciona com o cofre bloqueado e só mostra nomes de referências, nunca valores.", "Run go test ./internal/cli; verify diff works with a locked vault and displays reference names only, never secret values.", "Ejecutar go test ./internal/cli; comprobar que diff funciona con la bóveda bloqueada y solo muestra nombres de referencias, nunca valores."),
    ],
  }),
  withDraft({
    id: "dreamerz-create-error-recovery",
    projectSlug: "dreamerz",
    repository: "YagoLagrottiBracco/dreamerz-front",
    title: tr("Permitir recuperar falhas ao cadastrar um sonho", "Allow recovery from dream creation failures", "Permitir recuperarse de errores al crear un sueño"),
    evidence: tr(
      "CreateDream aguarda api.post e navega após sucesso, mas não possui try/catch nem estado de envio. O formulário continua habilitado durante a requisição. A API possui middleware de validação, portanto uma resposta de erro precisa ser apresentada sem perder o texto digitado.",
      "CreateDream awaits api.post and navigates on success, but has no try/catch or submission state. The form stays enabled during the request. The API has validation middleware, so failures need to be shown without losing the entered text.",
      "CreateDream espera api.post y navega tras el éxito, pero no tiene try/catch ni estado de envío. El formulario sigue habilitado durante la petición. La API tiene validación, por lo que los errores deben mostrarse sin perder el texto escrito.",
    ),
    size: "S",
    estimate: tr("3–5 horas", "3–5 hours", "3–5 horas"),
    skills: ["React", "TypeScript", "Axios"],
    sources: [
      source("dreamerz-front", "src/components/pages/dream/CreateDream.tsx", 49, 125),
      source("dreamerz-api", "src/routes/private.routes.ts", 37, 42, "context"),
      source("dreamerz-api", "src/app/middlewares/dreamMiddleware.ts", 3, 7, "context"),
    ],
    acceptanceCriteria: [
      tr("Simular uma resposta de validação e uma falha de rede; capturar o erro no envio e exibir uma mensagem acessível no formulário.", "Simulate a validation response and a network failure; catch submission errors and show an accessible message in the form.", "Simular una respuesta de validación y un fallo de red; capturar el error y mostrar un mensaje accesible en el formulario."),
      tr("Manter nome e descrição após falha e liberar nova tentativa; não navegar para a lista quando o cadastro falhar.", "Keep the name and description after failure and allow retry; do not navigate to the list when creation fails.", "Conservar nombre y descripción tras el error y permitir reintentar; no navegar a la lista cuando falle la creación."),
      tr("Desabilitar o envio enquanto a chamada estiver pendente e impedir que cliques repetidos criem requisições duplicadas.", "Disable submission while the request is pending and prevent repeated clicks from creating duplicate requests.", "Deshabilitar el envío durante la petición y evitar que clics repetidos generen peticiones duplicadas."),
      tr("Testar falha, repetição e resposta 201: o sucesso deve fazer uma única requisição e navegar para /dashboard/dreams.", "Test failure, retry and a 201 response: success must make one request and navigate to /dashboard/dreams.", "Probar fallo, reintento y respuesta 201: el éxito debe realizar una sola petición y navegar a /dashboard/dreams."),
    ],
  }),
  withDraft({
    id: "meu-mundo-mental-tracking-load-recovery",
    projectSlug: "meu-mundo-mental",
    repository: "YagoLagrottiBracco/andre",
    title: tr("Recuperar falhas no carregamento do acompanhamento", "Recover from tracking-page loading failures", "Recuperarse de fallos al cargar el seguimiento"),
    evidence: tr(
      "O efeito de TrackingPage chama fetch e resp.json sem captura de erro; uma rejeição impede setLoading(false). Respostas HTTP sem sucesso acabam como ticket não encontrado, embora a rota também retorne 500 quando a consulta de mensagens falha.",
      "TrackingPage calls fetch and resp.json in an effect without catching errors; a rejection prevents setLoading(false). Unsuccessful HTTP responses become ticket-not-found, although the route also returns 500 when the messages query fails.",
      "TrackingPage llama a fetch y resp.json sin capturar errores; un rechazo impide setLoading(false). Las respuestas HTTP fallidas se muestran como ticket no encontrado, aunque la ruta también devuelve 500 si falla la consulta de mensajes.",
    ),
    size: "S",
    estimate: tr("3–5 horas", "3–5 hours", "3–5 horas"),
    skills: ["React", "Next.js", "TypeScript"],
    sources: [
      source("andre", "src/app/acompanhamento/[token]/page.tsx", 31, 54),
      source("andre", "src/app/api/public/ticket/route.ts", 5, 24, "context"),
    ],
    acceptanceCriteria: [
      tr("Reproduzir fetch rejeitado e JSON inválido; encerrar o estado de carregamento em todos os resultados, inclusive exceções.", "Reproduce rejected fetch and invalid JSON; end the loading state for every outcome, including exceptions.", "Reproducir fetch rechazado y JSON inválido; terminar el estado de carga en todos los casos, incluidas excepciones."),
      tr("Distinguir 404 de erro de rede ou 500 e oferecer nova tentativa acessível para falhas transitórias.", "Distinguish 404 from network errors or 500 and provide an accessible retry for transient failures.", "Distinguir 404 de errores de red o 500 y ofrecer un reintento accesible para fallos transitorios."),
      tr("Ao trocar de token, limpar os dados anteriores e cancelar ou ignorar respostas antigas; não registrar token ou mensagens no console.", "When the token changes, clear previous data and cancel or ignore stale responses; do not log tokens or messages.", "Al cambiar el token, borrar datos previos y cancelar o ignorar respuestas antiguas; no registrar tokens ni mensajes en consola."),
      tr("Cobrir 200, 404, 500, rede indisponível, JSON inválido, nova tentativa e troca de token usando apenas dados fictícios.", "Cover 200, 404, 500, offline, invalid JSON, retry and token changes using synthetic data only.", "Cubrir 200, 404, 500, falta de red, JSON inválido, reintento y cambio de token usando solo datos ficticios."),
    ],
  }),
  withDraft({
    id: "congresso-lecture-not-found",
    projectSlug: "congresso",
    repository: "YagoLagrottiBracco/congresso-api",
    title: tr("Retornar 404 ao buscar uma palestra inexistente", "Return 404 when looking up an unknown lecture", "Devolver 404 al buscar una ponencia inexistente"),
    evidence: tr(
      "LectureController.find usa findOne e depois acessa lecture.length. Quando não há resultado, lecture é null e esse acesso cai no catch de erro 500. O frontend monta links de palestra a partir de slug; um slug desconhecido precisa de uma resposta de ausência previsível.",
      "LectureController.find calls findOne and then reads lecture.length. With no match, lecture is null and that access reaches the 500 error handler. The frontend builds lecture links from slugs; an unknown slug needs a predictable not-found response.",
      "LectureController.find llama a findOne y después lee lecture.length. Sin resultado, lecture es null y ese acceso termina en el error 500. El frontend crea enlaces con slugs; un slug desconocido necesita una respuesta de ausencia predecible.",
    ),
    size: "S",
    estimate: tr("1–3 horas", "1–3 hours", "1–3 horas"),
    skills: ["JavaScript", "Express", "Mongoose"],
    sources: [
      source("congresso-api", "src/app/controllers/LectureController.js", 38, 56),
      source("congresso-front", "src/templates/organisms/molecules/LecturyCard.jsx", 6, 15, "context"),
    ],
    acceptanceCriteria: [
      tr("Adicionar uma regressão para GET /lecturies/find/slug-inexistente com findOne retornando null.", "Add a regression for GET /lecturies/find/unknown-slug with findOne returning null.", "Añadir una regresión para GET /lecturies/find/slug-inexistente con findOne devolviendo null."),
      tr("Trocar a leitura de length por uma verificação de ausência e retornar 404 usando o formato existente de sendResponse.", "Replace the length access with a missing-document check and return 404 using the existing sendResponse format.", "Sustituir el acceso a length por una comprobación de ausencia y devolver 404 con el formato actual de sendResponse."),
      tr("Verificar que um documento válido continua retornando 200 com seus dados e que uma rejeição do banco continua retornando 500.", "Verify a valid document still returns 200 with its data and a database rejection still returns 500.", "Comprobar que un documento válido sigue devolviendo 200 con sus datos y un rechazo de base de datos sigue devolviendo 500."),
      tr("Documentar no PR os três casos e o comando de teste usado; usar fixtures locais, sem depender do banco de produção.", "Document the three cases and the test command in the PR; use local fixtures without relying on the production database.", "Documentar los tres casos y el comando de prueba en el PR; usar fixtures locales sin depender de la base de producción."),
    ],
  }),
  withDraft({
    id: "tripsync-honest-getting-started",
    projectSlug: "tripsync",
    repository: "YagoLagrottiBracco/tripsync-backend",
    title: tr("Corrigir o início rápido nos dois READMEs do TripSync", "Correct the getting-started guides in both TripSync READMEs", "Corregir las guías de inicio en ambos README de TripSync"),
    evidence: tr(
      "Nos dois commits inspecionados, os únicos arquivos versionados são README.md e LICENSE. Os READMEs usam URLs com yourusername e instruem npm install/start sem package.json. A estrutura src e as funcionalidades descritas ainda não existem nesses snapshots públicos.",
      "At both inspected commits, the only tracked files are README.md and LICENSE. The READMEs use yourusername clone URLs and instruct npm install/start without a package.json. The described src tree and features do not yet exist in these public snapshots.",
      "En ambos commits revisados, los únicos archivos versionados son README.md y LICENSE. Los README usan URLs con yourusername e indican npm install/start sin package.json. El árbol src y las funciones descritas todavía no existen en esas versiones públicas.",
    ),
    size: "S",
    estimate: tr("1–2 horas", "1–2 hours", "1–2 horas"),
    skills: ["Markdown", "Git", "Documentation"],
    sources: [
      source("tripsync-backend", "README.md", 1, 46),
      source("tripsync-mobile", "README.md", 1, 50),
    ],
    acceptanceCriteria: [
      tr("Abrir uma alteração de documentação por repositório e substituir os clones de exemplo por YagoLagrottiBracco/tripsync-backend e YagoLagrottiBracco/tripsync-mobile, com os diretórios corretos.", "Prepare one documentation change per repository and replace example clone URLs with YagoLagrottiBracco/tripsync-backend and YagoLagrottiBracco/tripsync-mobile, using the correct directories.", "Preparar un cambio de documentación por repositorio y sustituir los clones de ejemplo por YagoLagrottiBracco/tripsync-backend y YagoLagrottiBracco/tripsync-mobile, con sus directorios correctos."),
      tr("Informar logo no início que o snapshot público contém apenas documentação e licença; apresentar funcionalidades e estrutura de pastas como planejadas.", "State near the top that the public snapshot contains documentation and a license only; identify the features and folder tree as planned.", "Indicar al inicio que la versión pública solo contiene documentación y licencia; presentar funciones y carpetas como previstas."),
      tr("Remover os comandos de instalação e execução que ainda não funcionam ou identificá-los como futuros, explicando que falta o scaffold com package.json e código.", "Remove nonfunctional install/run commands or mark them as future instructions, explaining that the package.json and application scaffold are missing.", "Quitar los comandos de instalación y ejecución que aún no funcionan o marcarlos como futuros, explicando que faltan package.json y el código base."),
      tr("Clonar ambos os repositórios em diretórios vazios, conferir git ls-files e revisar os links cruzados; não declarar aplicação executável sem código publicado.", "Clone both repositories into empty directories, inspect git ls-files and review cross-links; do not describe an executable application without published code.", "Clonar ambos repositorios en directorios vacíos, revisar git ls-files y los enlaces cruzados; no describir una aplicación ejecutable sin código publicado."),
    ],
  }),
]

export function getContributionTasks(projectSlug: string): readonly ContributionTask[] {
  return contributionTasks.filter((task) => task.projectSlug === projectSlug)
}
