import Link from "next/link"
import { Rss } from "lucide-react"

import { BlogPostList } from "@/components/blog/BlogPostList"
import { NewsletterSignup } from "@/components/blog/NewsletterSignup"
import { PopularPosts } from "@/components/blog/PopularPosts"
import { RandomArticle } from "@/components/blog/RandomArticle"
import { getAllPosts } from "@/lib/blog"
import { getBlogOutline } from "@/lib/blog-outline"
import { getBlogFeedPath, getBlogIndexPath } from "@/lib/blog-routes"
import { buildSearchText } from "@/lib/blog-search"
import { getFilterTags } from "@/lib/blog-tags"
import { localeTags, type Locale } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"
import { PERSON_ID, SITE_URL } from "@/lib/site"

interface BlogIndexCopy {
  eyebrow: string
  title: string
  description: string
  read: string
  empty: string
  all: string
  filterLabel: string
  clear: string
  feed: string
  search: string
  searchPlaceholder: string
  /** `{count}` is replaced by the number of matches. */
  results: string
  /** `{query}` is replaced by what was typed. */
  noResults: string
  reset: string
}

const copy: Record<Locale, BlogIndexCopy> = {
  pt: { eyebrow: "Blog", title: "Engenharia de software aplicada", description: "Notas técnicas sobre arquitetura, produtos digitais, IA e entrega de software.", read: "Ler artigo", empty: "Nenhum post publicado ainda.", all: "Todos", filterLabel: "Filtrar artigos por tema", clear: "Remover filtro", feed: "Assinar por RSS", search: "Buscar artigos", searchPlaceholder: "Buscar por tema, tecnologia ou projeto", results: "{count} artigos encontrados", noResults: "Nenhum artigo encontrado para “{query}”.", reset: "Limpar busca e filtros" },
  en: { eyebrow: "Blog", title: "Applied software engineering", description: "Technical notes on architecture, digital products, AI, and software delivery.", read: "Read article", empty: "No posts published yet.", all: "All", filterLabel: "Filter articles by topic", clear: "Remove filter", feed: "Subscribe via RSS", search: "Search articles", searchPlaceholder: "Search by topic, technology or project", results: "{count} articles found", noResults: "No articles found for “{query}”.", reset: "Clear search and filters" },
  es: { eyebrow: "Blog", title: "Ingeniería de software aplicada", description: "Notas técnicas sobre arquitectura, productos digitales, IA y entrega de software.", read: "Leer artículo", empty: "Aún no hay publicaciones.", all: "Todos", filterLabel: "Filtrar artículos por tema", clear: "Quitar filtro", feed: "Suscribirse por RSS", search: "Buscar artículos", searchPlaceholder: "Buscar por tema, tecnología o proyecto", results: "{count} artículos encontrados", noResults: "No se encontraron artículos para “{query}”.", reset: "Limpiar búsqueda y filtros" },
}

export function BlogIndex({ locale }: { locale: Locale }) {
  const posts = getAllPosts(locale)
  const text = copy[locale]
  const formatDate = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "long", timeZone: "UTC" })
  const url = `${SITE_URL}${getBlogIndexPath(locale)}`
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    url,
    name: `${text.title} — Yago Lagrotti Bracco`,
    description: text.description,
    inLanguage: localeTags[locale],
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@type": "WebSite", name: "Yago Lagrotti Bracco", url: SITE_URL },
    blogPost: posts.slice(0, 12).map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${SITE_URL}${post.url}`,
      datePublished: post.date,
      author: { "@id": PERSON_ID },
    })),
  }
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Yago Lagrotti Bracco", item: `${SITE_URL}${getHomePath(locale)}` },
      { "@type": "ListItem", position: 2, name: text.eyebrow, item: url },
    ],
  }

  return (
    <div className="py-24" lang={localeTags[locale]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-sm font-medium text-primary">{text.eyebrow}</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold md:text-5xl">{text.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{text.description}</p>
          <a
            href={getBlogFeedPath(locale)}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <Rss className="h-4 w-4" aria-hidden="true" />
            {text.feed}
          </a>
          <div className="flex justify-center">
            <RandomArticle locale={locale} posts={posts.map(p => ({ title: p.title, url: p.url }))} />
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16" aria-label={text.eyebrow}>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">{text.empty}</p>
        ) : (
          <BlogPostList
            posts={posts.map((post) => ({
              slug: post.slug,
              url: post.url,
              title: post.title,
              excerpt: post.excerpt,
              date: post.date,
              dateLabel: formatDate.format(new Date(post.date)),
              tags: post.tags,
              image: post.image,
              searchText: buildSearchText([post.title, post.excerpt, ...post.tags, ...getBlogOutline(post.content).map((heading) => heading.text)]),
            }))}
            filterTags={getFilterTags(posts)}
            copy={{ read: text.read, all: text.all, filterLabel: text.filterLabel, clear: text.clear, search: text.search, searchPlaceholder: text.searchPlaceholder, results: text.results, noResults: text.noResults, reset: text.reset }}
          />
        )}
        {process.env.BUTTONDOWN_API_KEY && (
          <NewsletterSignup locale={locale} page={getBlogIndexPath(locale)} placement="blog-index" className="mx-auto mt-16 max-w-3xl" />
        )}
      </section>
      <section className="container mx-auto px-4 pb-20">
        <PopularPosts locale={locale} />
        <p className="mt-10 text-center text-sm text-muted-foreground">
          <Link href={locale === "pt" ? "/participar" : `/${locale}/participar`} className="font-medium text-brand underline underline-offset-4 hover:decoration-brand">
            {locale === "pt" ? "Vote na próxima pauta técnica" : locale === "en" ? "Vote on the next technical topic" : "Vota el próximo tema técnico"}
          </Link>
        </p>
      </section>
    </div>
  )
}
