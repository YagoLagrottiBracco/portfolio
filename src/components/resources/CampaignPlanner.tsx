"use client"

import { useEffect, useId, useState } from "react"
import type { Locale } from "@/lib/i18n"
import {
  CAMPAIGN_PROGRESS_KEY,
  campaignChannelLabels,
  getCampaignEntries,
  parseCampaignProgress,
  type CampaignChannel,
} from "@/data/resources/campaign-plan"
import { CopyField } from "./ResourceActions"

const actionClass =
  "inline-flex min-h-11 items-center justify-center rounded-lg border border-hairline bg-surface px-4 py-2 text-sm hover:bg-surface-hover disabled:opacity-50"

export function CampaignPlanner({ locale }: { locale: Locale }) {
  const wording = (pt: string, en: string, es: string) =>
    ({ pt, en, es })[locale]
  const identifier = useId()
  const [completed, setCompleted] = useState<string[]>([])
  const [storageUnavailable, setStorageUnavailable] = useState(false)
  const [ready, setReady] = useState(false)
  const [channel, setChannel] = useState<CampaignChannel | "all">("all")
  const entries = getCampaignEntries(locale)
  useEffect(() => {
    try {
      setCompleted(
        parseCampaignProgress(localStorage.getItem(CAMPAIGN_PROGRESS_KEY))
      )
    } catch {
      setStorageUnavailable(true)
    }
    setReady(true)
  }, [])
  function updateProgress(next: string[]) {
    setCompleted(next)
    try {
      if (next.length)
        localStorage.setItem(CAMPAIGN_PROGRESS_KEY, JSON.stringify(next))
      else localStorage.removeItem(CAMPAIGN_PROGRESS_KEY)
      setStorageUnavailable(false)
    } catch {
      setStorageUnavailable(true)
    }
  }
  return (
    <section
      className="mt-12"
      aria-labelledby={`${identifier}-heading`}
      data-testid="campaign-planner"
    >
      <h2 id={`${identifier}-heading`} className="text-2xl font-semibold">
        {wording(
          "Plano editorial de 30 dias",
          "30-day editorial plan",
          "Plan editorial de 30 días"
        )}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
        {wording(
          "19/10 a 17/11/2026 · Datas sugeridas para revisar e adaptar. Cada entrada tem o texto completo e um link identificado por canal. Escolha o idioma do seu público. Copiar ou marcar uma entrada não publica nem envia nada.",
          "October 19–November 17, 2026 · Suggested dates to review and adapt. Each entry has full copy and a channel-tagged link. Choose your audience's language. Copying or checking an entry does not publish or send anything.",
          "19/10–17/11/2026 · Fechas sugeridas para revisar y adaptar. Cada entrada incluye texto completo y un enlace identificado por canal. Elige el idioma del público. Copiar o marcar no publica ni envía nada."
        )}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          className={actionClass}
          href={`/recursos/campanha/${locale}/plano-30-dias.md`}
          download
        >
          {wording(
            "Baixar textos (.md)",
            "Download copy (.md)",
            "Descargar textos (.md)"
          )}
        </a>
        <a
          className={actionClass}
          href={`/recursos/campanha/${locale}/calendario.ics`}
          download
        >
          {wording(
            "Baixar calendário (.ics)",
            "Download calendar (.ics)",
            "Descargar calendario (.ics)"
          )}
        </a>
        <a
          className={actionClass}
          href={`/recursos/campanha/${locale}/kit-campanha.zip`}
          download
        >
          {wording(
            "Baixar pacote (.zip)",
            "Download pack (.zip)",
            "Descargar paquete (.zip)"
          )}
        </a>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {wording(
          "O calendário contém lembretes editoriais de dia inteiro, sem convidados ou alertas. Importá-lo é uma ação sua no aplicativo de calendário.",
          "The calendar contains all-day editorial reminders, with no invitees or alerts. Importing it is your action in your calendar app.",
          "El calendario contiene recordatorios editoriales de día completo, sin invitados ni alertas. La importación la realizas en tu aplicación de calendario."
        )}
      </p>
      <div className="mt-7 rounded-xl border border-hairline p-4">
        <p
          className="text-sm"
          role="status"
          aria-live="polite"
          data-testid="campaign-progress"
        >
          {completed.length} / {entries.length}{" "}
          {wording(
            "entradas concluídas",
            "entries completed",
            "entradas completadas"
          )}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {storageUnavailable
            ? wording(
                "O navegador não permitiu salvar. Seu progresso fica disponível apenas nesta página enquanto ela estiver aberta.",
                "The browser did not allow saving. Progress remains available only on this page while it is open.",
                "El navegador no permitió guardar. El progreso queda disponible solo en esta página mientras esté abierta."
              )
            : wording(
                "Apenas as marcações são salvas neste navegador. O progresso é compartilhado entre idiomas neste dispositivo; não é enviado ao servidor.",
                "Only checklist marks are saved in this browser. Progress is shared across languages on this device; it is not sent to the server.",
                "Solo las marcas se guardan en este navegador. El progreso se comparte entre idiomas en este dispositivo; no se envía al servidor."
              )}
        </p>
        <button
          className={`${actionClass} mt-3`}
          type="button"
          disabled={!ready || completed.length === 0}
          onClick={() => updateProgress([])}
        >
          {wording(
            "Limpar marcações locais",
            "Clear local checklist",
            "Borrar marcas locales"
          )}
        </button>
      </div>
      <label
        className="mt-6 block text-sm font-medium"
        htmlFor={`${identifier}-channel`}
      >
        {wording("Filtrar por canal", "Filter by channel", "Filtrar por canal")}
      </label>
      <select
        id={`${identifier}-channel`}
        value={channel}
        onChange={(event) =>
          setChannel(event.target.value as CampaignChannel | "all")
        }
        className="mt-2 min-h-11 max-w-full rounded-lg border border-hairline bg-background px-3"
      >
        <option value="all">
          {wording("Todos os canais", "All channels", "Todos los canales")}
        </option>
        {(Object.keys(campaignChannelLabels) as CampaignChannel[]).map(
          (key) => (
            <option key={key} value={key}>
              {campaignChannelLabels[key][locale]}
            </option>
          )
        )}
      </select>
      <ol className="mt-5 grid gap-4">
        {entries
          .filter((entry) => channel === "all" || entry.channel === channel)
          .map((entry) => (
            <li
              key={entry.id}
              className="min-w-0 rounded-xl border border-hairline bg-surface p-4 sm:p-5"
            >
              <p className="text-xs text-muted-foreground">
                <time dateTime={entry.date}>
                  {new Intl.DateTimeFormat(
                    locale === "pt"
                      ? "pt-BR"
                      : locale === "en"
                        ? "en-US"
                        : "es",
                    { dateStyle: "medium", timeZone: "UTC" }
                  ).format(new Date(`${entry.date}T12:00:00Z`))}
                </time>
                {" · "}
                {campaignChannelLabels[entry.channel][locale]}
              </p>
              <h3 className="mt-2 font-semibold">{entry.title}</h3>
              <label className="mt-3 inline-flex min-h-11 items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={completed.includes(entry.id)}
                  disabled={!ready}
                  onChange={(event) =>
                    updateProgress(
                      event.target.checked
                        ? [...completed, entry.id]
                        : completed.filter((id) => id !== entry.id)
                    )
                  }
                  className="h-4 w-4 accent-brand"
                />
                {wording("Concluída", "Completed", "Completada")}
                <span className="sr-only">: {entry.title}</span>
              </label>
              <details className="mt-2">
                <summary className="cursor-pointer py-3 text-sm font-medium text-brand">
                  {wording(
                    "Abrir texto completo",
                    "Open full copy",
                    "Abrir texto completo"
                  )}
                </summary>
                <CopyField
                  value={entry.text}
                  label={wording(
                    "Texto para revisar e publicar",
                    "Copy to review and publish",
                    "Texto para revisar y publicar"
                  )}
                  locale={locale}
                />
                <a
                  href={entry.href}
                  className="mt-4 inline-flex min-h-11 items-center text-sm font-medium text-brand underline underline-offset-4"
                >
                  {wording(
                    "Ver recurso de destino",
                    "View target resource",
                    "Ver recurso de destino"
                  )}
                  <span className="sr-only">: {entry.title}</span>
                </a>
              </details>
            </li>
          ))}
      </ol>
    </section>
  )
}
