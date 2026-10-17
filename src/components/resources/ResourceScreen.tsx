import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  Terminal,
  Sparkles,
} from "lucide-react"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { ReactNode } from "react"

import { Navigation } from "@/components/organisms/Navigation"
import { Footer } from "@/components/organisms/Footer"
import { ArchitectureFlow } from "@/components/molecules/ArchitectureFlow"
import { LiveProjectDemo } from "./LiveProjectDemo"
import { ContributionTasks } from "./ContributionTasks"
import { CampaignPlanner } from "./CampaignPlanner"
import { projectDemos } from "@/data/resources/project-demos"
import communityEntries from "@/data/resources/community.json"
import type { ApprovedCommunityEntry } from "@/lib/resource-community"
import { ResourceTools } from "./ResourceTools"
import { CopyField, ProposalForm } from "./ResourceActions"
import { publicRepositoryUrls } from "@/data/resources/repositories"
import { personalData } from "@/data/personal"
import { videoSteps } from "@/data/resources/video-transcripts"
import { getAllPosts } from "@/lib/blog"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import {
  getResourceEntries,
  getResourceEntry,
  resourceSections,
  type ResourceEntry,
} from "@/lib/resource-catalog"
import { getResourcePath, getEmbedPath } from "@/lib/resource-routes"
import { resourceHeading, resourceDescription } from "@/lib/resource-metadata"
import { getCaseStudyBySlug } from "@/lib/projects"
import type { Locale } from "@/lib/i18n"
import { SITE_URL } from "@/lib/site"

const linkClass =
  "inline-flex min-h-11 items-center gap-2 rounded-lg border border-hairline px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand-soft"
const downloadHref = (file: string, locale: Locale) =>
  `/recursos/downloads/${["worker-starter.zip", "json-clone.csv", "json-clone.json", "benchmark-json.mjs"].includes(file) ? "" : `${locale}/`}${file}`
const pick = (locale: Locale) => (pt: string, en: string, es: string) =>
  ({ pt, en, es })[locale]

export function ResourceScreen({
  locale,
  segments = [],
}: {
  locale: Locale
  segments?: string[]
}) {
  const [section, slug] = segments
  const collection = resourceSections.find((s) => s.slug === section)
  const entry = section && slug ? getResourceEntry(section, slug) : undefined
  if (segments.length > 2 || (section && !collection) || (slug && !entry))
    notFound()
  const copy = pick(locale)
  const title =
    entry?.title[locale] ?? collection?.title[locale] ?? resourceHeading[locale]
  const description =
    entry?.description[locale] ??
    collection?.description[locale] ??
    resourceDescription[locale]
  return (
    <div className="min-h-screen">
      <Navigation />
      <main id="main" className="pb-24 pt-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <nav
              aria-label={copy(
                "Caminho da página",
                "Breadcrumb",
                "Ruta de navegación"
              )}
              className="mb-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"
            >
              <Link
                href={getResourcePath(locale)}
                className="inline-flex min-h-11 items-center gap-2 hover:text-brand"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {copy("Recursos", "Resources", "Recursos")}
              </Link>
              {collection && (
                <>
                  <span aria-hidden="true">/</span>
                  <Link
                    href={getResourcePath(locale, section)}
                    className="hover:text-brand"
                  >
                    {collection.title[locale]}
                  </Link>
                </>
              )}
              {entry && (
                <>
                  <span aria-hidden="true">/</span>
                  <span aria-current="page">{entry.title[locale]}</span>
                </>
              )}
            </nav>
            <header className="rise-in max-w-4xl">
              <p className="font-mono text-xs uppercase tracking-[.2em] text-brand">
                {section
                  ? copy(
                      "Engenharia / Recursos abertos",
                      "Engineering / Open resources",
                      "Ingeniería / Recursos abiertos"
                    )
                  : `Yago Lagrotti Bracco / ${copy("Recursos abertos", "Open resources", "Recursos abiertos")}`}
              </p>
              <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                {description}
              </p>
            </header>
            {!section && <ResourceIndex locale={locale} />}
            {collection && !entry && (
              <>
                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {getResourceEntries(collection.slug).map((item) => (
                    <ResourceCard
                      key={item.slug}
                      entry={item}
                      href={getResourcePath(locale, collection.slug, item.slug)}
                      locale={locale}
                    />
                  ))}
                </div>
                {collection.slug === "comunidade" &&
                  communityEntries.length === 0 && (
                    <p className="mt-6 text-sm text-muted-foreground">
                      {copy(
                        "Ainda não há aplicações externas publicadas. Os exemplos estão identificados como materiais do autor.",
                        "No external applications have been published yet. Examples are identified as author materials.",
                        "Todavía no hay aplicaciones externas publicadas. Los ejemplos se identifican como materiales del autor."
                      )}
                    </p>
                  )}
              </>
            )}
            {entry && section && (
              <ResourceDetail entry={entry} section={section} locale={locale} />
            )}
            {section &&
              !entry &&
              ["colaboracoes", "comunidade", "palestras"].includes(section) && (
                <ProposalForm
                  kind={section}
                  locale={locale}
                  title={copy(
                    "Prepare sua proposta",
                    "Prepare your proposal",
                    "Prepara tu propuesta"
                  )}
                />
              )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
function ResourceIndex({ locale }: { locale: Locale }) {
  const copy = pick(locale)
  return (
    <>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link
          href={getResourcePath(locale, "campanhas", "kit-engenharia")}
          className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand px-5 font-semibold text-brand-contrast"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {copy(
            "Comece pelo kit de engenharia",
            "Start with the engineering kit",
            "Empieza por el kit de ingeniería"
          )}
        </Link>
        <Link
          href={getResourcePath(locale, "demos", "queue")}
          className={linkClass}
        >
          <Terminal className="h-4 w-4" aria-hidden="true" />
          {copy("Experimente uma fila", "Try a queue", "Prueba una cola")}
        </Link>
      </div>
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resourceSections.map((section, index) => (
          <Link
            key={section.slug}
            data-resource-section={section.slug}
            href={getResourcePath(locale, section.slug)}
            className="group flex flex-col rounded-2xl border border-hairline bg-surface p-6 transition-colors hover:border-brand/50 hover:bg-surface-hover"
          >
            <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <ArrowUpRight className="h-4 w-4 text-brand" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-semibold group-hover:text-brand">
              {section.title[locale]}
            </h2>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
              {section.description[locale]}
            </p>
            <p className="mt-5 text-xs text-muted-foreground">
              {getResourceEntries(section.slug).length}{" "}
              {getResourceEntries(section.slug).length === 1
                ? copy("recurso", "resource", "recurso")
                : copy("recursos", "resources", "recursos")}
            </p>
          </Link>
        ))}
      </div>
    </>
  )
}
function ResourceCard({
  entry,
  href,
  locale,
}: {
  entry: ResourceEntry
  href: string
  locale: Locale
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-hairline bg-surface p-6 transition-colors hover:border-brand/50"
    >
      <h2 className="text-xl font-semibold group-hover:text-brand">
        {entry.title[locale]}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {entry.description[locale]}
      </p>
      {entry.date && (
        <time
          dateTime={entry.date}
          className="mt-4 text-xs text-muted-foreground"
        >
          {entry.date}
        </time>
      )}
      <ArrowUpRight className="mt-5 h-4 w-4 text-brand" aria-hidden="true" />
    </Link>
  )
}
function ResourceDetail({
  entry,
  section,
  locale,
}: {
  entry: ResourceEntry
  section: string
  locale: Locale
}) {
  const copy = pick(locale)
  const project = getCaseStudyBySlug(entry.slug)
  const isCaseAsset = ["diagramas", "carrosseis", "curadoria"].includes(section)
  return (
    <div className="mt-10 space-y-10">
      {entry.date && (
        <time dateTime={entry.date} className="text-sm text-muted-foreground">
          {entry.date}
        </time>
      )}
      {entry.tool && section !== "incorporar" && (
        <ResourceTools tool={entry.tool} locale={locale} />
      )}
      {entry.download && (
        <DownloadLink href={downloadHref(entry.download, locale)}>
          {copy("Baixar", "Download", "Descargar")} {entry.download}
        </DownloadLink>
      )}
      {entry.blocks?.map((block, index) => (
        <section className="max-w-3xl" key={index}>
          <h2 className="text-2xl font-semibold tracking-tight">
            {block.title[locale]}
          </h2>
          <p className="mt-4 whitespace-pre-line text-base leading-8 text-muted-foreground">
            {block.body[locale]}
          </p>
        </section>
      ))}
      {section === "demos" &&
        projectDemos
          .filter((demo) => demo.slug === entry.slug)
          .map((demo) => (
            <LiveProjectDemo key={demo.slug} demo={demo} locale={locale} />
          ))}
      {section === "benchmarks" && <Benchmark locale={locale} />}
      {section === "diagramas" && project?.caseStudy.diagram && (
        <section>
          <h2 className="mb-5 text-2xl font-semibold">
            {copy("Fluxo documentado", "Documented flow", "Flujo documentado")}
          </h2>
          <ArchitectureFlow
            stages={project.caseStudy.diagram}
            locale={locale}
            label={entry.title[locale]}
          />
          <div className="mt-7 rounded-xl border border-hairline bg-surface p-3">
            <Image
              src={`/recursos/diagramas/${locale}/${entry.slug}.svg`}
              alt={`${copy("Diagrama de arquitetura", "Architecture diagram", "Diagrama de arquitectura")}: ${entry.title[locale]}`}
              width={1440}
              height={900}
              unoptimized
              className="h-auto w-full rounded-lg"
            />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <DownloadLink
              href={`/recursos/diagramas/${locale}/${entry.slug}.svg`}
            >
              SVG
            </DownloadLink>
            <DownloadLink
              href={`/recursos/diagramas/${locale}/${entry.slug}.png`}
            >
              PNG
            </DownloadLink>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {copy(
              "Diagrama autoral baseado no estudo de caso; não é documentação operacional completa do cliente.",
              "Author diagram based on the case study; not complete client operational documentation.",
              "Diagrama del autor basado en el caso; no es documentación operativa completa del cliente."
            )}
          </p>
        </section>
      )}
      {section === "carrosseis" && project && (
        <section>
          <DownloadLink
            href={`/recursos/carrosseis/${locale}/${entry.slug}.zip`}
          >
            {copy(
              "Baixar 5 slides em PNG",
              "Download 5 PNG slides",
              "Descargar 5 diapositivas PNG"
            )}
          </DownloadLink>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <li key={n}>
                <Image
                  src={`/recursos/carrosseis/${locale}/${entry.slug}-${n}.png`}
                  alt={`${entry.title[locale]} — ${copy("slide", "slide", "diapositiva")} ${n}/5`}
                  width={1080}
                  height={1350}
                  className="h-auto w-full rounded-xl border border-hairline"
                />
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted-foreground">
            {copy(
              "Sequência: problema, restrições, decisão, solução e aprendizado. O pacote inclui texto alternativo e links de referência.",
              "Sequence: problem, constraints, decision, solution and lesson. The pack includes alternative text and reference links.",
              "Secuencia: problema, restricciones, decisión, solución y aprendizaje. El paquete incluye texto alternativo y referencias."
            )}
          </p>
        </section>
      )}
      {section === "curadoria" && project && (
        <section className="max-w-3xl">
          <Image
            src={project.image}
            width={1200}
            height={675}
            alt={project.title[locale]}
            className="h-auto w-full rounded-xl border border-hairline"
          />
          <CopyField
            locale={locale}
            label={copy(
              "Resumo editorial",
              "Editorial summary",
              "Resumen editorial"
            )}
            value={`${project.title[locale]}: ${project.description[locale]}\n\n${SITE_URL}${getCaseStudyPath(locale, project.slug)}\n\n${personalData.name} — ${SITE_URL}`}
          />
          <div className="mt-5">
            <DownloadLink
              href={`/recursos/curadoria/${locale}/${entry.slug}.zip`}
            >
              {copy(
                "Baixar resumo, imagem e créditos",
                "Download summary, image and credits",
                "Descargar resumen, imagen y créditos"
              )}
            </DownloadLink>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {copy(
              "A imagem do projeto pode ilustrar a recomendação deste estudo de caso, com crédito. Marcas e interfaces de clientes mantêm seus respectivos direitos.",
              "The project image may illustrate a recommendation of this case study, with credit. Client brands and interfaces retain their respective rights.",
              "La imagen puede ilustrar una recomendación de este caso, con crédito. Marcas e interfaces de clientes conservan sus derechos."
            )}
          </p>
        </section>
      )}
      {section === "videos" &&
        (entry.slug === "queue" || entry.slug === "json") && (
          <VideoDetail kind={entry.slug} locale={locale} />
        )}
      {section === "incorporar" && entry.tool && (
        <section>
          <div className="overflow-hidden rounded-xl border border-hairline">
            <iframe
              src={getEmbedPath(locale, entry.tool)}
              title={entry.title[locale]}
              className="h-[860px] w-full bg-background"
              loading="lazy"
            />
          </div>
          <CopyField
            locale={locale}
            label={copy(
              "Código de incorporação",
              "Embed code",
              "Código de integración"
            )}
            value={`<iframe src="${SITE_URL}${getEmbedPath(locale, entry.tool)}" title="${entry.title[locale]}" width="100%" height="860" loading="lazy" style="border:1px solid #ccc;border-radius:12px"></iframe>`}
          />
          <p className="mt-4 text-sm text-muted-foreground">
            {copy(
              "A ferramenta usa a licença MIT e mantém um link visível para a biblioteca. Sem acesso ao documento da página que incorpora; os dados digitados continuam locais ao iframe.",
              "The tool is MIT licensed and retains a visible library link. It does not access the embedding page document; entered data stays local to the iframe.",
              "La herramienta tiene licencia MIT y mantiene un enlace visible a la biblioteca. No accede al documento de la página anfitriona; los datos quedan locales al iframe."
            )}
          </p>
        </section>
      )}
      {section === "imprensa" && (
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-hairline bg-surface p-6">
          <Image
            src="/recursos/imprensa/yago-github.jpg"
            alt="Yago Lagrotti Bracco"
            width={160}
            height={160}
            className="rounded-xl"
          />
          <div>
            <p className="font-semibold">Yago Lagrotti Bracco</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {personalData.headline} · São Paulo, Brasil
            </p>
            <a
              className="mt-3 inline-block text-sm text-brand underline"
              href={personalData.socialLinks.linkedin}
            >
              LinkedIn
            </a>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              {copy(
                "O kit inclui biografias, foto pública do perfil, monograma e cartão de apresentação. A foto original tem 422 × 422 px e é reutilizada sem alterações.",
                "The kit includes biographies, the public profile photo, monogram and presentation card. The original photo is 422 × 422 px and is reused unchanged.",
                "El kit incluye biografías, foto pública del perfil, monograma y tarjeta. La foto original tiene 422 × 422 px y se reutiliza sin cambios."
              )}
            </p>
          </div>
        </div>
      )}
      {section === "atualizacoes" && project && (
        <p className="max-w-3xl text-sm text-muted-foreground">
          {copy(
            "Registro de decisões já descritas no estudo de caso; sem data de lançamento atribuída. Novas alterações podem ser adicionadas como entradas datadas.",
            "A record of decisions already described in the case study; no release date assigned. New changes can be added as dated entries.",
            "Registro de decisiones ya descritas en el caso; sin fecha de lanzamiento atribuida. Nuevos cambios pueden añadirse como entradas fechadas."
          )}
        </p>
      )}
      {section === "comunidade" &&
        (communityEntries as ApprovedCommunityEntry[])
          .filter((item) => item.slug === entry.slug)
          .map((item) => (
            <section
              key={item.slug}
              className="rounded-xl border border-hairline bg-surface p-6"
            >
              <h2 className="text-xl font-semibold">
                {copy(
                  "Autoria e recurso utilizado",
                  "Author and resource used",
                  "Autoría y recurso utilizado"
                )}
              </h2>
              <a
                href={item.authorUrl}
                className="mt-4 inline-flex min-h-11 items-center text-brand underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                {item.authorName}
              </a>
              <p>
                <Link href={item.resourcePath} className="text-brand underline">
                  {copy(
                    "Ver recurso original",
                    "View original resource",
                    "Ver recurso original"
                  )}
                </Link>
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {copy(
                  "Publicação autorizada; revisão em",
                  "Publication authorized; reviewed on",
                  "Publicación autorizada; revisión el"
                )}{" "}
                {item.review.reviewedAt} ·{" "}
                <a href={item.review.issueUrl} className="text-brand underline">
                  {copy(
                    "Proposta e crédito",
                    "Proposal and credit",
                    "Propuesta y crédito"
                  )}
                </a>
              </p>
            </section>
          ))}
      {section === "comunidade" && entry.slug === "worker-do-autor" && (
        <ResourceLink locale={locale} section="templates" slug="worker" />
      )}
      {["colaboracoes", "palestras", "comunidade"].includes(section) && (
        <ProposalForm
          kind={section}
          locale={locale}
          title={
            section === "palestras"
              ? copy(
                  "Convide para uma sessão",
                  "Invite me to a session",
                  "Invítame a una sesión"
                )
              : copy(
                  "Prepare sua proposta",
                  "Prepare your proposal",
                  "Prepara tu propuesta"
                )
          }
        />
      )}
      {section === "campanhas" && <CampaignPlanner locale={locale} />}
      {section === "palestras" && (
        <section className="rounded-xl border border-hairline p-6">
          <h2 className="text-xl font-semibold">
            {copy(
              "Material completo para conduzir a sessão",
              "Complete session materials",
              "Material completo para facilitar la sesión"
            )}
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <DownloadLink
              href={`/recursos/sessoes/${locale}/${entry.slug === "eventos" ? "filas-30min.md" : "arquitetura-60min.md"}`}
            >
              {copy(
                "Guia do facilitador",
                "Facilitator guide",
                "Guía del facilitador"
              )}
            </DownloadLink>
            <DownloadLink
              href={`/recursos/sessoes/${locale}/caderno-participante.md`}
            >
              {copy(
                "Caderno do participante",
                "Participant workbook",
                "Cuaderno del participante"
              )}
            </DownloadLink>
            <DownloadLink href={`/recursos/sessoes/${locale}/kit-sessoes.zip`}>
              ZIP
            </DownloadLink>
          </div>
        </section>
      )}
      {section === "campanhas" && (
        <section>
          <h2 className="text-2xl font-semibold">
            {copy("Seu percurso", "Your route", "Tu recorrido")}
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(entry.slug === "oficina-arquitetura"
              ? [
                  ["demos", "queue"],
                  ["guias", "filas"],
                  ["templates", "adr"],
                  ["laboratorio", "sobrecarga"],
                ]
              : [
                  ["ferramentas", "json"],
                  ["demos", "queue"],
                  ["templates", "worker"],
                  ["diagramas", "vmageste"],
                ]
            ).map(([s, slug]) => (
              <ResourceLink key={s} locale={locale} section={s} slug={slug} />
            ))}
          </div>
        </section>
      )}
      {section === "laboratorio" && entry.slug === "copias" && (
        <ResourceLink locale={locale} section="benchmarks" slug="json-clone" />
      )}
      {section === "guias" && entry.slug === "filas" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <ResourceLink locale={locale} section="demos" slug="queue" />
          <ResourceLink locale={locale} section="templates" slug="adr" />
        </div>
      )}
      {section === "temas" && <TopicContent entry={entry} locale={locale} />}
      {section === "incorporar" && (
        <a href="/recursos/downloads/tools-LICENSE.txt" className={linkClass}>
          {copy(
            "Licença MIT das ferramentas",
            "Tools MIT license",
            "Licencia MIT de las herramientas"
          )}
        </a>
      )}
      {entry.source && (
        <a
          className={linkClass}
          href={entry.source}
          target="_blank"
          rel="noopener noreferrer"
        >
          {section === "repositorios"
            ? copy("Abrir repositório", "Open repository", "Abrir repositorio")
            : copy(
                "Referência técnica",
                "Technical reference",
                "Referencia técnica"
              )}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      )}
      {section === "repositorios" && (
        <>
          <ContributionTasks projectSlug={entry.slug} locale={locale} />
          <RepositoryDetails entry={entry} locale={locale} />
        </>
      )}
      {isCaseAsset && (
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {copy(
            "Textos e diagramas autorais: CC BY 4.0, com crédito a Yago Lagrotti Bracco e link para o estudo de caso. Imagens de interfaces e marcas de terceiros estão excluídas dessa licença.",
            "Original text and diagrams: CC BY 4.0, credit Yago Lagrotti Bracco and link to the case study. Third-party interface images and brands are excluded from this license.",
            "Textos y diagramas originales: CC BY 4.0, con crédito a Yago Lagrotti Bracco y enlace al caso. Imágenes de interfaces y marcas de terceros quedan excluidas."
          )}{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            className="text-brand underline"
          >
            CC BY 4.0
          </a>
        </p>
      )}
      {entry.projects && section !== "repositorios" && (
        <ProjectReferences slugs={entry.projects} locale={locale} />
      )}
    </div>
  )
}
function DownloadLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a href={href} download className={linkClass}>
      <Download className="h-4 w-4" aria-hidden="true" />
      {children}
    </a>
  )
}
function ResourceLink({
  section,
  slug,
  locale,
}: {
  section: string
  slug: string
  locale: Locale
}) {
  const entry = getResourceEntry(section, slug)
  return entry ? (
    <ResourceCard
      entry={entry}
      href={getResourcePath(locale, section, slug)}
      locale={locale}
    />
  ) : null
}
function ProjectReferences({
  slugs,
  locale,
}: {
  slugs: string[]
  locale: Locale
}) {
  const copy = pick(locale)
  return (
    <section className="border-t border-hairline pt-8">
      <h2 className="text-xl font-semibold">
        {copy(
          "Evidências nos projetos",
          "Project evidence",
          "Evidencias en proyectos"
        )}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {slugs.map((slug) => {
          const project = getCaseStudyBySlug(slug)
          return project ? (
            <Link
              key={slug}
              href={getCaseStudyPath(locale, slug)}
              className={linkClass}
            >
              {project.title[locale]}
              <ArrowUpRight className="ml-auto h-4 w-4" aria-hidden="true" />
            </Link>
          ) : null
        })}
      </div>
    </section>
  )
}
function TopicContent({
  entry,
  locale,
}: {
  entry: ResourceEntry
  locale: Locale
}) {
  const copy = pick(locale)
  const keys = (entry.projects ?? [])
    .map((slug) => getCaseStudyBySlug(slug)?.caseStudy.articleKey)
    .filter(Boolean)
  const tags = entry.tags?.map((tag) => tag.toLowerCase()) ?? []
  const posts = getAllPosts(locale)
    .filter(
      (post) =>
        keys.includes(post.translationKey) ||
        post.tags.some((tag) => tags.includes(tag.toLowerCase()))
    )
    .slice(0, 8)
  const resources = [
    "guias",
    "glossario",
    "laboratorio",
    "ferramentas",
    "demos",
  ].flatMap((section) =>
    getResourceEntries(section)
      .filter((item) => item.projects?.some((p) => entry.projects?.includes(p)))
      .map((item) => ({ section, item }))
  )
  return (
    <>
      <section>
        <h2 className="text-2xl font-semibold">
          {copy(
            "Artigos selecionados",
            "Selected articles",
            "Artículos seleccionados"
          )}
        </h2>
        <ul className="mt-4 space-y-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={post.url}
                className="inline-flex min-h-11 items-center text-brand underline underline-offset-4"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
        {posts.length === 0 && (
          <p className="mt-4 text-muted-foreground">
            {copy(
              "Os estudos de caso abaixo documentam este assunto.",
              "The case studies below document this topic.",
              "Los casos siguientes documentan este tema."
            )}
          </p>
        )}
      </section>
      <section>
        <h2 className="text-2xl font-semibold">
          {copy(
            "Recursos para aprofundar",
            "Further resources",
            "Recursos para profundizar"
          )}
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map(({ section, item }) => (
            <ResourceCard
              key={`${section}/${item.slug}`}
              entry={item}
              href={getResourcePath(locale, section, item.slug)}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </>
  )
}
function Benchmark({ locale }: { locale: Locale }) {
  const copy = pick(locale)
  const data = JSON.parse(
    readFileSync(
      join(process.cwd(), "public/recursos/downloads/json-clone.json"),
      "utf8"
    )
  ) as {
    node: string
    platform: string
    arch: string
    cpu: string
    generatedAt: string
    summary: {
      size: number
      method: string
      medianMs: number
      minMs: number
      maxMs: number
    }[]
  }
  const format = (n: number) =>
    n.toLocaleString(locale, { maximumFractionDigits: 4 })
  return (
    <section>
      <h2 className="text-2xl font-semibold">
        {copy(
          "Resultado desta execução",
          "Results of this run",
          "Resultado de esta ejecución"
        )}
      </h2>
      <p className="mt-4 break-words text-sm leading-relaxed text-muted-foreground">
        Node {data.node} · {data.platform}/{data.arch} · {data.cpu}
        <br />
        <time dateTime={data.generatedAt}>{data.generatedAt}</time>
      </p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full max-w-3xl text-left text-sm">
          <caption className="sr-only">
            {copy(
              "Tempos por cópia em milissegundos",
              "Milliseconds per copy",
              "Milisegundos por copia"
            )}
          </caption>
          <thead>
            <tr className="border-b border-hairline">
              {[
                copy("Eventos", "Events", "Eventos"),
                copy("Método", "Method", "Método"),
                copy("Mediana (ms)", "Median (ms)", "Mediana (ms)"),
                "Min / Max (ms)",
              ].map((h) => (
                <th key={h} className="p-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.summary.map((row) => (
              <tr
                key={`${row.size}/${row.method}`}
                className="border-b border-hairline"
              >
                <td className="p-3">{row.size.toLocaleString(locale)}</td>
                <td className="p-3 font-mono">
                  {row.method === "json"
                    ? "JSON.parse/stringify"
                    : "structuredClone"}
                </td>
                <td className="p-3 font-mono">{format(row.medianMs)}</td>
                <td className="p-3 font-mono">
                  {format(row.minMs)} / {format(row.maxMs)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <DownloadLink href={downloadHref("benchmark-json.mjs", locale)}>
          {copy(
            "Código reproduzível",
            "Reproducible source",
            "Código reproducible"
          )}
        </DownloadLink>
        <DownloadLink href={downloadHref("json-clone.json", locale)}>
          JSON
        </DownloadLink>
      </div>
    </section>
  )
}
function VideoDetail({
  kind,
  locale,
}: {
  kind: "queue" | "json"
  locale: Locale
}) {
  const copy = pick(locale)
  return (
    <section className="max-w-4xl">
      <video
        controls
        playsInline
        preload="none"
        poster={`/recursos/videos/${locale}/${kind}-poster.png`}
        className="aspect-video w-full rounded-xl border border-hairline bg-surface"
        aria-label={copy(
          "Gravação sem áudio, com legendas",
          "Silent recording with captions",
          "Grabación sin audio, con subtítulos"
        )}
      >
        <source
          src={`/recursos/videos/${locale}/${kind}.webm`}
          type="video/webm"
        />
        <track
          default
          kind="captions"
          srcLang={locale}
          label={{ pt: "Português", en: "English", es: "Español" }[locale]}
          src={`/recursos/videos/${locale}/${kind}.vtt`}
        />
        {copy(
          "Use o link de download para assistir.",
          "Use the download link to watch.",
          "Usa el enlace de descarga para verlo."
        )}
      </video>
      <div className="mt-4 flex flex-wrap gap-3">
        <DownloadLink href={`/recursos/videos/${locale}/${kind}.webm`}>
          WebM
        </DownloadLink>
        <DownloadLink href={`/recursos/videos/${locale}/${kind}.vtt`}>
          {copy("Legendas", "Captions", "Subtítulos")} (VTT)
        </DownloadLink>
      </div>
      <h2 className="mt-8 text-xl font-semibold">
        {copy("Transcrição", "Transcript", "Transcripción")}
      </h2>
      <ol className="mt-4 space-y-3 text-muted-foreground">
        {videoSteps[kind].map((step, i) => (
          <li key={i}>
            <span className="mr-2 font-mono text-sm">
              00:{String(i * 6).padStart(2, "0")}
            </span>
            {step[locale]}
          </li>
        ))}
      </ol>
      <div className="mt-8">
        <ResourceLink
          locale={locale}
          section={kind === "queue" ? "demos" : "ferramentas"}
          slug={kind}
        />
      </div>
    </section>
  )
}
function RepositoryDetails({
  entry,
  locale,
}: {
  entry: ResourceEntry
  locale: Locale
}) {
  const copy = pick(locale),
    project = personalData.projects.find((p) => p.slug === entry.slug)
  const links =
    project?.links.filter((link) => publicRepositoryUrls.has(link.url)) ?? []
  return (
    <section className="max-w-3xl">
      <h2 className="text-2xl font-semibold">
        {copy(
          "Como começar a contribuir",
          "How to start contributing",
          "Cómo empezar a contribuir"
        )}
      </h2>
      <p className="mt-4 leading-8 text-muted-foreground">
        {copy(
          "Os links vêm do catálogo do portfólio; disponibilidade, licença e tarefas abertas devem ser conferidas em cada repositório. Leia o README e a licença, execute o projeto e proponha uma melhoria pequena de documentação ou um caso de teste com reprodução. Combine mudanças maiores com o mantenedor antes de implementar.",
          "Links come from the portfolio catalog; check availability, license and open tasks in each repository. Read the README and license, run the project and propose a small documentation improvement or a reproducible test case. Discuss larger changes with the maintainer first.",
          "Los enlaces vienen del catálogo; verifica disponibilidad, licencia y tareas en cada repositorio. Lee el README y la licencia, ejecuta el proyecto y propón una mejora pequeña de documentación o prueba reproducible. Acuerda los cambios grandes con el mantenedor antes de implementarlos."
        )}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {links.map((link) => (
          <a
            key={link.url}
            href={link.url}
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label[locale]}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        ))}
      </div>
      <a
        href={`${entry.source}#readme`}
        className="mt-4 inline-flex min-h-11 items-center text-brand underline"
      >
        {copy("Ler o README", "Read the README", "Leer el README")}
      </a>
      <div className="mt-6">
        <ProjectReferences slugs={[entry.slug]} locale={locale} />
      </div>
    </section>
  )
}
