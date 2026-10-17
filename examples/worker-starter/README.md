# Worker starter 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

Exemplo executável de worker em memória: reentrega, limite de tentativas, deduplicação por ID e descarte após falhas permanentes. Dados e falhas são fictícios. Node.js 20+, MIT, sem dependências.

Extraia o ZIP e entre em `worker-starter`, ou clone o repositório e entre em `examples/worker-starter`:

```sh
npm install --ignore-scripts
npm test
npm run demo
npm start
```

O exemplo retém no máximo 1.000 IDs, executa um trabalho por vez e tenta cada trabalho até 3 vezes. `worker.mjs` exporta `createWorker`; `demo.mjs` simula sucesso, falha transitória e falha permanente. O servidor mostra o resultado em http://localhost:3000.

É um laboratório: a memória se perde ao reiniciar, o deduplicador não é durável, não há atraso/backoff, broker, concorrência distribuída nem transação com efeitos externos. Em produção, use armazenamento durável e idempotência transacional para os efeitos.

[StackBlitz](https://stackblitz.com/github/YagoLagrottiBracco/portfolio/tree/master/examples/worker-starter?startScript=dev) · [Código-fonte](https://github.com/YagoLagrottiBracco/portfolio/tree/master/examples/worker-starter) · [StackBlitz GitHub folders](https://developer.stackblitz.com/guides/integration/open-from-github)
