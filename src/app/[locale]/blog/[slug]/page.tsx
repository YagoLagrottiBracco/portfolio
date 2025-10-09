"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { getPostBySlug } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import { useTranslation } from '@/contexts/TranslationContext';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default function BlogPost({ params }: PageProps) {
  const [locale, setLocale] = useState<string>('pt');
  const [post, setPost] = useState<BlogPost | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    params.then(({ locale: loc, slug }) => {
      setLocale(loc);
      const foundPost = getPostBySlug(slug, loc as 'pt' | 'en');
      if (!foundPost) {
        notFound();
      }
      setPost(foundPost);
    });
  }, [params]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <article>
        <header className="mb-8">
          <Link href="/blog" className="text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← {t('blog.backToBlog')}
          </Link>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <time>{t('blog.publishedOn')} {new Date(post.date).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US')}</time>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
        </div>
      </article>
    </div>
  );
}
