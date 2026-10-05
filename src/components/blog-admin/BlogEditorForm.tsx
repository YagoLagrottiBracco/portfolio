"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"

import { BlogArticle } from "@/components/blog/BlogArticle"
import { VisualMarkdownEditor } from "@/components/blog-admin/VisualMarkdownEditor"
import type { BlogAdminBundle } from "@/lib/blog-admin-document"
import type { BlogPost } from "@/lib/blog-content"
import type { ArticleInput, RemoteImageInput, UploadImageInput } from "@/lib/blog-publishing"
import type { StagedAsset } from "@/lib/blog-admin-assets"
import { locales, type Locale } from "@/lib/i18n"

const hints: Record<Locale, { heading: string; content: string }> = {
  pt: { heading: "Introdução", content: "Comece com uma ideia concreta." },
  en: { heading: "Introduction", content: "Start with a concrete idea." },
  es: { heading: "Introducción", content: "Empieza con una idea concreta." },
}

function initialArticle(locale: Locale): ArticleInput {
  return { title: "", slug: "", excerpt: "", date: new Date().toISOString().slice(0, 10), tags: [], content: `## ${hints[locale].heading}\n\n` }
}

function initialArticles(bundle?: BlogAdminBundle): Record<Locale, ArticleInput> {
  return Object.fromEntries(locales.map(locale => [locale, bundle?.articles[locale] ? {
    title: bundle.articles[locale].title, slug: bundle.articles[locale].slug, excerpt: bundle.articles[locale].excerpt,
    date: bundle.articles[locale].date, updatedAt: bundle.articles[locale].updatedAt,
    tags: bundle.articles[locale].tags, content: bundle.articles[locale].content,
  } : initialArticle(locale)])) as Record<Locale, ArticleInput>
}

async function base64(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  let binary = ""
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192))
  return btoa(binary)
}

function imageSource(image: RemoteImageInput | UploadImageInput | undefined, bundle?: BlogAdminBundle): string | undefined {
  if (image?.kind === "remote") return image.url
  if (image?.kind === "upload") return `data:${image.contentType};base64,${image.base64}`
  return bundle?.image?.src
}

export function BlogEditorForm({ bundle, csrf }: { bundle?: BlogAdminBundle; csrf: string }) {
  const [translationKey, setTranslationKey] = useState(bundle?.translationKey ?? "")
  const [articles, setArticles] = useState<Record<Locale, ArticleInput>>(() => initialArticles(bundle))
  const [locale, setLocale] = useState<Locale>("pt")
  const [image, setImage] = useState<RemoteImageInput | UploadImageInput>()
  const [coverMode, setCoverMode] = useState<"existing" | "remote" | "upload" | "none">(bundle?.image ? "existing" : "none")
  const [assets, setAssets] = useState<StagedAsset[]>([])
  const [dirty, setDirty] = useState(false)
  const [preview, setPreview] = useState(false)
  const [previewedLocales, setPreviewedLocales] = useState<Locale[]>([])
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [message, setMessage] = useState("")
  const [conflict, setConflict] = useState(false)
  const published = !!bundle && locales.some(lang => bundle.articles[lang]?.draft === false)

  useEffect(() => {
    const warning = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = "" } }
    window.addEventListener("beforeunload", warning)
    return () => window.removeEventListener("beforeunload", warning)
  }, [dirty])

  function changed() { setDirty(true); setPreviewedLocales([]); setSaved(false); setMessage(""); setConflict(false) }
  function patchArticle(patch: Partial<ArticleInput>) { setArticles(current => ({ ...current, [locale]: { ...current[locale], ...patch } })); changed() }
  function patchImage(patch: Partial<RemoteImageInput>) {
    setImage(current => ({ kind: "remote", url: current?.kind === "remote" ? current.url : "", alt: current?.alt ?? "", width: current?.width ?? 0, height: current?.height ?? 0, ...patch }))
    changed()
  }

  async function stageAsset(file: File): Promise<string> {
    if (!/^image\/(png|jpeg|webp|avif)$/.test(file.type) || file.size > 5 * 1024 * 1024) throw new Error("Use PNG, JPEG, WebP ou AVIF até 5 MB")
    const alt = window.prompt("Descreva a imagem para leitores de tela:")?.trim()
    if (!alt) throw new Error("Texto alternativo obrigatório")
    const bitmap = await createImageBitmap(file)
    const width = bitmap.width, height = bitmap.height
    bitmap.close()
    const id = crypto.randomUUID().replaceAll("-", "")
    const encoded = await base64(file)
    setAssets(current => [...current, { id, filename: file.name, contentType: file.type, base64: encoded, alt, width, height }])
    changed()
    return `blog-asset://${id}`
  }

  async function uploadCover(file: File) {
    try {
      if (!/^image\/(png|jpeg|webp|avif)$/.test(file.type) || file.size > 5 * 1024 * 1024) throw new Error("Use PNG, JPEG, WebP ou AVIF até 5 MB")
      const bitmap = await createImageBitmap(file)
      const width = bitmap.width, height = bitmap.height
      bitmap.close()
      setImage({ kind: "upload", filename: file.name, contentType: file.type as UploadImageInput["contentType"], base64: await base64(file), alt: image?.alt ?? "", width, height })
      setCoverMode("upload"); changed()
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Imagem inválida") }
  }

  const previewPost = useMemo<BlogPost>(() => {
    const article = articles[locale]
    const src = imageSource(image, bundle)
    const cover = src && (image ?? bundle?.image) ? { src, alt: image?.alt ?? bundle?.image?.alt ?? "", width: image?.width ?? bundle?.image?.width ?? 1, height: image?.height ?? bundle?.image?.height ?? 1 } : undefined
    return { translationKey, locale, title: article.title || "Título do artigo", slug: article.slug || "previa", excerpt: article.excerpt || "Resumo do artigo", date: Number.isNaN(Date.parse(article.date)) ? new Date().toISOString().slice(0, 10) : article.date, updatedAt: article.updatedAt, tags: article.tags, content: article.content, url: `/blog/${article.slug || "previa"}`, image: cover, readingMinutes: Math.max(1, Math.ceil(article.content.split(/\s+/).length / 220)) }
  }, [articles, locale, image, bundle, translationKey])
  const assetPreviews = useMemo(() => Object.fromEntries(assets.map(asset => [`blog-asset://${asset.id}`, `data:${asset.contentType};base64,${asset.base64}`])), [assets])

  async function save(publish: boolean) {
    if (busy || saved) return
    if (publish && previewedLocales.length < 3) { setPreview(true); setMessage("Abra e revise a prévia de PT, EN e ES antes de publicar."); return }
    setBusy(true); setMessage(""); setConflict(false)
    try {
      const versions = bundle ? Object.fromEntries(locales.map(lang => [lang, bundle.articles[lang] ? { path: bundle.articles[lang].sourcePath, sha: bundle.articles[lang].blobSha } : null])) : undefined
      const payload = { translationKey, articles, image, assets, publish, versions }
      const endpoint = bundle ? `/api/admin/blog/${encodeURIComponent(bundle.translationKey)}` : "/api/admin/blog"
      const response = await fetch(endpoint, { method: bundle ? "PUT" : "POST", headers: { "Content-Type": "application/json", "X-Blog-CSRF": csrf }, body: JSON.stringify(payload) })
      const result = await response.json()
      if (!response.ok) {
        setConflict(response.status === 409)
        throw new Error(result.error?.message ?? "Não foi possível salvar o artigo")
      }
      setDirty(false); setSaved(true)
      setMessage(`Commit ${result.commitSha} criado. O conteúdo aparecerá no site após o deploy.`)
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Falha ao salvar") }
    finally { setBusy(false) }
  }

  return <div className="blog-admin-form">
    <div className="grid gap-6 rounded-xl border border-border bg-card p-5 md:p-7">
      <label className="block text-sm font-medium">Chave do artigo <span className="text-muted-foreground">(igual nos três idiomas)</span>
        <input className="blog-admin-input mt-2" value={translationKey} disabled={!!bundle} onChange={event => { setTranslationKey(event.target.value); changed() }} placeholder="minha-historia" required />
      </label>
      <div className="blog-editor-tabs" role="tablist" aria-label="Idioma do artigo">{locales.map(lang => <button key={lang} type="button" role="tab" aria-selected={locale === lang} onClick={() => { setLocale(lang); setPreview(false) }} className={locale === lang ? "is-active" : ""}>{lang.toUpperCase()}{bundle?.articles[lang] && <span className="ml-1 text-xs">· {bundle.articles[lang].draft ? "rascunho" : "público"}</span>}</button>)}</div>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="text-sm font-medium">Título<input className="blog-admin-input mt-2" value={articles[locale].title} onChange={event => patchArticle({ title: event.target.value })} required /></label>
        <label className="text-sm font-medium">Slug<input className="blog-admin-input mt-2" value={articles[locale].slug} disabled={bundle?.articles[locale]?.draft === false} onChange={event => patchArticle({ slug: event.target.value })} placeholder="meu-artigo" required /></label>
        <label className="text-sm font-medium md:col-span-2">Resumo para leitores e buscadores<textarea className="blog-admin-input mt-2" rows={3} value={articles[locale].excerpt} onChange={event => patchArticle({ excerpt: event.target.value })} required /></label>
        <label className="text-sm font-medium">Data<input className="blog-admin-input mt-2" type="date" value={articles[locale].date.slice(0, 10)} onChange={event => patchArticle({ date: event.target.value })} required /></label>
        <label className="text-sm font-medium">Tags <span className="text-muted-foreground">(separadas por vírgula)</span><input className="blog-admin-input mt-2" value={articles[locale].tags.join(", ")} onChange={event => patchArticle({ tags: event.target.value.split(",").map(item => item.trim()).filter(Boolean) })} required /></label>
      </div>
      <fieldset className="rounded-lg border border-border p-4"><legend className="px-2 font-semibold">Capa compartilhada</legend>
        <div className="mb-4 flex flex-wrap gap-3 text-sm"><button type="button" onClick={() => { setCoverMode("remote"); setImage({ kind: "remote", url: "", alt: "", width: 0, height: 0 }); changed() }} className="underline">URL HTTPS</button><button type="button" onClick={() => { setCoverMode("upload"); setImage(undefined); changed() }} className="underline">Enviar arquivo</button>{bundle?.image && <button type="button" onClick={() => { setCoverMode("existing"); setImage(undefined); changed() }} className="underline">Manter capa atual</button>}</div>
        {coverMode === "existing" && bundle?.image && <p className="text-sm text-muted-foreground">Capa atual: {bundle.image.alt} ({bundle.image.width} × {bundle.image.height})</p>}
        {coverMode === "remote" && <div className="grid gap-3 md:grid-cols-2"><label className="text-sm">URL HTTPS<input className="blog-admin-input mt-1" type="url" value={image?.kind === "remote" ? image.url : ""} onChange={event => patchImage({ url: event.target.value })} /></label><label className="text-sm">Texto alternativo<input className="blog-admin-input mt-1" value={image?.alt ?? ""} onChange={event => patchImage({ alt: event.target.value })} /></label><label className="text-sm">Largura em pixels<input className="blog-admin-input mt-1" type="number" min="1" value={image?.width || ""} onChange={event => patchImage({ width: Number(event.target.value) })} /></label><label className="text-sm">Altura em pixels<input className="blog-admin-input mt-1" type="number" min="1" value={image?.height || ""} onChange={event => patchImage({ height: Number(event.target.value) })} /></label></div>}
        {coverMode === "upload" && <div className="grid gap-3 md:grid-cols-2"><label className="text-sm">Arquivo PNG, JPEG, WebP ou AVIF<input className="blog-admin-input mt-1" type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={event => { const file = event.target.files?.[0]; if (file) void uploadCover(file) }} /></label>{image?.kind === "upload" && <label className="text-sm">Texto alternativo<input className="blog-admin-input mt-1" value={image.alt} onChange={event => { setImage({ ...image, alt: event.target.value }); changed() }} /></label>}</div>}
      </fieldset>
      <section aria-label={`Corpo ${locale}`}><h2 className="mb-3 text-lg font-semibold">Corpo do artigo · {locale.toUpperCase()}</h2><p className="mb-4 text-sm text-muted-foreground">Use H2/H3, links de fontes, código com linguagem e imagens com descrição. O título acima já é o H1.</p><VisualMarkdownEditor key={locale} value={articles[locale].content} onChange={content => patchArticle({ content })} onStageAsset={stageAsset} /></section>
      <aside className="rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground"><h2 className="font-semibold text-foreground">Antes de publicar</h2><p className="mt-2">Escreva um resumo específico, confira os subtítulos, as fontes, os exemplos de código e o texto alternativo das imagens. Revise cada idioma na prévia.</p></aside>
    </div>

    <div className="mt-6 flex flex-wrap items-center gap-3"><button type="button" onClick={() => { if (!preview) setPreviewedLocales(current => current.includes(locale) ? current : [...current, locale]); setPreview(!preview); setMessage("") }} className="blog-admin-secondary">{preview ? "Fechar prévia" : "Ver prévia"}</button>{!published && <button type="button" disabled={busy || saved} onClick={() => void save(false)} className="blog-admin-secondary">Salvar rascunho</button>}<button type="button" disabled={busy || saved} onClick={() => void save(true)} className="blog-admin-primary">{busy ? "Salvando…" : published ? "Publicar alterações" : "Publicar"}</button><span className="text-sm text-muted-foreground">Prévia revisada: {previewedLocales.length}/3</span>{dirty && <span className="text-sm text-muted-foreground">Alterações não salvas</span>}</div>
    {message && <div role={conflict ? "alert" : "status"} className={`mt-5 rounded-lg border p-4 text-sm ${conflict ? "border-destructive" : "border-border"}`}><p>{message}</p>{conflict && <p className="mt-2">O texto continua neste navegador. Compare com a versão atual antes de recarregar.</p>}{saved && <p className="mt-2"><Link className="underline" href={`/admin/blog/${translationKey}`}>Reabrir artigo atualizado</Link></p>}</div>}
    {preview && <section aria-label="Prévia privada" className="mt-8 overflow-hidden rounded-xl border border-border"><p className="border-b border-border bg-muted px-5 py-3 text-sm font-semibold">Prévia privada · {locale.toUpperCase()} · {published ? "post público" : "rascunho"}</p><BlogArticle post={previewPost} translations={[]} assetPreviews={assetPreviews} /></section>}
  </div>
}
