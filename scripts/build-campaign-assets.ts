import { mkdirSync, writeFileSync } from "node:fs"
import { join, resolve, basename } from "node:path"
import { execFileSync } from "node:child_process"
import type { Locale } from "../src/lib/i18n"
import { getResourcePath } from "../src/lib/resource-routes"
import { SITE_URL } from "../src/lib/site"
import { talks } from "../src/data/resources/collections"
import {
  buildCampaignCalendar,
  buildCampaignMarkdown,
} from "../src/data/resources/campaign-plan"

const languages: Locale[] = ["pt", "en", "es"]
const translated = <T>(pt: T, en: T, es: T) => ({ pt, en, es })

const queueGuide: Record<Locale, string> = {
  pt: `## Objetivos e preparação

Proposta de palestra de 30 minutos para pessoas de backend que conhecem HTTP. Material disponível para estudo ou convite; não documenta uma apresentação realizada. Ao final, a pessoa deverá prever o backlog do cenário, distinguir trabalho pendente de perda e explicar o limite de retries e a necessidade de idempotência.

Prepare navegador, cronômetro e editor. Abra a demo, o guia de filas e este material. Faça os testes abaixo antes da sessão. Use somente dados fictícios. Não peça credenciais nem registre nomes ou respostas sem acordo. Em dupla, uma pessoa opera e outra anota; troquem na metade. Na condução individual, pare o cronômetro para registrar a previsão antes de executar.

## Roteiro do facilitador — 30 minutos

| Tempo | Ação e fala de apoio | Evidência de aprendizagem |
| --- | --- | --- |
| 0–5 min | Apresente: “Receber um pedido não é concluir o trabalho”. Pergunte se uma confirmação pode anteceder o resultado. Delimite um pico, sem métricas de um sistema real. | A pessoa distingue aceitação de conclusão. |
| 5–15 min | Execute o exercício A. Peça a previsão antes do clique. Avance dez segundos; depois zere entradas e acompanhe a recuperação. | Previsão, conta e observação registradas. |
| 15–25 min | Execute B por quatro minutos. Nos seis seguintes, discuta C e desenhe o intervalo entre efeito e confirmação. | Limite de tentativas e risco de duplicação explicados. |
| 25–30 min | Peça a saída escrita e compare com o gabarito. Use a pergunta “O que faria você mudar esta decisão?”. | Uma escolha com limite e condição de revisão. |

Abertura sugerida: “Hoje vamos usar um modelo pequeno para testar uma hipótese, não escolher o melhor broker. Uma fila permite esperar; não cria capacidade de processamento”.

## Exercício A — capacidade e recuperação

1. Reinicie a demo e configure explicitamente entradas = 20, workers = 2, falhas = 0. Reiniciar limpa o estado, sem necessariamente mudar os controles.
2. Antes de avançar, preveja chegadas, conclusões e pendências após dez segundos. Escreva a conta.
3. Avance dez segundos uma vez. Anote os contadores. Mude entradas para 0, mantenha dois workers e falhas = 0.
4. Preveja quantos segundos adicionais serão necessários. Avance dez segundos nove vezes e confira a fila vazia.
5. Discuta: o que acontece se as 20 entradas/s nunca pararem?

Resultado esperado: usar conservação de mensagens para explicar a diferença entre um pico e um déficit permanente. Se a conta divergir, confira os controles e reinicie antes de repetir; não altere o resultado para caber na hipótese.

## Exercício B — destino das falhas

Reinicie; entradas = 1, workers = 1, falhas = 100. Avance um segundo. Zere entradas e avance mais dois segundos, um de cada vez. Registre pendências, concluídas e DLQ após cada passo. Pergunte: “DLQ significa que o efeito aconteceu? Quem decide se é seguro reprocessar?”.

## Exercício C — uma confirmação perdida

Desenhe: receber pedido fictício X → registrar o efeito → processo cai antes de confirmar → X é entregue novamente. Explique por que um Set em memória não protege após reinício. Proponha uma chave de negócio e uma forma de tornar efeito e registro duráveis de maneira atômica. Para um efeito externo, como pagamento, discuta também a chave de idempotência na API externa: uma transação local não cobre sozinha esse efeito.

## Gabarito comentado

- A: em dez passos chegam 200 mensagens, 20 concluem e 180 ficam pendentes. Saldo = (20 − 2) × 10. Com entrada zero, 180 / 2 = 90 segundos adicionais; o relógio termina em 100. Se a entrada continuar, o saldo é +18/s e a fila não drena.
- B: após o primeiro passo, pendentes = 1, concluídas = 0, DLQ = 0. Após o segundo, os mesmos totais. No terceiro, pendentes = 0, concluídas = 0, DLQ = 1. São três tentativas totais, não três retries além da inicial. A mensagem saiu do ciclo automático; a causa ainda pede investigação e um procedimento de reprocessamento.
- C: use uma chave estável para a mesma operação de negócio. No caso de efeito no mesmo banco, imponha unicidade e registre efeito + deduplicação na mesma transação durável; teste concorrência e repetição após reinício. Um Set protege apenas a execução local. Para efeitos externos, use a garantia idempotente do provedor e uma estratégia de reconciliação; não prometa “exactly once” só porque há retries.

## Limites, acessibilidade e saída

O modelo usa um segundo por passo e uma tentativa por worker. Falhas dependem deterministicamente do ID; não são uma amostra aleatória de disponibilidade. Há três tentativas, limite de 5.000 pendências, sem backoff, persistência, partições ou latência de rede. Não extrapole a vazão para VMAGeste, PulseWatch ou um broker real.

Leia os contadores em voz alta e ofereça a tabela em texto. Sem navegador ou rede, use o caderno: subtraia duas conclusões de vinte chegadas em cada linha; o mesmo gabarito permite a sessão offline. Sem terminal, o exercício C pode ser feito no papel. O starter é uma extensão opcional, não um pré-requisito.

Saída individual: escreva (1) por que 180 pendentes não provam perda, (2) qual sinal observaria além da quantidade e (3) uma condição que levaria a limitar entrada. Resposta aceitável: contabilidade fecha em 200; observar idade da mensagem mais antiga e taxa de conclusão; reavaliar quando o atraso exceder o requisito do produto. Números e limite devem ser explícitos, sem inventar um requisito real.
`,
  en: `## Objectives and preparation

A 30-minute talk proposal for backend developers familiar with HTTP. Available for study or invitations; this material does not document a past presentation. By the end, learners should predict scenario backlog, distinguish pending work from loss and explain bounded retries and the need for idempotency.

Prepare a browser, timer and text editor. Open the demo, queue guide and this document. Run the exercises before facilitating. Use only synthetic data. Do not request credentials or record names or responses without agreement. In pairs, one person operates and one records; swap halfway. Working alone, pause the timer to write a prediction before running.

## Facilitator outline — 30 minutes

| Time | Action and suggested wording | Learning evidence |
| --- | --- | --- |
| 0–5 min | Introduce: “Accepting an order is not completing the work”. Ask whether acknowledgement can precede the result. Define a burst without claiming real system metrics. | Learner separates acceptance from completion. |
| 5–15 min | Run exercise A. Ask for predictions before clicking. Advance ten seconds, stop arrivals and observe recovery. | Prediction, calculation and observation recorded. |
| 15–25 min | Spend four minutes on B, then six on C. Draw the gap between an effect and its acknowledgement. | Retry bounds and duplicate effects explained. |
| 25–30 min | Request a written exit response and compare with the key. Ask “What would make you change this decision?”. | A choice with limits and a review condition. |

Suggested opening: “We will use a small model to test an assumption, not select the best broker. A queue lets work wait; it does not create processing capacity”.

## Exercise A — capacity and recovery

1. Reset the demo and explicitly set arrivals = 20, workers = 2, failures = 0. Reset clears state without necessarily changing the controls.
2. Before advancing, predict arrivals, completions and pending work after ten seconds. Write the calculation.
3. Advance ten seconds once and record the counters. Set arrivals = 0; keep two workers and failures = 0.
4. Predict the additional seconds needed. Advance ten seconds nine times and check that the queue is empty.
5. Discuss what happens if 20 arrivals/s never stop.

Expected outcome: use message conservation to explain the difference between a burst and a permanent deficit. If observation differs, check controls and reset before repeating; do not change results to fit the hypothesis.

## Exercise B — where failures go

Reset; arrivals = 1, workers = 1, failures = 100. Advance one second. Set arrivals = 0 and advance two more seconds, one at a time. Record pending, completed and DLQ after each step. Ask: “Does DLQ mean the effect happened? Who decides whether replay is safe?”.

## Exercise C — a lost acknowledgement

Draw: receive fictional order X → record its effect → process crashes before acknowledgement → X is delivered again. Explain why an in-memory Set does not protect after restart. Propose a business key and a durable atomic boundary for the effect and its record. For an external effect such as payment, also discuss the external API's idempotency key: a local transaction alone does not cover that effect.

## Annotated answer key

- A: in ten steps, 200 messages arrive, 20 complete and 180 remain pending. Balance = (20 − 2) × 10. With zero arrivals, 180 / 2 = 90 additional seconds; the clock ends at 100. Continuing arrivals produce +18/s and the queue never drains.
- B: after step one, pending = 1, completed = 0, DLQ = 0. Step two has the same totals. Step three has pending = 0, completed = 0, DLQ = 1. These are three total attempts, not three retries after the first. The message has left the automatic cycle; the cause still needs investigation and a replay procedure.
- C: use a stable key for the same business operation. For an effect in the same database, enforce uniqueness and store the effect and deduplication record in one durable transaction; test concurrency and replay after restart. A Set protects only a local execution. For external effects, use the provider's idempotency guarantee and a reconciliation strategy; do not promise “exactly once” merely because retries exist.

## Limits, accessibility and exit response

The model uses one second per step and one attempt per worker. Failures depend deterministically on message IDs; they are not random availability samples. It has three attempts, a 5,000-pending cap and no backoff, persistence, partitions or network latency. Do not extrapolate throughput to VMAGeste, PulseWatch or a real broker.

Read counters aloud and offer the table as text. Without browser or network, use the workbook: subtract two completions from twenty arrivals in each row; the same key supports an offline session. Exercise C works on paper. The worker starter is an optional extension, not a prerequisite.

Individual exit response: write (1) why 180 pending messages do not prove loss, (2) one signal beyond count and (3) a condition for limiting arrivals. Acceptable response: the accounting totals 200; observe oldest message age and completion rate; reconsider when delay exceeds the product requirement. State assumptions and limits explicitly without inventing a real product requirement.
`,
  es: `## Objetivos y preparación

Propuesta de charla de 30 minutos para desarrolladores backend que conocen HTTP. Material disponible para estudio o invitaciones; no documenta una charla realizada. Al terminar, la persona deberá predecir la acumulación, distinguir trabajo pendiente de pérdida y explicar reintentos limitados e idempotencia.

Prepara navegador, cronómetro y editor. Abre la demo, la guía de colas y este documento. Ejecuta los ejercicios antes de facilitar. Usa datos ficticios. No pidas credenciales ni registres nombres o respuestas sin acuerdo. En parejas, una persona opera y otra anota; intercambien a mitad. A solas, pausa el cronómetro para escribir la predicción antes de ejecutar.

## Guion del facilitador — 30 minutos

| Tiempo | Acción y frase sugerida | Evidencia de aprendizaje |
| --- | --- | --- |
| 0–5 min | Presenta: “Recibir un pedido no es terminar el trabajo”. Pregunta si la confirmación puede preceder al resultado. Delimita un pico sin atribuir métricas a un sistema real. | Distingue recepción de finalización. |
| 5–15 min | Ejecuta A. Pide predicción antes del clic. Avanza diez segundos, detén entradas y observa recuperación. | Predicción, cálculo y observación registrados. |
| 15–25 min | Dedica cuatro minutos a B y seis a C. Dibuja el intervalo entre efecto y confirmación. | Explica límite de intentos y duplicación. |
| 25–30 min | Pide la respuesta escrita y compárala con las soluciones. Pregunta “¿Qué te haría cambiar esta decisión?”. | Una elección con límites y condición de revisión. |

Apertura sugerida: “Usaremos un modelo pequeño para probar un supuesto, no para elegir el mejor broker. Una cola permite esperar; no crea capacidad de procesamiento”.

## Ejercicio A — capacidad y recuperación

1. Reinicia y configura explícitamente entradas = 20, workers = 2, fallos = 0. Reiniciar borra el estado sin cambiar necesariamente los controles.
2. Antes de avanzar, predice entradas, finalizaciones y pendientes después de diez segundos. Escribe el cálculo.
3. Avanza diez segundos una vez y anota contadores. Pon entradas = 0; mantén dos workers y fallos = 0.
4. Predice los segundos adicionales necesarios. Avanza diez segundos nueve veces y comprueba la cola vacía.
5. Discute qué pasa si nunca se detienen las 20 entradas/s.

Resultado esperado: usar conservación de mensajes para distinguir un pico de un déficit permanente. Si observas una diferencia, revisa controles y reinicia antes de repetir; no cambies resultados para acomodar la hipótesis.

## Ejercicio B — destino de los fallos

Reinicia; entradas = 1, workers = 1, fallos = 100. Avanza un segundo. Pon entradas = 0 y avanza dos segundos más, uno por vez. Anota pendientes, completados y DLQ tras cada paso. Pregunta: “¿DLQ significa que ocurrió el efecto? ¿Quién decide si es seguro reprocesar?”.

## Ejercicio C — una confirmación perdida

Dibuja: recibir pedido ficticio X → registrar el efecto → el proceso cae antes de confirmar → X vuelve a entregarse. Explica por qué un Set en memoria no protege tras reiniciar. Propón una clave de negocio y una frontera duradera y atómica para efecto y registro. Para efectos externos, como pagos, discute la clave de idempotencia de la API externa: una transacción local no cubre por sí sola ese efecto.

## Soluciones comentadas

- A: en diez pasos llegan 200 mensajes, terminan 20 y quedan 180. Saldo = (20 − 2) × 10. Sin entradas, 180 / 2 = 90 segundos adicionales; el reloj termina en 100. Si las entradas continúan, el saldo es +18/s y la cola no se vacía.
- B: tras el primer paso, pendientes = 1, completados = 0, DLQ = 0. El segundo tiene los mismos totales. En el tercero, pendientes = 0, completados = 0, DLQ = 1. Son tres intentos totales, no tres reintentos además del inicial. El mensaje salió del ciclo automático; aún hace falta investigar la causa y definir reprocesamiento.
- C: usa una clave estable para la misma operación de negocio. Para efectos en la misma base, impón unicidad y guarda efecto y deduplicación en una transacción duradera; prueba concurrencia y repetición tras reinicio. Un Set protege solo una ejecución local. Para efectos externos, usa la garantía idempotente del proveedor y una estrategia de conciliación; no prometas “exactly once” solo por tener reintentos.

## Límites, accesibilidad y salida

Cada paso representa un segundo y cada worker intenta un mensaje. Los fallos dependen del ID de forma determinista; no son una muestra aleatoria de disponibilidad. Hay tres intentos, límite de 5.000 pendientes, sin backoff, persistencia, particiones ni latencia de red. No extrapoles rendimiento a VMAGeste, PulseWatch o un broker real.

Lee contadores en voz alta y ofrece la tabla en texto. Sin navegador o red, usa el cuaderno: resta dos finalizaciones de veinte entradas por fila; las mismas soluciones permiten la sesión offline. C puede hacerse en papel. El starter es una ampliación opcional, no un requisito.

Salida individual: escribe (1) por qué 180 pendientes no prueban pérdida, (2) una señal además de cantidad y (3) una condición para limitar entradas. Respuesta aceptable: la contabilidad suma 200; observar edad del mensaje más antiguo y tasa de finalización; reconsiderar cuando el retraso supere el requisito del producto. Declara límites y supuestos sin inventar un requisito real.
`,
}

const architectureGuide: Record<Locale, string> = {
  pt: `## Objetivo, público e cenário

Oficina proposta de 60 minutos para pessoas que já conhecem HTTP; individual ou em duplas. Não representa evento realizado, inscrição ou turma confirmada. Entrega: um ADR que compara alternativas, usa um experimento e explicita uma condição de revisão. Requer apenas navegador e editor; terminal é opcional.

Cenário inteiramente fictício: um serviço recebe 20 pedidos/s durante dez segundos e depois não recebe nada. Dois workers processam uma mensagem/s cada, sem falhas. O requisito do exercício é concluir todos os pedidos aceitos em até 30 segundos após o fim do pico. Esse prazo foi criado para o exercício e não descreve um produto real. A capacidade pode ser alterada instantaneamente na simulação; custos e tempo de provisionamento não são medidos.

Prepare a demo, o guia de filas, o template ADR e o caderno. Faça o experimento uma vez antes de facilitar. Ofereça os materiais em texto e explique os contadores em voz alta. Em dupla, definam operador e revisor e troquem aos 25 minutos. Ninguém precisa compartilhar nome, código privado ou dados reais.

## Agenda e instruções de facilitação

| Minutos | Atividade | Pergunta de facilitação | Entrega |
| --- | --- | --- | --- |
| 0–10 | Ler contexto e restrições | “O prazo é para aceitar ou concluir? O que sabemos e o que supomos?” | Hipóteses e critério de aceitação. |
| 10–25 | Prever e executar experimento | “Qual conta deveria fechar? O que alteramos entre os testes?” | Tabela de três execuções. |
| 25–40 | Comparar alternativas | “Quem espera, quem paga e quem pode repetir o efeito?” | Matriz com pelo menos duas alternativas. |
| 40–55 | Escrever ADR | “Qual evidência sustenta a decisão? Qual risco fica aberto?” | ADR com condição de revisão. |
| 55–60 | Revisão por pares ou autorrevisão | “O que invalidaria a recomendação?” | Um comentário e uma revisão concreta. |

## Exercício 1 — hipótese e capacidade

Antes de abrir a demo, anote: quantas mensagens chegam, quantas terminam durante o pico, quanto fica pendente e quanto demora a recuperar com dois workers. Declare a hipótese “uma tentativa bem-sucedida por worker por segundo”. O requisito é sobre todos os pedidos aceitos; não mude silenciosamente para “fila vazia” descartando trabalho.

## Exercício 2 — três execuções controladas

1. A: reinicie, entradas = 20, workers = 2, falhas = 0; avance dez segundos. Anote chegadas, concluídas, pendentes e DLQ. Mude entradas = 0, mantenha dois workers e observe até drenar. Conte segundos adicionais.
2. B: repita o pico após reiniciar e configurar os mesmos controles. Somente depois dos dez segundos, ponha entradas = 0 e workers = 8. Avance dez segundos duas vezes e depois três passos de um segundo. Registre em qual passo a fila esvazia.
3. C: reinicie; use entradas = 20, workers = 8, falhas = 0 durante dez segundos. Registre o backlog. Mantenha entradas = 20 por mais dez segundos. Ele diminuiu? Explique o que isso diz sobre sobrecarga permanente.

Reiniciar limpa o estado, não necessariamente os controles: configure os três a cada repetição. No modo offline, faça uma tabela com saldo = pendentes anteriores + entradas − concluídas; concluídas não podem superar o trabalho disponível. Não use a demo para medir custo ou latência real.

## Exercício 3 — alternativas e consequências

Compare: A, manter dois workers e aceitar atraso; B, aceitar o pico e usar oito workers após ele; C, limitar a aceitação a dois pedidos/s e rejeitar o restante. C é uma política hipotética analisada no papel, não uma opção de admissão configurável da demo.

Para cada alternativa, escreva: prazo para concluir o trabalho aceito, efeito para o usuário, necessidade de idempotência, custo ainda desconhecido e falha que precisa ser observada. Acrescente uma alternativa própria somente se explicar as novas hipóteses. Uma rejeição explícita exige contrato de erro e política segura de nova tentativa; não a descreva como trabalho concluído.

## Exercício 4 — ADR e revisão

Preencha: título/status; contexto/restrições; alternativas; decisão; evidência; consequências; condição de revisão. Inclua uma alternativa rejeitada e por quê. O revisor deve localizar o número da execução que sustenta a escolha, uma hipótese não medida e um sinal que invalidaria a decisão. Na revisão individual, leia o ADR como se outra pessoa fosse operar o sistema.

## Gabarito de cálculo

- Pico com dois workers: 200 chegadas, 20 concluídas, 180 pendentes, zero DLQ. Recuperação A = 90 s; excede o requisito de 30 s.
- B: os mesmos 180 pendentes no fim do pico. Oito workers concluem 176 em 22 s e as quatro restantes no segundo 23. Total do relógio = 33 s; recuperação = 23 s, dentro do requisito. Após 20 s adicionais, ainda há 20 pendentes. Há sete segundos de margem no modelo, sem medir provisionamento ou I/O.
- C da execução: oito workers durante o pico deixam (20 − 8) × 10 = 120 pendentes. Mais dez segundos com as mesmas entradas levam a 240 pendentes: +12/s. Oito workers não resolvem a entrada permanente de 20/s.
- Política de rejeição no papel: aceitar dois/s por dez segundos permite concluir 20 e rejeitar explicitamente 180, sob as hipóteses de processamento do modelo. Atende o prazo dos aceitos, mas não aceita todos os pedidos. Isso exige acordo de produto; rejeitar não é perder silenciosamente nem concluir.

## Exemplo de ADR preenchido

**Título/status:** Recuperar pico com capacidade temporária — proposta para o cenário fictício.

**Contexto:** 200 pedidos em dez segundos; dois workers concluem 20 nesse intervalo. Os aceitos devem terminar até 30 s após o pico. Sem novas chegadas e sem falhas nos testes.

**Alternativas:** manter dois workers recupera em 90 s e não atende o prazo; rejeitar acima de dois/s muda o contrato de aceitação; elevar a oito após o pico recupera em 23 s no modelo.

**Decisão/evidência:** escolher oito workers após o pico para este exercício, com admissão e capacidade limitadas. Execução B: 180 pendentes, 176 concluídas em 22 s, quatro no passo seguinte. Não afirmar que autoscaling real é instantâneo.

**Consequências:** custo maior durante recuperação; exige disponibilidade de capacidade, chave idempotente durável, limite de tentativas e procedimento de DLQ. Provisionamento, latência, ordenação, persistência e custo ficam por validar num ambiente representativo. Efeitos externos exigem garantias próprias, além de uma transação local.

**Condição de revisão:** antes de produção, validar o prazo incluindo provisionamento e I/O; se o trabalho aceito ultrapassar os 30 s após o pico, ou a entrada não cessar, reavaliar capacidade e política de admissão. Observar idade da mensagem mais antiga, taxa de conclusão, DLQ e rejeições. Não basta medir quantidade.

## Critério de conclusão e extensão

O ADR passa na revisão se conserva as 200 mensagens, compara ao menos duas alternativas, relaciona a decisão ao prazo, reconhece uma hipótese não medida e inclui condição verificável de revisão. Outras decisões são válidas se explicitarem o compromisso de produto e sustentarem a conta; o gabarito não define uma arquitetura universal.

Se sobrar tempo, introduza uma falha depois do efeito e antes da confirmação. Explique por que repetir exige idempotência e por que o Set do starter não sobrevive a reinício. Para estudo posterior, execute o starter e escreva um teste de repetição. Isso não faz parte dos 60 minutos nem exige instalar nada para concluir a oficina.
`,
  en: `## Objective, audience and scenario

A proposed 60-minute workshop for people familiar with HTTP, alone or in pairs. This is not a past event, registration or confirmed class. Deliverable: an ADR comparing alternatives, using an experiment and stating a review condition. Only a browser and text editor are required; a terminal is optional.

Entirely fictional scenario: a service receives 20 orders/s for ten seconds, then receives nothing. Two workers each process one message/s, with no failures. The exercise requirement is to complete all accepted orders within 30 seconds after the burst ends. This deadline was created for the exercise and does not describe a real product. Capacity changes instantly in the simulation; cost and provisioning time are not measured.

Prepare the demo, queue guide, ADR template and workbook. Run the experiment once before facilitating. Offer text materials and read counters aloud. Pairs choose operator and reviewer, swapping at minute 25. Nobody needs to share names, private code or real data.

## Agenda and facilitation prompts

| Minutes | Activity | Facilitation question | Output |
| --- | --- | --- | --- |
| 0–10 | Read context and constraints | “Is the deadline for acceptance or completion? What is known or assumed?” | Assumptions and acceptance criterion. |
| 10–25 | Predict and run the experiment | “Which calculation should balance? What changed between runs?” | Three-run table. |
| 25–40 | Compare alternatives | “Who waits, who pays and who might repeat the effect?” | Matrix with at least two alternatives. |
| 40–55 | Write the ADR | “What evidence supports the decision? Which risk remains open?” | ADR with a review condition. |
| 55–60 | Peer review or self-review | “What would invalidate the recommendation?” | One comment and a concrete revision. |

## Exercise 1 — assumption and capacity

Before opening the demo, write how many messages arrive, complete during the burst and remain pending, and how long recovery takes with two workers. State the assumption “one successful attempt per worker per second”. The requirement concerns all accepted orders; do not quietly change it to “empty queue” by discarding work.

## Exercise 2 — three controlled runs

1. A: reset; arrivals = 20, workers = 2, failures = 0. Advance ten seconds. Record arrived, completed, pending and DLQ. Set arrivals = 0, keep two workers and observe until drained. Count additional seconds.
2. B: reset and repeat the burst with the same controls. Only after those ten seconds, set arrivals = 0 and workers = 8. Advance ten seconds twice, then three one-second steps. Record the step at which the queue empties.
3. C: reset; arrivals = 20, workers = 8, failures = 0 for ten seconds. Record backlog. Keep arrivals = 20 for another ten seconds. Did backlog shrink? Explain what this says about permanent overload.

Reset clears state without necessarily changing controls: set all three for each run. Offline, use pending = previous pending + arrivals − completions; completions cannot exceed available work. Do not use the demo to measure real cost or latency.

## Exercise 3 — alternatives and consequences

Compare A, keep two workers and accept delay; B, accept the burst and use eight workers afterward; C, accept only two orders/s and reject the rest. C is a hypothetical policy analyzed on paper, not a configurable admission option in the demo.

For each, state completion time for accepted work, user-visible effect, idempotency needs, unknown cost and a failure signal to observe. Add your own alternative only if you explain the new assumptions. Explicit rejection needs an error contract and safe retry policy; do not describe it as completed work.

## Exercise 4 — ADR and review

Fill in title/status, context/constraints, alternatives, decision, evidence, consequences and review condition. Include a rejected alternative and why. The reviewer must find the run supporting the choice, an unmeasured assumption and a signal that would invalidate it. Working alone, read the ADR as if another person would operate the system.

## Calculation key

- Burst with two workers: 200 arrived, 20 completed, 180 pending, zero DLQ. Recovery A = 90 s; it misses the 30 s requirement.
- B: the same 180 pending after the burst. Eight workers complete 176 in 22 s and the last four in second 23. Total clock = 33 s; recovery = 23 s, meeting the requirement. After 20 additional seconds, 20 remain pending. There are seven seconds of model headroom, without measuring provisioning or I/O.
- Run C: eight workers during the burst leave (20 − 8) × 10 = 120 pending. Another ten seconds with continued arrivals leave 240: +12/s. Eight workers cannot handle sustained arrivals of 20/s.
- Paper rejection policy: accepting two/s for ten seconds allows 20 completions and 180 explicit rejections under the model assumptions. It meets the deadline for accepted work but does not accept every order. This needs product agreement; rejection is neither silent loss nor completion.

## Example completed ADR

**Title/status:** Recover a burst with temporary capacity — proposal for the fictional scenario.

**Context:** 200 orders over ten seconds; two workers complete 20 during that interval. Accepted work must finish within 30 s after the burst. Tests have no subsequent arrivals or failures.

**Alternatives:** two workers recover in 90 s and miss the deadline; rejecting above two/s changes the acceptance contract; increasing to eight after the burst recovers in 23 s in the model.

**Decision/evidence:** choose eight workers after the burst for this exercise, with bounded admission and capacity. Run B: 180 pending, 176 completed in 22 s, four in the next step. Do not claim real autoscaling is instantaneous.

**Consequences:** higher cost during recovery; requires available capacity, durable idempotency keys, bounded retries and a DLQ procedure. Provisioning, latency, ordering, persistence and cost remain to be validated in a representative environment. External effects need their own guarantees beyond a local transaction.

**Review condition:** before production, validate the deadline including provisioning and I/O; if accepted work exceeds 30 s after the burst, or arrivals do not stop, revisit capacity and admission policy. Observe oldest message age, completion rate, DLQ and rejections, rather than count alone.

## Completion criterion and extension

An ADR passes review if it accounts for 200 messages, compares at least two alternatives, connects the choice to the deadline, acknowledges an unmeasured assumption and includes a testable review condition. Other decisions are valid if they make the product tradeoff explicit and support the calculation; the key does not define a universal architecture.

If time remains, introduce a crash after an effect but before acknowledgement. Explain why retrying needs idempotency and why the starter's Set does not survive restart. For further study, run the starter and write a replay test. This is outside the 60 minutes and requires no installation to complete the workshop itself.
`,
  es: `## Objetivo, público y escenario

Taller propuesto de 60 minutos para personas que conocen HTTP, individual o en parejas. No representa un evento realizado, inscripción ni grupo confirmado. Entrega: un ADR que compara alternativas, usa un experimento y declara una condición de revisión. Solo requiere navegador y editor; la terminal es opcional.

Escenario completamente ficticio: un servicio recibe 20 pedidos/s durante diez segundos y luego no recibe nada. Dos workers procesan un mensaje/s cada uno, sin fallos. El requisito del ejercicio es terminar todos los pedidos aceptados en los 30 segundos posteriores al pico. El plazo se creó para el ejercicio y no describe un producto real. La capacidad cambia instantáneamente en la simulación; no se miden coste ni tiempo de aprovisionamiento.

Prepara demo, guía, plantilla ADR y cuaderno. Ejecuta el experimento antes de facilitar. Ofrece texto y lee contadores en voz alta. En parejas, elijan operador y revisor e intercambien al minuto 25. Nadie necesita compartir nombres, código privado o datos reales.

## Agenda e instrucciones de facilitación

| Minutos | Actividad | Pregunta | Entrega |
| --- | --- | --- | --- |
| 0–10 | Leer contexto y restricciones | “¿El plazo es para aceptar o terminar? ¿Qué sabemos y qué suponemos?” | Supuestos y criterio de aceptación. |
| 10–25 | Predecir y ejecutar | “¿Qué cálculo debe cerrar? ¿Qué cambiamos entre ejecuciones?” | Tabla de tres ejecuciones. |
| 25–40 | Comparar alternativas | “¿Quién espera, quién paga y quién puede repetir el efecto?” | Matriz de al menos dos alternativas. |
| 40–55 | Escribir ADR | “¿Qué evidencia apoya la decisión? ¿Qué riesgo queda abierto?” | ADR con condición de revisión. |
| 55–60 | Revisión en pareja o individual | “¿Qué invalidaría la recomendación?” | Un comentario y una revisión concreta. |

## Ejercicio 1 — supuesto y capacidad

Antes de abrir la demo, anota cuántos mensajes llegan, terminan durante el pico, quedan pendientes y cuánto tarda la recuperación con dos workers. Declara el supuesto “un intento exitoso por worker por segundo”. El requisito concierne a todos los pedidos aceptados; no lo cambies por “cola vacía” descartando trabajo.

## Ejercicio 2 — tres ejecuciones controladas

1. A: reinicia; entradas = 20, workers = 2, fallos = 0. Avanza diez segundos. Anota entradas, completados, pendientes y DLQ. Pon entradas = 0, mantén dos workers y observa hasta vaciar. Cuenta segundos adicionales.
2. B: reinicia y repite el pico con los mismos controles. Solo después de esos diez segundos, pon entradas = 0 y workers = 8. Avanza diez segundos dos veces y después tres pasos de un segundo. Anota cuándo se vacía.
3. C: reinicia; entradas = 20, workers = 8, fallos = 0 durante diez segundos. Anota pendientes. Mantén entradas = 20 otros diez segundos. ¿Disminuyeron? Explica qué indica sobre sobrecarga permanente.

Reiniciar borra el estado, sin cambiar necesariamente los controles: configura los tres cada vez. Sin conexión, usa pendientes = pendientes anteriores + entradas − completados; no puede haber más completados que trabajo disponible. No midas coste o latencia real con la demo.

## Ejercicio 3 — alternativas y consecuencias

Compara A, mantener dos workers y aceptar retraso; B, aceptar el pico y usar ocho después; C, aceptar solo dos pedidos/s y rechazar los demás. C es una política hipotética analizada en papel, no una opción de admisión configurable en la demo.

Para cada una, escribe plazo de finalización de lo aceptado, efecto para el usuario, idempotencia necesaria, coste desconocido y una señal de fallo. Añade otra alternativa solo si explicas los nuevos supuestos. Rechazar explícitamente requiere contrato de error y política segura de reintento; no es trabajo completado.

## Ejercicio 4 — ADR y revisión

Completa título/estado, contexto/restricciones, alternativas, decisión, evidencia, consecuencias y condición de revisión. Incluye una alternativa descartada y el motivo. El revisor debe encontrar la ejecución que apoya la elección, un supuesto no medido y una señal que la invalidaría. A solas, lee el ADR como si otra persona fuera a operar el sistema.

## Soluciones de cálculo

- Pico con dos workers: 200 entradas, 20 completados, 180 pendientes, cero DLQ. Recuperación A = 90 s; supera el requisito de 30 s.
- B: los mismos 180 pendientes al terminar el pico. Ocho workers completan 176 en 22 s y los cuatro restantes en el segundo 23. Reloj total = 33 s; recuperación = 23 s, dentro del requisito. Tras 20 s adicionales, quedan 20 pendientes. Hay siete segundos de margen en el modelo, sin medir aprovisionamiento ni I/O.
- Ejecución C: ocho workers durante el pico dejan (20 − 8) × 10 = 120 pendientes. Otros diez segundos con entradas continuas dejan 240: +12/s. Ocho workers no resuelven una entrada sostenida de 20/s.
- Política en papel: aceptar dos/s durante diez segundos permite completar 20 y rechazar explícitamente 180 bajo los supuestos del modelo. Cumple el plazo de los aceptados, pero no acepta todos los pedidos. Requiere acuerdo de producto; rechazar no es perder en silencio ni completar.

## Ejemplo de ADR completo

**Título/estado:** Recuperar un pico con capacidad temporal — propuesta para el escenario ficticio.

**Contexto:** 200 pedidos en diez segundos; dos workers completan 20 durante ese intervalo. Lo aceptado debe terminar en 30 s después del pico. Sin entradas posteriores ni fallos en las pruebas.

**Alternativas:** dos workers recuperan en 90 s y no cumplen; rechazar por encima de dos/s cambia el contrato de aceptación; subir a ocho tras el pico recupera en 23 s en el modelo.

**Decisión/evidencia:** elegir ocho workers después del pico para este ejercicio, con admisión y capacidad limitadas. Ejecución B: 180 pendientes, 176 completados en 22 s, cuatro en el siguiente paso. No afirmar que el escalado real sea instantáneo.

**Consecuencias:** mayor coste durante recuperación; requiere capacidad disponible, clave idempotente duradera, intentos limitados y procedimiento DLQ. Aprovisionamiento, latencia, orden, persistencia y coste quedan por validar en un entorno representativo. Los efectos externos necesitan garantías propias además de una transacción local.

**Condición de revisión:** antes de producción, validar el plazo incluyendo aprovisionamiento e I/O; si lo aceptado supera 30 s tras el pico, o las entradas no cesan, revisar capacidad y admisión. Observar edad del mensaje más antiguo, tasa de finalización, DLQ y rechazos, además de cantidad.

## Criterio de finalización y ampliación

El ADR pasa si conserva los 200 mensajes, compara al menos dos alternativas, relaciona la decisión con el plazo, reconoce un supuesto no medido e incluye una condición verificable de revisión. Otras decisiones son válidas si explicitan el compromiso de producto y sostienen el cálculo; las soluciones no definen una arquitectura universal.

Si sobra tiempo, introduce un fallo después del efecto y antes de confirmar. Explica por qué repetir requiere idempotencia y por qué el Set del starter no sobrevive al reinicio. Como estudio posterior, ejecuta el starter y escribe una prueba de repetición. Queda fuera de los 60 minutos y no hace falta instalar nada para completar el taller.
`,
}

const workbook: Record<Locale, string> = {
  pt: `# Caderno de participante — filas e decisões de arquitetura

Material para os roteiros de 30 e 60 minutos. Cenário fictício, sem inscrição ou evento marcado. Salve uma cópia no seu editor ou imprima. Não precisa identificar a pessoa. Use dados fictícios; nada é enviado por este arquivo.

## 1. Minha previsão antes de executar

Entradas = 20/s; workers = 2; uma tentativa bem-sucedida por worker/s; pico = 10 s; depois entradas = 0.

- Hipótese que estou testando: ____________________
- Chegadas em dez segundos: ______
- Concluídas em dez segundos: ______
- Pendentes ao fim do pico: ______
- Segundos adicionais com dois workers: ______
- Conta usada: ____________________

## 2. Registro de observação

Reinicie e configure os três controles a cada execução. No modo offline, preencha usando conservação de mensagens.

| Execução | Entrada durante pico | Workers no pico/depois | Chegadas | Concluídas ao fim do pico | Pendentes ao fim do pico | Recuperação adicional |
| --- | --- | --- | --- | --- | --- | --- |
| A | 20/s por 10 s | 2 / 2 | ___ | ___ | ___ | ___ s |
| B | 20/s por 10 s | 2 / 8 | ___ | ___ | ___ | ___ s |
| C | 20/s por 20 s | 8 / 8, entrada continua | ___ | ___ após 10 s | ___ após 10 e 20 s | drena? ___ |

O que mudou entre A e B? ____________________
O que o experimento não mediu? ____________________
Chegadas = concluídas + pendentes + DLQ + rejeitadas. Minha contabilidade fecha? ______

## 3. Falhas e repetição — palestra de 30 minutos

Uma mensagem entra no primeiro passo; depois entrada zero. Um worker, falhas = 100%.

| Passo | Pendentes | Concluídas | DLQ |
| --- | --- | --- | --- |
| 1 | ___ | ___ | ___ |
| 2 | ___ | ___ | ___ |
| 3 | ___ | ___ | ___ |

Desenhe o intervalo: efeito registrado → queda antes da confirmação → entrega repetida.

- Chave da operação de negócio: ____________________
- O que precisa sobreviver ao reinício: ____________________
- Como evitar repetir um efeito externo: ____________________
- Quem investiga a DLQ e quando reprocessar: ____________________

## 4. Matriz de alternativas — oficina de 60 minutos

Requisito fictício: concluir os pedidos aceitos até 30 s após o pico. Para a rejeição, faça análise no papel; a demo não permite configurar essa política.

| Alternativa | Recuperação | Efeito para usuário | Custo/risco não medido | Atende o requisito? |
| --- | --- | --- | --- | --- |
| Manter 2 workers | ___ | ___ | ___ | ___ |
| Usar 8 depois do pico | ___ | ___ | ___ | ___ |
| Aceitar 2/s e rejeitar o resto | ___ | ___ | ___ | ___ |

## 5. Meu ADR

**Título e status:** ____________________

**Contexto e restrições:** ____________________

**Alternativas e motivo para descartar uma:** ____________________

**Decisão:** ____________________

**Evidência, incluindo a execução e os números:** ____________________

**Consequências e hipótese não medida:** ____________________

**Condição observável de revisão:** ____________________

## 6. Revisão e saída

- [ ] Minha conta conserva as mensagens.
- [ ] Comparei pelo menos duas alternativas e o prazo.
- [ ] Diferenciei rejeitar, concluir e perder.
- [ ] Registrei um risco e uma hipótese não medida.
- [ ] Minha condição de revisão pode ser verificada.

Comentário de revisão: ____________________
Alteração que fiz após revisar: ____________________
Próximo teste em um ambiente representativo: ____________________

Depois da tentativa, consulte os gabaritos em [Filas sem mágica](filas-30min.md) e [Oficina de arquitetura](arquitetura-60min.md). Não é necessário instalar o starter para concluir.
`,
  en: `# Participant workbook — queues and architecture decisions

Material for the 30- and 60-minute outlines. Fictional scenario, no registration or scheduled event. Save a copy in your editor or print it. No name is needed. Use synthetic data; this file sends nothing.

## 1. My prediction before running

Arrivals = 20/s; workers = 2; one successful attempt per worker/s; burst = 10 s; then arrivals = 0.

- Assumption I am testing: ____________________
- Arrivals in ten seconds: ______
- Completions in ten seconds: ______
- Pending at burst end: ______
- Additional seconds with two workers: ______
- Calculation: ____________________

## 2. Observation record

Reset and set all three controls for each run. Offline, fill in using message conservation.

| Run | Burst arrivals | Workers during/after | Arrived | Completed at burst end | Pending at burst end | Additional recovery |
| --- | --- | --- | --- | --- | --- | --- |
| A | 20/s for 10 s | 2 / 2 | ___ | ___ | ___ | ___ s |
| B | 20/s for 10 s | 2 / 8 | ___ | ___ | ___ | ___ s |
| C | 20/s for 20 s | 8 / 8, arrivals continue | ___ | ___ after 10 s | ___ after 10 and 20 s | drains? ___ |

What changed between A and B? ____________________
What did the experiment not measure? ____________________
Arrived = completed + pending + DLQ + rejected. Does my accounting balance? ______

## 3. Failures and replay — 30-minute talk

One message arrives in the first step; then zero arrivals. One worker, failures = 100%.

| Step | Pending | Completed | DLQ |
| --- | --- | --- | --- |
| 1 | ___ | ___ | ___ |
| 2 | ___ | ___ | ___ |
| 3 | ___ | ___ | ___ |

Draw the gap: effect recorded → crash before acknowledgement → repeated delivery.

- Business operation key: ____________________
- What must survive restart: ____________________
- How to avoid repeating an external effect: ____________________
- Who investigates DLQ and when to replay: ____________________

## 4. Alternatives matrix — 60-minute workshop

Fictional requirement: complete accepted orders within 30 s after the burst. Analyze rejection on paper; the demo does not let you configure that policy.

| Alternative | Recovery | User-visible effect | Unmeasured cost/risk | Meets requirement? |
| --- | --- | --- | --- | --- |
| Keep 2 workers | ___ | ___ | ___ | ___ |
| Use 8 after burst | ___ | ___ | ___ | ___ |
| Accept 2/s and reject the rest | ___ | ___ | ___ | ___ |

## 5. My ADR

**Title and status:** ____________________

**Context and constraints:** ____________________

**Alternatives and why one was rejected:** ____________________

**Decision:** ____________________

**Evidence, including run and numbers:** ____________________

**Consequences and unmeasured assumption:** ____________________

**Observable review condition:** ____________________

## 6. Review and exit response

- [ ] My calculation conserves messages.
- [ ] I compared at least two alternatives against the deadline.
- [ ] I separated rejection, completion and loss.
- [ ] I recorded a risk and an unmeasured assumption.
- [ ] My review condition can be checked.

Review comment: ____________________
Change I made after review: ____________________
Next test in a representative environment: ____________________

After trying, see the answer keys in [Queues without magic](filas-30min.md) and [Architecture workshop](arquitetura-60min.md). Installing the starter is not required to finish.
`,
  es: `# Cuaderno de participante — colas y decisiones de arquitectura

Material para los guiones de 30 y 60 minutos. Escenario ficticio, sin inscripción ni evento programado. Guarda una copia en tu editor o imprime. No hace falta identificar a la persona. Usa datos ficticios; este archivo no envía nada.

## 1. Mi predicción antes de ejecutar

Entradas = 20/s; workers = 2; un intento exitoso por worker/s; pico = 10 s; después entradas = 0.

- Supuesto que pruebo: ____________________
- Entradas en diez segundos: ______
- Completados en diez segundos: ______
- Pendientes al final del pico: ______
- Segundos adicionales con dos workers: ______
- Cálculo: ____________________

## 2. Registro de observación

Reinicia y configura los tres controles cada vez. Sin conexión, completa usando conservación de mensajes.

| Ejecución | Entradas durante pico | Workers durante/después | Entradas | Completados al final del pico | Pendientes al final del pico | Recuperación adicional |
| --- | --- | --- | --- | --- | --- | --- |
| A | 20/s durante 10 s | 2 / 2 | ___ | ___ | ___ | ___ s |
| B | 20/s durante 10 s | 2 / 8 | ___ | ___ | ___ | ___ s |
| C | 20/s durante 20 s | 8 / 8, entradas continúan | ___ | ___ después de 10 s | ___ después de 10 y 20 s | ¿se vacía? ___ |

¿Qué cambió entre A y B? ____________________
¿Qué no midió el experimento? ____________________
Entradas = completados + pendientes + DLQ + rechazados. ¿Cierra mi contabilidad? ______

## 3. Fallos y repetición — charla de 30 minutos

Un mensaje entra en el primer paso; después, cero entradas. Un worker, fallos = 100%.

| Paso | Pendientes | Completados | DLQ |
| --- | --- | --- | --- |
| 1 | ___ | ___ | ___ |
| 2 | ___ | ___ | ___ |
| 3 | ___ | ___ | ___ |

Dibuja el intervalo: efecto registrado → caída antes de confirmar → entrega repetida.

- Clave de la operación de negocio: ____________________
- Qué debe sobrevivir al reinicio: ____________________
- Cómo evitar repetir un efecto externo: ____________________
- Quién investiga DLQ y cuándo reprocesar: ____________________

## 4. Matriz de alternativas — taller de 60 minutos

Requisito ficticio: completar lo aceptado en 30 s después del pico. Analiza el rechazo en papel; la demo no permite configurar esa política.

| Alternativa | Recuperación | Efecto para usuario | Coste/riesgo no medido | ¿Cumple? |
| --- | --- | --- | --- | --- |
| Mantener 2 workers | ___ | ___ | ___ | ___ |
| Usar 8 después del pico | ___ | ___ | ___ | ___ |
| Aceptar 2/s y rechazar el resto | ___ | ___ | ___ | ___ |

## 5. Mi ADR

**Título y estado:** ____________________

**Contexto y restricciones:** ____________________

**Alternativas y motivo para descartar una:** ____________________

**Decisión:** ____________________

**Evidencia con ejecución y números:** ____________________

**Consecuencias y supuesto no medido:** ____________________

**Condición observable de revisión:** ____________________

## 6. Revisión y salida

- [ ] Mi cálculo conserva mensajes.
- [ ] Comparé al menos dos alternativas con el plazo.
- [ ] Distinguí rechazo, finalización y pérdida.
- [ ] Registré un riesgo y un supuesto no medido.
- [ ] La condición de revisión es verificable.

Comentario de revisión: ____________________
Cambio que hice tras revisar: ____________________
Próxima prueba en entorno representativo: ____________________

Después de intentarlo, consulta las soluciones en [Colas sin magia](filas-30min.md) y [Taller de arquitectura](arquitetura-60min.md). No hace falta instalar el starter para terminar.
`,
}

function resourceLinks(locale: Locale): string {
  const labels = translated(
    [
      "Recursos e preparação",
      "Demo de fila",
      "Guia de filas",
      "Template ADR",
      "Starter de worker",
      "Caderno de participante",
    ],
    [
      "Resources and preparation",
      "Queue demo",
      "Queue guide",
      "ADR template",
      "Worker starter",
      "Participant workbook",
    ],
    [
      "Recursos y preparación",
      "Demo de cola",
      "Guía de colas",
      "Plantilla ADR",
      "Starter de worker",
      "Cuaderno de participante",
    ]
  )[locale]
  const targets = [
    ["demos", "queue"],
    ["guias", "filas"],
    ["templates", "adr"],
    ["templates", "worker"],
  ]
  return `## ${labels[0]}\n\n${targets.map(([section, slug], index) => `- [${labels[index + 1]}](${SITE_URL}${getResourcePath(locale, section, slug)})`).join("\n")}\n- [${labels[5]}](caderno-participante.md)\n`
}

function zipFiles(directory: string, archive: string, files: string[]): void {
  execFileSync("python3", [
    "-c",
    `import pathlib,sys,zipfile
root=pathlib.Path(sys.argv[1])
with zipfile.ZipFile(root/sys.argv[2], 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as bundle:
    for name in sorted(sys.argv[3:]):
        info=zipfile.ZipInfo(name, (2026,10,17,0,0,0))
        info.compress_type=zipfile.ZIP_DEFLATED
        info.create_system=3
        info.external_attr=0o100644 << 16
        bundle.writestr(info, (root/name).read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
`,
    directory,
    archive,
    ...files,
  ])
}

/** Build reproducible files beneath an isolated resource root, or public/recursos by default. */
export function buildCampaignAssets(output = resolve("public/recursos")): void {
  for (const locale of languages) {
    const campaignDirectory = join(output, "campanha", locale)
    const sessionDirectory = join(output, "sessoes", locale)
    mkdirSync(campaignDirectory, { recursive: true })
    mkdirSync(sessionDirectory, { recursive: true })
    writeFileSync(
      join(campaignDirectory, "plano-30-dias.md"),
      buildCampaignMarkdown(locale)
    )
    writeFileSync(
      join(campaignDirectory, "calendario.ics"),
      buildCampaignCalendar(locale)
    )
    const queueTitle = talks.find((entry) => entry.slug === "eventos")!.title[
      locale
    ]
    const architectureTitle = talks.find(
      (entry) => entry.slug === "arquitetura"
    )!.title[locale]
    writeFileSync(
      join(sessionDirectory, "filas-30min.md"),
      `# ${queueTitle}\n\n${queueGuide[locale]}\n${resourceLinks(locale)}`
    )
    writeFileSync(
      join(sessionDirectory, "arquitetura-60min.md"),
      `# ${architectureTitle}\n\n${architectureGuide[locale]}\n${resourceLinks(locale)}`
    )
    writeFileSync(
      join(sessionDirectory, "caderno-participante.md"),
      workbook[locale]
    )
    zipFiles(campaignDirectory, "kit-campanha.zip", [
      "plano-30-dias.md",
      "calendario.ics",
    ])
    zipFiles(sessionDirectory, "kit-sessoes.zip", [
      "filas-30min.md",
      "arquitetura-60min.md",
      "caderno-participante.md",
    ])
  }
}

if (
  /^build-campaign-assets\.[cm]?[jt]s$/.test(basename(process.argv[1] ?? ""))
) {
  buildCampaignAssets()
  console.log(
    "Generated campaign plans, calendars and facilitator packs in public/recursos."
  )
}
