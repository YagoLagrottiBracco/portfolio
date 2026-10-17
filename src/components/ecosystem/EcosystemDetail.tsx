import React from "react"
import Link from "next/link"
import type { Locale } from "@/lib/i18n"
import {
  buildResourceCatalogue,
  getStudioResourceOptions,
} from "@/lib/resource-catalogue-api"
import type { ResourceCitation } from "@/lib/resource-citation"
import { ECOSYSTEM_DATE, ECOSYSTEM_VERSION } from "@/data/resources/ecosystem"
import { personalData } from "@/data/personal"
import { getAllPosts } from "@/lib/blog"
import { getResourcePath } from "@/lib/resource-routes"
import {
  getShortDestination,
  getShortResourceUrl,
  shortResourceLinks,
  resolvePublicResource,
} from "@/lib/resource-discovery"
import { getBlogBlockAnchors } from "@/lib/blog-block-anchors"
import { SITE_URL } from "@/lib/site"
import { CopyField } from "@/components/resources/ResourceActions"
import { PackageResources } from "./PackageResources"
import { StudioResources } from "./StudioResources"
import { ParticipationResources } from "./ParticipationResources"
import { CitationGenerator } from "./CitationGenerator"
import { ResourceCardBuilder, ShortLinkBuilder } from "./DiscoveryTools"

const action =
  "inline-flex min-h-11 items-center rounded-lg border border-hairline px-4 py-2 text-sm font-medium text-brand hover:bg-brand-soft"
export function EcosystemDetail({
  kind,
  locale,
}: {
  kind: string
  locale: Locale
}) {
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  const catalogue = buildResourceCatalogue(new URLSearchParams({ locale }))
  const resources = catalogue.resources.map((item) => ({
    id: item.id,
    title: item.title,
    url: item.url,
  }))
  if (
    ["terminal", "github-action", "executar", "api-bruno", "versoes"].includes(
      kind
    )
  )
    return (
      <PackageResources
        kind={
          kind as
            | "terminal"
            | "github-action"
            | "executar"
            | "api-bruno"
            | "versoes"
        }
        locale={locale}
      />
    )
  if (["cenarios", "desafios", "editor-diagramas", "colecoes"].includes(kind))
    return (
      <StudioResources
        kind={kind as "cenarios" | "desafios" | "editor-diagramas" | "colecoes"}
        locale={locale}
        resources={getStudioResourceOptions(new URLSearchParams({ locale }))}
      />
    )
  if (
    [
      "correcoes",
      "pedidos",
      "referencias",
      "contribuicoes",
      "indexnow",
    ].includes(kind)
  )
    return (
      <ParticipationResources
        kind={
          kind as
            | "correcoes"
            | "pedidos"
            | "referencias"
            | "contribuicoes"
            | "indexnow"
        }
        locale={locale}
      />
    )
  if (kind === "citacoes") {
    const items: ResourceCitation[] = [
      ...catalogue.resources.map((item) => ({
        id: item.id,
        title: item.title,
        author: personalData.name,
        url: item.url,
        publishedAt: ECOSYSTEM_DATE,
        version: ECOSYSTEM_VERSION,
        kind: "resource" as const,
      })),
      ...getAllPosts(locale).map((post) => ({
        id: "blog/" + post.slug,
        title: post.title,
        author: personalData.name,
        url: SITE_URL + post.url,
        publishedAt: post.date,
        updatedAt: post.updatedAt,
        kind: "article" as const,
      })),
    ]
    return <CitationGenerator items={items} locale={locale} />
  }
  if (kind === "cartoes")
    return <ResourceCardBuilder resources={resources} locale={locale} />
  if (kind === "links-qr")
    return (
      <ShortLinkBuilder
        locale={locale}
        links={shortResourceLinks.map((item) => ({
          code: item.code,
          title: resolvePublicResource(item.resource, locale).entry.title[
            locale
          ],
          url: getShortResourceUrl(item.code, locale),
          destination: getShortDestination(item.code, locale),
        }))}
      />
    )
  if (kind === "catalogo-api")
    return (
      <section className="mt-8 space-y-5 rounded-2xl border border-hairline bg-surface p-5 sm:p-7">
        <h2 className="text-2xl font-semibold">
          {copy(
            "Metadados públicos para integrar",
            "Public metadata for integrations",
            "Metadatos públicos para integrar"
          )}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {copy(
            "A API entrega títulos, descrições, idiomas, links canônicos, licenças e downloads. Aceita um idioma e uma coleção por requisição; dados privados e rascunhos ficam fora do catálogo.",
            "The API supplies titles, descriptions, languages, canonical links, licenses and downloads. It accepts one language and section per request; private data and drafts are excluded.",
            "La API ofrece títulos, descripciones, idiomas, enlaces canónicos, licencias y descargas. Acepta un idioma y una colección por solicitud; los datos privados y borradores quedan fuera."
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <a className={action} href={"/api/resources/v1?locale=" + locale}>
            JSON v1
          </a>
          <a
            className={action}
            href="/api/resources/v1/schema"
            download="resource-catalogue.schema.json"
          >
            JSON Schema
          </a>
        </div>
        <CopyField
          label={copy(
            "Exemplo com filtro",
            "Filtered example",
            "Ejemplo con filtro"
          )}
          locale={locale}
          value={`curl '${SITE_URL}/api/resources/v1?locale=${locale}&section=templates'`}
        />
        <p className="text-sm text-muted-foreground">
          {copy(
            "JSON UTF-8 · CORS público somente leitura · ETag e cache · filtro inválido: HTTP 400.",
            "UTF-8 JSON · public read-only CORS · ETag and cache · invalid filter: HTTP 400.",
            "JSON UTF-8 · CORS público de solo lectura · ETag y caché · filtro inválido: HTTP 400."
          )}
        </p>
      </section>
    )
  if (kind === "feeds")
    return (
      <section className="mt-8 space-y-5 rounded-2xl border border-hairline bg-surface p-5 sm:p-7">
        <h2 className="text-2xl font-semibold">
          RSS ·{" "}
          {copy(
            "Lançamentos dos recursos",
            "Resource releases",
            "Lanzamientos de recursos"
          )}
        </h2>
        <p className="text-sm text-muted-foreground">
          {copy(
            "Copie o endereço para seu leitor RSS. Cada item identifica material, versão, idioma e data real de publicação; os filtros usam IDs do catálogo público.",
            "Copy the address into your RSS reader. Each item identifies its material, version, language and actual publication date; filters use public catalogue IDs.",
            "Copia la dirección en tu lector RSS. Cada entrada identifica material, versión, idioma y fecha real de publicación; los filtros usan IDs del catálogo público."
          )}
        </p>
        <CopyField
          label={copy(
            "Todos os recursos",
            "All resources",
            "Todos los recursos"
          )}
          value={SITE_URL + getResourcePath(locale) + "/feed.xml"}
          locale={locale}
        />
        <CopyField
          label={copy("Uma coleção", "One collection", "Una colección")}
          value={
            SITE_URL + getResourcePath(locale) + "/feed.xml?section=templates"
          }
          locale={locale}
        />
        <CopyField
          label={copy("Um material", "One material", "Un material")}
          value={
            SITE_URL +
            getResourcePath(locale) +
            "/feed.xml?resource=templates%2Fworker"
          }
          locale={locale}
        />
        <a className={action} href={getResourcePath(locale) + "/feed.xml"}>
          {copy("Abrir feed", "Open feed", "Abrir feed")}
        </a>
      </section>
    )
  if (kind === "trechos") {
    const post = getAllPosts(locale)[0],
      anchor = post ? getBlogBlockAnchors(post.content)[0] : undefined
    return (
      <section className="mt-8 space-y-5 rounded-2xl border border-hairline bg-surface p-5 sm:p-7">
        <h2 className="text-2xl font-semibold">
          {copy(
            "Aponte para o parágrafo ou código",
            "Point to the paragraph or code",
            "Apunta al párrafo o código"
          )}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {copy(
            "Os parágrafos e blocos de código dos artigos têm links derivados de seu conteúdo. Inserir outro trecho antes deles preserva esses endereços. Alterar o próprio texto pode mudar o identificador. Repetições recebem um sufixo.",
            "Article paragraphs and code blocks have content-derived links. Inserting another passage before them preserves those addresses. Changing the passage itself may change its identifier. Repetitions receive a suffix.",
            "Los párrafos y bloques de código tienen enlaces derivados de su contenido. Insertar otro fragmento antes conserva sus direcciones. Modificar el propio texto puede cambiar su identificador. Las repeticiones reciben un sufijo."
          )}
        </p>
        {post && anchor && (
          <>
            <Link className={action} href={post.url + "#" + anchor.id}>
              {copy(
                "Abrir um trecho real",
                "Open a real passage",
                "Abrir un fragmento real"
              )}
            </Link>
            <blockquote className="border-l-2 border-brand pl-4 text-sm text-muted-foreground">
              {anchor.text.slice(0, 280)}
            </blockquote>
            <CopyField
              label={copy(
                "Link permanente do exemplo",
                "Example permalink",
                "Enlace permanente del ejemplo"
              )}
              locale={locale}
              value={SITE_URL + post.url + "#" + anchor.id}
            />
          </>
        )}
      </section>
    )
  }
  return null
}
