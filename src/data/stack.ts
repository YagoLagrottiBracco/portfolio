/**
 * @file stack.ts
 * @description The technologies that get a page at `/stack/[slug]`. Each one
 * lists the spellings used across the data (project stacks, article tags,
 * experience text), so "Next.js 16" and "next.js" count as Next.js. Whether a
 * page is actually published depends on the evidence found for it
 * (`src/lib/stack.ts`), never on this list alone.
 */
import type { Locale } from "@/lib/i18n"

export interface TechEntry {
  slug: string
  name: string
  /** When the name itself is translated. */
  localizedName?: Record<Locale, string>
  /** Exact names in project stacks and skills, and article tags (case-insensitive). */
  aliases: string[]
  /** Searched as whole words in experience descriptions (English text). Omit when too ambiguous. */
  textPattern?: RegExp
}

export const techCatalog: TechEntry[] = [
  { slug: "nextjs", name: "Next.js", aliases: ["next.js", "next.js 16", "nextjs"], textPattern: /\bnext\.?js\b/i },
  { slug: "react", name: "React", aliases: ["react"], textPattern: /\breact\b(?!\s+(native|three|flow))/i },
  { slug: "typescript", name: "TypeScript", aliases: ["typescript"], textPattern: /\btypescript\b/i },
  { slug: "nodejs", name: "Node.js", aliases: ["node.js", "nodejs"], textPattern: /\bnode\.?js\b/i },
  { slug: "nestjs", name: "NestJS", aliases: ["nestjs"], textPattern: /\bnestjs\b/i },
  { slug: "postgresql", name: "PostgreSQL", aliases: ["postgresql", "postgres"], textPattern: /\bpostgre(sql|s)\b/i },
  { slug: "supabase", name: "Supabase", aliases: ["supabase", "supabase realtime"], textPattern: /\bsupabase\b/i },
  { slug: "mysql", name: "MySQL", aliases: ["mysql"], textPattern: /\bmysql\b/i },
  { slug: "mongodb", name: "MongoDB", aliases: ["mongodb"], textPattern: /\bmongodb\b/i },
  { slug: "kafka", name: "Apache Kafka", aliases: ["apache kafka", "kafka"], textPattern: /\bkafka\b/i },
  { slug: "clickhouse", name: "ClickHouse", aliases: ["clickhouse"], textPattern: /\bclickhouse\b/i },
  { slug: "redis", name: "Redis", aliases: ["redis"], textPattern: /\bredis\b/i },
  { slug: "golang", name: "Go", aliases: ["golang", "go"], textPattern: /\bgolang\b/i },
  { slug: "python", name: "Python", aliases: ["python"], textPattern: /\bpython\b/i },
  { slug: "laravel", name: "Laravel", aliases: ["laravel"], textPattern: /\blaravel\b/i },
  { slug: "php", name: "PHP", aliases: ["php"], textPattern: /\bphp\b/i },
  { slug: "vuejs", name: "Vue.js", aliases: ["vue.js", "vue"], textPattern: /\bvue\.?js\b/i },
  { slug: "docker", name: "Docker", aliases: ["docker"], textPattern: /\bdocker\b/i },
  { slug: "terraform", name: "Terraform", aliases: ["terraform"], textPattern: /\bterraform\b/i },
  { slug: "tailwind", name: "Tailwind CSS", aliases: ["tailwind css", "tailwind css v4", "tailwind"] },
  { slug: "threejs", name: "Three.js", aliases: ["three.js", "react three fiber"], textPattern: /\bthree\.js\b/i },
  { slug: "stripe", name: "Stripe", aliases: ["stripe"], textPattern: /\bstripe\b/i },
  { slug: "ddd", name: "Domain-Driven Design", aliases: ["ddd", "domain-driven design"], textPattern: /\bdomain-driven design\b/i },
  {
    slug: "ia",
    name: "IA e LLMs",
    localizedName: { pt: "IA e LLMs", en: "AI and LLMs", es: "IA y LLMs" },
    aliases: ["llm", "llms", "ai sdk", "ai apis", "openai", "prompt engineering", "agentes de ia", "ai agents", "inteligencia artificial", "inteligência artificial", "artificial intelligence", "ia", "ai"],
    textPattern: /\b(generative ai|artificial intelligence|llms?|ai-powered|ai developer)\b/i,
  },
]

/** Fewer than this many pieces of evidence and a page would be thin; it is not published. */
export const MIN_TECH_EVIDENCE = 3
