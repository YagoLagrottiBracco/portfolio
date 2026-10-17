# resource-tools 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

Local JSON comparison and .env key checks. Requires Node.js 20 or newer. MIT.

Install the versioned hosted tarball (the npm registry package has not been published yet):

```sh
npm install --global https://lagrotti.dev/recursos/releases/1.0.0/resource-tools-1.0.0.tgz
resource-tools --help
resource-tools json before.json after.json --json
resource-tools env .env.example .env --json
cat candidate.json | resource-tools json reference.json - --json
```

Exit codes: **0** equal/valid; **1** differences; **2** invalid input or usage.

Each input is limited to 200,000 UTF-8 bytes. Only regular files are accepted; `-` reads stdin once. No network, telemetry, or input-file writes. Environment reports show key names and invalid line numbers, never values. JSON reports may include compared JSON values.

Environment mode checks keys without evaluating variables or executing shell. Duplicates and malformed assignment lines return 2; missing/extra keys return 1. It is not a complete multiline value parser.

From source: `npm test`. The distributed JavaScript engine is generated from the same `src/lib/resource-tools.ts` used in the browser; tests verify parity. Generation runs in the main repository with `npm run resources:packages`, with no installation-time compilation.

[Source](https://github.com/YagoLagrottiBracco/portfolio/tree/master/packages/resource-tools)
