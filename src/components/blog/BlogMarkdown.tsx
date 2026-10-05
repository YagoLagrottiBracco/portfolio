/* eslint-disable @next/next/no-img-element */
import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

import { remarkBlogHeadingIds } from "@/lib/blog-outline"
import { safeBlogUrl } from "@/lib/blog-markdown-url"
import type { Locale } from "@/lib/i18n"
import { BlogCopyCode } from "@/components/blog/BlogCopyCode"

type HastChild = { type?: string; value?: string; tagName?: string; children?: HastChild[]; properties?: Record<string, unknown> }

function hastText(node: HastChild): string {
  if (node.type === "text") return node.value ?? ""
  return (node.children ?? []).map(hastText).join("")
}

function htmlProps<T extends { node?: unknown }>(props: T): Omit<T, "node"> {
  const { node, ...rest } = props
  void node
  return rest
}

export function BlogMarkdown({ content, locale = "pt" }: { content: string; locale?: Locale }) {
  return <div className="blog-prose max-w-none break-words text-foreground">
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkBlogHeadingIds]}
      rehypePlugins={[[rehypeHighlight, { detect: false, plainText: ["txt", "text"] }]]}
      skipHtml
      urlTransform={(url, key) => safeBlogUrl(url, key === "src" ? "image" : "link") ?? ""}
      components={{
        h2: props => <h2 {...htmlProps(props)} className="mt-14 scroll-mt-24 border-b border-border pb-3 text-3xl font-semibold tracking-tight" />,
        h3: props => <h3 {...htmlProps(props)} className="mt-10 scroll-mt-24 text-2xl font-semibold tracking-tight" />,
        p: ({ node, children, ...props }) => {
          const only = node?.children.length === 1 ? node.children[0] as HastChild : null
          if (only?.type === "element" && only.tagName === "img") {
            const caption = typeof only.properties?.title === "string" ? only.properties.title : ""
            return <figure className="my-9"><div>{children}</div>{caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{caption}</figcaption>}</figure>
          }
          return <p className="my-5 leading-8 text-foreground/90" {...props}>{children}</p>
        },
        a: props => {
          const { href, ...rest } = htmlProps(props)
          return <a {...rest} href={href ? safeBlogUrl(href, "link") : undefined} className="font-medium text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand" />
        },
        img: props => {
          const { src, alt, ...rest } = htmlProps(props)
          const safe = typeof src === "string" ? safeBlogUrl(src, "image") : undefined
          return safe ? <img {...rest} src={safe} alt={alt ?? ""} loading="lazy" className="h-auto max-w-full rounded-xl border border-border" /> : <span>{alt}</span>
        },
        blockquote: props => <blockquote {...htmlProps(props)} className="my-8 border-l-4 border-brand bg-brand-soft px-5 py-3 italic" />,
        ul: props => <ul {...htmlProps(props)} className="my-6 list-disc space-y-2 pl-6" />,
        ol: props => <ol {...htmlProps(props)} className="my-6 list-decimal space-y-2 pl-6" />,
        li: props => <li {...htmlProps(props)} className="pl-1 leading-7" />,
        hr: props => <hr {...htmlProps(props)} className="my-10 border-border" />,
        table: props => <div className="my-8 max-w-full overflow-x-auto rounded-xl border border-border"><table {...htmlProps(props)} className="min-w-full border-collapse text-left text-sm" /></div>,
        th: props => <th {...htmlProps(props)} className="border-b border-border bg-muted px-4 py-3 font-semibold" />,
        td: props => <td {...htmlProps(props)} className="border-b border-border px-4 py-3 align-top" />,
        pre: ({ node, children }) => {
          const raw = hastText(node as HastChild).replace(/\n$/, "")
          const code = (node as HastChild).children?.find(child => child.tagName === "code")
          const className = String(code?.properties?.className ?? "")
          const language = className.match(/language-([\w-]+)/)?.[1]
          return <div className="my-8 min-w-0 overflow-hidden rounded-xl border border-border bg-muted/50"><div className="flex items-center justify-between border-b border-border px-4 py-2 text-xs text-muted-foreground"><span>{language ?? "text"}</span><BlogCopyCode code={raw} locale={locale} /></div><pre className="overflow-x-auto p-4 text-sm leading-6">{children}</pre></div>
        },
        code: props => {
          const { className, ...rest } = htmlProps(props)
          return <code {...rest} className={className ? className : "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em]"} />
        },
      }}
    >{content}</ReactMarkdown>
  </div>
}
