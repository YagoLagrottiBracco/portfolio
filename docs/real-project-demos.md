# Real public project demonstrations

Checked on **2026-10-17**. These experiences load the original production applications after a visitor activates them. They are not local replicas, isolated test accounts or simulated business data. The existing local queue tool remains an educational simulation.

## Selected experiences and provenance

| Resource slug | Portfolio project | Original public application | Verified interaction |
| --- | --- | --- | --- |
| `dupla-face-planta` | `dupla-face` | [Estúdio Dupla Face · Apto Oscar](https://duplaface.arq.br/projetos/apto-oscar) | Select a room pin to inspect the actual room drawings/images; switch floor-plan layers. |
| `flora-agenda` | `flora-psicologia` | [Flora Psicologia · Agendamento](https://florapsicologa.com.br/agendar) | Navigate calendar months and select a date to read available appointment times. |

Both applications are already linked from their projects in `src/data/personal.ts`. The embedded document comes directly from the listed HTTPS origin. No public source repository was established for either product, so the optional `source` field is deliberately absent. The component identifies the product, its origin and the verification date without presenting the embed as published source code.

GET responses returned HTTP 200. Neither selected document supplied `X-Frame-Options` or a `Content-Security-Policy` restriction on frame ancestors. More significantly, both ran and responded to real interactions in Chromium 153 inside a cross-origin local page using the production iframe restrictions described below. These checks establish observed support on the stated date; the applications can change their headers or availability later.

Read-only browser evidence:

- Dupla Face: clicking `1 · Sala` changed the floor-plan detail to `PONTO 1 DE 7` with `7 ITENS NESTE PONTO`. Clicking `Planta Demolição` changed that control's `aria-pressed` attribute to `true`. The frame produced no console errors during those interactions.
- Flora: `Próximo mês` changed the calendar to `novembro 2026`; `Mês anterior` returned to October. Selecting `19` displayed ten appointment times, from `09:00` to `20:00`, under the October 19 heading. The confirmation control stayed disabled. Request observation found **no methods other than GET/HEAD/OPTIONS** during these steps. No personal data was entered, time was booked or form was submitted.

## Component contract

`src/data/resources/project-demos.ts` exports `ProjectDemo`, `LocalizedText`, `projectDemos` and `isSafeProjectDemoUrl`. Each record contains a stable `slug`, localized `title`, `description` and exploration `instructions`, `projectSlug`, exact `productName`, public `url`, optional public repository `source`, `embeddingSupported` and ISO `checkedAt` date.

`src/components/resources/LiveProjectDemo.tsx` exports:

```tsx
<LiveProjectDemo demo={demo} locale="pt" />
```

The component renders complete Portuguese, English and Spanish interface text. It creates no iframe, image, preload, preconnect or script request to the product before activation. A regular external anchor remains available without activation. Consent is tied to the selected URL and record identity, so changing products in the same component instance requires another activation.

The active iframe has an accessible product title, `referrerPolicy="no-referrer"`, and exactly `sandbox="allow-scripts allow-same-origin"`. The products require JavaScript and their own origin for normal application behavior. No form, popup, download or parent-navigation sandbox permission is added. Camera, microphone, geolocation, payment and clipboard access are explicitly denied through the iframe permissions policy. These browser restrictions do not turn the production application into a simulated environment; the visitor-facing instructions say that clearly.

The load button explains the external connection and that the product can use its own cookies and services. Loading progress is announced through a polite status region, with a slower-loading recovery message after 15 seconds. The external application link is always available for valid URLs, including when an embed is unavailable, blocked or blank. An iframe `load` event is described as opening the frame, not proof that a cross-origin application rendered successfully. Closing the product removes its iframe and restores focus to the activation button.

Only the inspected HTTPS hosts are accepted by the URL validator. Credentials, other protocols/hosts, nonstandard ports, control characters and backslashes are rejected before an iframe or fallback link can be rendered. Set `embeddingSupported: false` if a subsequent check discovers blocking headers or broken embedded behavior; the direct app link remains available.

## Reproducing the read-only checks

Inspect the actual GET headers rather than assuming that a HEAD response represents the embedded document:

```sh
curl -sS -D - -o /dev/null https://duplaface.arq.br/projetos/apto-oscar
curl -sS -D - -o /dev/null https://florapsicologa.com.br/agendar
```

Against a local portfolio preview, activate the resource with `[data-demo-activate]`, then use these Playwright frame selectors:

```js
const floorPlan = page.frameLocator('iframe[title*="Estúdio Dupla Face"]')
await floorPlan.getByRole("button", { name: "1 · Sala", exact: true }).click()
await floorPlan.getByRole("button", { name: "Planta Demolição", exact: true }).click()

const calendar = page.frameLocator('iframe[title*="Flora Psicologia"]')
await calendar.getByRole("button", { name: "Próximo mês", exact: true }).click()
await calendar.getByRole("button", { name: "Mês anterior", exact: true }).click()
```

For Flora, choose a future enabled calendar date to inspect its time slots. Do not enter the personal-data fields or click `Confirmar agendamento` when recording or checking the demonstration. The October 19 example above is a dated observation rather than a permanent fixture. `[data-demo-close]` closes either frame. `[data-live-project-demo]` identifies the component region.

The local regression tests run without product network access:

```sh
node --import tsx --test tests/project-demos.test.ts
```

They cover provenance against the portfolio, localized guidance, unsafe URL rejection, initial request gating, accessible loading state, restricted permissions, removal on close, unavailable/unsafe fallbacks, separate activation when switching products and announced recovery after a frame error. Live-site availability remains a separate read-only browser check so normal unit tests do not depend on external services.

## Other inspected products

These observations explain why the selected experiences were used; none is presented as a working anonymous configurator or authenticated demo:

| Public product | Observed state on 2026-10-17 |
| --- | --- |
| [Digital Tech MS](https://digitaltechms.com.br/produtos) | Site and catalog route returned 200, but the catalog displayed no products, so no product configurator was demonstrated. |
| [ImpressãoMais3D](https://impressaomais3d.com.br) | Reachable storefront linking product purchases to Shopee; no public 3D customization tool was found in this deployment. |
| [EnvRune Cloud](https://envrune.vercel.app) | Reachable sign-in landing page; managing actual team secrets requires account access. |
| [Normify](https://normify.app) | Returned HTTP 404. |
| [Minhas Finanças](https://minhas-financas-murex.vercel.app) | Returned HTTP 404. |
| [Agendify](https://agendify.me) | Domain did not resolve in the browser check. |
| [Ikigai](https://florir.online) | Returned the host's 404 page. |
| [PulseWatch](https://pulsewatch.click) | Hosting reported HTTP 503 with deployment paused. |

No accounts, bookings, orders, external submissions or replicas were created. Authenticated client portals remain outside these anonymous public demonstrations.
