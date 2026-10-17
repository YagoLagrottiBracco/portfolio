"use client"

import React, { useEffect, useId, useRef, useState } from "react"
import type { Locale } from "@/lib/i18n"
import {
  isSafeProjectDemoUrl,
  type ProjectDemo,
} from "@/data/resources/project-demos"

type FrameState = "idle" | "loading" | "requested" | "slow" | "error"

const secondaryClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-hairline px-4 py-2 text-sm font-semibold text-brand hover:bg-brand-soft"

/** The original public product is mounted only after an explicit visitor action. */
export function LiveProjectDemo({
  demo,
  locale,
}: {
  demo: ProjectDemo
  locale: Locale
}) {
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  const [state, setState] = useState<FrameState>("idle")
  const [consentedDemo, setConsentedDemo] = useState<Pick<
    ProjectDemo,
    "slug" | "url"
  > | null>(null)
  const activateRef = useRef<HTMLButtonElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const detailsId = useId()
  const safeUrl = isSafeProjectDemoUrl(demo.url)
  const canEmbed = safeUrl && demo.embeddingSupported
  const active =
    canEmbed &&
    consentedDemo?.slug === demo.slug &&
    consentedDemo.url === demo.url &&
    state !== "idle"
  const visibleState = active ? state : "idle"

  useEffect(() => {
    if (!active || state !== "loading") return
    const timeout = window.setTimeout(() => setState("slow"), 15000)
    return () => window.clearTimeout(timeout)
  }, [active, state])

  useEffect(() => {
    const frame = frameRef.current
    if (!active || !frame) return
    // React listens for iframe load but not its non-bubbling error event.
    const handleError = () => setState("error")
    frame.addEventListener("error", handleError)
    return () => frame.removeEventListener("error", handleError)
  }, [active])

  function closeProduct() {
    setState("idle")
    setConsentedDemo(null)
    window.requestAnimationFrame(() => activateRef.current?.focus())
  }

  return (
    <section
      aria-label={demo.title[locale]}
      className="mt-8 overflow-hidden rounded-2xl border border-hairline bg-surface"
      data-live-project-demo={demo.slug}
    >
      <div className="p-4 sm:p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-brand">
          {copy(
            "Produto original em produção",
            "Original production product",
            "Producto original en producción"
          )}
        </p>
        <h2 className="mt-3 text-xl font-semibold">{demo.productName}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {demo.description[locale]}
        </p>
        <p
          id={detailsId}
          className="mt-3 text-sm leading-relaxed text-muted-foreground"
        >
          {copy(
            "Ao carregar, seu navegador acessa o produto externo, que pode usar cookies e serviços próprios. Esta é a aplicação real em produção.",
            "Loading connects your browser to the external product, which may use its own cookies and services. This is the real production application.",
            "Al cargar, tu navegador accede al producto externo, que puede usar sus propias cookies y servicios. Es la aplicación real en producción."
          )}
        </p>
        <p className="mt-3 text-sm leading-relaxed">
          {demo.instructions[locale]}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          {copy("Origem", "Origin", "Origen")}:{" "}
          {safeUrl ? new URL(demo.url).hostname : "—"}
          {" · "}
          {copy(
            "Incorporação verificada em",
            "Embedding checked on",
            "Incorporación verificada el"
          )}{" "}
          <time dateTime={demo.checkedAt}>{demo.checkedAt}</time>
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {canEmbed && !active && (
            <button
              ref={activateRef}
              type="button"
              data-demo-activate
              aria-describedby={detailsId}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 py-2 font-semibold text-brand-contrast"
              onClick={() => {
                setConsentedDemo({ slug: demo.slug, url: demo.url })
                setState("loading")
              }}
            >
              {copy(
                "Carregar produto real",
                "Load the real product",
                "Cargar producto real"
              )}
            </button>
          )}
          {active && (
            <button
              type="button"
              data-demo-close
              className={secondaryClass}
              onClick={closeProduct}
            >
              {copy("Fechar produto", "Close product", "Cerrar producto")}
            </button>
          )}
          {safeUrl && (
            <a
              href={demo.url}
              target="_blank"
              rel="noopener noreferrer"
              className={secondaryClass}
            >
              {copy(
                "Abrir aplicativo original",
                "Open original application",
                "Abrir aplicación original"
              )}
              <span className="sr-only">
                {copy(" (nova aba)", " (new tab)", " (nueva pestaña)")}
              </span>
            </a>
          )}
        </div>
        <p
          className="mt-4 text-sm text-muted-foreground"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {!safeUrl
            ? copy(
                "Endereço do produto indisponível.",
                "Product address is unavailable.",
                "La dirección del producto no está disponible."
              )
            : !demo.embeddingSupported
              ? copy(
                  "A incorporação está indisponível. Abra o aplicativo original pelo link acima.",
                  "Embedding is unavailable. Open the original application using the link above.",
                  "La incorporación no está disponible. Abre la aplicación original con el enlace anterior."
                )
              : visibleState === "loading"
                ? copy(
                    "Carregando o produto externo…",
                    "Loading the external product…",
                    "Cargando el producto externo…"
                  )
                : visibleState === "slow" || visibleState === "error"
                  ? copy(
                      "Se o produto não aparecer, abra o aplicativo original pelo link acima.",
                      "If the product does not appear, open the original application using the link above.",
                      "Si el producto no aparece, abre la aplicación original con el enlace anterior."
                    )
                  : visibleState === "requested"
                    ? copy(
                        "Visualização aberta. Se estiver vazia ou bloqueada, use o link do aplicativo original.",
                        "Frame opened. If it is blank or blocked, use the original application link.",
                        "Vista abierta. Si está vacía o bloqueada, usa el enlace de la aplicación original."
                      )
                    : copy(
                        "O produto externo só é carregado após sua escolha.",
                        "The external product loads only after you choose to open it.",
                        "El producto externo solo se carga cuando decides abrirlo."
                      )}
        </p>
      </div>
      {active && (
        <iframe
          ref={frameRef}
          src={demo.url}
          title={`${demo.productName} — ${demo.title[locale]}`}
          sandbox="allow-scripts allow-same-origin"
          allow="camera 'none'; microphone 'none'; geolocation 'none'; payment 'none'; clipboard-read 'none'; clipboard-write 'none'"
          referrerPolicy="no-referrer"
          onLoad={() => setState("requested")}
          className="h-[42rem] w-full border-0 border-t border-hairline bg-white sm:h-[48rem]"
        />
      )}
    </section>
  )
}
