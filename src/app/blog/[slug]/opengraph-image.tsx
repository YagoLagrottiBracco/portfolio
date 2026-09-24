import { ImageResponse } from "next/og"
import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/blog"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPostBySlug((await params).slug); if (!post) notFound()
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "#0a0a0a", color: "#fafafa", fontFamily: "sans-serif" }}><div style={{ display: "flex", color: "#60a5fa", fontSize: 28, letterSpacing: 5, textTransform: "uppercase" }}>lagrotti.dev / blog</div><div style={{ display: "flex", marginTop: 36, fontSize: 64, fontWeight: 700, lineHeight: 1.12 }}>{post.title}</div><div style={{ display: "flex", marginTop: 28, color: "#a1a1aa", fontSize: 30 }}>{post.excerpt}</div><div style={{ display: "flex", marginTop: 48, color: "#93c5fd", fontSize: 26 }}>Yago Lagrotti Bracco</div></div>, size)
}
