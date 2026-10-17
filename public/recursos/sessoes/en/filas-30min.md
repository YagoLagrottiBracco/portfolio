# Queues without magic

## Objectives and preparation

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

## Resources and preparation

- [Queue demo](https://lagrotti.dev/en/recursos/demos/queue)
- [Queue guide](https://lagrotti.dev/en/recursos/guias/filas)
- [ADR template](https://lagrotti.dev/en/recursos/templates/adr)
- [Worker starter](https://lagrotti.dev/en/recursos/templates/worker)
- [Participant workbook](caderno-participante.md)
