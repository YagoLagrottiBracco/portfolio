# Worker starter 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

Worker ejecutable en memoria: reintentos, límite de intentos, deduplicación por ID y descarte después de fallos permanentes. Datos y fallos ficticios. Node.js 20+, MIT, sin dependencias.

Extrae el ZIP y entra en `worker-starter`, o clona el repositorio y entra en `examples/worker-starter`:

```sh
npm install --ignore-scripts
npm test
npm run demo
npm start
```

El ejemplo conserva hasta 1.000 IDs, ejecuta un trabajo a la vez e intenta cada trabajo hasta 3 veces. `worker.mjs` exporta `createWorker`; `demo.mjs` simula éxito, fallo transitorio y fallo permanente. El servidor muestra el resultado en http://localhost:3000.

Es un laboratorio: la memoria se pierde al reiniciar, la deduplicación no es duradera y no hay espera/backoff, broker, concurrencia distribuida ni transacción con efectos externos. En producción se necesita almacenamiento duradero e idempotencia transaccional para los efectos.

[StackBlitz](https://stackblitz.com/github/YagoLagrottiBracco/portfolio/tree/master/examples/worker-starter?startScript=dev) · [Código fuente](https://github.com/YagoLagrottiBracco/portfolio/tree/master/examples/worker-starter) · [StackBlitz GitHub folders](https://developer.stackblitz.com/guides/integration/open-from-github)
