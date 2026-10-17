# Interactive resource studio

The ecosystem collection exposes four tools in Portuguese, English and Spanish:

| Route suffix | Tool | Input and persistence |
| --- | --- | --- |
| `ecossistema/cenarios` | Queue scenario links | Synthetic arrivals, workers, failure percentage and replay steps. Shared links are generated explicitly. |
| `ecossistema/desafios` | Six technical challenges | Fixed answer choices, deterministic grading, two progressive hints and an explanation. Completed challenge IDs are saved locally. |
| `ecossistema/editor-diagramas` | Editable architecture graphs | Initial stages come from actual portfolio case studies. Edits remain in memory until downloaded/copied as SVG or Mermaid. |
| `ecossistema/colecoes` | Named resource collections | Public catalogue IDs and a visitor-chosen public name. Saving, importing and sharing are explicit. |

Use `/recursos/…`, `/en/recursos/…` and `/es/recursos/…` for localized pages. All controls are native buttons, selects and inputs, accessible through Tab and Enter/Space. The diagram selector and connection selectors also use native arrow-key navigation.

## Queue scenarios

Example query: `?queue=1&arrivals=4&workers=2&failures=0&steps=3`.

The page previews a received scenario and waits for **Apply scenario and reset**. Replay starts with an empty queue. It does not serialize prior changes to settings or an entire simulation history. Each step still calls the existing deterministic queue engine; its accounting, retries, dead-letter rule and capacity are unchanged.

Limits: 0–50 arrivals, 1–50 workers, 0–100 percent failures, 0–500 steps. Decoding rejects missing, repeated, fractional, malformed and out-of-range fields. New share URLs drop unrelated query parameters and fragments. JSON and `.env` visitor inputs never enter scenario URLs.

## Challenges and diagrams

Challenge topics are backlog, recovery capacity, retry/DLQ behavior, atomic idempotency, external effects and request-contract compatibility. Grading matches a known challenge and known option against its answer; it executes no visitor code. Local progress is an array of known IDs in `resource-challenges-v1`, with a reset control. Progress is practice feedback, not a credential.

Diagram components can be added, removed and renamed. Connections can be added, removed and relabeled. Removing a component removes its incident connections. Validation rejects unknown endpoints, duplicate connections, self-connections, duplicate IDs, control characters and empty component names. At least one component must remain. Limits are 16 components, 32 connections and 64 characters per label.

Exports use generated internal IDs, escape untrusted text and include no remote assets or active markup. The preview is rendered as React SVG rather than inserting exported markup into HTML. Download failure leaves the export available in a selectable text field. Reset restores the selected real case study.

## Collections

`StudioResources` accepts public localized records through `resources?: StudioResource[]`, where each record is `{id: "section/slug", title, url: "/en/recursos/section/slug"}`. The root catalogue supplies this prop; the studio never imports the catalogue and therefore cannot form a catalogue/component cycle. An absent catalogue displays an unavailable state.

Collection imports accept JSON or a generated URL and require explicit review/application. Only known catalogue IDs are accepted. Limits are 40 unique IDs, an 80-character nonempty name, 8,000 decoded JSON characters and 24,000 characters in a pasted link. Up to 10 named collections can be saved in `resource-collections-v1`. Saving a name again updates that collection. Individual resource removal, saved collection deletion and resetting all local collections are available.

Markdown exports use escaped titles/names and canonical `https://lagrotti.dev` resource URLs. Unknown IDs and invalid resource paths cannot create arbitrary links. Share URLs contain the public collection name and selected public IDs; the interface asks visitors to avoid private information in names. Storage access, invalid persisted data, quota failures and clipboard/download failures have visible fallbacks; editing and exports still work for the current session.

## Focused verification

```sh
node --import tsx --test tests/resource-studio.test.ts tests/resource-studio-ui.test.tsx tests/resource-tools.test.ts
```

The tests exercise real codecs, queue replay, grading, graph edits/exports, collection validation and mounted React controls, including explicit import and denied storage. Root integration owns the full production build and browser suite.
