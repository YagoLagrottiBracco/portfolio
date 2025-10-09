type Locale = 'pt' | 'en';

export interface BlogPost {
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
  const posts = getAllPosts(locale);
  return posts.find(post => post.slug === slug) || null;
}
