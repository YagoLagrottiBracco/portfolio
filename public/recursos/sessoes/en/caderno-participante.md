# Participant workbook — queues and architecture decisions

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
