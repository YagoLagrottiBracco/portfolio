# Editorial plan — 30 days

Suggested dates: October 19–November 17, 2026. Review before publishing or sending. This file does not schedule or send messages. Select one language version for each audience; you do not need to publish all three. There are no confirmed audience results or external appearances.

## 2026-10-19 · LinkedIn

<!-- d01-kit -->

A library for testing engineering decisions

I put together open tools and materials to turn architecture discussions into experiments: a JSON comparator, .env key checker, queue simulator and TypeScript worker starter.

The five-minute route is simple: compare two contracts, generate overload and run the starter tests. Each resource states its limits; the simulation uses no production data. Materials are available in Portuguese, English and Spanish.

Which of these decisions comes up most often in your team? Start with the kit and choose one experiment.

https://lagrotti.dev/en/recursos/campanhas/kit-engenharia?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d01-kit-en

---

## 2026-10-20 · WhatsApp

<!-- d02-json -->

Did a contract change?

Here is a JSON comparator that shows added, removed and changed fields without treating key order as a change. Try two synthetic examples in your browser. Useful for the next payload review.

https://lagrotti.dev/en/recursos/ferramentas/json?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d02-json-en

---

## 2026-10-21 · Developer community

<!-- d03-fila-lab -->

Open exercise: predict backlog before running

Sharing an educational queue demo for technical discussion. Challenge: set 20 arrivals/s, two workers and 0% failures. Before advancing ten steps, write down how much work you expect in the queue. Then stop arrivals and estimate drain time.

The model attempts one message per worker per second; retries stop after three attempts. It has no backoff, persistence or partitions. The goal is to discuss capacity and recovery, without estimating real broker performance.

If you try it, which assumption would you change first: capacity, burst duration or rejection policy? Share your reasoning using synthetic data.

https://lagrotti.dev/en/recursos/demos/queue?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d03-fila-lab-en

---

## 2026-10-22 · LinkedIn

<!-- d04-backlog -->

A queue buys time; capacity pays the bill

In this model, 20 arrivals per second and two workers leave 18 messages per second outstanding. After ten steps, 180 messages are pending.

The queue absorbs the burst without removing the work. With arrivals stopped, two workers need another 90 steps to drain it. If 20 arrivals/s continue, backlog keeps growing.

The experiment is ready for you to change the variables. Before choosing a queue, ask: how much delay can the product tolerate, and what is the capacity recovery plan?

https://lagrotti.dev/en/recursos/laboratorio/sobrecarga?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d04-backlog-en

---

## 2026-10-23 · Newsletter pitch

<!-- d05-pitch-worker -->

Subject: Resource suggestion: a TypeScript worker for exploring retries

Hello, editorial team.

I would like to suggest a free resource for an issue about backend engineering or event-driven systems: a runnable TypeScript starter with tests, in-memory deduplication, bounded retries and a dead-letter example.

Suggested blurb: “Run a small worker, trigger a failure and follow its retry limit. A starting point for discussing idempotency before adopting a broker.”

Requires Node.js 22 or newer and uses the MIT license. The README explains execution; deduplication is process-local and this is not a production-ready solution. If it fits your selection, the link below provides the download and context.

Thank you for considering it,
Yago Lagrotti Bracco

https://lagrotti.dev/en/recursos/templates/worker?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d05-pitch-worker-en

---

## 2026-10-24 · WhatsApp

<!-- d06-adr -->

A decision you can revisit

An ADR template for context, alternatives, decision and consequences. My favorite part is the review condition: what would need to change for this choice to stop making sense? Download it and fill it in as plain text.

https://lagrotti.dev/en/recursos/templates/adr?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d06-adr-en

---

## 2026-10-25 · LinkedIn

<!-- d07-guia-filas -->

Does the response need the result now?

That question comes before choosing a broker. If the response needs the result immediately, and traffic and dependencies fit the latency budget, a direct call may be enough.

A queue makes sense when acceptance and completion can be separate, bursts exceed sustained capacity and work can be replayed safely. That adds decisions about retention, ordering, idempotency and failure handling.

I wrote a short guide with criteria and limitations. Use it to review a choice in your context: which requirement actually needs asynchronous processing?

https://lagrotti.dev/en/recursos/guias/filas?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d07-guia-filas-en

---

## 2026-10-26 · LinkedIn

<!-- d08-env -->

A variable name is also a contract

A deployment can fail because a required key never reached the environment. To review that contract, I built a tool comparing variable names from an .env.example reference against another configuration.

The report highlights missing keys, extras, duplicates and invalid lines without reproducing values. Processing happens in the browser. Use synthetic values for demonstrations: the checker is not a complete dotenv parser and cannot confirm a secret is correct.

Which configuration check would you like to make before the next deployment?

https://lagrotti.dev/en/recursos/ferramentas/env?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d08-env-en

---

## 2026-10-27 · WhatsApp

<!-- d09-idempotencia -->

What if the message arrives twice?

Retries raise a question: does repeating this operation repeat its effect? This short explanation of idempotency separates message identity from the business effect. Bring a synthetic payment or order example to your team discussion.

https://lagrotti.dev/en/recursos/glossario/idempotencia?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d09-idempotencia-en

---

## 2026-10-28 · Developer community

<!-- d10-worker-lab -->

Small lab: test failures before the broker

Here is an exercise using the library's TypeScript starter. Download it and run npm install, npm test and npm start on Node.js 22+. Read the deduplication test and retry limit before changing code.

Now describe two scenarios: a repeated message within one process and a repeat after restarting the process. An in-memory Set does not solve the second case. Which storage and transaction boundary would you use to connect the business effect to its idempotency key?

The starter uses the MIT license and is educational. If you share a solution, include a test and explain the failure assumption; use no real customer data.

https://lagrotti.dev/en/recursos/templates/worker?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d10-worker-lab-en

---

## 2026-10-29 · LinkedIn

<!-- d11-clone -->

A benchmark needs context to be useful

Comparing JSON.parse/stringify and structuredClone by the lowest time leaves important questions unanswered. Which types must survive? How large was the data? Was the runtime the same?

I published an experiment with synthetic JSON data, warm-up, alternating method order and downloadable raw samples. The dataset does not test Date, Map, cycles or transferables. A local measurement does not make one strategy a universal winner.

Read the method, run the script in your environment and compare results by size. Which use case would change your choice even at a higher execution time?

https://lagrotti.dev/en/recursos/benchmarks/json-clone?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d11-clone-en

---

## 2026-10-30 · Newsletter pitch

<!-- d12-pitch-filas -->

Subject: For your resource list: a queue you can overload

Hello, editorial team.

I would like to suggest an interactive demo for an issue on reliability: readers adjust arrivals, workers and failures to observe backlog, retries and dead letters. No account is required.

Suggested blurb: “Before adding a queue, predict backlog from a ten-second burst and test your estimate in the browser.”

The model is educational, with no production data, backoff or persistence. The page states those limits and lets readers repeat the exercise. It may be a practical companion to a capacity discussion. Here is the link for your review.

Thank you,
Yago Lagrotti Bracco

https://lagrotti.dev/en/recursos/demos/queue?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d12-pitch-filas-en

---

## 2026-10-31 · WhatsApp

<!-- d13-reproduzir -->

Repeat the measurement on your runtime

Here is a JSON cloning experiment with a script and synthetic data. Run it in your environment and compare medians by size. The useful part is recording method and limits, rather than choosing an API from one number. Instructions are here.

https://lagrotti.dev/en/recursos/laboratorio/copias?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d13-reproduzir-en

---

## 2026-11-01 · LinkedIn

<!-- d14-caso-vmageste -->

Read the flow before choosing the tool

Event discussions become more concrete when we draw the stages: where data enters, where it is processed and how it reaches queries. The VMAGeste case study uses that flow as an entry point into its architecture decisions.

My suggested reading exercise: identify an asynchronous boundary, write down the assumption it addresses and look for what operations would need to observe. Use the case for context and the library demo to test capacity ideas with synthetic data.

What do you look for first in a diagram when trying to understand failure recovery?

https://lagrotti.dev/en/projetos/vmageste?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d14-caso-vmageste-en

---

## 2026-11-02 · LinkedIn

<!-- d15-oficina -->

One hour to write a defensible decision

I prepared a self-guided workshop around one bounded problem: 20 orders/s arrive, two are processed per second and the burst lasts ten seconds. The task is to model backlog and record a decision in an ADR.

The outline splits one hour between context, experiment, alternatives, writing and review. Work alone or in pairs with only a browser and text editor. The material includes exercises, expected outcomes and an answer key for discussion.

This is available material, with no registration or scheduled event. Which condition would make you reject work instead of queuing it?

https://lagrotti.dev/en/recursos/campanhas/oficina-arquitetura?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d15-oficina-en

---

## 2026-11-03 · WhatsApp

<!-- d16-pico -->

Two-minute challenge

20 arrivals/s, two workers, 0% failures, ten seconds. How much work remains? Predict before opening the demo, then stop arrivals to measure recovery. The exercise separates a temporary burst from a permanent capacity deficit.

https://lagrotti.dev/en/recursos/laboratorio/sobrecarga?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d16-pico-en

---

## 2026-11-04 · Developer community

<!-- d17-adr-review -->

ADR review: what evidence would change your decision?

An exercise for an architecture discussion: use the self-guided workshop scenario and write an ADR with context, two alternatives, a decision, consequences and a review condition. Avoid justifying it through tool preference alone.

One alternative can retain current capacity and accept delay; another can increase workers or reject arrivals above a limit. Compare recovery time, cost, duplication and user-visible behavior. State the assumptions your experiment did not measure.

During review, look for a testable condition that would force reconsideration. The material includes an example answer without treating one architecture as the only solution. Which assumption is missing from your ADR?

https://lagrotti.dev/en/recursos/campanhas/oficina-arquitetura?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d17-adr-review-en

---

## 2026-11-05 · LinkedIn

<!-- d18-monolito -->

Does a code boundary need to become a service?

Separating responsibilities is one decision; separating deployments is another. A boundary can begin inside a modular monolith and later gain independent operations if a concrete need emerges.

The guide on modular monoliths and separate services compares autonomy, contracts and operating cost. A new process also adds networking, observability and partial failures.

Before splitting, write down the constraint that separation solves and the condition that would justify revisiting it. Which part of your system needs operational autonomy today?

https://lagrotti.dev/en/recursos/guias/monolito?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d18-monolito-en

---

## 2026-11-06 · Newsletter pitch

<!-- d19-pitch-oficina -->

Subject: Study material: a 60-minute architecture workshop

Hello, editorial team.

I would like to suggest material for a study or team activities section: a 60-minute workshop on comparing alternatives and writing an ADR supported by a capacity experiment.

Suggested blurb: “One problem, one simulation and one recorded decision. Work alone or in pairs with a browser and text editor.”

The guide includes timing, exercises, expected outcomes and an answer key. The scenario is fictional and requires no registration. It is an available proposal and self-guided material, with no claim of a previous presentation or class. The link provides context and downloads for review.

Thank you,
Yago Lagrotti Bracco

https://lagrotti.dev/en/recursos/palestras/arquitetura?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d19-pitch-oficina-en

---

## 2026-11-07 · WhatsApp

<!-- d20-env-check -->

Quick configuration review

Before testing, create two synthetic .env files: a reference with API_URL and WORKER_TOKEN, and another with API_URL repeated. The checker shows the missing key and duplicate without reproducing values in the report. Here is the tool.

https://lagrotti.dev/en/recursos/ferramentas/env?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d20-env-check-en

---

## 2026-11-08 · LinkedIn

<!-- d21-caso-pulsewatch -->

What should you observe beyond queue length?

Two backlogs of the same size can represent very different situations. A queue that drains quickly after a burst calls for one interpretation; an old message that never progresses calls for another.

To explore that difference, read the PulseWatch case alongside the queue guide. Use the case as product and operations context without turning simulator numbers into project metrics.

In your review, note three signals: oldest message age, completion rate and failure destination. Which signal would help you choose between waiting, scaling and investigating?

https://lagrotti.dev/en/projetos/pulsewatch?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d21-caso-pulsewatch-en

---

## 2026-11-09 · LinkedIn

<!-- d22-retries -->

Where does the third failure go?

A retry needs a limit and a destination after that limit. In the educational demo, a message failing three times goes to a dead-letter queue. That ends the model's automatic cycle but does not explain how to fix the cause.

An operations discussion must say who investigates, how to identify the message and when replay is safe. Moving work from an endless retry loop into an unowned error store is not enough.

The glossary explains DLQs and connects the concept to the exercise. If a message reached the dead-letter queue today, would your team know the next step?

https://lagrotti.dev/en/recursos/glossario/dead-letter?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d22-retries-en

---

## 2026-11-10 · WhatsApp

<!-- d23-json-video -->

Watch a contract change

A short recording shows two versions of an event and the fields that changed. Watch it, then repeat the comparison with synthetic examples. A quick starting point for a contract review discussion.

https://lagrotti.dev/en/recursos/videos/json?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d23-json-video-en

---

## 2026-11-11 · Developer community

<!-- d24-benchmark-colab -->

Open invitation: reproduce a benchmark with a method

I opened a brief for reproducing the JSON cloning experiment on another runtime and comparing results with the same method. The material includes the script, samples and limitations.

A useful contribution states runtime version, system, CPU, command and raw samples using synthetic data. Before comparing, check object sizes and each API's semantic guarantees. Differences can motivate hypotheses; they do not prove a universal rule.

The brief explains review and credit. There are no confirmed coauthors; any joint publication depends on methodology review and participant permission. If this kind of reproduction interests you, read the scope and propose a contribution.

https://lagrotti.dev/en/recursos/colaboracoes/reproduzir-benchmark?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d24-benchmark-colab-en

---

## 2026-11-12 · LinkedIn

<!-- d25-caso-eurologado -->

From payload to product context

A diff shows that a field changed. Deciding whether it matters needs context: who produces it, who consumes it and which behavior depends on it.

Use the Eurologado case study as a reading exercise. Pick one described flow and write a minimal fictional contract for it. Then add a field and change a value using the library's JSON comparator.

This does not reproduce the project's internal contracts. It connects a comparison tool to product questions: can the consumer tolerate the change? Would validation detect an incompatibility?

https://lagrotti.dev/en/projetos/eurologado?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d25-caso-eurologado-en

---

## 2026-11-13 · Newsletter pitch

<!-- d26-pitch-kit -->

Subject: Resource suggestion: engineering tools and exercises

Hello, editorial team.

I would like to suggest the open engineering kit for a practical resources selection. It brings together a JSON comparator, .env key checker, queue demo, TypeScript starter and architecture decision exercises in Portuguese, English and Spanish.

Suggested blurb: “Compare a contract, trigger overload and take a starter with tests. A library for experimenting with decisions using synthetic data.”

The resources explain their limitations and can be explored without registration. I am not presenting audience metrics or adoption results; the link below lets you assess the material directly. If it fits an issue, I can clarify method and scope.

Thank you,
Yago Lagrotti Bracco

https://lagrotti.dev/en/recursos/campanhas/kit-engenharia?utm_source=newsletter&utm_medium=email&utm_campaign=biblioteca-2026-10&utm_content=d26-pitch-kit-en

---

## 2026-11-14 · WhatsApp

<!-- d27-charla -->

A 30-minute queue outline

I prepared “Queues without magic”: an outline and material for discussing capacity, retries, idempotency and observability in 30 minutes. Includes exercises and an answer key. Available for invitations or study, with no scheduled event.

https://lagrotti.dev/en/recursos/palestras/eventos?utm_source=whatsapp&utm_medium=messaging&utm_campaign=biblioteca-2026-10&utm_content=d27-charla-en

---

## 2026-11-15 · LinkedIn

<!-- d28-decisao -->

Replace “it is better” with an observable condition

A useful ADR does not end with the technology choice. It records the constraint, the rejected alternative and the signal that would make the team reconsider.

In the workshop's fictional scenario, a condition might be: if backlog does not drain within the product's required time, revisit capacity and admission policy. The number must come from a requirement or experiment, with visible assumptions.

The template is available as plain text for adaptation. Take a recent decision: which consequence was accepted consciously, and what evidence would show its cost has grown too high?

https://lagrotti.dev/en/recursos/templates/adr?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d28-decisao-en

---

## 2026-11-16 · Developer community

<!-- d29-comunidade -->

Used a resource? Show a verifiable application

The library has an open invitation for anyone who applies a resource in a public demonstration. A useful proposal shows which resource was used, what was adapted and how another person can verify the result.

It could be a deduplication test, an ADR with a reproducible experiment or a contract comparison using synthetic data. Include a public link, preferred credit and publication permission. Share no third-party personal data or confidential material.

Proposals are reviewed; submission does not guarantee publication. The page explains the process and lets you prepare and review a proposal before sending. Which adaptation would make the resource more useful in your context?

https://lagrotti.dev/en/recursos/comunidade/sua-aplicacao?utm_source=community&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d29-comunidade-en

---

## 2026-11-17 · LinkedIn

<!-- d30-proximo -->

Choose an experiment and record what you learned

If you reached the library through a post, here is a route from reading to practice: compare two synthetic payloads, overload the queue, test the starter and write an ADR with a review condition.

You do not need to adopt a new technology to get value from the exercise. The outcome might be confirming that a direct call is enough, finding an untested assumption or explaining failure recovery more clearly.

The kit collects the routes and downloads in three languages. Which experiment would you choose for your next engineering discussion? Write your prediction before running it and compare afterward.

https://lagrotti.dev/en/recursos/campanhas/kit-engenharia?utm_source=linkedin&utm_medium=social&utm_campaign=biblioteca-2026-10&utm_content=d30-proximo-en
