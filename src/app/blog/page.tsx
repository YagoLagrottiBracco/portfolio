"use client"

import Link from "next/link";
import { useMemo } from "react";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { getAllPosts } from "@/lib/blog";
import { useTranslation } from '@/contexts/TranslationContext';

export default function Blog() {
  const { t, locale } = useTranslation();
  const posts = useMemo(() => getAllPosts(locale), [locale]);

  return (
    <div className="py-24">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background pointer-events-none" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              ✍️ {t('blog.title')}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold">{t('blog.subtitle')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('blog.heroDescription')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const formattedDate = new Date(post.date).toLocaleDateString(
              locale === 'pt' ? 'pt-BR' : 'en-US',
              { year: 'numeric', month: 'short', day: 'numeric' }
            );

            return (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.45 }}
                className="group relative flex h-full flex-col rounded-2xl border border-border/60 bg-background/80 p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time>{formattedDate}</time>
                </div>

                <h2 className="mt-4 text-2xl font-semibold leading-snug group-hover:text-primary transition-colors">
                  {post.title}
                </h2>

                <p className="mt-3 text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary/70 px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <Link
                    href={post.url}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1"
                  >
                    {t('blog.readMore')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-primary/40 transition-colors" aria-hidden />
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
