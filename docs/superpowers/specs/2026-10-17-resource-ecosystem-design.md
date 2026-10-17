# Resource ecosystem — design

The user approved all twenty proposals and explicitly delegates implementation decisions, testing, PR integration and publication using the previous delivery workflow. Existing authorization to skip unavailable account/human actions persists. Do not stop for additional design approvals. Do not invent users, citations, votes, third-party contributions or publication credentials.

## Outcome and architecture

Extend the existing Portuguese/English/Spanish resource library with an `ecossistema` collection and twenty working entries. Reuse current navigation, localized metadata, canonical/hreflang and sitemap. Existing twenty collections stay available. New modules are split into distribution packages, interactive studio, participation/publication and root integration. Browser tools keep private inputs local. Shared URLs contain only validated public resource identifiers or bounded synthetic scenario parameters.

### Distribution packages — items 1, 2, 3, 4, 9

1. Standalone MIT CLI package for the existing JSON and .env engines, with help, JSON output, meaningful exit codes (0 equal/valid, 1 differences, 2 invalid input), local files/stdin, bounded input and tests. Publish a tested `.tgz` and sources; publish to npm only if an authenticated account is available. A hosted tarball remains runnable/installable without npm registry publication.
2. Reusable public GitHub Action invokes the CLI and writes a workflow summary without leaking environment values. Build a standalone action repository/release if GitHub authorization supports it. Marketplace legal/account acceptance is a manual exception if unavailable.
3. Executable worker sources under `examples/worker-starter`; browser launch button points to that real folder through StackBlitz, with installation/test instructions and downloadable fallback.
4. A fictional local HTTP lab with authentication, pagination, validation and error responses, plus complete Bruno requests/assertions, README, runnable server and meaningful integration tests.
9. Immutable version `1.0.0` release downloads and manifest with sizes, SHA-256, compatibility and source links. Preserve old release files; a conflicting rebuild must be detectable. At minimum CLI tarball, action source, worker and HTTP/Bruno lab are downloadable.

### Interactive studio — items 5, 6, 7, 8

5. Queue scenario links preserve bounded arrivals/workers/failures and number of steps; decode defensively and apply explicitly. Do not encode visitor JSON/.env inputs. Existing queue semantics and tests stay intact.
6. At least six fully localized technical challenges covering queues, idempotency and contracts, with deterministic automatic grading, progressive hints, explanations and local progress/reset. No execution of arbitrary visitor code and no fabricated credentials.
7. Editable architecture graphs seeded from actual case data. Add/remove/rename components and connections, reset, validate, export escaped SVG and Mermaid. Keyboard-operable controls, bounded nodes/edges/text and no HTML injection.
8. Named collections of real resource IDs, local storage with failure fallback, shareable bounded URL, import validation, removal/reset and Markdown export. Unknown IDs cannot create arbitrary links.

### Participation/publication — items 12, 13, 17, 19, 20

12. Contextual correction proposals contain page URL, locale, original excerpt and suggestion; reviewable GitHub issue drafts. Context is read from the actual article/resource selection and never sent before a visitor submits explicitly.
13. Public request/roadmap board backed by real labeled GitHub issues and reactions, with issue form, links for requests/votes, truthful states and cached public reads. Use real data or an explicitly empty board; no fabricated votes. Live-read failure uses a dated snapshot or clear unavailable state.
17. Standards-oriented Webmention endpoint accepts validated public HTTPS source and known same-site target, size/rate limits, durable queue adapter using configured GitHub credentials, and explicit 503 when persistence is not configured. Manual issue intake remains usable. Verification must reject private/reserved addresses and unsafe redirects, require an actual backlink, and keep entries unpublished until maintainer review. Include tested importer and reviewed references dataset. Do not claim an unconfigured receiver is live.
19. Verified external contributions page populated by inspecting actual public GitHub merged PRs by the author outside owned repositories. Record exact source/status/date and empty-state if no qualifying PR is found; include a reproducible refresh command.
20. IndexNow key file, validated dry-run-by-default submission command and post-publication automation. Submit only same-site canonical URLs to official endpoints, after the production key is reachable. No ranking/indexing guarantee. Actual initial submission is authorized by this request.

### Root integration — items 10, 11, 14, 15, 16, 18

10. Citation generator for articles/resources produces escaped BibTeX and plain text from real author/title/URL/date/version metadata; copy/download available.
11. Stable content-derived anchors on article paragraphs and code blocks, existing heading IDs preserved; accessible per-block permalink buttons. Duplicate content has a deterministic suffix.
14. Read-only versioned JSON catalogue at `/api/resources/v1` with locale/section filtering, schema, canonical links, licenses, download metadata, ETag/cache/CORS, documented errors and no private content.
15. Safe SVG cards for public README embedding, selected by validated real resource ID, localized, with title/description/source and copyable Markdown. No remote assets, injected markup or fabricated usage counts.
16. Allowlisted short redirects `/r/[code]`, tracked public destinations and generated real QR codes; unknown codes are 404 and arbitrary redirect destinations are rejected.
18. Localized release/resource RSS feeds with escaping, canonical links, deterministic GUIDs, actual release dates and optional strict known-resource filter; advertise feed discovery.

## Integration contracts

Root owns `src/data/resources/ecosystem.ts`, resource catalog/screen integration, navigation/discovery, shared build scripts/package.json, API catalogue, citation/permalink modules, cards/short URLs/RSS and final docs/E2E. Other implementers must not modify these shared files without agreement.

Distribution exports `PackageResources({kind,locale})` from `src/components/ecosystem/PackageResources.tsx`, accepting slugs `terminal`, `github-action`, `executar`, `api-bruno`, `versoes`.

Studio exports `StudioResources({kind,locale})` from `src/components/ecosystem/StudioResources.tsx`, accepting `cenarios`, `desafios`, `editor-diagramas`, `colecoes`. It may modify only `ResourceTools.tsx` among existing shared components to integrate scenario controls. Editor/collections use pure public case/resource metadata.

Participation exports `ParticipationResources({kind,locale})` from `src/components/ecosystem/ParticipationResources.tsx`, accepting `correcoes`, `pedidos`, `referencias`, `contribuicoes`, `indexnow`; exports a reusable correction control suitable for articles. It owns only its API routes, new libs/data, scripts, issue templates/workflows and tests. It does not modify existing blog components.

All public UI must support PT/EN/ES. Avoid naming a local translation helper `t`, as the i18n AST test reserves it for dictionary keys. Use existing theme tokens and accessible focusable controls. Data-dependent controls report failures honestly.

## Verification and release

Targeted behavioral/security tests precede implementation for nontrivial logic. Run package/lab tests and artifact checks, lint, typecheck, full unit suite, production build and browser tests. Check malformed URLs/payloads, missing storage, XML/SVG/BibTeX escaping, SSRF boundaries and missing external configuration. Fresh independent review before PR; fix material findings with reproduction tests. Push HTTPS-authenticated feature branch, create PR to master, wait for CI, integrate and verify production routes/artifacts. Document each of twenty items with concrete evidence and any external publication/account exceptions.
