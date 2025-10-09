import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params

  // For now, only handle the welcome post
  if (slug !== 'welcome') {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to My Blog</h1>
          <time className="text-muted-foreground">October 9, 2024</time>
        </header>

        <div className="prose prose-lg dark:prose-invert">
          <p>
            Hello! Welcome to my personal blog. This is where I&apos;ll share my thoughts,
            experiences, and insights about software development, technology, and life.
          </p>

          <p>
            As a Fullstack Developer with over 8 years of experience, I&apos;ve worked on
            various projects using technologies like Node.js, PHP, Vue.js, React, and more.
            This blog will be a space to document my learnings and share knowledge with
            the community.
          </p>

          <p>
            Stay tuned for upcoming posts about:
          </p>

          <ul>
            <li>Web development best practices</li>
            <li>Project management insights</li>
            <li>Technology trends</li>
            <li>Career advice</li>
          </ul>

          <p>
            Thank you for visiting! Feel free to connect with me on{" "}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>{" "}
            or check out my{" "}
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>.
          </p>
        </div>
      </article>
    </div>
  )
}
