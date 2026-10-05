import matter from "gray-matter"

import { prepareBlogAssets, validateCoverUpload, type StagedAsset } from "@/lib/blog-admin-assets"
import type { BlogAdminBundle } from "@/lib/blog-admin-document"
import { parsePublishRequest, preparePublication, type ArticleInput, type PreparedPublication, type RemoteImageInput, type UploadImageInput } from "@/lib/blog-publishing"
import type { Locale } from "@/lib/i18n"

const locales: Locale[] = ["pt", "en", "es"]

export interface AdminSaveInput {
  translationKey: string
  articles: Record<Locale, ArticleInput>
  image?: RemoteImageInput | UploadImageInput
  publish: boolean
  assets?: StagedAsset[]
}
export interface PreparedAdminSave extends PreparedPublication {
  expectedBlobs: Record<string, string | null>
  deletePaths: string[]
}

export async function prepareAdminSave(input: AdminSaveInput, existing: BlogAdminBundle | null, allSlugs: string[]): Promise<PreparedAdminSave> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.translationKey)) throw new Error("Invalid translation key")
  if (existing && existing.translationKey !== input.translationKey) throw new Error("Translation key cannot change")
  if (typeof input.publish !== "boolean") throw new Error("Publish state is required")
  if (!input.publish && existing && locales.some(locale => existing.articles[locale]?.draft === false)) throw new Error("A published article can only be changed with Publish changes")
  const ownSlugs = new Set(locales.map(locale => existing?.articles[locale]?.slug).filter(Boolean))
  for (const locale of locales) {
    const article = input.articles?.[locale]
    if (!article) throw new Error(`Missing ${locale} article`)
    const old = existing?.articles[locale]
    if (old && !old.draft && old.slug !== article.slug) throw new Error("Published slug cannot change")
    if (allSlugs.includes(article.slug) && !ownSlugs.has(article.slug)) throw new Error(`Duplicate slug: ${article.slug}`)
  }
  const staged = await prepareBlogAssets(input.assets ?? [], Object.fromEntries(locales.map(locale => [locale, input.articles[locale].content])) as Record<Locale, string>, input.translationKey)
  if (input.image?.kind === "upload") await validateCoverUpload(input.image)
  const request = parsePublishRequest({ translationKey: input.translationKey, articles: Object.fromEntries(locales.map(locale => [locale, { ...input.articles[locale], content: staged.markdownByLocale[locale], draft: !input.publish }])), image: input.image })
  const prepared = preparePublication(request)
  prepared.files.push(...staged.files)
  const expectedBlobs: Record<string, string | null> = {}
  const deletePaths: string[] = []
  for (const locale of locales) {
    const file = prepared.files.find(item => item.path.endsWith(`.${locale}.mdx`))!
    const old = existing?.articles[locale]
    const parsed = matter(String(file.content))
    const fallbackImage = existing?.image ? { [existing.image.src.startsWith("https://") ? "url" : "src"]: existing.image.src, alt: existing.image.alt, width: existing.image.width, height: existing.image.height } : undefined
    const oldImageExtra = Object.fromEntries(Object.entries(old?.imageFrontmatter ?? {}).filter(([key]) => !["src", "url", "alt", "width", "height"].includes(key)))
    const imageFrontmatter = input.image
      ? { ...oldImageExtra, ...(parsed.data.image as Record<string, unknown>) }
      : old?.imageFrontmatter ?? fallbackImage
    file.content = matter.stringify(parsed.content, { ...old?.extraFrontmatter, ...parsed.data, ...(imageFrontmatter ? { image: imageFrontmatter } : {}) })
    expectedBlobs[file.path] = old?.sourcePath === file.path ? old.blobSha : null
    if (old && old.sourcePath !== file.path) {
      expectedBlobs[old.sourcePath] = old.blobSha
      deletePaths.push(old.sourcePath)
    }
  }
  return { ...prepared, expectedBlobs, deletePaths, commitMessage: `${input.publish ? "publish" : "draft"}(blog): ${input.translationKey}` }
}
