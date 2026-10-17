# Resource contract checks 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

Action compuesta reutilizable e independiente con CLI y motor incluidos. Requiere Node.js 20+ en el runner. MIT. La revisión no instala dependencias ni accede a la red.

En el repositorio principal, haz checkout y usa la ruta local. Desde otro repositorio usa `YagoLagrottiBracco/portfolio/packages/resource-action@master` (es preferible fijar el SHA completo revisado). También puedes extraer el ZIP en `.github/actions/resource-check` y usar `uses: ./.github/actions/resource-check`.

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: YagoLagrottiBracco/resource-contract-checks@v1
    with:
      tool: env
      reference: .env.example
      candidate: .env.ci
```

Entradas: `tool` (`json` o `env`), `reference`, `candidate`. Salidas: `status` y `exit-code`. El paso falla con 1 si hay diferencias y 2 si la entrada es inválida. El resumen publica solo estado y recuentos, nunca rutas, nombres de claves, fragmentos ni valores. Los argumentos pasan por variables de entorno, sin interpolación de shell.

El ejemplo apunta al repositorio dedicado `YagoLagrottiBracco/resource-contract-checks@v1`, cuya publicación está pendiente al preparar esta distribución. Hasta la publicación, usa el ZIP local. Las releases `v1.0.0` y `v1` se publicarán tras verificar. La lista del Marketplace depende de aceptar los términos de la cuenta; no se afirma estar en la lista.

```sh
node --test test/*.test.mjs
```

[Código fuente](https://github.com/YagoLagrottiBracco/resource-contract-checks) · [Metadata syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax)
