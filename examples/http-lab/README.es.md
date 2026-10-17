# Fictional HTTP + Bruno lab 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

API HTTP ficticia para estudiar contratos y Bruno. Los datos son sintéticos; `fictional-local-token` es un token público para este ejercicio local. Node.js 20+, MIT, sin dependencias de servidor.

Extrae el ZIP y entra en `http-lab`, o usa `examples/http-lab` en el repositorio:

```sh
npm install --ignore-scripts
npm test
npm start
```

http://127.0.0.1:4010

Abre la carpeta `bruno` en Bruno y selecciona el entorno `local`. Con el servidor activo, en otra terminal:

```sh
cd bruno
npx --yes @usebruno/cli@4.2.1 run --env local --sandbox=safe
```

La colección incluye peticiones completas, ordenadas y con asserts. La creación guarda `createdId` solo en memoria del runner para la consulta siguiente. Reinicia el servidor para restaurar las cinco tareas iniciales. Escucha solo en 127.0.0.1; usa datos sintéticos. No es autenticación de producción.

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

`npm test` usa un puerto efímero y verifica autenticación, páginas distintas, creación/consulta, límites, JSON malformado, validación, tipo de contenido y errores. Bruno CLI 4.2.1 es la versión usada para verificar la colección.

[Código fuente](https://github.com/YagoLagrottiBracco/portfolio/tree/master/examples/http-lab) · [Bruno scripting](https://docs.usebruno.com/testing/script/javascript-reference)
