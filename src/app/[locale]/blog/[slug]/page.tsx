import { isLocale } from "@/lib/i18n"
import { getPostBySlug } from "@/lib/blog"
import { notFound, permanentRedirect } from "next/navigation"

export default async function LegacyLocaleBlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const post = getPostBySlug(slug)
  if (!post || post.locale !== locale) notFound()
  permanentRedirect(post.url)
}
