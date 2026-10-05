import { Rss } from "lucide-react"

import { BlogPostList } from "@/components/blog/BlogPostList"
import { getAllPosts } from "@/lib/blog"
import { getBlogFeedPath } from "@/lib/blog-routes"
import { getFilterTags } from "@/lib/blog-tags"
import { localeTags, type Locale } from "@/lib/i18n"

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
}

const copy: Record<Locale, BlogIndexCopy> = {
  pt: { eyebrow: "Blog", title: "Engenharia de software aplicada", description: "Notas técnicas sobre arquitetura, produtos digitais, IA e entrega de software.", read: "Ler artigo", empty: "Nenhum post publicado ainda.", all: "Todos", filterLabel: "Filtrar artigos por tema", clear: "Remover filtro", feed: "Assinar por RSS" },
  en: { eyebrow: "Blog", title: "Applied software engineering", description: "Technical notes on architecture, digital products, AI, and software delivery.", read: "Read article", empty: "No posts published yet.", all: "All", filterLabel: "Filter articles by topic", clear: "Remove filter", feed: "Subscribe via RSS" },
  es: { eyebrow: "Blog", title: "Ingeniería de software aplicada", description: "Notas técnicas sobre arquitectura, productos digitales, IA y entrega de software.", read: "Leer artículo", empty: "Aún no hay publicaciones.", all: "Todos", filterLabel: "Filtrar artículos por tema", clear: "Quitar filtro", feed: "Suscribirse por RSS" },
}

export function BlogIndex({ locale }: { locale: Locale }) {
  const posts = getAllPosts(locale)
  const text = copy[locale]
  const formatDate = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "long", timeZone: "UTC" })

  return (
    <div className="py-24" lang={localeTags[locale]}>
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
            }))}
            filterTags={getFilterTags(posts)}
            copy={{ read: text.read, all: text.all, filterLabel: text.filterLabel, clear: text.clear }}
          />
        )}
      </section>
    </div>
  )
}
