# Participation, evidence and publication

The five ecosystem participation pages support Portuguese, English and Spanish. `ParticipationResources({kind, locale})` accepts `correcoes`, `pedidos`, `referencias`, `contribuicoes` and `indexnow`. `CorrectionProposal({locale, pageUrl, title?, initialExcerpt?})` reads the selection only when the visitor clicks **Use selected text**. `ReferencesForTarget({target, locale})` renders approved references for an exact canonical article/resource URL and renders nothing when no approved reference exists.

## Corrections and requests

Corrections preserve the actual canonical URL/block anchor, locale, original excerpt and suggestion. Forms build a GitHub issue draft only after the visitor submits the local form. A second action opens the draft, and the visitor chooses whether to publish it on GitHub. Inputs are neither submitted to this website nor stored in browser storage. GitHub login is required to publish or vote.

Request cards read real public issues labeled `resource-request` through `/api/roadmap`, capped at the 100 most recently updated issues. Counts are actual `+1` reactions. `in-progress` is an optional maintainer label. Closed means closed, which can include resolved or declined requests. There is no fabricated implementation promise. An in-process five-minute cache avoids a GitHub request per visitor; GitHub failures show a dated last successful snapshot or checked-in snapshot with explicit status. The current checked-in snapshot is an honestly empty result. The page links to the full GitHub issue query.

Create repository labels `resource-correction`, `resource-request`, `in-progress`, `webmention-pending` and `webmention-approved`. The three new `.github/ISSUE_TEMPLATE` forms use those labels. Label setup is a repository administrative action; issue publication is always a separate visitor or maintainer action.

## Webmention receiver and manual fallback

The receiver is `/api/webmention`. Discovery/status uses GET; protocol intake uses POST with `application/x-www-form-urlencoded` and exactly one `source` and `target`. Sources use public HTTPS hostnames, without credentials or custom ports. Targets must be known canonical URLs from actual public blog/resource/case/home content on `https://lagrotti.dev`. Unknown targets, source-equals-target, IP literals, private hosts and malformed URLs are rejected.

The default deployed behavior without `WEBMENTION_GITHUB_TOKEN` is **503**, with an explicit link to the manual reference issue form. It never claims an unpersisted mention was accepted. Set a deployment secret with fine-grained **Issues: read/write** permission on `YagoLagrottiBracco/portfolio` to enable durable GitHub issue queue writes. `GET /api/webmention` reports whether credentials are configured, which is not a proof that the credentials remain operational. A successful POST returns **202 only after GitHub returns a durable issue receipt**. Invalid credentials, permission failure, timeout or missing receipt returns 503. Queued sources and targets become public GitHub moderation issues; none are automatically displayed on the website.

Intake counts streamed bytes, including when Content-Length is absent or forged, and rejects payloads over 8 KiB. Each application instance admits at most 20 attempts/minute. This in-memory admission limit is not a distributed quota; configure hosting edge quotas if stronger fleet-wide protection is needed. The receiver never fetches source URLs. A maintainer or GitHub Actions verifier performs that work separately.

The verifier uses a public-address allowlist for IPv4/IPv6, rejects mixed public/private DNS answers, pins the selected IP with a custom Node HTTPS lookup, disables alternate-family resolution and connection reuse, verifies TLS against the original hostname, and validates every redirect before connecting. DNS has a three-second deadline, each request a five-second deadline, at most three redirects, at most 16 KiB of headers, and at most 512 KiB of uncompressed HTML. A fresh DNS check and pinned connection is made for every redirect. No cookies, authorization or environment secrets are forwarded. HTML is parsed with parse5 into an inert browser-standard tree; no script runs and no subresources load. An exact actual hyperlink to the target, including normal entity and base-URL resolution, is required. Templates, comments, script text and quoted fake tags cannot supply backlinks.

Verify a real proposal without publishing:

```sh
npx tsx scripts/import-webmention.ts --issue NUMBER
# Or a local JSON object containing public source and known target URLs:
npx tsx scripts/import-webmention.ts --input /path/to/proposal.json
```

The default prints a dry-run verification result and changes no dataset. To prepare an approved record, a maintainer with write/maintain/admin permission must apply `webmention-approved` on the real issue. The importer checks the actual label event actor, reviewer permission, current label, backlink and known target:

```sh
npx tsx scripts/import-webmention.ts --issue NUMBER --approve --reviewer MAINTAINER_LOGIN
```

It writes `src/data/resources/references.json` locally. Review the diff and preview before merging. The issue-label workflow `.github/workflows/webmention-review.yml` performs the same checks and opens a draft content PR when Actions is permitted to create PRs. No approval label is applied automatically, and no references are seeded without real evidence. Approval events outside the most recent 100 events fail safely and require a fresh maintainer label action. Update an approved pair by verifying and approving again; remove obsolete/deleted references through a reviewed content PR. This is a moderated standards-oriented receiver, not a claim of full Webmention interoperability certification or automatic update/delete propagation.

## External contribution evidence

Refresh only public data with authenticated or anonymous-capable `gh api` reads:

```sh
npx tsx scripts/refresh-participation.ts
```

The query is `type:pr author:YagoLagrottiBracco is:merged is:public -user:YagoLagrottiBracco`. Each matching PR is fetched directly to verify the exact author, merged timestamp, closed status, public repository and another repository owner. Other-owner contributions can include work for organizations the author collaborates with; they do not imply professional independence or endorsement. The script refuses incomplete searches and private results, preserves the previous snapshots on API failure, and never publishes private metadata. Output contains only public evidence and aggregate public counts.

The refresh on 2026-10-17 returned zero matching public PRs, with `incomplete_results=false`. The page states that no qualifying public contribution was found and links to the reproducible public query. It does not invent contribution records. The same refresh stores a real empty roadmap snapshot from the public labeled-issue query.

## IndexNow

The public verification file is `/4f31dd50dbdb4c5d9f4eac94301d918a.txt`. The key is public website-ownership verification data, not an application secret. The command uses the fixed official endpoint `https://api.indexnow.org/indexnow` and accepts only known canonical public pages on the exact production origin, excluding query strings, fragments, APIs, redirects and administration routes. Duplicate URLs are removed. The full local source-derived list is the default; explicit canonical URL arguments select a smaller list.

```sh
# No network submission; review payload first:
npx tsx scripts/submit-indexnow.ts
npx tsx scripts/submit-indexnow.ts https://lagrotti.dev/recursos/ferramentas/json
# Authorized maintenance action, after deployment:
npx tsx scripts/submit-indexnow.ts --submit
```

`--submit` first requests the fixed production key URL, rejects redirects/oversized bodies and verifies its exact contents. A missing or mismatched production key prevents submission. The command recognizes 200 as received and 202 as received with key validation pending; neither guarantees indexing or ranking. `.github/workflows/indexnow.yml` runs after a successful Production/production deployment status or an explicit manual workflow dispatch. It logs the dry-run payload, verifies production ownership and then submits. If the hosting provider does not emit GitHub deployment-status events, invoke the manual workflow or CLI after publication. No external legal/account agreements are accepted by these scripts.

## Verification

Run focused checks:

```sh
node --import tsx --test tests/resource-participation.test.ts tests/resource-participation-ui.test.tsx tests/resource-participation-server.test.ts
npx eslint src/lib/resource-participation*.ts src/lib/webmention*.ts src/components/ecosystem/CorrectionProposal.tsx src/components/ecosystem/Participation*.tsx src/components/ecosystem/ReferencesForTarget.tsx src/app/api/roadmap src/app/api/webmention scripts/refresh-participation.ts scripts/import-webmention.ts scripts/submit-indexnow.ts tests/resource-participation*.ts tests/resource-participation-ui.test.tsx
```

Tests cover consent/draft timing, actual selected text, true empty snapshots, missing persistence, body limits and forged lengths, rate rejection, private/reserved addresses and mixed DNS, per-redirect IP pinning, actual HTML links, approval evidence, and dry-run/same-origin submission rules. Full repository tests/build/browser verification remain part of the integrated release workflow.

Protocol references: [W3C Webmention](https://www.w3.org/TR/webmention/), [Node HTTPS request](https://nodejs.org/api/https.html#httpsrequesturl-options-callback), [parse5](https://parse5.js.org/), [GitHub issue reactions](https://docs.github.com/en/rest/reactions/reactions#list-reactions-for-an-issue), [IndexNow documentation](https://www.indexnow.org/documentation).
