# Resource contract checks 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

Action composta reutilizável e independente, com CLI e motor incluídos. Requer Node.js 20+ no runner. MIT. Não instala dependências nem acessa rede durante a checagem.

No repositório principal, faça checkout e use o caminho local. Em outro repositório, use `YagoLagrottiBracco/portfolio/packages/resource-action@master` (prefira fixar o SHA revisado). O ZIP pode ser extraído em `.github/actions/resource-check` e usado com `uses: ./.github/actions/resource-check`.

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: YagoLagrottiBracco/resource-contract-checks@v1
    with:
      tool: env
      reference: .env.example
      candidate: .env.ci
```

Entradas: `tool` (`json` ou `env`), `reference`, `candidate`. Saídas: `status` e `exit-code`. O passo falha com 1 em diferenças e 2 em entrada inválida. O resumo publica apenas estado e contagens; nunca caminhos, nomes de chaves, trechos ou valores. Argumentos são passados por variáveis de ambiente, sem interpolação de shell.

O exemplo aponta para o repositório dedicado `YagoLagrottiBracco/resource-contract-checks@v1`, cuja publicação está pendente na preparação desta distribuição. Até a publicação, use o ZIP local. Releases `v1.0.0` e `v1` serão publicadas após verificação. A listagem no Marketplace depende de aceite da conta; não há alegação de listagem.

```sh
node --test test/*.test.mjs
```

[Código-fonte](https://github.com/YagoLagrottiBracco/resource-contract-checks) · [Metadata syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax)
