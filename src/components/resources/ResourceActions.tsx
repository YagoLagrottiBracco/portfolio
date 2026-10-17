"use client"

import React, { useState } from "react"
import type { Locale } from "@/lib/i18n"
import {
  buildCommunityIssueUrl,
  buildCollaborationIssueUrl,
  validateCommunitySubmission,
} from "@/lib/resource-community"
import { buildProposalMailto } from "@/lib/resource-tools"

export function CopyField({
  value,
  label,
  locale,
}: {
  value: string
  label: string
  locale: Locale
}) {
  const [status, setStatus] = useState("")
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  return (
    <div className="mt-5">
      <label className="block text-sm font-medium">
        {label}
        <textarea
          readOnly
          rows={3}
          value={value}
          onFocus={(e) => e.target.select()}
          className="mt-2 w-full rounded-xl border border-hairline bg-background p-3 font-mono text-xs leading-relaxed"
        />
      </label>
      <button
        type="button"
        className="mt-2 min-h-11 rounded-lg border border-hairline px-4 text-sm hover:bg-surface"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value)
            setStatus(copy("Copiado.", "Copied.", "Copiado."))
          } catch {
            setStatus(
              copy(
                "Selecione o campo e copie manualmente.",
                "Select the field and copy manually.",
                "Selecciona el campo y copia manualmente."
              )
            )
          }
        }}
      >
        {copy("Copiar", "Copy", "Copiar")}
      </button>
      <span className="ml-3 text-sm" role="status">
        {status}
      </span>
    </div>
  )
}
export function ProposalForm({
  kind,
  locale,
  title,
}: {
  kind: string
  locale: Locale
  title: string
}) {
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  const [name, setName] = useState(""),
    [url, setUrl] = useState(""),
    [body, setBody] = useState(""),
    [consent, setConsent] = useState(false)
  const [draft, setDraft] = useState<string | null>(null)
  const [githubDraft, setGithubDraft] = useState<string | null>(null)
  const [proposalJson, setProposalJson] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [resource, setResource] = useState("/recursos/templates/worker")
  const resetDraft = () => {
    setDraft(null)
    setGithubDraft(null)
    setProposalJson(null)
    setError("")
  }
  const community = kind === "comunidade"
  return (
    <section className="mt-12 rounded-2xl border border-brand/30 bg-brand-soft p-5 sm:p-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {copy(
          "Prepare uma proposta para revisar por e-mail ou no GitHub. Nada é enviado automaticamente. Publicação, autorização e créditos passam por revisão antes de aparecer no site.",
          "Prepare a proposal to review by email or on GitHub. Nothing is sent automatically. Publication, permission and credits are reviewed before appearing on the site.",
          "Prepara una propuesta para revisar por correo o en GitHub. Nada se envía automáticamente. Publicación, autorización y créditos se revisan antes de aparecer en el sitio."
        )}
      </p>
      <form
        className="mt-6 grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          setError("")
          if (community) {
            try {
              const slug =
                name
                  .normalize("NFKD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-|-$/g, "")
                  .slice(0, 60)
                  .replace(/-$/, "") || "aplicacao"
              const proposal = validateCommunitySubmission({
                slug: `uso-${slug}`,
                title: {
                  pt: `Aplicação de ${name}`,
                  en: `Application by ${name}`,
                  es: `Aplicación de ${name}`,
                },
                description: { pt: body, en: body, es: body },
                authorName: name,
                authorUrl: url,
                demoUrl: url,
                resourcePath: resource,
                consent,
              })
              setGithubDraft(buildCommunityIssueUrl(proposal))
              setProposalJson(JSON.stringify(proposal, null, 2))
            } catch {
              setError(
                copy(
                  "Use um link público HTTPS e uma descrição com 20 a 1.500 caracteres. Confirme a autorização.",
                  "Use a public HTTPS link and a description of 20–1,500 characters. Confirm permission.",
                  "Usa un enlace público HTTPS y una descripción de 20 a 1.500 caracteres. Confirma el permiso."
                )
              )
              return
            }
          } else if (kind === "colaboracoes")
            setGithubDraft(buildCollaborationIssueUrl(name, url, body))
          setDraft(
            buildProposalMailto(
              kind,
              name,
              url,
              `${body}\n\n${community ? copy("Autorizo a revisão do material e a publicação do meu nome, link e descrição enviados, caso a proposta seja aceita.", "I authorize reviewing this material and publishing my submitted name, link and description if accepted.", "Autorizo revisar el material y publicar mi nombre, enlace y descripción enviados si se acepta.") : ""}`
            )
          )
        }}
      >
        <label className="text-sm font-medium">
          {copy(
            "Seu nome e crédito desejado",
            "Your name and preferred credit",
            "Tu nombre y crédito deseado"
          )}
          <input
            required
            maxLength={community ? 100 : 120}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              resetDraft()
            }}
            className="blog-admin-input mt-2"
          />
        </label>
        <label className="text-sm font-medium">
          {copy(
            "Link público do material ou perfil",
            "Public material or profile URL",
            "URL pública del material o perfil"
          )}
          <input
            required
            type="url"
            maxLength={1000}
            placeholder="https://"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value)
              resetDraft()
            }}
            className="blog-admin-input mt-2"
          />
        </label>
        <label className="text-sm font-medium">
          {copy(
            "Proposta, recurso usado e contexto",
            "Proposal, resource used and context",
            "Propuesta, recurso usado y contexto"
          )}
          <textarea
            required
            rows={5}
            minLength={community ? 20 : undefined}
            maxLength={community ? 1500 : 2500}
            value={body}
            onChange={(e) => {
              setBody(e.target.value)
              resetDraft()
            }}
            className="blog-admin-input mt-2"
          />
        </label>
        {community && (
          <label className="text-sm font-medium">
            {copy("Recurso usado", "Resource used", "Recurso usado")}
            <select
              className="blog-admin-input mt-2"
              value={resource}
              onChange={(event) => {
                setResource(event.target.value)
                resetDraft()
              }}
            >
              <option value="/recursos/templates/worker">Worker starter</option>
              <option value="/recursos/templates/adr">ADR</option>
              <option value="/recursos/ferramentas/json">JSON</option>
              <option value="/recursos/ferramentas/env">.env</option>
              <option value="/recursos/demos/queue">Queue</option>
            </select>
          </label>
        )}
        {community && (
          <label className="flex items-start gap-3 text-sm">
            <input
              required
              type="checkbox"
              checked={consent}
              onChange={(e) => {
                setConsent(e.target.checked)
                resetDraft()
              }}
              className="mt-1"
            />
            <span>
              {copy(
                "Sou responsável pelo material e autorizo a revisão e a publicação dos dados enviados se a entrada for aceita. Não incluirei dados pessoais de terceiros ou informações confidenciais.",
                "I am responsible for the material and authorize review and publication of submitted details if accepted. I will not include other people's personal data or confidential information.",
                "Soy responsable del material y autorizo revisión y publicación de los datos enviados si se acepta. No incluiré datos personales de terceros ni información confidencial."
              )}
            </span>
          </label>
        )}
        <button
          type="submit"
          className="min-h-11 justify-self-start rounded-lg bg-brand px-5 py-2 font-semibold text-brand-contrast"
        >
          {copy("Preparar rascunho", "Prepare draft", "Preparar borrador")}
        </button>
      </form>
      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
      {draft && (
        <div className="mt-5" role="status">
          <p className="mb-3 text-sm">
            {copy(
              "Rascunho pronto. Revise o conteúdo antes de enviar pelo seu aplicativo.",
              "Draft ready. Review it before sending from your email app.",
              "Borrador listo. Revísalo antes de enviarlo desde tu aplicación."
            )}
          </p>
          <a
            href={draft}
            data-testid="proposal-draft"
            className="inline-flex min-h-11 items-center rounded-lg border border-brand px-5 font-semibold text-brand"
          >
            {copy(
              "Abrir rascunho de e-mail",
              "Open email draft",
              "Abrir borrador de correo"
            )}
          </a>
          {githubDraft && (
            <div className="mt-5">
              <a
                href={githubDraft}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="github-proposal-draft"
                className="inline-flex min-h-11 items-center rounded-lg border border-brand px-5 font-semibold text-brand"
              >
                {copy(
                  "Abrir proposta pública no GitHub",
                  "Open public proposal on GitHub",
                  "Abrir propuesta pública en GitHub"
                )}
              </a>
              <p className="mt-3 text-sm text-muted-foreground">
                {copy(
                  "A proposta ficará pública apenas se você a enviar no GitHub. Cole o JSON baixado se o campo não estiver preenchido. O mantenedor revisa a autoria e a autorização antes de publicar na galeria.",
                  "The proposal becomes public only if you submit it on GitHub. Paste the downloaded JSON if the field is not prefilled. The maintainer reviews authorship and permission before publishing in the gallery.",
                  "La propuesta solo será pública si la envías en GitHub. Pega el JSON descargado si el campo está vacío. El responsable revisa autoría y permiso antes de publicar en la galería."
                )}
              </p>
            </div>
          )}
          {proposalJson && (
            <a
              className="mt-4 inline-flex min-h-11 items-center text-brand underline"
              download="community-proposal.json"
              href={`data:application/json;charset=utf-8,${encodeURIComponent(proposalJson)}`}
            >
              {copy(
                "Baixar proposta em JSON",
                "Download JSON proposal",
                "Descargar propuesta JSON"
              )}
            </a>
          )}
          <CopyField
            value={decodeURIComponent(draft.slice(draft.indexOf("&body=") + 6))}
            label={copy(
              "Texto do rascunho",
              "Draft text",
              "Texto del borrador"
            )}
            locale={locale}
          />
        </div>
      )}
    </section>
  )
}
