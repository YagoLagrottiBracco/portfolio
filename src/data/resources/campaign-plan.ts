import type { Locale } from "../../lib/i18n"
import { getResourcePath } from "../../lib/resource-routes"
import { getCaseStudyPath } from "../../lib/case-study-routes"
import { SITE_URL } from "../../lib/site"
import { withUtm } from "../../lib/utm"

export type CampaignChannel =
  | "linkedin"
  | "whatsapp"
  | "community"
  | "newsletter"
type Translated = Record<Locale, string>
export interface CampaignEntry {
  id: string
  date: string
  channel: CampaignChannel
  title: Translated
  text: Translated
  href: Translated
}
export interface LocalizedCampaignEntry {
  id: string
  date: string
  channel: CampaignChannel
  title: string
  text: string
  href: string
}
interface EditorialBrief {
  id: string
  channel: CampaignChannel
  target: string
  title: Translated
  body: Translated
}
const translated = (pt: string, en: string, es: string): Translated => ({
  pt,
  en,
  es,
})
const languages: Locale[] = ["pt", "en", "es"]
export const CAMPAIGN_PROGRESS_KEY = "portfolio-campaign-2026-10-progress-v1"
export const campaignChannelLabels: Record<CampaignChannel, Translated> = {
  linkedin: translated("LinkedIn", "LinkedIn", "LinkedIn"),
  whatsapp: translated("WhatsApp", "WhatsApp", "WhatsApp"),
  community: translated(
    "Comunidade de desenvolvimento",
    "Developer community",
    "Comunidad de desarrollo"
  ),
  newsletter: translated(
    "Sugestão para newsletter",
    "Newsletter pitch",
    "Propuesta para newsletter"
  ),
}

// A proposed publication plan. Dates are suggestions, never evidence that a post was sent.
const briefs: EditorialBrief[] = [
  {
    id: "d01-kit",
    channel: "linkedin",
    target: "campanhas/kit-engenharia",
    title: translated(
      "Uma biblioteca para testar decisões de engenharia",
      "A library for testing engineering decisions",
      "Una biblioteca para probar decisiones de ingeniería"
    ),
    body: translated(
      "Reuni ferramentas e materiais abertos para transformar uma conversa de arquitetura em um experimento: comparador JSON, revisor de chaves .env, simulador de fila e starter de worker em TypeScript.\n\nO caminho de cinco minutos é simples: compare dois contratos, gere uma sobrecarga e execute os testes do starter. Cada recurso informa seus limites; a simulação não usa dados de produção. Os materiais estão em português, inglês e espanhol.\n\nQual dessas decisões aparece mais nas conversas do seu time? Comece pelo kit e escolha um experimento.",
      "I put together open tools and materials to turn architecture discussions into experiments: a JSON comparator, .env key checker, queue simulator and TypeScript worker starter.\n\nThe five-minute route is simple: compare two contracts, generate overload and run the starter tests. Each resource states its limits; the simulation uses no production data. Materials are available in Portuguese, English and Spanish.\n\nWhich of these decisions comes up most often in your team? Start with the kit and choose one experiment.",
      "Reuní herramientas y materiales abiertos para convertir una conversación de arquitectura en un experimento: comparador JSON, revisor de claves .env, simulador de cola y starter de worker en TypeScript.\n\nEl recorrido de cinco minutos es sencillo: compara dos contratos, genera una sobrecarga y ejecuta las pruebas del starter. Cada recurso explica sus límites; la simulación no usa datos de producción. Hay materiales en portugués, inglés y español.\n\n¿Qué decisión aparece más en tu equipo? Empieza por el kit y elige un experimento."
    ),
  },
  {
    id: "d02-json",
    channel: "whatsapp",
    target: "ferramentas/json",
    title: translated(
      "Um contrato mudou?",
      "Did a contract change?",
      "¿Cambió un contrato?"
    ),
    body: translated(
      "Deixei um comparador JSON que mostra campos adicionados, removidos e alterados, sem confundir ordem das chaves com mudança. Teste com dois exemplos fictícios no navegador. Pode ser útil na próxima revisão de payload.",
      "Here is a JSON comparator that shows added, removed and changed fields without treating key order as a change. Try two synthetic examples in your browser. Useful for the next payload review.",
      "Aquí tienes un comparador JSON que muestra campos añadidos, eliminados y modificados sin confundir el orden de claves con cambios. Pruébalo con ejemplos ficticios en el navegador para tu próxima revisión de payload."
    ),
  },
  {
    id: "d03-fila-lab",
    channel: "community",
    target: "demos/queue",
    title: translated(
      "Exercício aberto: prever o backlog antes de executar",
      "Open exercise: predict backlog before running",
      "Ejercicio abierto: predecir la acumulación antes de ejecutar"
    ),
    body: translated(
      "Compartilho uma demo didática de filas para discussão técnica. Desafio: configure 20 entradas/s, dois workers e 0% de falhas. Antes de avançar dez passos, anote quanto trabalho espera encontrar na fila. Depois zere a entrada e estime o tempo de drenagem.\n\nO modelo tenta uma mensagem por worker a cada segundo; retries são limitados a três tentativas. Não há backoff, persistência ou partições. O objetivo é discutir capacidade e recuperação, sem estimar o desempenho de um broker real.\n\nSe experimentar, qual hipótese você mudaria primeiro: capacidade, duração do pico ou política de rejeição? Compartilhe o raciocínio com dados fictícios.",
      "Sharing an educational queue demo for technical discussion. Challenge: set 20 arrivals/s, two workers and 0% failures. Before advancing ten steps, write down how much work you expect in the queue. Then stop arrivals and estimate drain time.\n\nThe model attempts one message per worker per second; retries stop after three attempts. It has no backoff, persistence or partitions. The goal is to discuss capacity and recovery, without estimating real broker performance.\n\nIf you try it, which assumption would you change first: capacity, burst duration or rejection policy? Share your reasoning using synthetic data.",
      "Comparto una demo didáctica de colas para discusión técnica. Desafío: configura 20 entradas/s, dos workers y 0% de fallos. Antes de avanzar diez pasos, anota cuánto trabajo esperas en la cola. Después detén las entradas y estima el tiempo de vaciado.\n\nEl modelo intenta un mensaje por worker por segundo; limita los reintentos a tres intentos. No incluye backoff, persistencia ni particiones. Sirve para discutir capacidad y recuperación, sin estimar el rendimiento de un broker real.\n\nSi lo pruebas, ¿qué supuesto cambiarías primero: capacidad, duración del pico o rechazo? Comparte tu razonamiento con datos ficticios."
    ),
  },
  {
    id: "d04-backlog",
    channel: "linkedin",
    target: "laboratorio/sobrecarga",
    title: translated(
      "Uma fila compra tempo; a capacidade paga a conta",
      "A queue buys time; capacity pays the bill",
      "Una cola compra tiempo; la capacidad paga la cuenta"
    ),
    body: translated(
      "Neste modelo, 20 entradas por segundo e dois workers produzem um saldo de 18 mensagens por segundo. Dez passos depois, são 180 mensagens pendentes.\n\nA fila absorve esse pico, mas não elimina o trabalho. Com a entrada parada, dois workers precisam de mais 90 passos para drená-la. Se as 20 entradas/s continuarem, o backlog continuará crescendo.\n\nO experimento está pronto para você alterar as variáveis. Antes de escolher uma fila, pergunte: quanto atraso o produto tolera e qual é o plano para recuperar a capacidade?",
      "In this model, 20 arrivals per second and two workers leave 18 messages per second outstanding. After ten steps, 180 messages are pending.\n\nThe queue absorbs the burst without removing the work. With arrivals stopped, two workers need another 90 steps to drain it. If 20 arrivals/s continue, backlog keeps growing.\n\nThe experiment is ready for you to change the variables. Before choosing a queue, ask: how much delay can the product tolerate, and what is the capacity recovery plan?",
      "En este modelo, 20 entradas por segundo y dos workers dejan 18 mensajes por segundo pendientes. Después de diez pasos hay 180 mensajes en la cola.\n\nLa cola absorbe el pico sin eliminar el trabajo. Con las entradas detenidas, dos workers necesitan otros 90 pasos para vaciarla. Si siguen llegando 20 mensajes/s, la acumulación crece.\n\nEl experimento permite cambiar las variables. Antes de elegir una cola, pregunta: ¿cuánto retraso tolera el producto y cuál es el plan para recuperar capacidad?"
    ),
  },
  {
    id: "d05-pitch-worker",
    channel: "newsletter",
    target: "templates/worker",
    title: translated(
      "Sugestão de recurso: worker TypeScript para explorar retries",
      "Resource suggestion: a TypeScript worker for exploring retries",
      "Recurso propuesto: worker TypeScript para explorar reintentos"
    ),
    body: translated(
      "Olá, equipe editorial.\n\nGostaria de sugerir um recurso gratuito para uma edição sobre backend ou sistemas orientados a eventos: um starter TypeScript executável com testes, deduplicação em memória, limite de tentativas e exemplo de fila de falhas.\n\nSugestão de chamada: “Execute um worker pequeno, provoque uma falha e acompanhe o limite de retries. Um ponto de partida para discutir idempotência antes de adotar um broker.”\n\nRequer Node.js 22 ou superior e usa licença MIT. O README explica a execução; a deduplicação é local ao processo e não representa uma solução pronta para produção. Se fizer sentido para a curadoria, o link abaixo reúne o download e o contexto.\n\nObrigado pela avaliação,\nYago Lagrotti Bracco",
      "Hello, editorial team.\n\nI would like to suggest a free resource for an issue about backend engineering or event-driven systems: a runnable TypeScript starter with tests, in-memory deduplication, bounded retries and a dead-letter example.\n\nSuggested blurb: “Run a small worker, trigger a failure and follow its retry limit. A starting point for discussing idempotency before adopting a broker.”\n\nRequires Node.js 22 or newer and uses the MIT license. The README explains execution; deduplication is process-local and this is not a production-ready solution. If it fits your selection, the link below provides the download and context.\n\nThank you for considering it,\nYago Lagrotti Bracco",
      "Hola, equipo editorial.\n\nQuisiera proponer un recurso gratuito para una edición sobre backend o sistemas orientados a eventos: un starter TypeScript ejecutable con pruebas, deduplicación en memoria, reintentos limitados y ejemplo de cola de fallos.\n\nTexto sugerido: “Ejecuta un worker pequeño, provoca un fallo y observa el límite de reintentos. Un punto de partida para discutir idempotencia antes de adoptar un broker.”\n\nRequiere Node.js 22 o superior y usa licencia MIT. El README explica la ejecución; la deduplicación es local al proceso y no es una solución lista para producción. Si encaja en su selección, el enlace reúne descarga y contexto.\n\nGracias por evaluarlo,\nYago Lagrotti Bracco"
    ),
  },
  {
    id: "d06-adr",
    channel: "whatsapp",
    target: "templates/adr",
    title: translated(
      "Uma decisão que dá para revisar",
      "A decision you can revisit",
      "Una decisión que se puede revisar"
    ),
    body: translated(
      "Um template ADR para registrar contexto, alternativas, decisão e consequências. Minha parte preferida é a condição de revisão: o que precisaria mudar para a escolha deixar de fazer sentido? Dá para baixar e preencher em texto.",
      "An ADR template for context, alternatives, decision and consequences. My favorite part is the review condition: what would need to change for this choice to stop making sense? Download it and fill it in as plain text.",
      "Una plantilla ADR para contexto, alternativas, decisión y consecuencias. Mi parte favorita es la condición de revisión: ¿qué tendría que cambiar para reconsiderar la elección? Descárgala y complétala en texto."
    ),
  },
  {
    id: "d07-guia-filas",
    channel: "linkedin",
    target: "guias/filas",
    title: translated(
      "A resposta precisa do resultado agora?",
      "Does the response need the result now?",
      "¿La respuesta necesita el resultado ahora?"
    ),
    body: translated(
      "Essa pergunta vem antes da escolha do broker. Se a resposta exige o resultado imediatamente, volume e dependência cabem no orçamento de latência, uma chamada direta pode ser suficiente.\n\nUma fila faz sentido quando receber e concluir podem ser etapas diferentes, os picos excedem a capacidade sustentada e o trabalho pode ser repetido com segurança. Isso traz novas decisões: retenção, ordenação, idempotência e destino das falhas.\n\nEscrevi um guia curto com critérios e limites. Use-o para revisar uma escolha do seu contexto: qual requisito realmente pede processamento assíncrono?",
      "That question comes before choosing a broker. If the response needs the result immediately, and traffic and dependencies fit the latency budget, a direct call may be enough.\n\nA queue makes sense when acceptance and completion can be separate, bursts exceed sustained capacity and work can be replayed safely. That adds decisions about retention, ordering, idempotency and failure handling.\n\nI wrote a short guide with criteria and limitations. Use it to review a choice in your context: which requirement actually needs asynchronous processing?",
      "Esa pregunta viene antes de elegir un broker. Si la respuesta necesita el resultado inmediato y el volumen y las dependencias caben en el presupuesto de latencia, una llamada directa puede bastar.\n\nUna cola tiene sentido cuando recibir y terminar pueden ser etapas distintas, los picos superan la capacidad sostenida y el trabajo puede repetirse con seguridad. Añade decisiones sobre retención, orden, idempotencia y fallos.\n\nEscribí una guía breve con criterios y límites. Úsala para revisar una decisión de tu contexto: ¿qué requisito exige procesamiento asíncrono?"
    ),
  },
  {
    id: "d08-env",
    channel: "linkedin",
    target: "ferramentas/env",
    title: translated(
      "O nome de uma variável também é contrato",
      "A variable name is also a contract",
      "El nombre de una variable también es un contrato"
    ),
    body: translated(
      "Um deploy pode falhar porque uma chave obrigatória não chegou ao ambiente. Para revisar esse contrato, criei uma ferramenta que compara nomes de variáveis de uma referência .env.example com outra configuração.\n\nO relatório aponta ausências, extras, duplicatas e linhas inválidas sem reproduzir os valores. O processamento acontece no navegador. Para demonstrar, use valores fictícios: o verificador não é um parser completo de dotenv nem confirma se o segredo está correto.\n\nQue verificação de configuração você gostaria de fazer antes do próximo deploy?",
      "A deployment can fail because a required key never reached the environment. To review that contract, I built a tool comparing variable names from an .env.example reference against another configuration.\n\nThe report highlights missing keys, extras, duplicates and invalid lines without reproducing values. Processing happens in the browser. Use synthetic values for demonstrations: the checker is not a complete dotenv parser and cannot confirm a secret is correct.\n\nWhich configuration check would you like to make before the next deployment?",
      "Un despliegue puede fallar porque una clave obligatoria no llegó al entorno. Para revisar ese contrato, creé una herramienta que compara nombres de variables de una referencia .env.example con otra configuración.\n\nEl informe señala faltantes, extras, duplicados y líneas inválidas sin reproducir valores. El procesamiento ocurre en el navegador. Usa valores ficticios: no es un parser completo de dotenv ni verifica que un secreto sea correcto.\n\n¿Qué revisión de configuración harías antes del próximo despliegue?"
    ),
  },
  {
    id: "d09-idempotencia",
    channel: "whatsapp",
    target: "glossario/idempotencia",
    title: translated(
      "E se a mensagem chegar duas vezes?",
      "What if the message arrives twice?",
      "¿Y si el mensaje llega dos veces?"
    ),
    body: translated(
      "Retries pedem uma pergunta: repetir esta operação repete o efeito? A explicação curta de idempotência ajuda a separar a identidade da mensagem do efeito de negócio. Leve um exemplo fictício de cobrança ou pedido para a conversa do time.",
      "Retries raise a question: does repeating this operation repeat its effect? This short explanation of idempotency separates message identity from the business effect. Bring a synthetic payment or order example to your team discussion.",
      "Los reintentos plantean una pregunta: ¿repetir la operación repite su efecto? Esta explicación breve de idempotencia separa la identidad del mensaje del efecto de negocio. Lleva un ejemplo ficticio de pago o pedido al equipo."
    ),
  },
  {
    id: "d10-worker-lab",
    channel: "community",
    target: "templates/worker",
    title: translated(
      "Laboratório pequeno: teste falhas antes do broker",
      "Small lab: test failures before the broker",
      "Laboratorio pequeño: prueba fallos antes del broker"
    ),
    body: translated(
      "Proponho um exercício com o starter TypeScript da biblioteca. Baixe, execute npm install, npm test e npm start em Node.js 22+. Leia o teste de deduplicação e o limite de tentativas antes de mudar qualquer código.\n\nAgora descreva dois cenários: mensagem repetida no mesmo processo e repetição depois de reiniciar o processo. O segundo não é resolvido por um Set em memória. Que armazenamento e fronteira transacional você escolheria para ligar o efeito de negócio à chave de idempotência?\n\nO starter tem licença MIT e serve como material didático. Se compartilhar sua solução, inclua teste e explique a hipótese de falha; não use dados reais de clientes.",
      "Here is an exercise using the library's TypeScript starter. Download it and run npm install, npm test and npm start on Node.js 22+. Read the deduplication test and retry limit before changing code.\n\nNow describe two scenarios: a repeated message within one process and a repeat after restarting the process. An in-memory Set does not solve the second case. Which storage and transaction boundary would you use to connect the business effect to its idempotency key?\n\nThe starter uses the MIT license and is educational. If you share a solution, include a test and explain the failure assumption; use no real customer data.",
      "Propongo un ejercicio con el starter TypeScript de la biblioteca. Descárgalo y ejecuta npm install, npm test y npm start con Node.js 22+. Lee la prueba de deduplicación y el límite de intentos antes de cambiar código.\n\nDescribe dos escenarios: mensaje repetido en el mismo proceso y repetición después de reiniciarlo. Un Set en memoria no resuelve el segundo. ¿Qué almacenamiento y frontera transaccional conectarían el efecto de negocio con la clave de idempotencia?\n\nEl starter usa licencia MIT y es didáctico. Si compartes una solución, incluye prueba e hipótesis de fallo; no uses datos reales de clientes."
    ),
  },
  {
    id: "d11-clone",
    channel: "linkedin",
    target: "benchmarks/json-clone",
    title: translated(
      "Um benchmark precisa de contexto para ser útil",
      "A benchmark needs context to be useful",
      "Un benchmark necesita contexto para ser útil"
    ),
    body: translated(
      "Comparar JSON.parse/stringify e structuredClone só pelo menor tempo deixa perguntas importantes de fora. Quais tipos precisam ser preservados? Qual era o tamanho dos dados? O runtime foi o mesmo?\n\nPubliquei um experimento com dados JSON sintéticos, aquecimento, alternância da ordem dos métodos e amostras brutas para download. O conjunto não testa Date, Map, ciclos ou transferíveis. A medição local não transforma uma estratégia em vencedora universal.\n\nLeia o método, execute o script no seu ambiente e compare os resultados por tamanho. Que caso de uso mudaria sua escolha mesmo com um tempo maior?",
      "Comparing JSON.parse/stringify and structuredClone by the lowest time leaves important questions unanswered. Which types must survive? How large was the data? Was the runtime the same?\n\nI published an experiment with synthetic JSON data, warm-up, alternating method order and downloadable raw samples. The dataset does not test Date, Map, cycles or transferables. A local measurement does not make one strategy a universal winner.\n\nRead the method, run the script in your environment and compare results by size. Which use case would change your choice even at a higher execution time?",
      "Comparar JSON.parse/stringify y structuredClone solo por el menor tiempo deja preguntas abiertas. ¿Qué tipos deben conservarse? ¿Qué tamaño tenían los datos? ¿Era el mismo runtime?\n\nPubliqué un experimento con datos JSON sintéticos, calentamiento, alternancia del orden y muestras descargables. No prueba Date, Map, ciclos ni transferibles. Una medición local no convierte una estrategia en ganadora universal.\n\nLee el método, ejecuta el script en tu entorno y compara por tamaño. ¿Qué caso de uso cambiaría tu elección aunque tardara más?"
    ),
  },
  {
    id: "d12-pitch-filas",
    channel: "newsletter",
    target: "demos/queue",
    title: translated(
      "Sugestão para a curadoria: uma fila que você pode sobrecarregar",
      "For your resource list: a queue you can overload",
      "Para su selección: una cola que puedes sobrecargar"
    ),
    body: translated(
      "Olá, equipe editorial.\n\nQuero sugerir uma demo interativa para uma edição sobre confiabilidade: o leitor ajusta entradas, workers e falhas para observar backlog, retries e fila de falhas. Não requer conta.\n\nChamada sugerida: “Antes de adicionar uma fila, preveja o backlog de um pico de dez segundos e teste sua estimativa no navegador.”\n\nO modelo é didático, sem dados de produção, backoff ou persistência. A página explicita essas limitações e permite repetir o exercício. Pode ser um complemento prático a uma discussão sobre capacidade. Segue o link para avaliação.\n\nObrigado,\nYago Lagrotti Bracco",
      "Hello, editorial team.\n\nI would like to suggest an interactive demo for an issue on reliability: readers adjust arrivals, workers and failures to observe backlog, retries and dead letters. No account is required.\n\nSuggested blurb: “Before adding a queue, predict backlog from a ten-second burst and test your estimate in the browser.”\n\nThe model is educational, with no production data, backoff or persistence. The page states those limits and lets readers repeat the exercise. It may be a practical companion to a capacity discussion. Here is the link for your review.\n\nThank you,\nYago Lagrotti Bracco",
      "Hola, equipo editorial.\n\nQuisiera proponer una demo interactiva para una edición sobre confiabilidad: permite ajustar entradas, workers y fallos para observar acumulación, reintentos y mensajes fallidos. No requiere cuenta.\n\nTexto sugerido: “Antes de añadir una cola, predice la acumulación de un pico de diez segundos y comprueba la estimación en el navegador.”\n\nEl modelo es didáctico, sin datos de producción, backoff ni persistencia. La página declara esos límites y permite repetir el ejercicio. Puede complementar una discusión sobre capacidad. Comparto el enlace para evaluación.\n\nGracias,\nYago Lagrotti Bracco"
    ),
  },
  {
    id: "d13-reproduzir",
    channel: "whatsapp",
    target: "laboratorio/copias",
    title: translated(
      "Repita a medição no seu runtime",
      "Repeat the measurement on your runtime",
      "Repite la medición en tu runtime"
    ),
    body: translated(
      "Tem um experimento de cópia de JSON com script e dados sintéticos. Rode no seu ambiente e compare medianas por tamanho. A parte útil é registrar método e limites, não escolher uma API por um número isolado. O roteiro está aqui.",
      "Here is a JSON cloning experiment with a script and synthetic data. Run it in your environment and compare medians by size. The useful part is recording method and limits, rather than choosing an API from one number. Instructions are here.",
      "Aquí hay un experimento de copia de JSON con script y datos sintéticos. Ejecútalo en tu entorno y compara medianas por tamaño. Lo útil es registrar método y límites, en vez de elegir una API por un número aislado. Aquí está el guion."
    ),
  },
  {
    id: "d14-caso-vmageste",
    channel: "linkedin",
    target: "case/vmageste",
    title: translated(
      "Leia o fluxo antes de escolher a ferramenta",
      "Read the flow before choosing the tool",
      "Lee el flujo antes de elegir la herramienta"
    ),
    body: translated(
      "Uma discussão sobre eventos fica mais concreta quando desenhamos as etapas: onde o dado entra, onde é processado e como chega à consulta. No estudo de caso do VMAGeste, esse fluxo é uma boa porta de entrada para ler as decisões de arquitetura.\n\nMinha sugestão de leitura: identifique uma fronteira assíncrona, anote a hipótese que ela atende e procure o que precisaria ser observado na operação. Use o caso como contexto e a demo da biblioteca para testar a ideia de capacidade com dados fictícios.\n\nQual informação você procura primeiro em um diagrama para entender a recuperação de uma falha?",
      "Event discussions become more concrete when we draw the stages: where data enters, where it is processed and how it reaches queries. The VMAGeste case study uses that flow as an entry point into its architecture decisions.\n\nMy suggested reading exercise: identify an asynchronous boundary, write down the assumption it addresses and look for what operations would need to observe. Use the case for context and the library demo to test capacity ideas with synthetic data.\n\nWhat do you look for first in a diagram when trying to understand failure recovery?",
      "Una discusión sobre eventos se vuelve concreta al dibujar las etapas: dónde entran los datos, dónde se procesan y cómo llegan a las consultas. El caso de VMAGeste usa ese flujo como entrada a las decisiones de arquitectura.\n\nEjercicio de lectura: identifica una frontera asíncrona, anota qué supuesto atiende y busca qué habría que observar en operación. Usa el caso como contexto y la demo para probar capacidad con datos ficticios.\n\n¿Qué buscas primero en un diagrama para entender la recuperación de un fallo?"
    ),
  },
  {
    id: "d15-oficina",
    channel: "linkedin",
    target: "campanhas/oficina-arquitetura",
    title: translated(
      "Uma hora para escrever uma decisão defensável",
      "One hour to write a defensible decision",
      "Una hora para escribir una decisión defendible"
    ),
    body: translated(
      "Preparei uma oficina autoguiada com um problema delimitado: 20 pedidos/s entram, dois são processados por segundo e o pico dura dez segundos. A tarefa é modelar o backlog e registrar uma decisão em um ADR.\n\nO roteiro divide uma hora entre contexto, experimento, alternativas, escrita e revisão. Você pode fazer sozinho ou em dupla, usando apenas navegador e editor de texto. O material inclui exercícios, resultados esperados e gabarito para facilitar a discussão.\n\nÉ um material disponível para usar, sem inscrição ou evento marcado. Qual condição faria você rejeitar trabalho em vez de enfileirar?",
      "I prepared a self-guided workshop around one bounded problem: 20 orders/s arrive, two are processed per second and the burst lasts ten seconds. The task is to model backlog and record a decision in an ADR.\n\nThe outline splits one hour between context, experiment, alternatives, writing and review. Work alone or in pairs with only a browser and text editor. The material includes exercises, expected outcomes and an answer key for discussion.\n\nThis is available material, with no registration or scheduled event. Which condition would make you reject work instead of queuing it?",
      "Preparé un taller autoguiado con un problema delimitado: entran 20 pedidos/s, se procesan dos por segundo y el pico dura diez segundos. La tarea es modelar la acumulación y registrar una decisión en un ADR.\n\nEl guion divide una hora entre contexto, experimento, alternativas, escritura y revisión. Puedes hacerlo solo o en pareja, con navegador y editor de texto. Incluye ejercicios, resultados esperados y soluciones para guiar la discusión.\n\nEs material disponible, sin inscripción ni evento programado. ¿Qué condición te haría rechazar trabajo en vez de encolarlo?"
    ),
  },
  {
    id: "d16-pico",
    channel: "whatsapp",
    target: "laboratorio/sobrecarga",
    title: translated(
      "Desafio de dois minutos",
      "Two-minute challenge",
      "Desafío de dos minutos"
    ),
    body: translated(
      "20 entradas/s, dois workers, 0% de falhas, dez segundos. Quanto fica pendente? Faça a previsão antes de abrir a demo e depois zere a entrada para medir a recuperação. O roteiro distingue um pico temporário de déficit permanente de capacidade.",
      "20 arrivals/s, two workers, 0% failures, ten seconds. How much work remains? Predict before opening the demo, then stop arrivals to measure recovery. The exercise separates a temporary burst from a permanent capacity deficit.",
      "20 entradas/s, dos workers, 0% de fallos, diez segundos. ¿Cuánto queda pendiente? Predice antes de abrir la demo y después detén las entradas para medir recuperación. El ejercicio distingue un pico de un déficit permanente de capacidad."
    ),
  },
  {
    id: "d17-adr-review",
    channel: "community",
    target: "campanhas/oficina-arquitetura",
    title: translated(
      "Revisão de ADR: que evidência mudaria sua decisão?",
      "ADR review: what evidence would change your decision?",
      "Revisión de ADR: ¿qué evidencia cambiaría tu decisión?"
    ),
    body: translated(
      "Exercício para uma discussão de arquitetura: use o cenário da oficina autoguiada e escreva um ADR com contexto, duas alternativas, decisão, consequências e condição de revisão. Evite justificar só com preferência por uma ferramenta.\n\nUma alternativa pode preservar a capacidade atual e aceitar atraso; outra pode aumentar workers ou rejeitar entrada acima de um limite. Compare tempo de recuperação, custo, duplicação e o que o usuário percebe. Declare as hipóteses que seu experimento não mediu.\n\nAo revisar, procure uma condição verificável que obrigaria a reavaliar a escolha. O material inclui um exemplo de resposta, sem tratar uma arquitetura como solução única. Qual hipótese falta no seu ADR?",
      "An exercise for an architecture discussion: use the self-guided workshop scenario and write an ADR with context, two alternatives, a decision, consequences and a review condition. Avoid justifying it through tool preference alone.\n\nOne alternative can retain current capacity and accept delay; another can increase workers or reject arrivals above a limit. Compare recovery time, cost, duplication and user-visible behavior. State the assumptions your experiment did not measure.\n\nDuring review, look for a testable condition that would force reconsideration. The material includes an example answer without treating one architecture as the only solution. Which assumption is missing from your ADR?",
      "Ejercicio para una discusión de arquitectura: usa el escenario del taller autoguiado y escribe un ADR con contexto, dos alternativas, decisión, consecuencias y condición de revisión. Evita justificarlo solo por preferencia de herramienta.\n\nUna alternativa puede mantener la capacidad y aceptar retraso; otra puede aumentar workers o rechazar entradas por encima de un límite. Compara recuperación, coste, duplicación y lo que percibe el usuario. Declara qué supuestos no midió el experimento.\n\nAl revisar, busca una condición verificable que obligue a reconsiderar la elección. Hay una respuesta de ejemplo, sin presentar una única arquitectura correcta. ¿Qué supuesto falta en tu ADR?"
    ),
  },
  {
    id: "d18-monolito",
    channel: "linkedin",
    target: "guias/monolito",
    title: translated(
      "Uma fronteira de código precisa virar um serviço?",
      "Does a code boundary need to become a service?",
      "¿Un límite de código debe convertirse en servicio?"
    ),
    body: translated(
      "Separar responsabilidades é uma decisão; separar deploys é outra. Uma fronteira pode começar dentro de um monólito modular e só depois ganhar operação independente, se existir uma necessidade concreta.\n\nNo guia sobre monólito modular e serviços separados, a proposta é comparar autonomia, contratos e custo operacional. Um novo processo também traz rede, observabilidade e falhas parciais.\n\nAntes de decompor, escreva a restrição que a separação resolve e a condição que justificaria revisar a decisão. Qual parte do seu sistema precisa de autonomia de operação hoje?",
      "Separating responsibilities is one decision; separating deployments is another. A boundary can begin inside a modular monolith and later gain independent operations if a concrete need emerges.\n\nThe guide on modular monoliths and separate services compares autonomy, contracts and operating cost. A new process also adds networking, observability and partial failures.\n\nBefore splitting, write down the constraint that separation solves and the condition that would justify revisiting it. Which part of your system needs operational autonomy today?",
      "Separar responsabilidades es una decisión; separar despliegues es otra. Un límite puede empezar dentro de un monolito modular y después ganar operación independiente si aparece una necesidad concreta.\n\nLa guía compara autonomía, contratos y coste operativo entre monolito modular y servicios separados. Un proceso nuevo también añade red, observabilidad y fallos parciales.\n\nAntes de dividir, escribe qué restricción resuelve la separación y cuándo revisarías la decisión. ¿Qué parte de tu sistema necesita autonomía operativa hoy?"
    ),
  },
  {
    id: "d19-pitch-oficina",
    channel: "newsletter",
    target: "palestras/arquitetura",
    title: translated(
      "Material para estudo: oficina de arquitetura em 60 minutos",
      "Study material: a 60-minute architecture workshop",
      "Material de estudio: taller de arquitectura de 60 minutos"
    ),
    body: translated(
      "Olá, equipe editorial.\n\nGostaria de sugerir um material para a seção de estudos ou atividades em equipe: uma oficina de 60 minutos para comparar alternativas e escrever um ADR apoiado por um experimento de capacidade.\n\nChamada sugerida: “Um problema, uma simulação e uma decisão registrada. Faça sozinho ou em dupla, com navegador e editor de texto.”\n\nO guia traz divisão de tempo, exercícios, resultados esperados e gabarito. O cenário é fictício; não exige inscrição. Trata-se de uma proposta e de material autoguiado disponível, sem afirmar que houve uma apresentação ou turma anterior. O link reúne o contexto e os downloads para avaliação.\n\nObrigado,\nYago Lagrotti Bracco",
      "Hello, editorial team.\n\nI would like to suggest material for a study or team activities section: a 60-minute workshop on comparing alternatives and writing an ADR supported by a capacity experiment.\n\nSuggested blurb: “One problem, one simulation and one recorded decision. Work alone or in pairs with a browser and text editor.”\n\nThe guide includes timing, exercises, expected outcomes and an answer key. The scenario is fictional and requires no registration. It is an available proposal and self-guided material, with no claim of a previous presentation or class. The link provides context and downloads for review.\n\nThank you,\nYago Lagrotti Bracco",
      "Hola, equipo editorial.\n\nQuisiera proponer material para una sección de estudio o actividades de equipo: un taller de 60 minutos para comparar alternativas y escribir un ADR basado en un experimento de capacidad.\n\nTexto sugerido: “Un problema, una simulación y una decisión registrada. Trabaja solo o en pareja con navegador y editor de texto.”\n\nLa guía incluye tiempos, ejercicios, resultados esperados y soluciones. El escenario es ficticio y no requiere inscripción. Es una propuesta y material autoguiado disponible, sin afirmar que hubo una presentación o grupo anterior. El enlace reúne contexto y descargas para evaluación.\n\nGracias,\nYago Lagrotti Bracco"
    ),
  },
  {
    id: "d20-env-check",
    channel: "whatsapp",
    target: "ferramentas/env",
    title: translated(
      "Revisão rápida de configuração",
      "Quick configuration review",
      "Revisión rápida de configuración"
    ),
    body: translated(
      "Antes de testar, crie dois .env fictícios: uma referência com API_URL e WORKER_TOKEN e outro com API_URL repetido. O revisor mostra a chave ausente e a duplicata, sem reproduzir valores no relatório. Aqui está a ferramenta.",
      "Before testing, create two synthetic .env files: a reference with API_URL and WORKER_TOKEN, and another with API_URL repeated. The checker shows the missing key and duplicate without reproducing values in the report. Here is the tool.",
      "Crea dos .env ficticios: una referencia con API_URL y WORKER_TOKEN, y otro con API_URL repetido. El revisor muestra la clave faltante y el duplicado sin reproducir valores en el informe. Aquí tienes la herramienta."
    ),
  },
  {
    id: "d21-caso-pulsewatch",
    channel: "linkedin",
    target: "case/pulsewatch",
    title: translated(
      "O que observar além da quantidade na fila?",
      "What should you observe beyond queue length?",
      "¿Qué observar además de la longitud de la cola?"
    ),
    body: translated(
      "Dois backlogs do mesmo tamanho podem representar situações muito diferentes. Uma fila que drena rapidamente depois de um pico pede uma leitura; uma mensagem antiga que não avança pede outra.\n\nPara estudar essa diferença, leia o caso PulseWatch junto com o guia de filas. Use o caso como contexto de produto e operação, sem converter os números do simulador em métricas do projeto.\n\nNa sua revisão, anote três sinais: idade da mensagem mais antiga, taxa de conclusão e destino das falhas. Qual sinal ajudaria a decidir entre esperar, escalar e investigar?",
      "Two backlogs of the same size can represent very different situations. A queue that drains quickly after a burst calls for one interpretation; an old message that never progresses calls for another.\n\nTo explore that difference, read the PulseWatch case alongside the queue guide. Use the case as product and operations context without turning simulator numbers into project metrics.\n\nIn your review, note three signals: oldest message age, completion rate and failure destination. Which signal would help you choose between waiting, scaling and investigating?",
      "Dos colas del mismo tamaño pueden representar situaciones muy distintas. Una que se vacía rápido tras un pico pide una lectura; un mensaje antiguo que no avanza pide otra.\n\nPara estudiar esa diferencia, lee el caso PulseWatch junto con la guía de colas. Úsalo como contexto de producto y operación sin convertir los números del simulador en métricas del proyecto.\n\nAnota tres señales: edad del mensaje más antiguo, tasa de finalización y destino de fallos. ¿Qué señal ayudaría a elegir entre esperar, escalar e investigar?"
    ),
  },
  {
    id: "d22-retries",
    channel: "linkedin",
    target: "glossario/dead-letter",
    title: translated(
      "Qual é o destino da terceira falha?",
      "Where does the third failure go?",
      "¿Adónde va el tercer fallo?"
    ),
    body: translated(
      "Retry precisa de um limite e de um destino depois dele. Na demo didática, uma mensagem que falha três vezes vai para a fila de falhas. Isso encerra o ciclo automático do modelo, mas não explica sozinho como corrigir a causa.\n\nUma discussão de operação precisa dizer quem investiga, como identificar a mensagem e em que condição o reprocessamento será seguro. Não basta trocar uma fila infinita por um depósito de erros sem responsável.\n\nO glossário explica DLQ e liga o conceito ao exercício. Se uma mensagem fosse para a fila de falhas hoje, seu time saberia qual seria o próximo passo?",
      "A retry needs a limit and a destination after that limit. In the educational demo, a message failing three times goes to a dead-letter queue. That ends the model's automatic cycle but does not explain how to fix the cause.\n\nAn operations discussion must say who investigates, how to identify the message and when replay is safe. Moving work from an endless retry loop into an unowned error store is not enough.\n\nThe glossary explains DLQs and connects the concept to the exercise. If a message reached the dead-letter queue today, would your team know the next step?",
      "Un reintento necesita un límite y un destino posterior. En la demo didáctica, un mensaje que falla tres veces llega a la cola de fallos. Eso termina el ciclo automático del modelo, pero no explica cómo corregir la causa.\n\nLa discusión operativa debe decir quién investiga, cómo identificar el mensaje y cuándo es seguro reprocesarlo. No basta con cambiar un bucle infinito por un almacén de errores sin responsable.\n\nEl glosario explica DLQ y lo conecta con el ejercicio. Si un mensaje llegara hoy a la cola de fallos, ¿tu equipo sabría qué hacer después?"
    ),
  },
  {
    id: "d23-json-video",
    channel: "whatsapp",
    target: "videos/json",
    title: translated(
      "Veja um contrato mudando",
      "Watch a contract change",
      "Mira un contrato cambiar"
    ),
    body: translated(
      "Uma gravação curta mostra duas versões de um evento e os campos que mudaram. Dá para assistir e repetir no comparador com exemplos fictícios. É uma entrada rápida para conversar sobre revisão de contratos.",
      "A short recording shows two versions of an event and the fields that changed. Watch it, then repeat the comparison with synthetic examples. A quick starting point for a contract review discussion.",
      "Una grabación breve muestra dos versiones de un evento y los campos que cambiaron. Puedes verla y repetir la comparación con ejemplos ficticios. Un punto de partida rápido para revisar contratos."
    ),
  },
  {
    id: "d24-benchmark-colab",
    channel: "community",
    target: "colaboracoes/reproduzir-benchmark",
    title: translated(
      "Convite aberto: reproduzir um benchmark com método",
      "Open invitation: reproduce a benchmark with a method",
      "Invitación abierta: reproducir un benchmark con método"
    ),
    body: translated(
      "Abri um brief para reproduzir o experimento de cópia de JSON em outro runtime e comparar resultados com o mesmo método. O material inclui script, amostras e descrição das limitações.\n\nUma contribuição útil informa versão do runtime, sistema, CPU, comando e amostras brutas com dados sintéticos. Antes de comparar, verifique o tamanho dos objetos e as garantias semânticas de cada API. Diferenças podem motivar hipóteses; não provam uma regra universal.\n\nO brief explica revisão e crédito. Não há coautores confirmados; uma eventual publicação conjunta depende da revisão do método e da autorização de quem participar. Se esse tipo de reprodução interessa, leia o escopo e proponha uma contribuição.",
      "I opened a brief for reproducing the JSON cloning experiment on another runtime and comparing results with the same method. The material includes the script, samples and limitations.\n\nA useful contribution states runtime version, system, CPU, command and raw samples using synthetic data. Before comparing, check object sizes and each API's semantic guarantees. Differences can motivate hypotheses; they do not prove a universal rule.\n\nThe brief explains review and credit. There are no confirmed coauthors; any joint publication depends on methodology review and participant permission. If this kind of reproduction interests you, read the scope and propose a contribution.",
      "Abrí un brief para reproducir el experimento de copia de JSON en otro runtime y comparar resultados con el mismo método. Incluye script, muestras y limitaciones.\n\nUna contribución útil indica versión del runtime, sistema, CPU, comando y muestras brutas con datos sintéticos. Antes de comparar, revisa tamaños y garantías semánticas de cada API. Las diferencias motivan hipótesis; no prueban una regla universal.\n\nEl brief explica revisión y crédito. No hay coautores confirmados; cualquier publicación conjunta depende de revisar el método y obtener permiso. Si te interesa esta reproducción, lee el alcance y propón una contribución."
    ),
  },
  {
    id: "d25-caso-eurologado",
    channel: "linkedin",
    target: "case/eurologado",
    title: translated(
      "Do payload ao contexto do produto",
      "From payload to product context",
      "Del payload al contexto del producto"
    ),
    body: translated(
      "Um diff mostra que um campo mudou. Para decidir se isso importa, precisamos do contexto: quem produz, quem consome e qual comportamento depende desse campo.\n\nUse o estudo de caso Eurologado como exercício de leitura. Escolha um fluxo descrito no caso e escreva um contrato fictício mínimo para representá-lo. Depois adicione um campo e altere um valor no comparador JSON da biblioteca.\n\nO exercício não reproduz contratos internos do projeto. Ele conecta uma ferramenta de comparação a perguntas de produto: o consumidor tolera a mudança? A validação detectaria a incompatibilidade?",
      "A diff shows that a field changed. Deciding whether it matters needs context: who produces it, who consumes it and which behavior depends on it.\n\nUse the Eurologado case study as a reading exercise. Pick one described flow and write a minimal fictional contract for it. Then add a field and change a value using the library's JSON comparator.\n\nThis does not reproduce the project's internal contracts. It connects a comparison tool to product questions: can the consumer tolerate the change? Would validation detect an incompatibility?",
      "Un diff muestra que un campo cambió. Decidir si importa requiere contexto: quién lo produce, quién lo consume y qué comportamiento depende de él.\n\nUsa el caso Eurologado como ejercicio de lectura. Elige un flujo descrito y escribe un contrato ficticio mínimo. Después añade un campo y cambia un valor con el comparador JSON.\n\nEl ejercicio no reproduce contratos internos del proyecto. Conecta una herramienta con preguntas de producto: ¿el consumidor tolera el cambio? ¿La validación detectaría una incompatibilidad?"
    ),
  },
  {
    id: "d26-pitch-kit",
    channel: "newsletter",
    target: "campanhas/kit-engenharia",
    title: translated(
      "Sugestão de curadoria: ferramentas e exercícios de engenharia",
      "Resource suggestion: engineering tools and exercises",
      "Propuesta para su selección: herramientas y ejercicios de ingeniería"
    ),
    body: translated(
      "Olá, equipe editorial.\n\nGostaria de sugerir o kit aberto de engenharia para uma seleção de recursos práticos. Ele reúne comparador JSON, revisor de chaves .env, demo de fila, starter TypeScript e exercícios de decisão de arquitetura, em português, inglês e espanhol.\n\nChamada sugerida: “Compare um contrato, provoque uma sobrecarga e leve um starter com testes. Uma biblioteca para experimentar decisões com dados fictícios.”\n\nOs recursos explicam suas limitações e podem ser explorados sem cadastro. Não apresento métricas de audiência ou resultados de uso; o link abaixo permite avaliar diretamente o material. Se fizer sentido para a edição, fico disponível para esclarecer método e escopo.\n\nObrigado,\nYago Lagrotti Bracco",
      "Hello, editorial team.\n\nI would like to suggest the open engineering kit for a practical resources selection. It brings together a JSON comparator, .env key checker, queue demo, TypeScript starter and architecture decision exercises in Portuguese, English and Spanish.\n\nSuggested blurb: “Compare a contract, trigger overload and take a starter with tests. A library for experimenting with decisions using synthetic data.”\n\nThe resources explain their limitations and can be explored without registration. I am not presenting audience metrics or adoption results; the link below lets you assess the material directly. If it fits an issue, I can clarify method and scope.\n\nThank you,\nYago Lagrotti Bracco",
      "Hola, equipo editorial.\n\nQuisiera proponer el kit abierto de ingeniería para una selección de recursos prácticos. Reúne comparador JSON, revisor de claves .env, demo de cola, starter TypeScript y ejercicios de decisiones de arquitectura en portugués, inglés y español.\n\nTexto sugerido: “Compara un contrato, provoca una sobrecarga y descarga un starter con pruebas. Una biblioteca para experimentar decisiones con datos ficticios.”\n\nLos recursos explican sus límites y se exploran sin registro. No presento métricas de audiencia ni resultados de adopción; el enlace permite evaluar el material directamente. Si encaja en una edición, puedo aclarar método y alcance.\n\nGracias,\nYago Lagrotti Bracco"
    ),
  },
  {
    id: "d27-charla",
    channel: "whatsapp",
    target: "palestras/eventos",
    title: translated(
      "Roteiro de 30 minutos sobre filas",
      "A 30-minute queue outline",
      "Guion de 30 minutos sobre colas"
    ),
    body: translated(
      "Preparei “Filas sem mágica”: roteiro e material para discutir capacidade, retries, idempotência e observabilidade em 30 minutos. Inclui exercícios e gabarito. É uma proposta disponível para convite ou estudo, sem evento marcado.",
      "I prepared “Queues without magic”: an outline and material for discussing capacity, retries, idempotency and observability in 30 minutes. Includes exercises and an answer key. Available for invitations or study, with no scheduled event.",
      "Preparé “Colas sin magia”: guion y material para discutir capacidad, reintentos, idempotencia y observabilidad en 30 minutos. Incluye ejercicios y soluciones. Propuesta disponible para invitaciones o estudio, sin evento programado."
    ),
  },
  {
    id: "d28-decisao",
    channel: "linkedin",
    target: "templates/adr",
    title: translated(
      "Troque “é melhor” por uma condição observável",
      "Replace “it is better” with an observable condition",
      "Cambia “es mejor” por una condición observable"
    ),
    body: translated(
      "Um ADR útil não termina na escolha da tecnologia. Ele registra a restrição, a alternativa descartada e o sinal que faria o time reconsiderar.\n\nNo cenário fictício da oficina, uma condição pode ser: se o backlog não drenar no prazo definido para o produto, reavaliar capacidade e política de admissão. O número precisa vir do requisito ou do experimento, com as hipóteses visíveis.\n\nO template está disponível em texto para você adaptar. Pegue uma decisão recente: qual consequência foi aceita conscientemente e qual evidência mostraria que ela ficou cara demais?",
      "A useful ADR does not end with the technology choice. It records the constraint, the rejected alternative and the signal that would make the team reconsider.\n\nIn the workshop's fictional scenario, a condition might be: if backlog does not drain within the product's required time, revisit capacity and admission policy. The number must come from a requirement or experiment, with visible assumptions.\n\nThe template is available as plain text for adaptation. Take a recent decision: which consequence was accepted consciously, and what evidence would show its cost has grown too high?",
      "Un ADR útil no termina al elegir tecnología. Registra la restricción, la alternativa descartada y la señal que haría al equipo reconsiderar.\n\nEn el escenario ficticio del taller, una condición podría ser: si la cola no se vacía en el plazo requerido por el producto, revisar capacidad y política de admisión. El número debe venir del requisito o experimento, con los supuestos visibles.\n\nLa plantilla está en texto para adaptarla. Elige una decisión reciente: ¿qué consecuencia aceptaron y qué evidencia mostraría que su coste ya es demasiado alto?"
    ),
  },
  {
    id: "d29-comunidade",
    channel: "community",
    target: "comunidade/sua-aplicacao",
    title: translated(
      "Usou um recurso? Mostre uma aplicação verificável",
      "Used a resource? Show a verifiable application",
      "¿Usaste un recurso? Muestra una aplicación verificable"
    ),
    body: translated(
      "A biblioteca tem um convite aberto para quem aplicar um dos recursos em uma demonstração pública. Uma proposta útil mostra qual recurso foi usado, o que foi adaptado e como outra pessoa pode verificar o resultado.\n\nPode ser um teste de deduplicação, um ADR com experimento reproduzível ou uma comparação de contratos com dados sintéticos. Inclua um link público, o crédito desejado e a autorização de publicação. Não envie dados pessoais de terceiros nem material confidencial.\n\nAs propostas passam por revisão; enviar não garante publicação. A página explica o fluxo e permite preparar a proposta para revisar antes de enviar. Que adaptação tornaria o recurso mais útil no seu contexto?",
      "The library has an open invitation for anyone who applies a resource in a public demonstration. A useful proposal shows which resource was used, what was adapted and how another person can verify the result.\n\nIt could be a deduplication test, an ADR with a reproducible experiment or a contract comparison using synthetic data. Include a public link, preferred credit and publication permission. Share no third-party personal data or confidential material.\n\nProposals are reviewed; submission does not guarantee publication. The page explains the process and lets you prepare and review a proposal before sending. Which adaptation would make the resource more useful in your context?",
      "La biblioteca tiene una invitación abierta para quien aplique un recurso en una demostración pública. Una propuesta útil muestra qué recurso se usó, qué se adaptó y cómo otra persona puede verificar el resultado.\n\nPuede ser una prueba de deduplicación, un ADR con experimento reproducible o una comparación de contratos con datos sintéticos. Incluye enlace público, crédito deseado y permiso de publicación. No compartas datos personales de terceros ni material confidencial.\n\nLas propuestas se revisan; enviar no garantiza publicación. La página explica el proceso y permite preparar y revisar la propuesta antes de enviarla. ¿Qué adaptación haría el recurso más útil en tu contexto?"
    ),
  },
  {
    id: "d30-proximo",
    channel: "linkedin",
    target: "campanhas/kit-engenharia",
    title: translated(
      "Escolha um experimento e registre o que aprendeu",
      "Choose an experiment and record what you learned",
      "Elige un experimento y registra lo aprendido"
    ),
    body: translated(
      "Se você chegou à biblioteca por um post, aqui vai uma sequência para transformar leitura em prática: compare dois payloads fictícios, sobrecarregue a fila, teste o starter e escreva um ADR com uma condição de revisão.\n\nNão é preciso adotar uma tecnologia nova para tirar valor do exercício. O resultado pode ser confirmar que uma chamada direta basta, descobrir uma hipótese não testada ou explicar melhor a recuperação de uma falha.\n\nO kit reúne os caminhos e downloads em três idiomas. Qual experimento você escolheria para a próxima conversa de engenharia? Registre a previsão antes de executar e compare depois.",
      "If you reached the library through a post, here is a route from reading to practice: compare two synthetic payloads, overload the queue, test the starter and write an ADR with a review condition.\n\nYou do not need to adopt a new technology to get value from the exercise. The outcome might be confirming that a direct call is enough, finding an untested assumption or explaining failure recovery more clearly.\n\nThe kit collects the routes and downloads in three languages. Which experiment would you choose for your next engineering discussion? Write your prediction before running it and compare afterward.",
      "Si llegaste a la biblioteca por una publicación, aquí va un recorrido de lectura a práctica: compara dos payloads ficticios, sobrecarga la cola, prueba el starter y escribe un ADR con condición de revisión.\n\nNo hace falta adoptar una tecnología nueva para aprovechar el ejercicio. El resultado puede ser confirmar que basta una llamada directa, descubrir un supuesto sin probar o explicar mejor la recuperación de un fallo.\n\nEl kit reúne recorridos y descargas en tres idiomas. ¿Qué experimento elegirías para tu próxima conversación de ingeniería? Anota la predicción antes de ejecutar y compara después."
    ),
  },
]

function targetUrl(target: string, locale: Locale): string {
  const [section, slug] = target.split("/")
  return `${SITE_URL}${section === "case" ? getCaseStudyPath(locale, slug) : getResourcePath(locale, section, slug)}`
}
function dayAfter(date: string): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + 86400000)
    .toISOString()
    .slice(0, 10)
}
export const campaignEntries: CampaignEntry[] = briefs.map((brief, index) => {
  const href = {} as Translated
  const text = {} as Translated
  for (const locale of languages) {
    href[locale] = withUtm(targetUrl(brief.target, locale), {
      utm_source: brief.channel,
      utm_medium:
        brief.channel === "newsletter"
          ? "email"
          : brief.channel === "whatsapp"
            ? "messaging"
            : "social",
      utm_campaign: "biblioteca-2026-10",
      utm_content: `${brief.id}-${locale}`,
    })
    const subject = translated("Assunto: ", "Subject: ", "Asunto: ")[locale]
    text[locale] =
      `${brief.channel === "newsletter" ? subject : ""}${brief.title[locale]}\n\n${brief.body[locale]}\n\n${href[locale]}`
  }
  return {
    id: brief.id,
    date: new Date(Date.UTC(2026, 9, 19 + index)).toISOString().slice(0, 10),
    channel: brief.channel,
    title: brief.title,
    text,
    href,
  }
})

export function getCampaignEntries(locale: Locale): LocalizedCampaignEntry[] {
  return campaignEntries.map((entry) => ({
    ...entry,
    title: entry.title[locale],
    text: entry.text[locale],
    href: entry.href[locale],
  }))
}

/** Decode only known completion IDs. No messages, recipients or personal fields are retained. */
export function parseCampaignProgress(serialized: string | null): string[] {
  try {
    const value: unknown = JSON.parse(serialized ?? "[]")
    if (!Array.isArray(value)) return []
    const allowed = new Set(campaignEntries.map((entry) => entry.id))
    return [
      ...new Set(
        value.filter(
          (id): id is string => typeof id === "string" && allowed.has(id)
        )
      ),
    ]
  } catch {
    return []
  }
}

export function buildCampaignMarkdown(locale: Locale): string {
  const title = translated(
    "Plano editorial — 30 dias",
    "Editorial plan — 30 days",
    "Plan editorial — 30 días"
  )[locale]
  const note = translated(
    "Datas sugeridas: 19/10 a 17/11/2026. Revise antes de publicar ou enviar. Este arquivo não agenda nem envia mensagens. Selecione uma versão de idioma para cada público; não é preciso publicar as três. Não há resultados de audiência ou participações externas confirmadas.",
    "Suggested dates: October 19–November 17, 2026. Review before publishing or sending. This file does not schedule or send messages. Select one language version for each audience; you do not need to publish all three. There are no confirmed audience results or external appearances.",
    "Fechas sugeridas: 19/10–17/11/2026. Revisa antes de publicar o enviar. Este archivo no programa ni envía mensajes. Elige una versión de idioma por público; no hace falta publicar las tres. No hay resultados de audiencia ni participaciones externas confirmadas."
  )[locale]
  return `# ${title}\n\n${note}\n\n${getCampaignEntries(locale)
    .map(
      (entry) =>
        `## ${entry.date} · ${campaignChannelLabels[entry.channel][locale]}\n\n<!-- ${entry.id} -->\n\n${entry.text}`
    )
    .join("\n\n---\n\n")}\n`
}
function escapeCalendar(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
}
function foldCalendarLine(value: string): string {
  const encoder = new TextEncoder()
  let folded = "",
    octets = 0
  for (const character of value) {
    const size = encoder.encode(character).length
    if (octets + size > 75) {
      folded += "\r\n "
      octets = 1
    }
    folded += character
    octets += size
  }
  return folded
}
/** All-day editorial reminders, with exclusive end dates and no invitees or alerts. */
export function buildCampaignCalendar(
  locale: Locale,
  entries: LocalizedCampaignEntry[] = getCampaignEntries(locale)
): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//lagrotti.dev//Engineering editorial plan//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ]
  for (const entry of entries)
    lines.push(
      "BEGIN:VEVENT",
      `UID:${entry.id}-${locale}-biblioteca-2026-10@lagrotti.dev`,
      "DTSTAMP:20261017T000000Z",
      `DTSTART;VALUE=DATE:${entry.date.replace(/-/g, "")}`,
      `DTEND;VALUE=DATE:${dayAfter(entry.date).replace(/-/g, "")}`,
      `SUMMARY:${escapeCalendar(entry.title)}`,
      `DESCRIPTION:${escapeCalendar(`${campaignChannelLabels[entry.channel][locale]}\n\n${entry.text}`)}`,
      `URL:${entry.href}`,
      "STATUS:TENTATIVE",
      "TRANSP:TRANSPARENT",
      "END:VEVENT"
    )
  lines.push("END:VCALENDAR")
  return `${lines.map(foldCalendarLine).join("\r\n")}\r\n`
}
