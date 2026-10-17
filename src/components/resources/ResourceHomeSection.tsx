import Link from "next/link"
import { ArrowUpRight, Code2, FlaskConical, Layers3 } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { getResourcePath } from "@/lib/resource-routes"
import { resourceHeading, resourceDescription } from "@/lib/resource-metadata"

export function ResourceHomeSection({ locale }: { locale: Locale }) {
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  return (
    <section
      id="resources"
      className="border-y border-hairline bg-surface py-20"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            {copy(
              "Experimente. Reutilize. Compartilhe.",
              "Explore. Reuse. Share.",
              "Explora. Reutiliza. Comparte."
            )}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {resourceHeading[locale]}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            {resourceDescription[locale]}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                section: "ferramentas",
                Icon: Code2,
                title: copy(
                  "Ferramentas no navegador",
                  "Browser tools",
                  "Herramientas en el navegador"
                ),
                text: copy(
                  "Compare eventos JSON e chaves de ambiente.",
                  "Compare JSON events and environment keys.",
                  "Compara eventos JSON y claves de entorno."
                ),
              },
              {
                section: "demos",
                Icon: FlaskConical,
                title: copy(
                  "Arquitetura em ação",
                  "Architecture in action",
                  "Arquitectura en acción"
                ),
                text: copy(
                  "Gere uma sobrecarga e recupere uma fila.",
                  "Create overload and recover a queue.",
                  "Genera sobrecarga y recupera una cola."
                ),
              },
              {
                section: "templates",
                Icon: Layers3,
                title: copy(
                  "Código para levar",
                  "Code to take away",
                  "Código para llevar"
                ),
                text: copy(
                  "Um worker testado e um ADR para adaptar.",
                  "A tested worker and an ADR to adapt.",
                  "Un worker probado y un ADR para adaptar."
                ),
              },
            ].map(({ section, Icon, title, text }) => (
              <Link
                key={section}
                href={getResourcePath(locale, section)}
                className="group rounded-2xl border border-hairline bg-background p-6 transition-colors hover:border-brand/50"
              >
                <Icon className="h-6 w-6 text-brand" aria-hidden="true" />
                <h3 className="mt-5 font-semibold group-hover:text-brand">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </Link>
            ))}
          </div>
          <Link
            className="mt-7 inline-flex min-h-11 items-center gap-2 font-semibold text-brand"
            href={getResourcePath(locale)}
          >
            {copy(
              "Explorar todos os recursos",
              "Explore all resources",
              "Explorar todos los recursos"
            )}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
