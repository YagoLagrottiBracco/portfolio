/**
 * @file blog.ts
 * @description Blog post data layer and utility functions.
 *
 * Posts are currently stored as static data in this file.
 * To migrate to a CMS or markdown files: replace the `posts` array
 * with a fetch/fs call and keep the same `getAllPosts` / `getPostBySlug` API.
 *
 * Each post exists in `pt`, `en` and `es` as separate entries
 * linked by a stable `translationKey`, with localized slugs.
 */

import type { Locale } from "@/lib/i18n";

/** Represents a single blog post entry. */
export interface BlogPost {
  translationKey: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
  tags: string[];
  locale: Locale;
  content: string;
  url: string;
}

// Static posts data - in a real app, this could come from an API or CMS
const posts: BlogPost[] = [
  {
    translationKey: "welcome",
    title: "Bienvenido a mi blog",
    slug: "bienvenido-a-mi-blog",
    excerpt: "Este es el primer artículo de mi blog personal. ¡Pronto habrá más contenido!",
    date: "2024-10-09",
    tags: ["introducción", "desarrollo", "tecnología"],
    locale: "es",
    content: `# Bienvenido a mi blog

¡Hola! Bienvenido a mi blog personal. Este es el espacio donde compartiré mis reflexiones, experiencias y aprendizajes sobre desarrollo de software, tecnología y vida.

## Sobre mí

Como desarrollador fullstack con más de 8 años de experiencia, he trabajado en diversos proyectos con tecnologías como Node.js, PHP, Vue.js, React y muchas más. Este blog será un espacio para documentar lo que aprendo y compartir conocimientos con la comunidad.

## Qué puedes esperar

Próximamente publicaré artículos sobre:

- **Buenas prácticas de desarrollo web**
- **Ideas sobre gestión de proyectos**
- **Tendencias tecnológicas**
- **Consejos profesionales**

## Conecta conmigo

¡Gracias por tu visita! Puedes conectar conmigo en [LinkedIn](https://linkedin.com) o explorar mi [GitHub](https://github.com).

¡Hasta el próximo artículo!`,
    url: "/blog/bienvenido-a-mi-blog",
  },
  {
    translationKey: "welcome",
    title: "Bem-vindo ao meu blog",
    slug: "bem-vindo-ao-meu-blog",
    excerpt: "Este é o primeiro post no meu blog pessoal. Fique ligado para mais conteúdo!",
    date: "2024-10-09",
    tags: ["introdução", "desenvolvimento", "tecnologia"],
    locale: "pt",
    content: `# Bem-vindo ao meu blog

Olá! Bem-vindo ao meu blog pessoal. Este é o espaço onde vou compartilhar meus pensamentos, experiências e aprendizados sobre desenvolvimento de software, tecnologia e vida.

## Sobre mim

Como desenvolvedor fullstack com mais de 8 anos de experiência, já trabalhei em diversos projetos usando tecnologias como Node.js, PHP, Vue.js, React e muito mais. Este blog será um espaço para documentar meus aprendizados e compartilhar conhecimento com a comunidade.

## O que esperar

Fique ligado para posts sobre:

- **Práticas recomendadas de desenvolvimento web**
- **Insights sobre gerenciamento de projetos**
- **Tendências tecnológicas**
- **Dicas de carreira**

## Conecte-se comigo

Obrigado por visitar! Sinta-se à vontade para se conectar comigo no [LinkedIn](https://linkedin.com) ou dar uma olhada no meu [GitHub](https://github.com).

Até o próximo post!`,
    url: "/blog/bem-vindo-ao-meu-blog",
  },
  {
    translationKey: "welcome",
    title: "Welcome to my blog",
    slug: "welcome-to-my-blog",
    excerpt: "This is the first post on my personal blog. Stay tuned for more content!",
    date: "2024-10-09",
    tags: ["introduction", "development", "technology"],
    locale: "en",
    content: `# Welcome to my blog

Hello! Welcome to my personal blog. This is where I'll share my thoughts, experiences, and learnings about software development, technology, and life.

## About me

As a fullstack developer with over 8 years of experience, I've worked on various projects using technologies like Node.js, PHP, Vue.js, React, and more. This blog will be a space to document my learnings and share knowledge with the community.

## What to expect

Stay tuned for upcoming posts about:

- **Web development best practices**
- **Project management insights**
- **Technology trends**
- **Career advice**

## Connect with me

Thank you for visiting! Feel free to connect with me on [LinkedIn](https://linkedin.com) or check out my [GitHub](https://github.com).

See you in the next post!`,
    url: "/blog/welcome-to-my-blog",
  }
];

export function getAllPosts(locale?: Locale): BlogPost[] {
  const filteredPosts = locale ? posts.filter(post => post.locale === locale) : posts;
  // Sort posts by date (newest first)
  return filteredPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string, locale?: Locale): BlogPost | null {
  const original = posts.find(post => post.slug === slug);
  if (!original || !locale) return original ?? null;
  return posts.find(post => post.translationKey === original.translationKey && post.locale === locale) ?? null;
}
