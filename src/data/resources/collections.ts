import { tr, type ResourceEntry } from "./types"

export const tools: ResourceEntry[] = [
  {
    slug: "json",
    title: tr("Comparador de JSON", "JSON comparator", "Comparador de JSON"),
    description: tr(
      "Identifique campos adicionados, removidos e alterados. A ordem das chaves não muda o resultado.",
      "Find added, removed and changed fields. Key ordering does not change the result.",
      "Identifica campos añadidos, eliminados y modificados. El orden de las claves no cambia el resultado."
    ),
    tool: "json",
    projects: ["eurologado", "devagent"],
  },
  {
    slug: "env",
    title: tr(
      "Revisor de chaves .env",
      ".env key checker",
      "Revisor de claves .env"
    ),
    description: tr(
      "Compare apenas nomes de variáveis, detecte ausências e duplicatas sem reproduzir valores no relatório.",
      "Compare variable names, detect missing keys and duplicates without reproducing values in the report.",
      "Compara nombres de variables, detecta faltantes y duplicados sin reproducir valores en el informe."
    ),
    tool: "env",
    projects: ["envrune"],
  },
]
export const demos: ResourceEntry[] = [
  {
    slug: "queue",
    title: tr(
      "Fila, retries e recuperação",
      "Queue, retries and recovery",
      "Cola, reintentos y recuperación"
    ),
    description: tr(
      "Ajuste entrada, workers e falhas para observar o backlog e a fila de falhas. Modelo didático inspirado nos casos, sem dados de produção.",
      "Adjust arrivals, workers and failures to observe backlog and dead letters. An educational model inspired by the cases, with no production data.",
      "Ajusta entradas, workers y fallos para observar acumulación y mensajes fallidos. Modelo didáctico inspirado en los casos, sin datos de producción."
    ),
    tool: "queue",
    projects: ["vmageste", "pulsewatch"],
    blocks: [
      {
        title: tr(
          "O que está sendo modelado",
          "What is being modeled",
          "Qué se modela"
        ),
        body: tr(
          "Cada passo representa um segundo. Um worker tenta processar uma mensagem por passo. Falhas voltam para o fim da fila até três tentativas; depois vão para a DLQ. Não há backoff, persistência ou partições neste modelo. Ele ilustra capacidade, não estima a vazão real dos projetos.",
          "Each step represents one second. A worker attempts one message per step. Failures return to the queue for up to three attempts, then move to the DLQ. This model has no backoff, persistence or partitions. It illustrates capacity; it does not estimate actual project throughput.",
          "Cada paso representa un segundo. Un worker intenta un mensaje por paso. Los fallos vuelven a la cola hasta tres intentos; después pasan a la DLQ. El modelo no tiene backoff, persistencia ni particiones. Ilustra capacidad, no estima el rendimiento real de los proyectos."
        ),
      },
    ],
  },
]
export const templates: ResourceEntry[] = [
  {
    slug: "worker",
    title: tr(
      "Worker com retries limitados",
      "Worker with bounded retries",
      "Worker con reintentos limitados"
    ),
    description: tr(
      "Starter TypeScript executável, com teste, deduplicação em memória, limite de tentativas e exemplo de fila de falhas.",
      "Runnable TypeScript starter with tests, in-memory deduplication, bounded retries and a dead-letter example.",
      "Starter TypeScript ejecutable con pruebas, deduplicación en memoria, reintentos limitados y ejemplo de cola de fallos."
    ),
    download: "worker-starter.zip",
    projects: ["vmageste", "pulsewatch"],
    blocks: [
      {
        title: tr("Execute localmente", "Run locally", "Ejecútalo localmente"),
        body: tr(
          "Requer Node.js 22 ou superior. Descompacte, execute npm install, npm test e npm start. O README inclui a explicação de cada arquivo. Licença MIT. A deduplicação é local ao processo; adapte persistência e transações antes de uso em produção.",
          "Requires Node.js 22 or newer. Unzip, run npm install, npm test and npm start. The README explains each file. MIT license. Deduplication is process-local; adapt persistence and transactions before production use.",
          "Requiere Node.js 22 o superior. Descomprime, ejecuta npm install, npm test y npm start. El README explica cada archivo. Licencia MIT. La deduplicación es local al proceso; adapta persistencia y transacciones antes de producción."
        ),
      },
    ],
  },
  {
    slug: "adr",
    title: tr(
      "Template de decisão de arquitetura",
      "Architecture decision template",
      "Plantilla de decisión de arquitectura"
    ),
    description: tr(
      "Um ADR preenchível com contexto, alternativas, decisão, consequências e condição de revisão.",
      "A fillable ADR with context, alternatives, decision, consequences and a review condition.",
      "Un ADR para completar con contexto, alternativas, decisión, consecuencias y condición de revisión."
    ),
    download: "adr.md",
    projects: ["impressaomais3d", "envrune"],
  },
]
export const benchmarks: ResourceEntry[] = [
  {
    slug: "json-clone",
    title: tr(
      "Clonagem de dados JSON",
      "Cloning JSON data",
      "Clonación de datos JSON"
    ),
    description: tr(
      "JSON.parse/stringify e structuredClone em dados sintéticos: script reproduzível, amostras e contexto da execução.",
      "JSON.parse/stringify and structuredClone on synthetic data: reproducible script, samples and execution context.",
      "JSON.parse/stringify y structuredClone con datos sintéticos: script reproducible, muestras y contexto."
    ),
    download: "json-clone.csv",
    source: "https://nodejs.org/api/perf_hooks.html",
    blocks: [
      {
        title: tr("Método", "Method", "Método"),
        body: tr(
          "O script gera listas de 100, 1.000 e 5.000 eventos JSON, aquece cada função 20 vezes e mede 30 lotes de 10 cópias. Alterna a ordem dos métodos por amostra. A tabela exibe a mediana em ms por cópia e o CSV mantém todas as amostras.",
          "The script generates lists of 100, 1,000 and 5,000 JSON events, warms each function 20 times and measures 30 batches of 10 copies. Method order alternates per sample. The table shows median milliseconds per copy; the CSV retains all samples.",
          "El script genera listas de 100, 1.000 y 5.000 eventos JSON, calienta cada función 20 veces y mide 30 lotes de 10 copias. Alterna el orden por muestra. La tabla muestra la mediana en ms por copia; el CSV conserva las muestras."
        ),
      },
      {
        title: tr(
          "Limites e reprodução",
          "Limits and reproduction",
          "Límites y reproducción"
        ),
        body: tr(
          "Medição local em uma única máquina; GC e carga concorrente afetam os tempos. O conjunto só contém valores JSON: não testa Date, Map, ciclos ou transferíveis. Os métodos não são equivalentes para todos os objetos. Baixe o script e execute node benchmark-json.mjs ./resultado para produzir seu próprio CSV e JSON.",
          "A local measurement on one machine; GC and concurrent load affect timing. The dataset contains only JSON values: it does not test Date, Map, cycles or transferables. The methods are not equivalent for every object. Download the script and run node benchmark-json.mjs ./result to produce your own CSV and JSON.",
          "Medición local en una máquina; GC y carga concurrente afectan los tiempos. Los datos solo contienen valores JSON: no prueba Date, Map, ciclos ni transferibles. Los métodos no son equivalentes para todos los objetos. Descarga el script y ejecuta node benchmark-json.mjs ./resultado para generar CSV y JSON."
        ),
      },
    ],
  },
]
export const experiments: ResourceEntry[] = [
  {
    slug: "sobrecarga",
    title: tr(
      "O que acontece quando a entrada supera a capacidade?",
      "What happens when arrivals exceed capacity?",
      "¿Qué pasa cuando las entradas superan la capacidad?"
    ),
    description: tr(
      "Hipótese: uma fila absorve um pico, mas não corrige um déficit permanente de processamento.",
      "Hypothesis: a queue absorbs a burst but does not fix a permanent processing deficit.",
      "Hipótesis: una cola absorbe un pico, pero no corrige un déficit permanente de procesamiento."
    ),
    tool: "queue",
    projects: ["vmageste", "pulsewatch"],
    blocks: [
      {
        title: tr(
          "Protocolo e observação",
          "Protocol and observation",
          "Protocolo y observación"
        ),
        body: tr(
          "Use 20 entradas/s e dois workers, com 0% de falhas. Avance dez passos: o backlog será 180. Mude a entrada para zero e avance até esvaziar. A conclusão vale para este modelo determinístico; um broker real inclui batching, latência e limites próprios.",
          "Use 20 arrivals/s and two workers with 0% failures. Advance ten steps: backlog is 180. Set arrivals to zero and advance until drained. The conclusion applies to this deterministic model; a real broker adds batching, latency and its own limits.",
          "Usa 20 entradas/s y dos workers con 0% de fallos. Avanza diez pasos: habrá 180 pendientes. Pon las entradas en cero y avanza hasta vaciar. La conclusión vale para este modelo determinista; un broker real añade lotes, latencia y límites propios."
        ),
      },
    ],
  },
  {
    slug: "copias",
    title: tr(
      "Qual cópia é mais rápida neste conjunto?",
      "Which clone is faster on this dataset?",
      "¿Qué copia es más rápida con estos datos?"
    ),
    description: tr(
      "Experimento reproduzível que compara duas estratégias sem transformar uma medição em regra universal.",
      "A reproducible experiment comparing two strategies without treating one measurement as a universal rule.",
      "Experimento reproducible que compara dos estrategias sin convertir una medición en regla universal."
    ),
    download: "benchmark-json.mjs",
    blocks: [
      {
        title: tr(
          "Hipótese e teste",
          "Hypothesis and test",
          "Hipótesis y prueba"
        ),
        body: tr(
          "O tamanho do objeto pode mudar o custo relativo das estratégias. Execute o script, compare as medianas por tamanho e repita em outro runtime. Use o benchmark completo para consultar o contexto e os dados brutos; não escolha uma API só pelo tempo se ela não preservar os tipos necessários.",
          "Object size may change the relative cost of each strategy. Run the script, compare medians by size and repeat on another runtime. Consult the full benchmark for context and raw data; do not choose an API by timing alone if it cannot preserve the types you need.",
          "El tamaño puede cambiar el coste relativo de cada estrategia. Ejecuta el script, compara medianas por tamaño y repite en otro runtime. Consulta el benchmark completo para contexto y datos; no elijas una API solo por tiempo si no conserva los tipos necesarios."
        ),
      },
    ],
  },
]
export const talks: ResourceEntry[] = [
  {
    slug: "eventos",
    title: tr("Filas sem mágica", "Queues without magic", "Colas sin magia"),
    description: tr(
      "Proposta de palestra de 30 minutos: capacidade, retries, idempotência e observabilidade, com demonstração ao vivo.",
      "A 30-minute talk proposal: capacity, retries, idempotency and observability, with a live demonstration.",
      "Propuesta de charla de 30 minutos: capacidad, reintentos, idempotencia y observabilidad, con demostración."
    ),
    projects: ["vmageste", "pulsewatch"],
    download: "talk-eventos.md",
    blocks: [
      {
        title: tr(
          "Público e roteiro",
          "Audience and outline",
          "Público y guion"
        ),
        body: tr(
          "Para desenvolvedores backend que já conhecem HTTP. Roteiro: problema (5 min), modelo de fila (10 min), falhas e duplicação (10 min), discussão (5 min). Objetivo: sair sabendo identificar um backlog sem confundi-lo com perda de mensagens. Proposta disponível para convite; não representa apresentação já realizada.",
          "For backend developers familiar with HTTP. Outline: problem (5 min), queue model (10 min), failures and duplication (10 min), discussion (5 min). Goal: identify backlog without confusing it with message loss. Available for invitations; this is not a claim of a past presentation.",
          "Para desarrolladores backend que conocen HTTP. Guion: problema (5 min), modelo (10 min), fallos y duplicación (10 min), discusión (5 min). Objetivo: identificar acumulación sin confundirla con pérdida. Disponible para invitaciones; no representa una charla ya realizada."
        ),
      },
    ],
  },
  {
    slug: "arquitetura",
    title: tr(
      "Oficina: uma decisão que dá para defender",
      "Workshop: a decision you can defend",
      "Taller: una decisión defendible"
    ),
    description: tr(
      "Proposta de oficina de 60 minutos para comparar alternativas e escrever um ADR apoiado por um experimento.",
      "A 60-minute workshop proposal to compare alternatives and write an experiment-supported ADR.",
      "Propuesta de taller de 60 minutos para comparar alternativas y escribir un ADR basado en un experimento."
    ),
    download: "workshop-arquitetura.md",
    projects: ["impressaomais3d"],
    blocks: [
      {
        title: tr("Formato", "Format", "Formato"),
        body: tr(
          "Duplas ou estudo individual. Contexto e restrições (10 min), experimento de capacidade (15 min), alternativas (15 min), escrita do ADR (15 min), revisão (5 min). Requer apenas navegador e editor de texto. A versão autoguiada está na área de campanhas.",
          "Pairs or individual study. Context and constraints (10 min), capacity experiment (15 min), alternatives (15 min), ADR writing (15 min), review (5 min). Requires only a browser and text editor. A self-guided version is in the campaigns collection.",
          "En parejas o individual. Contexto (10 min), experimento (15 min), alternativas (15 min), ADR (15 min), revisión (5 min). Solo requiere navegador y editor de texto. La versión autoguiada está en campañas."
        ),
      },
    ],
  },
]
export const collaborations: ResourceEntry[] = [
  {
    slug: "reproduzir-benchmark",
    title: tr(
      "Reproduza e compare o benchmark",
      "Reproduce and compare the benchmark",
      "Reproduce y compara el benchmark"
    ),
    description: tr(
      "Brief aberto: executar a mesma carga em outro runtime e escrever uma análise conjunta das diferenças.",
      "Open brief: run the same workload on another runtime and jointly analyze the differences.",
      "Brief abierto: ejecutar la misma carga en otro runtime y analizar juntos las diferencias."
    ),
    download: "collaboration-brief.md",
    blocks: [
      {
        title: tr(
          "Entrega e crédito",
          "Deliverable and credit",
          "Entrega y crédito"
        ),
        body: tr(
          "Envie versão do runtime, sistema, CPU, comando e amostras brutas sem dados pessoais. A publicação conjunta depende de revisão de método e autorização dos participantes. Autoria e links são combinados antes da publicação; este é um convite, ainda sem coautores confirmados.",
          "Provide runtime version, system, CPU, command and raw samples without personal data. Joint publication depends on methodology review and participant permission. Authorship and links are agreed before publishing; this is an invitation with no confirmed coauthors yet.",
          "Envía runtime, sistema, CPU, comando y muestras sin datos personales. La publicación conjunta depende de revisar el método y obtener permiso. Autoría y enlaces se acuerdan antes de publicar; es una invitación sin coautores confirmados."
        ),
      },
    ],
  },
]
export const campaigns: ResourceEntry[] = [
  {
    slug: "kit-engenharia",
    title: tr(
      "Kit aberto de engenharia",
      "Open engineering kit",
      "Kit abierto de ingeniería"
    ),
    description: tr(
      "Um endereço para apresentar a biblioteca: experimente uma ferramenta, explore a fila e leve um starter para seu próximo projeto.",
      "One destination for the library: try a tool, explore the queue and take a starter to your next project.",
      "Un destino para la biblioteca: prueba una herramienta, explora la cola y lleva un starter a tu próximo proyecto."
    ),
    download: "launch-kit.md",
    projects: ["envrune", "vmageste", "pulsewatch"],
    blocks: [
      {
        title: tr(
          "Roteiro de cinco minutos",
          "Five-minute route",
          "Recorrido de cinco minutos"
        ),
        body: tr(
          "1. Compare duas configurações JSON. 2. Gere uma sobrecarga na demo e recupere a fila. 3. Baixe o worker e execute os testes. 4. Use um diagrama para explicar a ideia ao time. O pacote de lançamento inclui textos nos três idiomas para apresentar esta coleção.",
          "1. Compare two JSON configurations. 2. Overload and recover the demo queue. 3. Download the worker and run its tests. 4. Use a diagram to explain the idea to your team. The launch pack includes copy in all three languages to introduce this collection.",
          "1. Compara dos configuraciones JSON. 2. Sobrecarga y recupera la cola. 3. Descarga el worker y ejecuta las pruebas. 4. Usa un diagrama para explicar la idea al equipo. El kit incluye textos en los tres idiomas para presentar la colección."
        ),
      },
    ],
  },
  {
    slug: "oficina-arquitetura",
    title: tr(
      "Oficina autoguiada de arquitetura",
      "Self-guided architecture workshop",
      "Taller autoguiado de arquitectura"
    ),
    description: tr(
      "Uma hora, um problema e uma decisão registrada. Faça sozinho ou use o roteiro para conduzir uma sessão com seu time.",
      "One hour, one problem and one recorded decision. Work alone or use the outline to lead a team session.",
      "Una hora, un problema y una decisión registrada. Hazlo solo o guía una sesión con tu equipo."
    ),
    download: "workshop-arquitetura.md",
    blocks: [
      {
        title: tr("Desafio", "Challenge", "Desafío"),
        body: tr(
          "Seu serviço recebe 20 pedidos/s e processa dois por segundo. O pico dura dez segundos. Modele o backlog, proponha uma estratégia de recuperação e explique quando preferiria rejeitar trabalho em vez de enfileirar. Entregue um ADR com uma alternativa descartada e uma condição de revisão. Use a demo, o guia de filas e o template ADR; não há inscrição nem evento com data marcada.",
          "Your service receives 20 orders/s and processes two per second. The burst lasts ten seconds. Model backlog, propose recovery and explain when you would reject work instead of queuing it. Deliver an ADR with a rejected alternative and a review condition. Use the demo, queue guide and ADR template; no registration or scheduled event is implied.",
          "Tu servicio recibe 20 pedidos/s y procesa dos por segundo. El pico dura diez segundos. Modela la acumulación, propone recuperación y explica cuándo rechazarías trabajo en vez de encolarlo. Entrega un ADR con una alternativa descartada y condición de revisión. Usa demo, guía y plantilla; no hay inscripción ni evento con fecha."
        ),
      },
    ],
  },
]
