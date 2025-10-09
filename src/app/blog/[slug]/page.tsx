"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { getPostBySlug } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import { useTranslation } from '@/contexts/TranslationContext';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPost({ params }: PageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const { t, locale } = useTranslation();

  useEffect(() => {
    params.then(({ slug }) => {
      const currentLocale = localStorage.getItem('locale') as 'pt' | 'en' || 'pt';
      const foundPost = getPostBySlug(slug, currentLocale);
      if (!foundPost) {
        notFound();
      }
      setPost(foundPost);
    });
  }, [params]);

  if (!post) {
    return (
      <div className="py-32">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl border border-dashed border-border/70 bg-muted/30 p-12 text-center text-muted-foreground">
            {t('common.loading')}
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === 'pt' ? 'pt-BR' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="pb-24">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto flex max-w-4xl flex-col gap-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-transform hover:-translate-x-1"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('blog.backToBlog')}
            </Link>

            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1">
                  <Calendar className="h-4 w-4" />
                  {t('blog.publishedOn')} {formattedDate}
                </span>
                <div className="flex flex-wrap gap-2">
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
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}
          className="mx-auto -mt-12 max-w-3xl rounded-3xl border border-border/60 bg-background/90 p-8 shadow-lg"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <div
              className="space-y-6"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }}
            />
          </div>
        </motion.article>
      </div>
    </div>
  );
}
