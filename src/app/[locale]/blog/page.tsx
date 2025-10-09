"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { getAllPosts, BlogPost } from "@/lib/blog";
import { useTranslation } from '@/contexts/TranslationContext';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default function Blog({ params }: PageProps) {
  const [locale, setLocale] = useState<string>('pt');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    params.then(({ locale: loc }) => {
      setLocale(loc);
      setPosts(getAllPosts(loc as 'pt' | 'en'));
    });
  }, [params]);

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">{t('blog.title')}</h1>
      <p className="text-lg text-muted-foreground mb-12">{t('blog.subtitle')}</p>

      <div className="space-y-8">
        {posts.map((post: BlogPost) => (
          <article key={post.slug} className="border-b pb-8">
            <Link href={post.url} className="group">
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
            </Link>
            <p className="text-muted-foreground mb-4">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <time>{new Date(post.date).toLocaleDateString(locale === 'pt' ? 'pt-BR' : 'en-US')}</time>
              <Link href={post.url} className="text-primary hover:underline">
                {t('blog.readMore')}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
