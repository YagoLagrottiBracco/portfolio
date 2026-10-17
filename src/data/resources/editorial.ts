import { tr, type ResourceEntry } from "./types"

export const guides: ResourceEntry[] = [
  {
    slug: "filas",
    title: tr(
      "Quando colocar uma fila entre serviços?",
      "When should services use a queue?",
      "¿Cuándo usar una cola entre servicios?"
    ),
    description: tr(
      "Separe picos de entrada da capacidade de processamento sem esconder o custo operacional.",
      "Separate traffic spikes from processing capacity without hiding operational cost.",
      "Separa los picos de entrada de la capacidad de procesamiento sin ocultar el coste operativo."
    ),
    projects: ["vmageste", "pulsewatch"],
    tags: ["Kafka", "Architecture", "Node.js"],
    blocks: [
      {
        title: tr("Use quando", "Use when", "Úsala cuando"),
        body: tr(
          "O produtor pode aceitar uma confirmação de recebimento antes da conclusão. Picos excedem a capacidade sustentada do consumidor e o trabalho pode ser reprocessado com segurança. No VMAGeste, o fluxo documentado separa ingestão, processamento e consulta analítica.",
          "The producer can acknowledge receipt before completion. Bursts exceed sustained consumer capacity and work can be replayed safely. VMAGeste's documented flow separates ingestion, processing and analytical queries.",
          "El productor puede confirmar la recepción antes de terminar. Los picos superan la capacidad sostenida y el trabajo puede reprocesarse. El flujo de VMAGeste separa ingesta, procesamiento y consultas analíticas."
        ),
      },
      {
        title: tr(
          "Prefira uma chamada direta quando",
          "Prefer a direct call when",
          "Prefiere una llamada directa cuando"
        ),
        body: tr(
          "A resposta precisa do resultado imediatamente, o volume é previsível e a dependência já cabe no orçamento de latência. Uma fila não resolve consumidores permanentemente mais lentos que a entrada: o backlog só cresce.",
          "The response requires the result immediately, volume is predictable and the dependency fits the latency budget. A queue does not fix consumers that remain slower than arrivals: backlog keeps growing.",
          "La respuesta necesita el resultado inmediato, el volumen es previsible y la dependencia cabe en el presupuesto de latencia. Una cola no arregla consumidores siempre más lentos que la entrada: la acumulación crece."
        ),
      },
      {
        title: tr("Antes de adotar", "Before adopting", "Antes de adoptarla"),
        body: tr(
          "Defina chave de idempotência, limite de tentativas, retenção, ordenação necessária e destino das falhas. Monitore idade da mensagem mais antiga, não apenas quantidade. Experimente o cenário na demo e registre a decisão no template ADR.",
          "Define an idempotency key, retry limit, retention, required ordering and failure destination. Monitor the oldest message age, not just message count. Try the demo and record the decision using the ADR template.",
          "Define una clave de idempotencia, límite de intentos, retención, orden necesario y destino de fallos. Monitoriza la edad del mensaje más antiguo, además de la cantidad. Prueba la demo y registra la decisión con la plantilla ADR."
        ),
      },
    ],
    source: "https://kafka.apache.org/documentation/#semantics",
  },
  {
    slug: "monolito",
    title: tr(
      "Monólito modular ou serviços separados?",
      "Modular monolith or separate services?",
      "¿Monolito modular o servicios separados?"
    ),
    description: tr(
      "Escolha fronteiras pela necessidade de operação e autonomia, com exemplos do ImpressãoMais3D.",
      "Choose boundaries based on operations and autonomy, with examples from ImpressãoMais3D.",
      "Elige límites según operación y autonomía, con ejemplos de ImpressãoMais3D."
    ),
    projects: ["impressaomais3d", "vmageste"],
    tags: ["Architecture", "TypeScript"],
    blocks: [
      {
        title: tr(
          "Comece pelas fronteiras",
          "Start with boundaries",
          "Empieza por los límites"
        ),
        body: tr(
          "Separe domínios, dependências e contratos dentro da aplicação. No ImpressãoMais3D, regras de importação verificadas pelo linter ajudam a sustentar essas fronteiras sem exigir distribuição pela rede.",
          "Separate domains, dependencies and contracts within the application. In ImpressãoMais3D, linter-enforced import rules support these boundaries without requiring network distribution.",
          "Separa dominios, dependencias y contratos dentro de la aplicación. En ImpressãoMais3D, reglas de importación verificadas por el linter mantienen límites sin exigir distribución por la red."
        ),
      },
      {
        title: tr(
          "Extraia por uma pressão concreta",
          "Extract for a concrete pressure",
          "Extrae por una necesidad concreta"
        ),
        body: tr(
          "Considere um serviço quando implantação independente, isolamento de falha ou escala específica compensarem o custo de observabilidade, contratos e consistência distribuída. Registre qual problema a extração resolve e como medir o resultado.",
          "Consider a service when independent deployment, failure isolation or distinct scaling justify the cost of observability, contracts and distributed consistency. Record which problem extraction solves and how to measure the outcome.",
          "Considera un servicio cuando el despliegue independiente, aislamiento de fallos o escala específica justifiquen observabilidad, contratos y consistencia distribuida. Registra el problema y cómo medir el resultado."
        ),
      },
      {
        title: tr("Sinal de alerta", "Warning sign", "Señal de alerta"),
        body: tr(
          "Se toda alteração exige publicar todos os serviços juntos, a separação física não entregou autonomia. Revise os contratos e o acoplamento dos dados antes de criar mais serviços.",
          "If every change requires deploying all services together, physical separation has not delivered autonomy. Review contracts and data coupling before adding more services.",
          "Si cada cambio exige desplegar todos los servicios juntos, la separación física no dio autonomía. Revisa contratos y acoplamiento de datos antes de añadir servicios."
        ),
      },
    ],
  },
  {
    slug: "validacao-ia",
    title: tr(
      "Onde termina a IA e começa a validação?",
      "Where does AI end and validation begin?",
      "¿Dónde termina la IA y empieza la validación?"
    ),
    description: tr(
      "Use geração para produzir rascunhos e regras verificáveis para aceitar resultados.",
      "Use generation to produce drafts and verifiable rules to accept results.",
      "Usa generación para borradores y reglas verificables para aceptar resultados."
    ),
    projects: ["eurologado", "devagent"],
    tags: ["AI", "Architecture"],
    blocks: [
      {
        title: tr(
          "Separe responsabilidades",
          "Separate responsibilities",
          "Separa responsabilidades"
        ),
        body: tr(
          "No Eurologado, a IA redige e a validação estruturada identifica faltas. Trate a saída como entrada não confiável: valide formato, campos obrigatórios e relações antes de persistir ou entregar ao usuário.",
          "In Eurologado, AI drafts and structured validation identifies omissions. Treat output as untrusted input: validate format, required fields and relationships before persisting or presenting it.",
          "En Eurologado, la IA redacta y la validación estructurada identifica faltantes. Trata la salida como entrada no confiable: valida formato, campos y relaciones antes de guardarla o presentarla."
        ),
      },
      {
        title: tr(
          "Mantenha um portão verificável",
          "Keep a verifiable gate",
          "Mantén una comprobación verificable"
        ),
        body: tr(
          "No DevAgent, testes e revisão humana fazem parte do caminho até a entrega. Para conteúdo regulatório ou decisões de alto impacto, inclua revisão de alguém com competência no domínio; schema válido não significa conteúdo correto.",
          "In DevAgent, tests and human review are part of delivery. For regulatory content or high-impact decisions, include a competent domain reviewer; a valid schema does not mean correct content.",
          "En DevAgent, las pruebas y la revisión humana forman parte de la entrega. Para contenido regulatorio o decisiones de alto impacto, incluye revisión experta; un esquema válido no implica contenido correcto."
        ),
      },
    ],
  },
]

export const glossary: ResourceEntry[] = [
  {
    slug: "idempotencia",
    title: tr("Idempotência", "Idempotency", "Idempotencia"),
    description: tr(
      "Repetir uma operação com a mesma identidade não deve duplicar seu efeito de negócio.",
      "Repeating an operation with the same identity should not duplicate its business effect.",
      "Repetir una operación con la misma identidad no debe duplicar su efecto de negocio."
    ),
    projects: ["vmageste"],
    blocks: [
      {
        title: tr(
          "Exemplo aplicável",
          "Applicable example",
          "Ejemplo aplicable"
        ),
        body: tr(
          "Em um consumidor de pedidos, guarde o identificador do evento junto da mudança de estado na mesma transação. Uma segunda entrega encontra o identificador e confirma sem cobrar de novo. A demo simplifica esse cenário; não implementa persistência.",
          "In an order consumer, store the event identifier and state change in the same transaction. A second delivery finds the identifier and acknowledges without charging again. The demo simplifies this scenario; it has no persistence.",
          "En un consumidor de pedidos, guarda el identificador del evento y el cambio de estado en la misma transacción. Una segunda entrega confirma sin volver a cobrar. La demo simplifica este caso y no tiene persistencia."
        ),
      },
    ],
  },
  {
    slug: "backpressure",
    title: tr("Backpressure", "Backpressure", "Backpressure"),
    description: tr(
      "Controlar a admissão de trabalho quando os consumidores não acompanham os produtores.",
      "Controlling work admission when consumers cannot keep up with producers.",
      "Controlar la admisión de trabajo cuando los consumidores no siguen a los productores."
    ),
    projects: ["vmageste", "pulsewatch"],
    blocks: [
      {
        title: tr("Experimente", "Try it", "Pruébalo"),
        body: tr(
          "Na demo de filas, aumente a entrada acima da capacidade dos workers. O backlog cresce a cada passo. Em produção, limites, escalonamento e controle de admissão precisam acompanhar essa diferença; retries sem limite amplificam a sobrecarga.",
          "In the queue demo, increase arrivals above worker capacity. Backlog grows every step. In production, limits, scaling and admission control must address this gap; unlimited retries amplify overload.",
          "En la demo, aumenta las entradas por encima de la capacidad de los workers. La cola crece en cada paso. En producción, límites, escalado y control de admisión deben atender esa diferencia; reintentos ilimitados amplifican la sobrecarga."
        ),
      },
    ],
  },
  {
    slug: "multi-tenant",
    title: tr("Multi-tenant", "Multi-tenant", "Multiinquilino"),
    description: tr(
      "Uma aplicação atende organizações diferentes mantendo seus dados e permissões isolados.",
      "One application serves different organizations while isolating data and permissions.",
      "Una aplicación atiende distintas organizaciones con datos y permisos aislados."
    ),
    projects: ["pulsewatch", "vmageste"],
    blocks: [
      {
        title: tr("No portfólio", "In this portfolio", "En el portafolio"),
        body: tr(
          "Pulsewatch é descrito como multi-tenant desde o primeiro dia. Uma implementação precisa verificar o tenant em cada acesso e cobrir tentativas de acesso cruzado nos testes; esconder registros na interface é insuficiente.",
          "Pulsewatch is described as multi-tenant from day one. An implementation must verify the tenant on every access and test cross-tenant attempts; hiding records in the interface is insufficient.",
          "Pulsewatch es multiinquilino desde el primer día. La implementación debe verificar el tenant en cada acceso y probar intentos cruzados; ocultar registros en la interfaz es insuficiente."
        ),
      },
    ],
  },
  {
    slug: "rls",
    title: tr("Row-Level Security", "Row-Level Security", "Seguridad por fila"),
    description: tr(
      "Políticas no banco limitam quais linhas uma identidade pode ler ou alterar.",
      "Database policies limit which rows an identity can read or change.",
      "Políticas de base de datos limitan qué filas puede leer o cambiar una identidad."
    ),
    projects: ["dupla-face", "impressaomais3d"],
    blocks: [
      {
        title: tr("No portfólio", "In this portfolio", "En el portafolio"),
        body: tr(
          "Os casos Dupla Face e ImpressãoMais3D descrevem autorização no banco. Teste políticas com as identidades reais de acesso; contas administrativas podem ignorar políticas e não provam isolamento de um cliente.",
          "Dupla Face and ImpressãoMais3D describe database authorization. Test policies using actual access identities; administrative accounts may bypass policies and do not prove client isolation.",
          "Dupla Face e ImpressãoMais3D describen autorización en la base de datos. Prueba políticas con identidades reales; las cuentas administrativas pueden omitirlas y no prueban aislamiento."
        ),
      },
    ],
    source: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html",
  },
  {
    slug: "dead-letter",
    title: tr(
      "Fila de falhas (DLQ)",
      "Dead-letter queue",
      "Cola de fallos (DLQ)"
    ),
    description: tr(
      "Destino para mensagens que esgotaram as tentativas, com diagnóstico e reprocessamento controlado.",
      "A destination for messages that exhausted retries, supporting diagnosis and controlled replay.",
      "Destino para mensajes que agotaron los intentos, con diagnóstico y reprocesamiento controlado."
    ),
    projects: ["vmageste"],
    blocks: [
      {
        title: tr("Regra da demonstração", "Demo rule", "Regla de la demo"),
        body: tr(
          "Cada mensagem pode falhar três vezes antes de ir para a DLQ. A demo usa falhas determinísticas para permitir repetir o experimento. Um sistema real também precisa de retenção, alertas e um procedimento de reenvio idempotente.",
          "Each message can fail three times before moving to the DLQ. The demo uses deterministic failures so the experiment can be repeated. A real system also needs retention, alerts and an idempotent replay procedure.",
          "Cada mensaje puede fallar tres veces antes de ir a la DLQ. La demo usa fallos deterministas para repetir el experimento. Un sistema real también necesita retención, alertas y reenvío idempotente."
        ),
      },
    ],
  },
  {
    slug: "adr",
    title: tr(
      "Registro de decisão (ADR)",
      "Architecture decision record",
      "Registro de decisión (ADR)"
    ),
    description: tr(
      "Um documento curto registra contexto, escolha e consequências de uma decisão técnica.",
      "A short document records context, choice and consequences of a technical decision.",
      "Un documento breve registra contexto, elección y consecuencias de una decisión técnica."
    ),
    projects: ["impressaomais3d", "envrune"],
    blocks: [
      {
        title: tr("Como usar", "How to use it", "Cómo usarlo"),
        body: tr(
          "Use o template disponível nesta biblioteca. Escreva a pressão concreta, duas alternativas e a condição que faria você revisar a escolha. Relacione a decisão ao código ou experimento que oferece evidência.",
          "Use the template in this library. Write the concrete pressure, two alternatives and the condition that would make you revisit the choice. Connect the decision to code or an experiment that provides evidence.",
          "Usa la plantilla de esta biblioteca. Escribe la necesidad concreta, dos alternativas y la condición para revisar la elección. Relaciona la decisión con código o un experimento que aporte evidencia."
        ),
      },
    ],
  },
]

export const topics: ResourceEntry[] = [
  {
    slug: "sistemas-eventos",
    title: tr(
      "Sistemas orientados a eventos",
      "Event-driven systems",
      "Sistemas orientados a eventos"
    ),
    description: tr(
      "Da ingestão à operação: filas, pressão de carga, alertas e recuperação.",
      "From ingestion to operations: queues, load pressure, alerts and recovery.",
      "De la ingesta a la operación: colas, presión de carga, alertas y recuperación."
    ),
    projects: ["vmageste", "pulsewatch"],
    tags: ["Kafka", "Node.js", "Architecture"],
  },
  {
    slug: "produtos-seguros",
    title: tr(
      "Produtos e fronteiras de segurança",
      "Products and security boundaries",
      "Productos y límites de seguridad"
    ),
    description: tr(
      "Autorização no banco, segredos e decisões que sustentam um produto completo.",
      "Database authorization, secrets and decisions supporting a complete product.",
      "Autorización en base de datos, secretos y decisiones para un producto completo."
    ),
    projects: ["envrune", "dupla-face", "impressaomais3d"],
    tags: ["Security", "TypeScript", "SaaS"],
  },
  {
    slug: "ia-aplicada",
    title: tr(
      "IA com validação e revisão",
      "AI with validation and review",
      "IA con validación y revisión"
    ),
    description: tr(
      "Automação assistida por IA com contratos, testes e revisão humana.",
      "AI-assisted automation with contracts, tests and human review.",
      "Automatización con IA, contratos, pruebas y revisión humana."
    ),
    projects: ["eurologado", "devagent"],
    tags: ["AI", "Automation", "Python"],
  },
]
