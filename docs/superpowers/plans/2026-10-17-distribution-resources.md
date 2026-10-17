# Distribution resources implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan in this session. Keep the existing dirty feature checkout intact; review with one fresh reviewer at the end.

**Goal:** Deliver the twenty approved distribution features as a useful multilingual resource library.
**Architecture:** Typed localized editorial collections power SSR pages and project connections. Browser-only utilities are separated from server content and downloadable generated media.
**Tech Stack:** Next.js 15, React 19, TypeScript, existing sharp, Playwright, node:test.
**Spec:** docs/superpowers/specs/2026-10-17-distribution-resources-design.md

## Global Constraints
- No new production dependencies; PT/EN/ES; existing visual tokens and routing helpers.
- Preserve existing uncommitted changes; no external messaging or fabricated third-party evidence.
- Inputs to tools stay in browser memory; cap JSON text size and output size.
- Deliver real downloads, playable media and runnable benchmark/template code.

## Review Focus
- Invalid/oversized/deep JSON must fail gracefully and not execute content.
- Locale switches must retain resource and embedded view identity.
- Untrusted proposal text must be encoded in mailto drafts and never sent automatically.
- Downloads must exist, include attribution/licenses and not expose environment data.
- Collection detail slugs and unknown locale routes must return correct 404s.

### Task 1: Resource catalog and routing
Files: src/data/resources/*, src/lib/resource-routes.ts, src/lib/resource-catalog.ts, tests/resources.test.ts.
Produces: resourceSections, localized editorial records, getResourcePath(locale, section?, slug?), parseResourcePath(path).
- [x] Write and run failing tests for route parsing, localized resource paths and catalog integrity.
- [x] Implement localized collections and selection helpers, case-derived resources and real contribution boundaries.
- [x] Run targeted tests.

### Task 2: Local tools and experiments
Files: src/lib/resource-tools.ts, src/components/resources/ResourceTools.tsx, tests/resource-tools.test.ts.
Produces: compareJson, inspectEnvKeys, advanceQueue and interactive JSON/env/queue panels.
- [x] Write failing tests for primitive/array/missing JSON values, duplicates, escaped pointers, unsafe/deep input and retry/dead-letter behavior.
- [x] Implement deterministic pure tools and accessible localized panels; encode user-controlled mailto text.
- [x] Run targeted tests.

### Task 3: Pages and integration
Files: src/components/resources/*, src/app/(pt)/recursos/*, src/app/[locale]/recursos/*, embed routes, src/lib/locale-routes.ts, src/app/sitemap.ts, home/nav/case components, e2e/resources.spec.ts.
Consumes: catalog, paths, utility panels. Produces: all collection/detail routes, embeds, submission forms, home and case entrances.
- [x] Add failing browser checks for resource navigation, JSON comparison, locale identity, downloads, embedded attribution and contribution drafts.
- [x] Implement responsive server-rendered collections/details, metadata, filtered topic content, gallery and contribution workflows.
- [x] Add navigation/home/case links and sitemap entries; run typecheck and browser checks.

### Task 4: Reusable media and downloads
Files: scripts/build-resource-assets.ts, scripts/benchmark-json.mjs, public/recursos/*, scripts/record-resource-demos.mjs, docs/distribution-resources.md.
Consumes: catalog/project data. Produces: diagrams, carousels, ZIP templates, press/curator/session packs, benchmark CSV/JSON/source, playable captioned videos.
- [x] Generate real benchmark results and template archives; run the worker starter's tests and typecheck.
- [x] Render localized diagrams, carousels and kits from existing project data; verify expected outputs.
- [x] Record actual demos and encode web-compatible MP4/WebM with VTT captions and posters.
- [x] Document reproduction commands, all twenty outcomes and remaining human participation.

### Task 5: Verify and review
- [x] Run unit suite, lint, typecheck, build and E2E; fix regressions.
- [x] Inspect desktop/mobile and media views.
- [x] Request fresh review against spec and twenty deliverables; fix material issues with regression tests.
- [x] Deliver concise status with verification evidence and truthful external limitations.
