"use client"

/**
 * @file ArticleShare.tsx
 * @description Share buttons under an article, plus print / save as PDF.
 *
 * Every shared URL carries UTM tags naming the network, so the visits a share
 * brings back are attributed to it; each click is also counted as an event.
 */
import React, { useEffect, useState, type ReactNode } from "react"
import { Check, Link2, Linkedin, Mail, MessageCircle, Printer, Share2 } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import type { Locale } from "@/lib/i18n"
import { sharedArticleUrl, shareLinks, type ShareNetwork } from "@/lib/share-links"

const copy: Record<Locale, { title: string; copy: string; copied: string; native: string; print: string; email: string }> = {
  pt: { title: "Compartilhar este artigo", copy: "Copiar link", copied: "Link copiado", native: "Compartilhar…", print: "Imprimir ou salvar PDF", email: "E-mail" },
  en: { title: "Share this article", copy: "Copy link", copied: "Link copied", native: "Share…", print: "Print or save as PDF", email: "Email" },
  es: { title: "Compartir este artículo", copy: "Copiar enlace", copied: "Enlace copiado", native: "Compartir…", print: "Imprimir o guardar PDF", email: "Correo" },
}

/** The X logo; lucide only ships the old bird. */
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const button =
  "inline-flex h-10 items-center gap-2 rounded-full border border-hairline px-4 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-surface"

interface ArticleShareProps {
  url: string
  title: string
  locale: Locale
  /** The article's `translationKey`: the campaign of every shared link. */
  campaign: string
}

export function ArticleShare({ url, title, locale, campaign }: ArticleShareProps) {
  const text = copy[locale]
  const links = shareLinks({ url, title, campaign })
  const [copied, setCopied] = useState(false)
  const [canShare, setCanShare] = useState(false)

  // Only known in the browser, so it waits for the first effect to avoid a hydration mismatch.
  useEffect(() => setCanShare(typeof navigator.share === "function"), [])

  const count = (network: string) => trackEvent("article_share", { network, article: campaign })
  const networks: { id: ShareNetwork; label: string; Icon: (props: { className?: string }) => ReactNode }[] = [
    { id: "linkedin", label: "LinkedIn", Icon: Linkedin },
    { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
    { id: "x", label: "X", Icon: XLogo },
    { id: "email", label: text.email, Icon: Mail },
  ]

  async function copyLink() {
    count("copy")
    try {
      await navigator.clipboard.writeText(sharedArticleUrl(url, "copy", campaign))
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Clipboard blocked: the address bar still has the link.
    }
  }

  async function nativeShare() {
    count("native")
    try {
      await navigator.share({ title, url: sharedArticleUrl(url, "native", campaign) })
    } catch {
      // Dismissed by the reader.
    }
  }

  return (
    <section aria-labelledby="share-title" className="print:hidden">
      <h2 id="share-title" className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{text.title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {networks.map(({ id, label, Icon }) => (
          <a
            key={id}
            href={links[id]}
            {...(id === "email" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
            onClick={() => count(id)}
            className={button}
          >
            <Icon className="h-4 w-4" />
            {label}
          </a>
        ))}
        <button type="button" onClick={copyLink} className={button}>
          {copied ? <Check className="h-4 w-4 text-brand" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
          <span aria-live="polite">{copied ? text.copied : text.copy}</span>
        </button>
        {canShare && (
          <button type="button" onClick={nativeShare} className={button}>
            <Share2 className="h-4 w-4" aria-hidden="true" />
            {text.native}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            trackEvent("article_print", { article: campaign })
            window.print()
          }}
          className={button}
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          {text.print}
        </button>
      </div>
    </section>
  )
}
