# Standalone resource distributions

The distribution implementation covers ecosystem items 1, 2, 3, 4 and 9. Every package includes MIT licensing and Portuguese, English and Spanish instructions.

| Item | Source | Delivered behavior |
| --- | --- | --- |
| 1 — CLI | `packages/resource-tools/` | Installable dependency-free npm TGZ; JSON comparison and .env key checks reuse the existing browser engines. Reads bounded regular files or one stdin stream. Exit codes 0 equal/valid, 1 different, 2 invalid. Environment values never enter reports. |
| 2 — Action | `packages/resource-action/` | Standalone composite Action with bundled CLI and engine. Inputs pass through environment variables. Logs and workflow summaries contain status/counts only, excluding JSON values, .env values, key names and paths. |
| 3 — Worker | `examples/worker-starter/` | Real executable Node project, tests, synthetic browser demo and CLI demo. Bounded retained IDs, duplicate suppression, transient retries and dead letters. Real StackBlitz GitHub-folder launch and ZIP fallback. |
| 4 — HTTP/Bruno | `examples/http-lab/` | Local fictional HTTP server and 13 complete Bruno requests/tests for auth, pagination, creation/lookup, validation, empty JSON, missing resource, media type, method and synthetic outage. HTTP integration tests also cover malformed/oversized JSON and duplicated pagination parameters. |
| 9 — Versions | `public/recursos/releases/1.0.0/` | CLI TGZ, CLI sources ZIP, Action ZIP, worker ZIP, HTTP/Bruno ZIP, JSON manifest and SHA256SUMS. Metadata includes byte sizes, SHA-256, sources, license and compatibility. |

## Build and verification

From the main repository:

```sh
npm run resources:packages
node --import tsx --test tests/ecosystem-packages.test.ts tests/ecosystem-package-ui.test.tsx
node --test packages/resource-tools/test/*.test.mjs packages/resource-action/test/*.test.mjs examples/worker-starter/test/*.test.mjs examples/http-lab/test/*.test.mjs
```

The builder also exports `buildEcosystemPackages({ outputDirectory? })` for integration. Direct usage supports isolated staging:

```sh
npx tsx scripts/build-ecosystem-packages.ts --out-dir /tmp/resource-release
```

The build regenerates the standalone engine from `src/lib/resource-tools.ts`, bundles it into the Action, runs actual `npm pack`, and makes deterministic ZIPs with safe paths and CRC32. Release writes preflight all existing files and reject any conflicting bytes. Rebuilding identical sources preserves the same files. Published releases must never be regenerated with changed bytes: create a new version and preserve the old directory.

CLI tarball generation stages a private source copy with fixed file modes matching the frozen 1.0.0 headers. This prevents NTFS/Git-checkout permissions from changing the release hash, without changing the checkout or published artifacts. A regression compares a real 0644 checkout copy against the frozen TGZ; npm 10 and npm 11 also produced identical bytes.

The isolated install test runs `npm install` against the built TGZ in a temporary consumer directory and executes the installed npm bin. It also extracts and executes the Action outside the workspace, checks ZIP CRCs, verifies all artifact hashes, rebuilds deterministically and tests that deliberate artifact corruption rejects a rebuild without changing the manifest. A regression test rejects named pipes without blocking at file-open time.

The Bruno collection was executed with Bruno CLI 4.2.1 in safe mode, with all 13 requests and tests passing against the real local server:

```sh
cd examples/http-lab
npm start
# In another terminal:
cd examples/http-lab/bruno
npx --yes @usebruno/cli@4.2.1 run --env local --sandbox=safe
```

`PackageResources({ kind, locale })` provides the five localized screens `terminal`, `github-action`, `executar`, `api-bruno`, `versoes` and reads the actual release manifest for sizes, checksums and download links.

## External publication state

The hosted TGZ is independently installable once the site is deployed; registry publication is not required:

```sh
npm install --global https://lagrotti.dev/recursos/releases/1.0.0/resource-tools-1.0.0.tgz
```

The intended registry name is `@yagolagrottibracco/resource-tools`. npm authentication is unavailable in the current session, so registry publication remains pending and is stated explicitly in the UI and manifest. Do not claim registry publication.

The standalone Action is published at [YagoLagrottiBracco/resource-contract-checks](https://github.com/YagoLagrottiBracco/resource-contract-checks), with `v1` and `v1.0.0` tags and a `v1.0.0` release. The live UI reflects this verified publication. Frozen archives retain their release-preparation documentation; their bytes and checksums are unchanged. Marketplace terms/account acceptance remain a separate manual dependency and no Marketplace listing is claimed.

The worker launch points to `https://stackblitz.com/github/YagoLagrottiBracco/portfolio/tree/master/examples/worker-starter?startScript=dev`. It becomes usable after the branch is integrated into public `master`; the same real project remains available in the versioned ZIP. StackBlitz folder launch format follows [the official GitHub integration guide](https://developer.stackblitz.com/guides/integration/open-from-github). The Action environment/metadata format follows [GitHub's metadata specification](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax), and collection scripts use [Bruno's documented response/test API](https://docs.usebruno.com/testing/script/javascript-reference).
