"use client"

/**
 * @file NewsletterSignup.tsx
 * @description Email signup for new articles (Buttondown, double opt-in).
 *
 * Works without JavaScript: the form posts to `/api/newsletter`, which
 * redirects back to `#newsletter-<status>`, and `:target` reveals the matching
 * message. With JavaScript the same request goes through `fetch`, carrying
 * where the reader came from, and the message appears in place.
 */
import Link from "next/link"
import React, { useState, type FormEvent } from "react"
import { Mail } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import { attributionProperties, browserStorages } from "@/lib/attribution"
import type { Locale } from "@/lib/i18n"
import type { SubscribeStatus } from "@/lib/newsletter"
import { getPagePath } from "@/lib/page-routes"
import { cn } from "@/lib/utils"

const copy: Record<Locale, { title: string; text: string; label: string; placeholder: string; submit: string; sending: string; privacy: string; privacyLink: string; status: Record<SubscribeStatus, string> }> = {
  pt: {
    title: "Receba os próximos artigos",
    text: "Um e-mail quando sair artigo novo sobre arquitetura, produto e IA aplicada. Cancele quando quiser.",
    label: "Seu e-mail",
    placeholder: "voce@empresa.com",
    submit: "Inscrever",
    sending: "Enviando…",
    privacy: "O e-mail fica no Buttondown e só é usado para esta newsletter.",
    privacyLink: "Privacidade",
    status: {
      pending: "Pronto! Se este e-mail ainda não estava inscrito, chegou uma mensagem para confirmar.",
      invalid: "Confira o e-mail digitado.",
      unavailable: "Não deu certo agora. Tente de novo em alguns minutos.",
    },
  },
  en: {
    title: "Get the next articles",
    text: "One email when a new article on architecture, product and applied AI comes out. Unsubscribe anytime.",
    label: "Your email",
    placeholder: "you@company.com",
    submit: "Subscribe",
    sending: "Sending…",
    privacy: "Your address is kept at Buttondown and used only for this newsletter.",
    privacyLink: "Privacy",
    status: {
      pending: "Done! If this address was not subscribed yet, a confirmation email is on its way.",
      invalid: "Please check the address you typed.",
      unavailable: "That did not work right now. Please try again in a few minutes.",
    },
  },
  es: {
    title: "Recibe los próximos artículos",
    text: "Un correo cuando salga un artículo nuevo sobre arquitectura, producto e IA aplicada. Date de baja cuando quieras.",
    label: "Tu correo",
    placeholder: "tu@empresa.com",
    submit: "Suscribirme",
    sending: "Enviando…",
    privacy: "El correo se guarda en Buttondown y solo se usa para esta newsletter.",
    privacyLink: "Privacidad",
    status: {
      pending: "¡Listo! Si este correo aún no estaba suscrito, te llegó un mensaje para confirmar.",
      invalid: "Revisa el correo que escribiste.",
      unavailable: "No funcionó ahora. Inténtalo de nuevo en unos minutos.",
    },
  },
}

const statuses: SubscribeStatus[] = ["pending", "invalid", "unavailable"]

interface NewsletterSignupProps {
  locale: Locale
  /** Path of the page holding the form; the no-JS response returns here. */
  page: string
  /** Where on the site the form sits, recorded with the signup event. */
  placement: string
  className?: string
}

export function NewsletterSignup({ locale, page, placement, className }: NewsletterSignupProps) {
  const text = copy[locale]
  const [state, setState] = useState<SubscribeStatus | "sending" | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const { local, session } = browserStorages()
    setState("sending")
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(form), ...attributionProperties(local, session) }),
      })
      const { status } = (await response.json()) as { status: SubscribeStatus }
      setState(status)
      if (status === "pending") trackEvent("newsletter_signup", { placement, locale })
    } catch {
      setState("unavailable")
    }
  }

  return (
    <section id="newsletter" aria-labelledby="newsletter-title" className={cn("rounded-2xl border border-hairline bg-surface p-6 sm:p-8 print:hidden", className)}>
      <div className="flex items-start gap-3">
        <Mail className="mt-1 h-5 w-5 shrink-0 text-brand" aria-hidden="true" />
        <div>
          <h2 id="newsletter-title" className="text-xl font-semibold">{text.title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text.text}</p>
        </div>
      </div>

      <form action="/api/newsletter" method="post" onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">{text.label}</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder={text.placeholder}
          className="h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-2 focus-visible:outline-brand"
        />
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="page" value={page} />
        {/* Hidden from people and screen readers; bots fill every field. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="newsletter-website">Website</label>
          <input id="newsletter-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {state === "sending" ? text.sending : text.submit}
        </button>
      </form>

      <p role="status" className="mt-3 text-sm font-medium text-foreground empty:hidden">
        {state && state !== "sending" ? text.status[state] : ""}
      </p>
      {/* Without JavaScript, the redirect's fragment shows one of these. */}
      {statuses.map((status) => (
        <p key={status} id={`newsletter-${status}`} className="mt-3 hidden text-sm font-medium text-foreground target:block">
          {text.status[status]}
        </p>
      ))}

      <p className="mt-4 text-xs text-muted-foreground">
        {text.privacy}{" "}
        <Link href={getPagePath(locale, "privacidade")} className="underline underline-offset-4 hover:text-foreground">
          {text.privacyLink}
        </Link>
      </p>
    </section>
  )
}
