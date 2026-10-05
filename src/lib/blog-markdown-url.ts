export function safeBlogUrl(url: string, kind: "link" | "image"): string | undefined {
  if (!url || url.trim() !== url || /[\u0000-\u001f\\]/.test(url)) return undefined
  if (url.startsWith("/") && !url.startsWith("//")) return url
  if (kind === "link" && url.startsWith("#")) return url

  try {
    const parsed = new URL(url)
    if (parsed.protocol === "https:") return url
    if (kind === "link" && (parsed.protocol === "http:" || parsed.protocol === "mailto:")) return url
  } catch {
    return undefined
  }
  return undefined
}
