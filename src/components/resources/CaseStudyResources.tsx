import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import type { Locale } from "@/lib/i18n"
import { projectDemos } from "@/data/resources/project-demos"
import { getResourcePath } from "@/lib/resource-routes"

export function CaseStudyResources({
  slug,
  locale,
}: {
  slug: string
  locale: Locale
}) {
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  const queue = ["vmageste", "pulsewatch"].includes(slug)
  const json = ["eurologado", "devagent"].includes(slug)
  const links = [
    ...projectDemos
      .filter((demo) => demo.projectSlug === slug)
      .map((demo) => ({
        section: "demos",
        slug: demo.slug,
        title: copy(
          "Experimente o produto real",
          "Try the real product",
          "Prueba el producto real"
        ),
      })),
    {
      section: "diagramas",
      slug,
      title: copy(
        "Diagrama para baixar",
        "Downloadable diagram",
        "Diagrama para descargar"
      ),
    },
    {
      section: "carrosseis",
      slug,
      title: copy(
        "Apresentação em 5 slides",
        "Five-slide presentation",
        "Presentación de 5 diapositivas"
      ),
    },
    {
      section: "curadoria",
      slug,
      title: copy(
        "Resumo para newsletters",
        "Newsletter summary",
        "Resumen para newsletters"
      ),
    },
    ...(queue || json
      ? [
          {
            section: "videos",
            slug: queue ? "queue" : "json",
            title: copy(
              "Vídeo da demonstração",
              "Demo video",
              "Vídeo de demostración"
            ),
          },
          {
            section: queue ? "demos" : "ferramentas",
            slug: queue ? "queue" : "json",
            title: copy(
              "Experimente no navegador",
              "Try it in your browser",
              "Pruébalo en el navegador"
            ),
          },
        ]
      : []),
    ...(slug === "envrune"
      ? [
          {
            section: "ferramentas",
            slug: "env",
            title: copy(
              "Revise chaves .env",
              "Check .env keys",
              "Revisa claves .env"
            ),
          },
        ]
      : []),
  ]
  return (
    <section className="mt-16 rounded-2xl border border-hairline bg-surface p-6">
      <h2 className="text-xl font-semibold">
        {copy(
          "Explore e leve para seu time",
          "Explore and bring to your team",
          "Explora y lleva a tu equipo"
        )}
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.section}
            href={getResourcePath(locale, link.section, link.slug)}
            className="flex min-h-12 items-center justify-between gap-3 rounded-lg border border-hairline bg-background px-4 py-3 text-sm font-medium text-brand hover:border-brand/50"
          >
            {link.title}
            <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  )
}
