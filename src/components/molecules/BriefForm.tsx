"use client"

/**
 * @file BriefForm.tsx
 * @description "Rather write than book a call?": a short brief that reaches
 * Yago's inbox with where the person came from (see `src/lib/brief.ts`).
 */
import React, { useState, type FormEvent } from "react"
import Link from "next/link"
import { Send } from "lucide-react"

import { Checkbox, Field, Honeypot, inputClass, StatusMessages } from "@/components/molecules/form-controls"
import { profile } from "@/data/profile"
import { trackEvent } from "@/lib/analytics"
import type { FormStatus } from "@/lib/brief"
import { submitForm } from "@/lib/form-client"
import type { Locale } from "@/lib/i18n"
import { getPagePath } from "@/lib/page-routes"

const copy: Record<Locale, {
  title: string; intro: string; name: string; email: string; company: string; kind: string; kinds: Record<"role" | "project" | "other", string>
  timeline: string; timelines: Record<"now" | "soon" | "later" | "exploring", string>; choose: string; message: string; messagePlaceholder: string
  link: string; linkPlaceholder: string; consent: string; privacy: string; submit: string; sending: string; status: Record<FormStatus, string>
}> = {
  pt: {
    title: "Prefere escrever?",
    intro: "Conte o contexto e eu respondo por e-mail. Quanto mais concreto, melhor a primeira resposta.",
    name: "Nome", email: "E-mail", company: "Empresa (opcional)",
    kind: "Sobre o quê?", kinds: { role: "Uma vaga", project: "Um projeto", other: "Outro assunto" },
    timeline: "Para quando? (opcional)", timelines: { now: "Agora", soon: "Em 1 a 3 meses", later: "Mais adiante", exploring: "Ainda estou explorando" }, choose: "Escolha…",
    message: "Mensagem", messagePlaceholder: "O problema, o contexto, o que já existe e o que precisa acontecer.",
    link: "Link (opcional)", linkPlaceholder: "Vaga, site, repositório…",
    consent: "Concordo em receber a resposta por e-mail. Os dados servem só para esta conversa.", privacy: "Privacidade",
    submit: "Enviar", sending: "Enviando…",
    status: {
      sent: "Recebi! Respondo por e-mail.",
      invalid: "Confira os campos: nome, um e-mail válido, a mensagem com pelo menos 20 caracteres e o consentimento.",
      unavailable: `Não deu certo agora. Tente de novo ou escreva para ${profile.socialLinks.email}.`,
    },
  },
  en: {
    title: "Rather write?",
    intro: "Share the context and I will reply by email. The more concrete, the better the first answer.",
    name: "Name", email: "Email", company: "Company (optional)",
    kind: "What is it about?", kinds: { role: "A role", project: "A project", other: "Something else" },
    timeline: "When? (optional)", timelines: { now: "Now", soon: "In 1 to 3 months", later: "Later on", exploring: "Still exploring" }, choose: "Choose…",
    message: "Message", messagePlaceholder: "The problem, the context, what exists today and what needs to happen.",
    link: "Link (optional)", linkPlaceholder: "Job post, site, repository…",
    consent: "I agree to get the reply by email. The details are used only for this conversation.", privacy: "Privacy",
    submit: "Send", sending: "Sending…",
    status: {
      sent: "Got it! I will reply by email.",
      invalid: "Please check the fields: name, a valid email, a message of at least 20 characters and the consent.",
      unavailable: `That did not work right now. Try again or write to ${profile.socialLinks.email}.`,
    },
  },
  es: {
    title: "¿Prefieres escribir?",
    intro: "Cuéntame el contexto y te respondo por correo. Cuanto más concreto, mejor la primera respuesta.",
    name: "Nombre", email: "Correo", company: "Empresa (opcional)",
    kind: "¿Sobre qué?", kinds: { role: "Un puesto", project: "Un proyecto", other: "Otro tema" },
    timeline: "¿Para cuándo? (opcional)", timelines: { now: "Ahora", soon: "En 1 a 3 meses", later: "Más adelante", exploring: "Todavía explorando" }, choose: "Elige…",
    message: "Mensaje", messagePlaceholder: "El problema, el contexto, lo que ya existe y lo que tiene que pasar.",
    link: "Enlace (opcional)", linkPlaceholder: "Vacante, sitio, repositorio…",
    consent: "Acepto recibir la respuesta por correo. Los datos solo se usan para esta conversación.", privacy: "Privacidad",
    submit: "Enviar", sending: "Enviando…",
    status: {
      sent: "¡Recibido! Te respondo por correo.",
      invalid: "Revisa los campos: nombre, un correo válido, un mensaje de al menos 20 caracteres y el consentimiento.",
      unavailable: `No funcionó ahora. Inténtalo de nuevo o escribe a ${profile.socialLinks.email}.`,
    },
  },
}

export function BriefForm({ locale, page }: { locale: Locale; page: string }) {
  const text = copy[locale]
  const [state, setState] = useState<FormStatus | "sending" | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setState("sending")
    const status = await submitForm<FormStatus>("/api/contact/brief", form, "unavailable")
    setState(status)
    if (status === "sent") {
      trackEvent("brief_submitted", { kind: String(new FormData(form).get("kind")), placement: page })
      form.reset()
    }
  }

  return (
    <section id="briefing" aria-labelledby="brief-title" className="scroll-mt-24 rounded-2xl border border-hairline bg-surface p-6 sm:p-8">
      <h2 id="brief-title" className="text-2xl font-bold tracking-tight">{text.title}</h2>
      <p className="mt-2 text-muted-foreground">{text.intro}</p>

      <form action="/api/contact/brief" method="post" onSubmit={submit} className="relative mt-6 grid gap-5 sm:grid-cols-2">
        <Field id="brief-name" label={text.name}>
          <input id="brief-name" name="name" required maxLength={100} autoComplete="name" className={inputClass} />
        </Field>
        <Field id="brief-email" label={text.email}>
          <input id="brief-email" name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} />
        </Field>
        <Field id="brief-company" label={text.company}>
          <input id="brief-company" name="company" maxLength={100} autoComplete="organization" className={inputClass} />
        </Field>
        <Field id="brief-kind" label={text.kind}>
          <select id="brief-kind" name="kind" required defaultValue="" className={inputClass}>
            <option value="" disabled>{text.choose}</option>
            {(Object.keys(text.kinds) as (keyof typeof text.kinds)[]).map((kind) => <option key={kind} value={kind}>{text.kinds[kind]}</option>)}
          </select>
        </Field>
        <Field id="brief-timeline" label={text.timeline}>
          <select id="brief-timeline" name="timeline" defaultValue="" className={inputClass}>
            <option value="">{text.choose}</option>
            {(Object.keys(text.timelines) as (keyof typeof text.timelines)[]).map((value) => <option key={value} value={value}>{text.timelines[value]}</option>)}
          </select>
        </Field>
        <Field id="brief-link" label={text.link}>
          <input id="brief-link" name="link" type="url" maxLength={300} placeholder={text.linkPlaceholder} className={inputClass} />
        </Field>
        <Field id="brief-message" label={text.message} className="sm:col-span-2">
          <textarea id="brief-message" name="message" required minLength={20} maxLength={4000} rows={6} placeholder={text.messagePlaceholder} className={inputClass} />
        </Field>
        <div className="sm:col-span-2">
          <Checkbox id="brief-consent" name="consent" required>
            {text.consent}{" "}
            <Link href={getPagePath(locale, "privacidade")} className="underline underline-offset-4">{text.privacy}</Link>
          </Checkbox>
        </div>
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="page" value={page} />
        <Honeypot id="brief-website" />
        <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
          <button
            type="submit"
            disabled={state === "sending"}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {state === "sending" ? text.sending : text.submit}
          </button>
          <StatusMessages prefix="brief" current={state === "sending" ? null : state} messages={text.status} />
        </div>
      </form>
    </section>
  )
}
