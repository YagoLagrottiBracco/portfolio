# Worker starter 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

Runnable in-memory worker: retries, attempt limits, ID deduplication and dead letters after permanent failures. All data and failures are fictional. Node.js 20+, MIT, no dependencies.

Extract the ZIP and enter `worker-starter`, or clone the repository and enter `examples/worker-starter`:

```sh
npm install --ignore-scripts
npm test
npm run demo
npm start
```

The example retains at most 1,000 IDs, executes one job at a time and tries each job up to 3 times. `worker.mjs` exports `createWorker`; `demo.mjs` simulates success, transient failure and permanent failure. The server shows the result at http://localhost:3000.

This is a lab: state is lost on restart, deduplication is not durable, and there is no delay/backoff, broker, distributed concurrency or transaction with external effects. Production systems need durable storage and transactional idempotency for side effects.

[StackBlitz](https://stackblitz.com/github/YagoLagrottiBracco/portfolio/tree/master/examples/worker-starter?startScript=dev) · [Source](https://github.com/YagoLagrottiBracco/portfolio/tree/master/examples/worker-starter) · [StackBlitz GitHub folders](https://developer.stackblitz.com/guides/integration/open-from-github)
