import React from "react"
import type { Locale } from "@/lib/i18n"
import { getContributionTasks, contributionVerifiedOn } from "@/data/resources/contribution-tasks"
import { tr } from "@/data/resources/types"

export interface ContributionTasksProps {
  projectSlug: string
  locale: Locale
}

/** Server-rendered proposals. Following a draft URL never submits an issue. */
export function ContributionTasks({ projectSlug, locale }: ContributionTasksProps) {
  const tasks = getContributionTasks(projectSlug)
  if (tasks.length === 0) return null
  const copy = (pt: string, en: string, es: string) => tr(pt, en, es)[locale]
  return (
    <section className="mt-8 space-y-5" aria-labelledby={`contributions-${projectSlug}`}>
      <div>
        <h2 id={`contributions-${projectSlug}`} className="text-xl font-semibold">
          {copy("Tarefas de contribuição", "Contribution tasks", "Tareas de contribución")}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {copy(
            "Propostas baseadas em leitura do código, ainda sem aprovação da manutenção. Confira a versão atual e as issues antes de enviar. O link abre um rascunho: você revisa e decide se publica.",
            "Proposals based on source inspection, awaiting maintainer review. Check the current version and existing issues before submitting. The link opens a draft: you review it and decide whether to publish.",
            "Propuestas basadas en la revisión del código, pendientes de revisión de mantenimiento. Comprueba la versión actual y las issues antes de enviar. El enlace abre un borrador: tú lo revisas y decides si publicarlo.",
          )}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          {copy("Código inspecionado em", "Source inspected on", "Código revisado el")}{" "}
          <time dateTime={contributionVerifiedOn}>{contributionVerifiedOn}</time>
        </p>
      </div>
      {tasks.map((task) => (
        <article key={task.id} className="rounded-2xl border border-hairline bg-surface p-5 sm:p-6">
          <h3 className="text-lg font-semibold">{task.title[locale]}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{task.evidence[locale]}</p>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="font-medium">{copy("Tamanho estimado", "Estimated size", "Tamaño estimado")}</dt>
              <dd className="text-muted-foreground">{task.size} · {task.estimate[locale]}</dd>
            </div>
            <div>
              <dt className="font-medium">{copy("Conhecimentos", "Skills", "Conocimientos")}</dt>
              <dd className="text-muted-foreground">{task.skills.join(" · ")}</dd>
            </div>
          </dl>
          <h4 className="mt-5 text-sm font-semibold">{copy("Arquivos e evidências", "Files and evidence", "Archivos y evidencias")}</h4>
          <ul className="mt-2 space-y-3 text-sm">
            {task.sources.map((source) => (
              <li key={source.url} className="min-w-0">
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="break-words text-brand underline underline-offset-4">
                  {source.repository}/{source.path}
                </a>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {source.role === "target" ? copy("Arquivo a alterar", "Target file", "Archivo que modificar") : copy("Contexto", "Context", "Contexto")}
                  {" · "}<code>{source.commit.slice(0, 12)}</code>{" · "}L{source.startLine}–L{source.endLine}
                </span>
              </li>
            ))}
          </ul>
          <h4 className="mt-5 text-sm font-semibold">{copy("Critérios de aceite, passo a passo", "Step-by-step acceptance criteria", "Criterios de aceptación, paso a paso")}</h4>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {task.acceptanceCriteria.map((criterion, index) => <li key={index}>{criterion[locale]}</li>)}
          </ol>
          <a href={task.issueDraftUrls[locale]} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-brand/40 px-4 py-2 text-sm font-medium text-brand hover:border-brand">
            {copy("Revisar rascunho no GitHub", "Review draft on GitHub", "Revisar borrador en GitHub")}
          </a>
        </article>
      ))}
    </section>
  )
}
