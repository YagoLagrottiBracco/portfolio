import Link from "next/link"

export default function Blog() {
  const posts = [
    {
      title: "Welcome to My Blog",
      slug: "welcome",
      excerpt: "This is the first post on my personal blog. Stay tuned for more content!",
      date: "2024-10-09"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                {post.title}
              </Link>
            </h2>
            <p className="text-muted-foreground mb-2">{post.excerpt}</p>
            <time className="text-sm text-muted-foreground">{post.date}</time>
          </article>
        ))}
      </div>
    </div>
  )
}
