"use client"

/**
 * @file RecommendationForm.tsx
 * @description The form at `/recomendar`: someone who worked with Yago leaves
 * a testimonial with explicit consent to publish it. It reaches his inbox as
 * a ready-to-paste entry (see `src/lib/recommendation.ts`).
 */
import React, { useState, type FormEvent } from "react"
import Link from "next/link"
import { Send } from "lucide-react"

import { Checkbox, Field, Honeypot, inputClass, StatusMessages } from "@/components/molecules/form-controls"
import { trackEvent } from "@/lib/analytics"
import type { FormStatus } from "@/lib/brief"
import { submitForm } from "@/lib/form-client"
import type { Locale } from "@/lib/i18n"
import { getPagePath } from "@/lib/page-routes"

type Relationship = "client" | "manager" | "colleague" | "report" | "other"

const copy: Record<Locale, {
  name: string; email: string; emailHint: string; role: string; company: string; relationship: string; relationships: Record<Relationship, string>
  choose: string; project: string; noProject: string; quote: string; quotePlaceholder: string; results: string; resultsPlaceholder: string
  link: string; linkPlaceholder: string; consent: string; translate: string; privacy: string; submit: string; sending: string; status: Record<FormStatus, string>
}> = {
  pt: {
    name: "Seu nome", email: "Seu e-mail", emailHint: "Só para eu confirmar com você. Não é publicado.",
    role: "Seu cargo na época", company: "Empresa (opcional)",
    relationship: "Como trabalhamos juntos?", relationships: { client: "Fui cliente", manager: "Fui gestor(a) do Yago", colleague: "Fomos colegas", report: "Fui liderado(a) pelo Yago", other: "Outro" },
    choose: "Escolha…", project: "Sobre qual projeto? (opcional)", noProject: "Nenhum em especial",
    quote: "Seu depoimento", quotePlaceholder: "O que o trabalho resolveu, como foi trabalhar junto, o que você destacaria.",
    results: "Algum número que você possa confirmar? (opcional)", resultsPlaceholder: "Ex.: prazo, conversão, custo, volume, tempo economizado",
    link: "Link público da recomendação (opcional)", linkPlaceholder: "Sua recomendação no LinkedIn, por exemplo",
    consent: "Autorizo publicar este depoimento com meu nome, cargo e empresa em lagrotti.dev.",
    translate: "Autorizo traduzir o texto para inglês e espanhol, os outros idiomas do site.",
    privacy: "Privacidade", submit: "Enviar depoimento", sending: "Enviando…",
    status: {
      sent: "Obrigado! Eu reviso e confirmo com você antes de publicar.",
      invalid: "Confira os campos: nome, e-mail válido, cargo, a relação, um depoimento de pelo menos 40 caracteres e a autorização para publicar.",
      unavailable: "Não deu certo agora. Tente de novo em alguns minutos.",
    },
  },
  en: {
    name: "Your name", email: "Your email", emailHint: "Only so I can confirm with you. Never published.",
    role: "Your role at the time", company: "Company (optional)",
    relationship: "How did we work together?", relationships: { client: "I was a client", manager: "I managed Yago", colleague: "We were colleagues", report: "Yago led my team", other: "Other" },
    choose: "Choose…", project: "Which project? (optional)", noProject: "None in particular",
    quote: "Your testimonial", quotePlaceholder: "What the work solved, what working together was like, what you would highlight.",
    results: "Any number you can vouch for? (optional)", resultsPlaceholder: "E.g. lead time, conversion, cost, volume, time saved",
    link: "Public link to the recommendation (optional)", linkPlaceholder: "Your LinkedIn recommendation, for example",
    consent: "I allow this testimonial to be published with my name, role and company on lagrotti.dev.",
    translate: "I allow the text to be translated into Portuguese and Spanish, the site's other languages.",
    privacy: "Privacy", submit: "Send testimonial", sending: "Sending…",
    status: {
      sent: "Thank you! I will review it and check with you before publishing.",
      invalid: "Please check the fields: name, a valid email, role, how we worked together, a testimonial of at least 40 characters and the permission to publish.",
      unavailable: "That did not work right now. Please try again in a few minutes.",
    },
  },
  es: {
    name: "Tu nombre", email: "Tu correo", emailHint: "Solo para confirmarlo contigo. No se publica.",
    role: "Tu cargo en ese momento", company: "Empresa (opcional)",
    relationship: "¿Cómo trabajamos juntos?", relationships: { client: "Fui cliente", manager: "Fui jefe(a) de Yago", colleague: "Fuimos compañeros", report: "Yago lideró mi equipo", other: "Otro" },
    choose: "Elige…", project: "¿Sobre qué proyecto? (opcional)", noProject: "Ninguno en especial",
    quote: "Tu testimonio", quotePlaceholder: "Lo que el trabajo resolvió, cómo fue trabajar juntos, qué destacarías.",
    results: "¿Algún número que puedas confirmar? (opcional)", resultsPlaceholder: "Ej.: plazo, conversión, costo, volumen, tiempo ahorrado",
    link: "Enlace público a la recomendación (opcional)", linkPlaceholder: "Tu recomendación en LinkedIn, por ejemplo",
    consent: "Autorizo publicar este testimonio con mi nombre, cargo y empresa en lagrotti.dev.",
    translate: "Autorizo traducir el texto al portugués y al inglés, los otros idiomas del sitio.",
    privacy: "Privacidad", submit: "Enviar testimonio", sending: "Enviando…",
    status: {
      sent: "¡Gracias! Lo reviso y lo confirmo contigo antes de publicarlo.",
      invalid: "Revisa los campos: nombre, correo válido, cargo, la relación, un testimonio de al menos 40 caracteres y la autorización para publicar.",
      unavailable: "No funcionó ahora. Inténtalo de nuevo en unos minutos.",
    },
  },
}

interface RecommendationFormProps {
  locale: Locale
  page: string
  projects: { slug: string; title: string }[]
}

export function RecommendationForm({ locale, page, projects }: RecommendationFormProps) {
  const text = copy[locale]
  const [state, setState] = useState<FormStatus | "sending" | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setState("sending")
    const status = await submitForm<FormStatus>("/api/contact/recommendation", form, "unavailable")
    setState(status)
    if (status === "sent") {
      trackEvent("testimonial_submitted", { relationship: String(new FormData(form).get("relationship")), locale })
      form.reset()
    }
  }

  return (
    <form action="/api/contact/recommendation" method="post" onSubmit={submit} className="relative grid gap-5 sm:grid-cols-2">
      <Field id="rec-name" label={text.name}>
        <input id="rec-name" name="name" required maxLength={100} autoComplete="name" className={inputClass} />
      </Field>
      <Field id="rec-email" label={text.email} hint={text.emailHint}>
        <input id="rec-email" name="email" type="email" required maxLength={254} autoComplete="email" aria-describedby="rec-email-hint" className={inputClass} />
      </Field>
      <Field id="rec-role" label={text.role}>
        <input id="rec-role" name="role" required maxLength={100} autoComplete="organization-title" className={inputClass} />
      </Field>
      <Field id="rec-company" label={text.company}>
        <input id="rec-company" name="company" maxLength={100} autoComplete="organization" className={inputClass} />
      </Field>
      <Field id="rec-relationship" label={text.relationship}>
        <select id="rec-relationship" name="relationship" required defaultValue="" className={inputClass}>
          <option value="" disabled>{text.choose}</option>
          {(Object.keys(text.relationships) as Relationship[]).map((value) => <option key={value} value={value}>{text.relationships[value]}</option>)}
        </select>
      </Field>
      <Field id="rec-project" label={text.project}>
        <select id="rec-project" name="project" defaultValue="" className={inputClass}>
          <option value="">{text.noProject}</option>
          {projects.map((project) => <option key={project.slug} value={project.slug}>{project.title}</option>)}
        </select>
      </Field>
      <Field id="rec-quote" label={text.quote} className="sm:col-span-2">
        <textarea id="rec-quote" name="quote" required minLength={40} maxLength={1500} rows={6} placeholder={text.quotePlaceholder} className={inputClass} />
      </Field>
      <Field id="rec-results" label={text.results} className="sm:col-span-2">
        <textarea id="rec-results" name="results" maxLength={600} rows={2} placeholder={text.resultsPlaceholder} className={inputClass} />
      </Field>
      <Field id="rec-link" label={text.link} className="sm:col-span-2">
        <input id="rec-link" name="link" type="url" maxLength={300} placeholder={text.linkPlaceholder} className={inputClass} />
      </Field>
      <div className="space-y-3 sm:col-span-2">
        <Checkbox id="rec-consent" name="consent" required>{text.consent}</Checkbox>
        <Checkbox id="rec-translate" name="translate">{text.translate}</Checkbox>
        <p className="text-xs text-muted-foreground">
          <Link href={getPagePath(locale, "privacidade")} className="underline underline-offset-4">{text.privacy}</Link>
        </p>
      </div>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="page" value={page} />
      <Honeypot id="rec-website" />
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {state === "sending" ? text.sending : text.submit}
        </button>
        <StatusMessages prefix="recommendation" current={state === "sending" ? null : state} messages={text.status} />
      </div>
    </form>
  )
}
