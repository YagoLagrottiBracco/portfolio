# resource-tools 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

Comparador JSON e revisor de chaves .env, executados localmente. Node.js 20 ou superior. MIT.

Instalação pelo arquivo versionado (o pacote no registro npm ainda não foi publicado):

```sh
npm install --global https://lagrotti.dev/recursos/releases/1.0.0/resource-tools-1.0.0.tgz
resource-tools --help
resource-tools json before.json after.json --json
resource-tools env .env.example .env --json
cat candidate.json | resource-tools json reference.json - --json
```

Códigos de saída: **0** igual/válido; **1** diferenças; **2** entrada ou uso inválido.

Cada entrada tem limite de 200.000 bytes UTF-8. Apenas arquivos regulares são aceitos; `-` lê stdin uma vez. Sem rede, telemetria ou gravação dos arquivos de entrada. Relatórios .env exibem nomes de chaves e linhas inválidas, nunca valores. Relatórios JSON podem conter os valores JSON comparados.

O modo .env compara chaves, sem avaliar variáveis ou executar shell. Duplicatas e linhas sem atribuição válida retornam 2; chaves ausentes/extras retornam 1. Não é um parser completo de valores multilinha.

No código-fonte: `npm test`. O motor JavaScript distribuído é gerado a partir do mesmo `src/lib/resource-tools.ts` usado no navegador; testes verificam paridade. A geração acontece no repositório principal com `npm run resources:packages`, sem compilação na instalação.

[Código-fonte](https://github.com/YagoLagrottiBracco/portfolio/tree/master/packages/resource-tools)
