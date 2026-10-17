"use client"
import React, { useState } from "react"
import Image from "next/image"
import type { Locale } from "@/lib/i18n"
import { SITE_URL } from "@/lib/site"
import { CopyField } from "@/components/resources/ResourceActions"

export interface DiscoveryResource {
  id: string
  title: string
  url: string
}
export function ResourceCardBuilder({
  resources,
  locale,
}: {
  resources: DiscoveryResource[]
  locale: Locale
}) {
  const [id, setId] = useState(resources[0]?.id ?? "ferramentas/json")
  const item = resources.find((resource) => resource.id === id) ?? resources[0]
  const copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  if (!item) return null
  const image =
    SITE_URL +
    "/api/resources/card?id=" +
    encodeURIComponent(item.id) +
    "&locale=" +
    locale
  const markdown = `[![${item.title.replaceAll("[", "").replaceAll("]", "").replaceAll("\\", "")}](${image})](${item.url})`
  return (
    <section
      className="mt-8 rounded-2xl border border-hairline bg-surface p-5 sm:p-7"
      data-testid="resource-card-builder"
    >
      <h2 className="text-2xl font-semibold">
        {copy(
          "Um cartão para sua documentação",
          "A card for your documentation",
          "Una tarjeta para tu documentación"
        )}
      </h2>
      <label className="mt-5 block text-sm">
        {copy("Recurso do cartão", "Card resource", "Recurso de la tarjeta")}
        <select
          className="mt-2 min-h-11 w-full rounded-lg border border-hairline bg-background px-3"
          value={item.id}
          onChange={(event) => setId(event.target.value)}
        >
          {resources.map((resource) => (
            <option key={resource.id} value={resource.id}>
              {resource.title}
            </option>
          ))}
        </select>
      </label>
      <Image
        unoptimized
        src={
          "/api/resources/card?id=" +
          encodeURIComponent(item.id) +
          "&locale=" +
          locale
        }
        alt={item.title}
        width={800}
        height={320}
        className="mt-5 h-auto w-full rounded-xl"
      />
      <CopyField
        value={markdown}
        label={copy(
          "Markdown para incorporar",
          "Embedding Markdown",
          "Markdown para integrar"
        )}
        locale={locale}
      />
      <a
        download="resource-card.svg"
        href={image}
        className="mt-4 inline-flex min-h-11 items-center text-brand underline"
      >
        SVG
      </a>
    </section>
  )
}
export function ShortLinkBuilder({
  links,
  locale,
}: {
  links: { code: string; title: string; url: string; destination: string }[]
  locale: Locale
}) {
  const [code, setCode] = useState(links[0]?.code ?? "kit"),
    copy = (pt: string, en: string, es: string) => ({ pt, en, es })[locale]
  const item = links.find((link) => link.code === code) ?? links[0]
  if (!item) return null
  const qr = "/api/resources/qr?code=" + item.code + "&locale=" + locale
  return (
    <section
      className="mt-8 rounded-2xl border border-hairline bg-surface p-5 sm:p-7"
      data-testid="short-link-builder"
    >
      <h2 className="text-2xl font-semibold">
        {copy(
          "Leve um recurso para slides e impressos",
          "Bring a resource to slides and print",
          "Lleva un recurso a diapositivas e impresos"
        )}
      </h2>
      <label className="mt-5 block text-sm">
        {copy(
          "Destino do link curto",
          "Short-link destination",
          "Destino del enlace corto"
        )}
        <select
          className="mt-2 min-h-11 w-full rounded-lg border border-hairline bg-background px-3"
          value={item.code}
          onChange={(event) => setCode(event.target.value)}
        >
          {links.map((link) => (
            <option key={link.code} value={link.code}>
              {link.title}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-6 inline-block rounded-xl bg-white p-3">
        <Image
          unoptimized
          src={qr}
          width={232}
          height={232}
          alt={
            copy("QR code para ", "QR code for ", "Código QR para ") +
            item.title
          }
        />
      </div>
      <CopyField
        value={item.url}
        label={copy("Link curto", "Short link", "Enlace corto")}
        locale={locale}
      />
      <p className="mt-4 break-all text-xs text-muted-foreground">
        {copy(
          "Destino identificado",
          "Tagged destination",
          "Destino identificado"
        )}
        : {item.destination}
      </p>
      <a
        href={qr}
        download={item.code + "-qr.svg"}
        className="mt-4 inline-flex min-h-11 items-center text-brand underline"
      >
        {copy("Baixar QR em SVG", "Download QR as SVG", "Descargar QR en SVG")}
      </a>
    </section>
  )
}
