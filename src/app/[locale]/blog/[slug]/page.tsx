import { permanentRedirect } from "next/navigation"

/** Legacy `/pt/blog/[slug]`. The canonical post URL is `/blog/[slug]`. */
export default async function LegacyLocaleBlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  permanentRedirect(`/blog/${slug}`)
}
