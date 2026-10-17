# Fictional HTTP + Bruno lab 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

Fictional HTTP API for contract and Bruno exercises. All data is synthetic; `fictional-local-token` is a public token for this local exercise only. Node.js 20+, MIT, no server dependencies.

Extract the ZIP and enter `http-lab`, or use `examples/http-lab` in the repository:

```sh
npm install --ignore-scripts
npm test
npm start
```

http://127.0.0.1:4010

Open the `bruno` folder in Bruno and select the `local` environment. With the server running, in another terminal:

```sh
cd bruno
npx --yes @usebruno/cli@4.2.1 run --env local --sandbox=safe
```

The collection includes complete ordered requests and assertions. Creation stores `createdId` only in runner memory for the next lookup. Restart the server to restore the five seeded tasks. The lab binds to 127.0.0.1 only; use synthetic data. This is not production authentication.

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

`npm test` uses an ephemeral port and checks authentication, distinct pages, creation/lookup, limits, malformed JSON, validation, content type and errors. Bruno CLI 4.2.1 is the version used to verify the collection.

[Source](https://github.com/YagoLagrottiBracco/portfolio/tree/master/examples/http-lab) · [Bruno scripting](https://docs.usebruno.com/testing/script/javascript-reference)
