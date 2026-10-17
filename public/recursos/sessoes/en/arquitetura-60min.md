# Workshop: a decision you can defend

## Objective, audience and scenario

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

## Resources and preparation

- [Queue demo](https://lagrotti.dev/en/recursos/demos/queue)
- [Queue guide](https://lagrotti.dev/en/recursos/guias/filas)
- [ADR template](https://lagrotti.dev/en/recursos/templates/adr)
- [Worker starter](https://lagrotti.dev/en/recursos/templates/worker)
- [Participant workbook](caderno-participante.md)
