"use client"

import React, { useState } from "react"
import type { Locale } from "@/lib/i18n"
import { QueueScenario } from "@/components/ecosystem/QueueScenario"
import { replayQueueScenario } from "@/lib/resource-studio"
import {
  advanceQueue,
  compareJson,
  initialQueue,
  inspectEnvKeys,
} from "@/lib/resource-tools"

const inputClass =
  "mt-2 w-full rounded-xl border border-hairline bg-background p-3 font-mono text-sm leading-relaxed"
const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-5 py-2 font-semibold text-brand-contrast disabled:opacity-50"
const secondary =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-hairline bg-surface px-4 py-2 text-sm hover:bg-surface-hover"
const exampleA =
  '{\n  "event": "order.created",\n  "version": 1,\n  "payload": { "currency": "BRL", "total": 100 }\n}'
const exampleB =
  '{\n  "event": "order.created",\n  "version": 2,\n  "payload": { "currency": "BRL", "total": 120, "status": "paid" }\n}'

export function ResourceTools({
  tool,
  locale,
}: {
  tool: "json" | "env" | "queue"
  locale: Locale
}) {
  return tool === "queue" ? (
    <QueueTool locale={locale} />
  ) : (
    <TextTool tool={tool} locale={locale} />
  )
}
function TextTool({ tool, locale }: { tool: "json" | "env"; locale: Locale }) {
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  const [left, setLeft] = useState(
    tool === "json" ? exampleA : "API_URL=\nWORKER_TOKEN=\nPORT=3000"
  )
  const [right, setRight] = useState(
    tool === "json"
      ? exampleB
      : "API_URL=https://example.com\nPORT=3000\nPORT=4000"
  )
  const [json, setJson] = useState<ReturnType<typeof compareJson> | null>(null)
  const [env, setEnv] = useState<ReturnType<typeof inspectEnvKeys> | null>(null)
  const clearResult = () => {
    setJson(null)
    setEnv(null)
  }
  const error = json?.error ?? env?.error
  const errors = {
    "unsafe-number": copy(
      "Um número perde precisão em JavaScript. Use strings para IDs grandes e decimais exatos.",
      "A number loses precision in JavaScript. Use strings for large IDs and exact decimals.",
      "Un número pierde precisión en JavaScript. Usa strings para IDs grandes y decimales exactos."
    ),
    "too-large": copy(
      "Limite: 200.000 caracteres por campo.",
      "Limit: 200,000 characters per field.",
      "Límite: 200.000 caracteres por campo."
    ),
    "too-deep": copy(
      "Limite: 100 níveis de profundidade.",
      "Limit: 100 nesting levels.",
      "Límite: 100 niveles de profundidad."
    ),
    "invalid-json": copy(
      "JSON inválido. Revise os dois campos.",
      "Invalid JSON. Review both fields.",
      "JSON inválido. Revisa ambos campos."
    ),
  }
  return (
    <section
      className="rounded-2xl border border-hairline bg-surface p-4 sm:p-6"
      aria-label={
        tool === "json"
          ? copy("Comparador de JSON", "JSON comparator", "Comparador de JSON")
          : copy(
              "Revisor de ambiente",
              "Environment checker",
              "Revisor de entorno"
            )
      }
    >
      <p className="text-sm leading-relaxed text-muted-foreground">
        {copy(
          "O processamento acontece neste navegador. Os campos não são enviados, salvos ou incluídos em analytics. Use dados fictícios em demonstrações.",
          "Processing happens in this browser. Fields are not sent, saved or included in analytics. Use synthetic data for demonstrations.",
          "El procesamiento ocurre en este navegador. Los campos no se envían, guardan ni incluyen en analytics. Usa datos ficticios en demostraciones."
        )}
      </p>
      {tool === "env" && (
        <p className="mt-2 text-sm text-muted-foreground">
          {copy(
            "Revisa nomes de chaves, não a sintaxe completa de dotenv nem valores obrigatórios. Uma atribuição por linha; valores multilinha geram linhas inválidas.",
            "Checks key names, not full dotenv syntax or required values. One assignment per line; multiline values produce invalid lines.",
            "Revisa nombres, no toda la sintaxis dotenv ni valores obligatorios. Una asignación por línea; valores multilínea producen líneas inválidas."
          )}
        </p>
      )}
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="min-w-0 font-medium">
          {tool === "json"
            ? copy("JSON original", "Original JSON", "JSON original")
            : copy(
                "Referência (.env.example)",
                "Reference (.env.example)",
                "Referencia (.env.example)"
              )}
          <textarea
            data-testid="tool-left"
            spellCheck={false}
            maxLength={200001}
            rows={9}
            className={inputClass}
            value={left}
            onChange={(e) => {
              setLeft(e.target.value)
              clearResult()
            }}
          />
        </label>
        <label className="min-w-0 font-medium">
          {tool === "json"
            ? copy("JSON atualizado", "Updated JSON", "JSON actualizado")
            : copy(
                "Configuração para revisar",
                "Configuration to review",
                "Configuración para revisar"
              )}
          <textarea
            data-testid="tool-right"
            spellCheck={false}
            maxLength={200001}
            rows={9}
            className={inputClass}
            value={right}
            onChange={(e) => {
              setRight(e.target.value)
              clearResult()
            }}
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          data-testid="tool-run"
          className={buttonClass}
          onClick={() =>
            tool === "json"
              ? setJson(compareJson(left, right))
              : setEnv(inspectEnvKeys(left, right))
          }
        >
          {copy("Comparar", "Compare", "Comparar")}
        </button>
        <button
          type="button"
          className={secondary}
          onClick={() => {
            setLeft("")
            setRight("")
            clearResult()
          }}
        >
          {copy("Limpar campos", "Clear fields", "Limpiar campos")}
        </button>
      </div>
      <div
        className="mt-5"
        role="status"
        aria-live="polite"
        data-testid="tool-result"
      >
        {error && (
          <p className="font-medium text-destructive">{errors[error]}</p>
        )}
        {json && !error && (
          <>
            <p className="font-semibold">
              {json.changes.length}{" "}
              {copy("diferenças", "differences", "diferencias")}
              {json.truncated ? " (+)" : ""}
            </p>
            {json.changes.length === 0 && (
              <p>
                {copy(
                  "Os documentos têm os mesmos valores.",
                  "The documents have the same values.",
                  "Los documentos tienen los mismos valores."
                )}
              </p>
            )}
            {json.truncated && (
              <p>
                {copy(
                  "Mostrando as primeiras 500 diferenças.",
                  "Showing the first 500 differences.",
                  "Se muestran las primeras 500 diferencias."
                )}
              </p>
            )}
            {json.changes.length > 0 && (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">
                    {copy(
                      "Diferenças entre documentos",
                      "Document differences",
                      "Diferencias entre documentos"
                    )}
                  </caption>
                  <thead>
                    <tr className="border-b border-hairline">
                      <th className="p-2">JSON Pointer</th>
                      <th className="p-2">
                        {copy("Mudança", "Change", "Cambio")}
                      </th>
                      <th className="p-2">
                        {copy("Antes", "Before", "Antes")}
                      </th>
                      <th className="p-2">
                        {copy("Depois", "After", "Después")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {json.changes.map((change, i) => (
                      <tr key={i} className="border-b border-hairline">
                        <td className="max-w-56 break-all p-2 font-mono">
                          {change.path || copy("(raiz)", "(root)", "(raíz)")}
                        </td>
                        <td className="p-2">
                          {change.kind === "added"
                            ? copy("Adicionado", "Added", "Añadido")
                            : change.kind === "removed"
                              ? copy("Removido", "Removed", "Eliminado")
                              : copy("Alterado", "Changed", "Modificado")}
                        </td>
                        <td className="max-w-56 break-all p-2 font-mono">
                          {change.kind === "added"
                            ? "—"
                            : preview(change.before)}
                        </td>
                        <td className="max-w-56 break-all p-2 font-mono">
                          {change.kind === "removed"
                            ? "—"
                            : preview(change.after)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {env && !error && (
          <ul className="space-y-2 text-sm">
            {[
              [copy("Ausentes", "Missing", "Faltantes"), env.missing],
              [copy("Extras", "Extra", "Extras"), env.extra],
              [
                copy(
                  "Duplicatas na configuração",
                  "Configuration duplicates",
                  "Duplicados en configuración"
                ),
                env.duplicates,
              ],
              [
                copy(
                  "Duplicatas na referência",
                  "Reference duplicates",
                  "Duplicados en referencia"
                ),
                env.referenceDuplicates,
              ],
              [
                copy(
                  "Linhas inválidas na configuração",
                  "Invalid configuration lines",
                  "Líneas inválidas en configuración"
                ),
                env.invalidLines,
              ],
              [
                copy(
                  "Linhas inválidas na referência",
                  "Invalid reference lines",
                  "Líneas inválidas en referencia"
                ),
                env.referenceInvalidLines,
              ],
            ].map(([label, values]) => (
              <li key={String(label)}>
                <strong>{String(label)}: </strong>
                {(values as (string | number)[]).join(", ") ||
                  copy("nenhuma", "none", "ninguno")}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
function preview(value: unknown) {
  const text = JSON.stringify(value)
  return text && text.length > 160 ? `${text.slice(0, 160)}…` : text
}
function QueueTool({ locale }: { locale: Locale }) {
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  const [state, setState] = useState(initialQueue)
  const [arrivals, setArrivals] = useState(20),
    [workers, setWorkers] = useState(2),
    [failurePercent, setFailure] = useState(0)
  function step(count: number) {
    setState((current) => {
      let next = current
      for (let i = 0; i < count; i++)
        next = advanceQueue(next, { arrivals, workers, failurePercent })
      return next
    })
  }
  return (
    <section
      className="rounded-2xl border border-hairline bg-surface p-4 sm:p-6"
      aria-label={copy(
        "Simulador de fila",
        "Queue simulator",
        "Simulador de cola"
      )}
    >
      <p className="text-sm text-muted-foreground">
        {copy(
          "Simulação local e determinística. Um passo = um segundo; um worker = uma tentativa por passo; três falhas = DLQ. Não mede os sistemas de produção.",
          "Local deterministic simulation. One step = one second; one worker = one attempt per step; three failures = DLQ. Does not measure production systems.",
          "Simulación local determinista. Un paso = un segundo; un worker = un intento por paso; tres fallos = DLQ. No mide sistemas de producción."
        )}
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {[
          {
            id: "arrivals",
            label: copy(
              "Entradas por segundo",
              "Arrivals per second",
              "Entradas por segundo"
            ),
            value: arrivals,
            max: 50,
            min: 0,
            set: setArrivals,
          },
          {
            id: "workers",
            label: "Workers",
            value: workers,
            max: 50,
            min: 1,
            set: setWorkers,
          },
          {
            id: "failures",
            label: copy("Falhas (%)", "Failures (%)", "Fallos (%)"),
            value: failurePercent,
            max: 100,
            min: 0,
            set: setFailure,
          },
        ].map((control) => (
          <label key={control.id} className="text-sm font-medium">
            {control.label}
            <input
              data-testid={control.id}
              type="number"
              min={control.min}
              max={control.max}
              className={inputClass}
              value={control.value}
              onChange={(e) =>
                control.set(
                  Math.max(
                    control.min,
                    Math.min(control.max, Number(e.target.value) || control.min)
                  )
                )
              }
            />
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          className={buttonClass}
          data-testid="queue-step"
          onClick={() => step(1)}
        >
          {copy("Avançar 1 segundo", "Advance 1 second", "Avanzar 1 segundo")}
        </button>
        <button
          type="button"
          className={secondary}
          data-testid="queue-ten"
          onClick={() => step(10)}
        >
          {copy(
            "Avançar 10 segundos",
            "Advance 10 seconds",
            "Avanzar 10 segundos"
          )}
        </button>
        <button
          type="button"
          className={secondary}
          onClick={() => setState(initialQueue())}
        >
          {copy("Reiniciar", "Reset", "Reiniciar")}
        </button>
      </div>
      <div
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
        role="status"
        aria-live="polite"
      >
        {[
          [copy("Tempo (s)", "Time (s)", "Tiempo (s)"), state.tick],
          ["Backlog", state.pending.length],
          [copy("Concluídas", "Completed", "Completados"), state.completed],
          ["DLQ", state.dead],
        ].map(([label, value]) => (
          <div
            className="rounded-xl border border-hairline bg-background p-4"
            key={label}
          >
            <p className="text-xs text-muted-foreground">{label}</p>
            <p
              data-testid={label === "Backlog" ? "queue-backlog" : undefined}
              className="mt-1 font-mono text-3xl font-semibold"
            >
              {value}
            </p>
          </div>
        ))}
      </div>
      <label className="mt-6 block text-sm">
        {copy(
          "Ocupação da fila (limite didático: 5.000)",
          "Queue occupancy (educational limit: 5,000)",
          "Ocupación de cola (límite didáctico: 5.000)"
        )}
        <meter
          className="mt-2 block h-5 w-full accent-brand"
          min={0}
          max={5000}
          value={state.pending.length}
        >
          {state.pending.length} / 5000
        </meter>
      </label>
      <p className="mt-3 text-sm text-muted-foreground">
        {copy("Recebidas", "Arrived", "Recibidos")}: {state.arrived} ·{" "}
        {copy(
          "Recusadas por capacidade",
          "Rejected at capacity",
          "Rechazados por capacidad"
        )}
        : {state.dropped}
      </p>
      <p className="mt-3 text-sm text-muted-foreground">
        {copy(
          "Para recuperar: zere as entradas, aumente os workers e avance. Falhas afetam IDs determinísticos; a mesma mensagem falhará novamente enquanto a configuração não mudar.",
          "To recover: set arrivals to zero, increase workers and advance. Failures affect deterministic IDs; the same message fails again until the configuration changes.",
          "Para recuperar: pon entradas en cero, aumenta workers y avanza. Los fallos afectan IDs deterministas; el mismo mensaje vuelve a fallar hasta cambiar la configuración."
        )}
      </p>
      <QueueScenario locale={locale} config={{arrivals,workers,failurePercent}} onApply={(scenario)=>{
        setArrivals(scenario.arrivals)
        setWorkers(scenario.workers)
        setFailure(scenario.failurePercent)
        setState(replayQueueScenario(scenario))
      }} />
    </section>
  )
}
