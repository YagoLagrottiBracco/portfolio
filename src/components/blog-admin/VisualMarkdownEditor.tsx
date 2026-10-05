"use client"

import { useEffect, useRef, useState } from "react"
import "@milkdown/crepe/theme/common/style.css"
import "@milkdown/crepe/theme/frame.css"

import { checkMarkdownRoundtrip } from "@/lib/blog-editor-roundtrip"

interface Props {
  value: string
  onChange: (markdown: string) => void
  onStageAsset: (file: File) => Promise<string>
}

export function VisualMarkdownEditor({ value, onChange, onStageAsset }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const initial = useRef(value)
  const change = useRef(onChange)
  const stage = useRef(onStageAsset)
  const [mode, setMode] = useState<"visual" | "source">("visual")
  const [reason, setReason] = useState("")
  const [ready, setReady] = useState(false)
  change.current = onChange
  stage.current = onStageAsset

  useEffect(() => {
    let active = true
    let created = false
    let instance: { destroy: () => void } | undefined
    async function setup() {
      try {
        const { Crepe } = await import("@milkdown/crepe")
        if (!active || !root.current) return
        const crepe = new Crepe({
          root: root.current,
          defaultValue: initial.current,
          features: { [Crepe.Feature.Latex]: false },
          featureConfigs: { [Crepe.Feature.ImageBlock]: { onUpload: file => stage.current(file) } },
        })
        instance = crepe
        crepe.on(listener => listener.markdownUpdated((_ctx, markdown) => {
          if (!created) return
          const result = checkMarkdownRoundtrip(markdown, markdown)
          if (!result.safe) { setReason(result.reason ?? "Markdown incompatível"); setMode("source") }
          change.current(markdown)
        }))
        await crepe.create()
        if (!active) return
        const result = checkMarkdownRoundtrip(initial.current, crepe.getMarkdown())
        if (!result.safe) { setReason(result.reason ?? "Markdown incompatível"); setMode("source") }
        created = true
        setReady(true)
      } catch {
        if (active) { setReason("Editor visual indisponível; use o Markdown."); setMode("source"); setReady(true) }
      }
    }
    setup()
    return () => { active = false; instance?.destroy() }
  }, [])

  return <div className="blog-visual-editor">
    <div className="blog-editor-tabs" role="tablist" aria-label="Modo de edição">
      <button type="button" role="tab" aria-selected={mode === "visual"} disabled={!ready || !!reason} onClick={() => setMode("visual")}>Visual</button>
      <button type="button" role="tab" aria-selected={mode === "source"} onClick={() => setMode("source")}>Markdown</button>
    </div>
    {reason && <p role="status">{reason}</p>}
    <div ref={root} hidden={mode !== "visual"} aria-label="Editor visual do artigo" />
    {mode === "source" && <textarea aria-label="Markdown do artigo" value={value} onChange={event => { setReason("Recarregue o artigo para voltar ao modo visual após editar o Markdown."); change.current(event.target.value) }} rows={22} spellCheck />}
  </div>
}
