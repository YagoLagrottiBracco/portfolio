# Resource contract checks 1.0.0

[Português](README.md) · [English](README.en.md) · [Español](README.es.md)

Standalone reusable composite Action with the CLI and engine included. Requires Node.js 20+ on the runner. MIT. The check installs no dependencies and makes no network requests.

In the main repository, checkout and use the local path. From another repository use `YagoLagrottiBracco/portfolio/packages/resource-action@master` (prefer a reviewed full commit SHA). Alternatively extract the ZIP to `.github/actions/resource-check` and use `uses: ./.github/actions/resource-check`.

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: YagoLagrottiBracco/resource-contract-checks@v1
    with:
      tool: env
      reference: .env.example
      candidate: .env.ci
```

Inputs: `tool` (`json` or `env`), `reference`, `candidate`. Outputs: `status` and `exit-code`. The step fails with 1 for differences and 2 for invalid input. Summaries publish only status and counts, never paths, key names, snippets or values. Arguments use environment variables without shell interpolation.

The example targets the dedicated repository `YagoLagrottiBracco/resource-contract-checks@v1`, whose publication is pending while this distribution is prepared. Until publication, use the local ZIP. Releases `v1.0.0` and `v1` will be published after verification. Marketplace listing depends on account acceptance; no listing is claimed.

```sh
node --test test/*.test.mjs
```

[Source](https://github.com/YagoLagrottiBracco/resource-contract-checks) · [Metadata syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax)
