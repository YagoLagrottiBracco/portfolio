# Contribution proposal source verification

Inspected on **2026-10-17** using read-only shallow clones of the nine public repositories. No external issue, message, label or maintainer approval was created or inferred. These are editorial proposals for visitors to review against the current branch and existing issues before submitting.

| Portfolio project | Public repository | Inspected commit | Proposal |
| --- | --- | --- | --- |
| devagent | YagoLagrottiBracco/dev-forge | `dabb49843b69bb4f9fbb18e4994f27ec9336ce18` | Separate queue loading, empty and failed states; allow retry. |
| envrune | YagoLagrottiBracco/envrune | `c2aa0d1807862b21b1db757048df703fbe839486` | Show differing reference names for matching environment keys. |
| dreamerz | YagoLagrottiBracco/dreamerz-front | `51efb503a97a8d9159d19edb60ccde44c8442c08` | Preserve the dream form after API failure and prevent duplicate submission. |
| dreamerz | YagoLagrottiBracco/dreamerz-api | `541490969f046cd5c7910015933540ae84e62e80` | Context: dream creation route invokes validation middleware. |
| meu-mundo-mental | YagoLagrottiBracco/andre | `41b801131ffa3727c5f218ffa84fa1142c60c1ad` | End tracking-page loading after failure and distinguish 404 from transient errors. |
| congresso | YagoLagrottiBracco/congresso-api | `f31b0d0f31cf5c49bfd9434d9033b4a130f885f8` | Check a missing lecture document before property access and return 404. |
| congresso | YagoLagrottiBracco/congresso-front | `8abed2d12d208261a024d0cc0435c29620b451ae` | Context: lecture card builds a link from the lecture slug. |
| tripsync | YagoLagrottiBracco/tripsync-backend | `0583d8796989e083cb1c161de91bc89fe3e15732` | Correct placeholder clone URL and label nonfunctional setup instructions as future work. |
| tripsync | YagoLagrottiBracco/tripsync-mobile | `f17fa63cd1f61eb386a6dec67d86ed1e93f92697` | Apply the documentation correction in the second repository too. |

The full target/context file paths, line ranges, commit-pinned GitHub links, localized acceptance criteria, size/skill estimates and localized issue composition links live in `src/data/resources/contribution-tasks.ts`. All **13 cited files** were checked with `git show <commit>:<path>` and against anonymous `https://raw.githubusercontent.com/<repository>/<commit>/<path>` responses. Every response was HTTP 200, its contents matched the inspected git object, and each cited line range was within the file. `git ls-tree -r --name-only HEAD` confirmed both TripSync snapshots contain exactly `LICENSE` and `README.md`; they do not contain the advertised runnable applications.

## Integration contract

`ContributionTask` contains `id`, `projectSlug`, `repository`, localized `title`, `evidence`, `estimate`, `size` (`S` or `M`), `skills`, `sources`, localized `acceptanceCriteria` and `issueDraftUrls` by locale. `ContributionSource` contains `repository`, `commit`, `path`, `startLine`, `endLine`, `role` (`target` or `context`) and the pinned `url`.

- `contributionTasks`: readonly proposal array for the six groups.
- `getContributionTasks(projectSlug: string)`: exact project-slug lookup, returning an empty array for unknown slugs.
- `contributionVerifiedOn`: inspection date; this is a static snapshot, not live issue status.
- `ContributionProjectSlug`: union of the six supported portfolio slugs.
- `ContributionTasks({ projectSlug, locale }: ContributionTasksProps)`: localized server component from `src/components/resources/ContributionTasks.tsx`; returns `null` for unsupported projects. No client JavaScript, new production dependency or external submission is required.

Use `<ContributionTasks projectSlug={entry.slug} locale={locale} />` on a repository resource entry. Each card marks target/context files, exposes source links and criteria, and opens the selected language's prefilled GitHub issue editor. The editor does not submit an issue. No labels, assignee or approved-maintainer status are invented.

## Verification and limits

`tests/contribution-tasks.test.ts` checks six-group coverage, source pinning, localized actionable criteria, generated issue-editor payloads and rendered PT/EN/ES cards, including empty-state behavior for unsupported slugs. Targeted test and ESLint runs passed. The proposal regressions describe work for contributors; no changes were made in the nine upstream projects and their application test suites were not run. Effort is an editorial estimate and requires rechecking against the current source before someone starts a contribution.
