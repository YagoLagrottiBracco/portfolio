import assert from "node:assert/strict"
import test from "node:test"
import { buildLlmsTxt } from "../src/lib/llms"

test("maps the site as llms.txt Markdown with absolute links", () => {
  const text = buildLlmsTxt({
    siteUrl: "https://lagrotti.dev",
    name: "Yago Lagrotti Bracco",
    headline: "Senior Software Engineer",
    summary: "Builds products\nend to end.",
    contact: { email: "y@example.com", linkedin: "https://linkedin.com/in/y", github: "https://github.com/y", workWithMe: "/en/trabalhe-comigo" },
    caseStudies: [{ title: "EnvRune — CLI", url: "/en/projetos/envrune", summary: "Secrets out of .env." }],
    posts: [
      { title: "Artigo", url: "/blog/artigo", excerpt: "Resumo", locale: "pt" },
      { title: "Article", url: "/blog/article", excerpt: "Summary", locale: "en" },
    ],
    cv: { pt: "/cv/pt", en: "/cv/en", es: "/cv/es" },
    feeds: { pt: "/blog/feed.xml", en: "/en/blog/feed.xml", es: "/es/blog/feed.xml" },
  })

  assert.match(text, /^# Yago Lagrotti Bracco\n\n> Senior Software Engineer\. Builds products end to end\./)
  assert.match(text, /- \[Work with me\]\(https:\/\/lagrotti\.dev\/en\/trabalhe-comigo\)/)
  assert.match(text, /## Case studies\n\n- \[EnvRune — CLI\]\(https:\/\/lagrotti\.dev\/en\/projetos\/envrune\): Secrets out of \.env\./)
  assert.match(text, /## Articles \(Português\)\n\n- \[Artigo\]\(https:\/\/lagrotti\.dev\/blog\/artigo\): Resumo/)
  assert.doesNotMatch(text, /Articles \(Español\)/, "no empty language section")
  assert.match(text, /- \[RSS feed \(English\)\]\(https:\/\/lagrotti\.dev\/en\/blog\/feed\.xml\)/)
})
