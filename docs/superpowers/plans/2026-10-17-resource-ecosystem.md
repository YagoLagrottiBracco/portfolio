# Resource ecosystem implementation plan

Design: `docs/superpowers/specs/2026-10-17-resource-ecosystem-design.md`.
Execution: user-approved autonomous workflow, isolated branch, parallel independent modules, root integration and final independent review. Do not pause for repeat approval.

## File boundaries and tasks

- [x] Distribution: `packages/resource-tools/`, `packages/resource-action/`, `examples/worker-starter/`, `examples/http-lab/`, `scripts/build-ecosystem-packages.ts`, `src/components/ecosystem/PackageResources.tsx`, package-focused tests/docs and `public/recursos/releases/1.0.0/`. Implement CLI exit/input/report contracts, action summary, real StackBlitz sources, Bruno lab and version manifest. Verify actual packed installs and HTTP interactions.
- [x] Studio: `src/lib/resource-studio*.ts`, `src/data/resources/challenges.ts`, `src/components/ecosystem/{StudioResources,QueueScenario,ChallengeStudio,DiagramEditor,ResourceCollections}.tsx`, and existing `ResourceTools.tsx`. Test hostile/oversized URL payloads, deterministic grading, graph integrity/export escaping and bounded real-resource collections; then implement client flows in three languages.
- [x] Participation: `src/lib/resource-participation*.ts`, `src/lib/webmention*.ts`, new participation datasets/components, API routes for roadmap/Webmention, correction/request/reference issue forms, importer/refresh/IndexNow scripts and workflows. Test URL/consent/persistence, pinned public fetch + redirect limits/backlink matching, absent config and truthful external records; implement exact empty/error states.
- [x] Root catalogue: add `ecossistema` and twenty entries in `src/data/resources/ecosystem.ts`; wire `resource-catalog.ts` and `ResourceScreen.tsx` to the three interfaces. Add pure citation helpers, API response builder/schema and readonly Next route `/api/resources/v1`; tests assert filters, invalid locale/section, deterministic serialization and no private data.
- [x] Root article context: content-derived paragraph/code anchors through a remark plugin; accessible permalink controls and shared correction control; citation exports for actual articles. Preserve existing outline/heading behavior and test repeat blocks and Markdown attacks.
- [x] Root discovery: safe SVG cards, allowlisted short redirects and QR SVG generation, resource/release feeds and metadata discovery. Test escaping, same-site destinations, invalid codes/filter queries, XML GUIDs and response headers.
- [x] Root generated assets: run package/lab builds, add combined build command and reproducible docs; retain immutable artifacts and inspect archive paths/CRCs. Add website walkthrough and twenty-item delivery matrix with external account requirements.
- [x] Root integration: full unit/lint/type/build and Playwright suite, HTTP catalogue/locale/download audit, fresh independent review and material fixes. Evidence: 162 application tests, 12 package tests, 35 browser tests, 372 audited resource pages, 74 valid ZIP archives and all five release hashes. Standalone Action published and verified in actual Node 20/22 workflows.

## Release procedure

Use the already authorized GitHub PR/CI/merge workflow, then repeat the HTTP audit on production and verify the initial IndexNow receipt after key availability. npm registry authentication, Marketplace account acceptance and deployment Webmention credentials are external exceptions documented in `docs/resource-ecosystem.md`; do not claim those actions completed without evidence. Public CI/deployment records and the delivery report record the final publication result.

## Review focus

1. No private visitor inputs enter query strings, analytics, logs or persistent storage.
2. Webmention source fetching cannot reach reserved networks or follow unchecked redirects; absent durable storage returns an explicit failure.
3. Public SVG/XML/BibTeX exports escape untrusted text and reject unknown resource IDs.
4. CLI and Action never include `.env` values in diagnostics; packed artifacts execute without workspace dependencies.
5. Shared URL parsing and localStorage errors cannot crash pages or create arbitrary external links; no runtime `eval` for challenges.
