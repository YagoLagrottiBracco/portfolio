"use client"

/**
 * @file SiteSearch.tsx
 * @description Site-wide search: case studies, technologies, pages, articles
 * and resources. Opens with the navigation button, Ctrl/Cmd+K or "/". Uses
 * the native <dialog> (focus trap, Esc, inert page behind it) and the ARIA
 * combobox pattern; the index loads the first time the dialog opens.
 */
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

import { trackEvent } from "@/lib/analytics"
import type { Locale } from "@/lib/i18n"
import { rankSearch, type SearchItem, type SearchKind } from "@/lib/site-search"
import { cn } from "@/lib/utils"

const OPEN_EVENT = "site-search:open"

const copy: Record<Locale, { open: string; label: string; placeholder: string; empty: string; hint: string; loading: string; failed: string; kinds: Record<SearchKind, string> }> = {
  pt: {
    open: "Buscar no site", label: "Buscar", placeholder: "Busque projetos, tecnologias, artigos…", empty: "Nada encontrado.", hint: "↑↓ para navegar · Enter para abrir · Esc para fechar",
    loading: "Carregando…", failed: "A busca não carregou. Tente de novo.",
    kinds: { case: "Estudo de caso", stack: "Tecnologia", page: "Página", article: "Artigo", resource: "Recurso" },
  },
  en: {
    open: "Search the site", label: "Search", placeholder: "Search projects, technologies, articles…", empty: "Nothing found.", hint: "↑↓ to move · Enter to open · Esc to close",
    loading: "Loading…", failed: "Search did not load. Please try again.",
    kinds: { case: "Case study", stack: "Technology", page: "Page", article: "Article", resource: "Resource" },
  },
  es: {
    open: "Buscar en el sitio", label: "Buscar", placeholder: "Busca proyectos, tecnologías, artículos…", empty: "No se encontró nada.", hint: "↑↓ para moverte · Enter para abrir · Esc para cerrar",
    loading: "Cargando…", failed: "La búsqueda no cargó. Inténtalo de nuevo.",
    kinds: { case: "Caso de estudio", stack: "Tecnología", page: "Página", article: "Artículo", resource: "Recurso" },
  },
}

const indexes = new Map<Locale, Promise<SearchItem[]>>()

function loadIndex(locale: Locale): Promise<SearchItem[]> {
  let index = indexes.get(locale)
  if (!index) {
    index = fetch(`/search-index/${locale}`).then((response) => {
      if (!response.ok) throw new Error(`Search index answered ${response.status}`)
      return response.json() as Promise<SearchItem[]>
    })
    index.catch(() => indexes.delete(locale))
    indexes.set(locale, index)
  }
  return index
}

/** The button in the navigation; any number of them can open the one dialog. */
export function SearchButton({ locale, className }: { locale: Locale; className?: string }) {
  const text = copy[locale]
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      aria-label={`${text.open} (Ctrl+K)`}
      title={`${text.open} (Ctrl+K)`}
      className={cn("inline-flex h-9 items-center gap-2 rounded-md px-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground", className)}
    >
      <Search className="h-4 w-4" aria-hidden="true" />
      <kbd aria-hidden="true" className="hidden rounded border border-hairline px-1.5 py-0.5 font-sans text-[11px] lg:inline">Ctrl K</kbd>
    </button>
  )
}

function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
}

/** Mounted once, by the navigation. */
export function SearchDialog({ locale }: { locale: Locale }) {
  const text = copy[locale]
  const router = useRouter()
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<SearchItem[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)

  const open = useCallback(() => {
    if (!dialog.current || dialog.current.open) return
    dialog.current.showModal()
    input.current?.focus()
    loadIndex(locale).then(setItems, () => setFailed(true))
  }, [locale])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.key === "k" && (event.ctrlKey || event.metaKey)) || (event.key === "/" && !isTyping(event.target))) {
        event.preventDefault()
        open()
      }
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener(OPEN_EVENT, open)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener(OPEN_EVENT, open)
    }
  }, [open])

  const results = items ? rankSearch(items, query) : []

  function close() {
    dialog.current?.close()
  }

  function choose(item: SearchItem) {
    trackEvent("site_search", { kind: item.kind, query: query.trim().slice(0, 40) })
    close()
    router.push(item.url)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (results.length) setActive((current) => (current + (event.key === "ArrowDown" ? 1 : -1) + results.length) % results.length)
    } else if (event.key === "Enter" && results[active]) {
      event.preventDefault()
      choose(results[active])
    } else if (event.key === "Escape") {
      // A search input would spend the first Esc clearing itself; close right away instead.
      event.preventDefault()
      close()
    }
  }

  return (
    <dialog
      ref={dialog}
      aria-label={text.open}
      onClose={() => {
        setQuery("")
        setActive(0)
      }}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(event) => event.target === event.currentTarget && close()}
      className="mx-auto mt-[12vh] w-[min(40rem,calc(100vw-2rem))] rounded-2xl border border-hairline bg-background p-0 text-foreground shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-hairline px-4">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="site-search-input" className="sr-only">{text.label}</label>
        <input
          ref={input}
          id="site-search-input"
          type="search"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="site-search-results"
          aria-activedescendant={results[active] ? `site-search-option-${active}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
          placeholder={text.placeholder}
          className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
      </div>

      <ul id="site-search-results" role="listbox" aria-label={text.label} className="max-h-[50vh] overflow-y-auto p-2 empty:hidden">
        {results.map((item, index) => (
          <li
            key={item.url}
            id={`site-search-option-${index}`}
            role="option"
            aria-selected={index === active}
            onClick={() => choose(item)}
            onMouseMove={() => setActive(index)}
            className={cn("cursor-pointer rounded-lg px-3 py-2.5", index === active && "bg-surface")}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="truncate font-medium">{item.title}</span>
              <span className="shrink-0 text-xs text-muted-foreground">{text.kinds[item.kind]}</span>
            </span>
            <span className="mt-0.5 block truncate text-sm text-muted-foreground">{item.description}</span>
          </li>
        ))}
      </ul>

      <p role="status" className="border-t border-hairline px-4 py-2.5 text-xs text-muted-foreground">
        {failed ? text.failed : !items ? text.loading : query.trim() && results.length === 0 ? text.empty : text.hint}
      </p>
    </dialog>
  )
}
