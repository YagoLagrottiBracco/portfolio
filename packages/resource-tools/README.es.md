# resource-tools 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

Comparación JSON y revisión local de claves .env. Requiere Node.js 20 o superior. MIT.

Instala el archivo versionado alojado (el paquete del registro npm aún no se ha publicado):

```sh
npm install --global https://lagrotti.dev/recursos/releases/1.0.0/resource-tools-1.0.0.tgz
resource-tools --help
resource-tools json before.json after.json --json
resource-tools env .env.example .env --json
cat candidate.json | resource-tools json reference.json - --json
```

Códigos de salida: **0** igual/válido; **1** diferencias; **2** entrada o uso inválido.

Cada entrada tiene un límite de 200.000 bytes UTF-8. Solo se aceptan archivos regulares; `-` lee stdin una vez. Sin red, telemetría ni escritura de entradas. Los informes .env muestran nombres de claves y líneas inválidas, nunca valores. Los informes JSON pueden incluir los valores JSON comparados.

El modo .env compara claves sin evaluar variables ni ejecutar shell. Duplicados y líneas sin asignación válida devuelven 2; claves ausentes/adicionales devuelven 1. No es un parser completo de valores multilínea.

Desde el código: `npm test`. El motor JavaScript distribuido se genera desde el mismo `src/lib/resource-tools.ts` usado en el navegador; las pruebas verifican la paridad. Se genera en el repositorio principal con `npm run resources:packages`, sin compilar durante la instalación.

[Código fuente](https://github.com/YagoLagrottiBracco/portfolio/tree/master/packages/resource-tools)
