# Fictional HTTP + Bruno lab 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

API HTTP fictícia para estudar contratos e Bruno. Toda informação é sintética; o token `fictional-local-token` é público e serve apenas ao exercício local. Node.js 20+, MIT, sem dependências de servidor.

Extraia o ZIP e entre em `http-lab`, ou use `examples/http-lab` no repositório:

```sh
npm install --ignore-scripts
npm test
npm start
```

http://127.0.0.1:4010

Abra a pasta `bruno` no Bruno e selecione o ambiente `local`. Com o servidor ativo, em outro terminal:

```sh
cd bruno
npx --yes @usebruno/cli@4.2.1 run --env local --sandbox=safe
```

A coleção tem requisições completas, ordenadas e com asserts. Criação salva `createdId` apenas na memória do runner para a consulta seguinte. Reinicie o servidor para restaurar as cinco tarefas iniciais. O laboratório escuta apenas 127.0.0.1; não envie dados reais. Não é autenticação de produção.

| Request | Contract |
| --- | --- |
| GET /health | 200, fictional=true |
| GET /tasks (no token) | 401, unauthorized |
| GET /tasks?page=1&limit=2 | 200, nextPage=2 |
| GET /tasks?page=2&limit=2 | 200, different IDs |
| POST /tasks | 201, Location + data.id |
| GET /tasks/:id | 200 or 404 |
| POST /tasks (invalid title) | 422, validation_error |
| POST /tasks (invalid JSON) | 400, invalid_json |
| POST /tasks (text/plain) | 415, unsupported_media_type |
| GET /tasks?limit=99 | 400, invalid_pagination |
| GET /simulate-error | 503, Retry-After |
| DELETE /tasks | 405, Allow |

`npm test` abre uma porta efêmera e verifica autenticação, páginas distintas, criação/consulta, limites, JSON malformado, validação, tipo de conteúdo e erros. Bruno CLI 4.2.1 é a versão usada na verificação da coleção.

[Código-fonte](https://github.com/YagoLagrottiBracco/portfolio/tree/master/examples/http-lab) · [Bruno scripting](https://docs.usebruno.com/testing/script/javascript-reference)
