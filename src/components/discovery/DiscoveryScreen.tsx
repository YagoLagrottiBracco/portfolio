import Link from "next/link"
import { ArrowRight, Download, ExternalLink, FileJson, Mail, Phone, Rss } from "lucide-react"

import { AnalyticsDashboard } from "@/components/discovery/AnalyticsDashboard"
import { StatusBoard } from "@/components/discovery/StatusBoard"
import { BlogPoll } from "@/components/blog/BlogPoll"
import { Navigation } from "@/components/organisms/Navigation"
import { Footer } from "@/components/organisms/Footer"
import { getAllPosts } from "@/lib/blog"
import { getCaseStudyProjects } from "@/lib/projects"
import { aiPolicy, blogroll, channelLabels, discoveryPages, engineeringPrinciples, radarEditions, readingShelf, topicProposals, type DiscoverySlug } from "@/data/discovery"
import { personalData } from "@/data/personal"
import { localeTags, type Locale } from "@/lib/i18n"
import { getBlogIndexPath } from "@/lib/blog-routes"
import { getCvFileName, getCvPath } from "@/lib/cv-routes"

function PageShell({ locale, slug, children }: { locale: Locale; slug: DiscoverySlug; children: React.ReactNode }) {
  const page = discoveryPages[slug]
  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
      <Navigation />
      <main id="main" className="pb-24 pt-28">
        <header className="container mx-auto max-w-4xl px-4">
          <p className="text-sm font-medium uppercase tracking-widest text-brand">lagrotti.dev</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">{page.title[locale]}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">{page.description[locale]}</p>
        </header>
        <div className="container mx-auto max-w-5xl px-4">{children}</div>
      </main>
      <Footer />
    </div>
  )
}

function LinksScreen({ locale }: { locale: Locale }) {
  const posts = getAllPosts(locale).slice(0, 3)
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_CHANNEL_URL
  const telegram = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_URL
  const channels = [
    whatsapp ? { href: whatsapp, label: channelLabels.whatsapp[locale], external: true } : null,
    telegram ? { href: telegram, label: channelLabels.telegram[locale], external: true } : null,
    { href: getBlogIndexPath(locale), label: channelLabels.follow[locale], external: false },
    { href: "/blog/feed.xml", label: "RSS", external: false },
  ].filter((item): item is NonNullable<typeof item> => item !== null)

  return <section className="mt-12 grid gap-4 md:grid-cols-2">
    {channels.map(item => (
      <Link key={item.href} href={item.href} {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-brand/50">
        <span className="flex items-center justify-between gap-4 font-semibold">{item.label}{item.external && <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}</span>
        <span className="mt-2 block break-all text-sm text-muted-foreground">{item.href}</span>
      </Link>
    ))}
    <div className="rounded-xl border border-border bg-muted/25 p-5 md:col-span-2">
      <h2 className="font-semibold">{locale === "pt" ? "Últimos artigos" : locale === "en" ? "Latest articles" : "Últimos artículos"}</h2>
      <ol className="mt-4 space-y-3">
        {posts.map(post => <li key={post.slug}><Link className="font-medium text-brand underline-offset-4 hover:underline" href={post.url}>{post.title}</Link><p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p></li>)}
      </ol>
    </div>
  </section>
}

function BlogrollScreen({ locale }: { locale: Locale }) {
  return <section className="mt-12">
    <Link href="/blogroll.opml" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-contrast"><Rss className="h-4 w-4" aria-hidden="true" />OPML</Link>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {blogroll.map(item => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-brand/50">
        <h2 className="font-semibold">{item.name}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description[locale]}</p>
        <p className="mt-3 break-all text-xs text-muted-foreground">{item.url}</p>
      </a>)}
    </div>
  </section>
}

function RadarScreen({ locale }: { locale: Locale }) {
  return <section className="mt-12 space-y-8">
    {radarEditions.map(edition => <article key={edition.edition} className="rounded-2xl border border-border bg-background p-6">
      <p className="text-sm text-muted-foreground">{edition.date} · #{edition.edition}</p>
      <h2 className="mt-2 text-2xl font-semibold">{edition.title[locale]}</h2>
      <ol className="mt-6 space-y-5">
        {edition.links.map(item => <li key={item.url} className="border-t border-border pt-5">
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-brand underline-offset-4 hover:underline">{item.title}<ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note[locale]}</p>
        </li>)}
      </ol>
    </article>)}
  </section>
}

function ReadingScreen({ locale }: { locale: Locale }) {
  return <section className="mt-12 grid gap-4 md:grid-cols-2">
    {readingShelf.map(item => <article key={item.title} className="rounded-xl border border-border bg-background p-5">
      <h2 className="text-xl font-semibold">{item.title}</h2>
      <p className="mt-1 text-sm font-medium text-brand">{item.author}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.note[locale]}</p>
    </article>)}
  </section>
}

function PrinciplesScreen({ locale }: { locale: Locale }) {
  return <section className="mt-12 grid gap-4 md:grid-cols-2">
    {engineeringPrinciples.map((item, index) => <article key={item.title.en} className="rounded-xl border border-border bg-background p-5">
      <span className="text-sm font-semibold text-brand">{String(index + 1).padStart(2, "0")}</span>
      <h2 className="mt-2 text-xl font-semibold">{item.title[locale]}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body[locale]}</p>
    </article>)}
  </section>
}

function AiPolicyScreen({ locale }: { locale: Locale }) {
  return <section className="mt-12 space-y-4">
    {aiPolicy.map(item => <article key={item.title.en} className="rounded-xl border border-border bg-background p-5">
      <h2 className="text-xl font-semibold">{item.title[locale]}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body[locale]}</p>
    </article>)}
  </section>
}

function SkillsScreen({ locale }: { locale: Locale }) {
  const posts = getAllPosts()
  const projects = personalData.projects
  const evidence = personalData.skills.map(skill => {
    const normalized = skill.toLowerCase()
    const projectHits = projects.filter(project => project.techStack.some(tech => tech.toLowerCase().includes(normalized) || normalized.includes(tech.toLowerCase()))).slice(0, 3)
    const postHits = posts.filter(post => post.tags.some(tag => tag.toLowerCase().includes(normalized) || normalized.includes(tag.toLowerCase()))).slice(0, 2)
    return { skill, projectHits, postHits }
  })

  return <section className="mt-12 space-y-8">
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {evidence.map(item => <article key={item.skill} className="rounded-xl border border-border bg-background p-5">
        <h2 className="font-semibold">{item.skill}</h2>
        {item.projectHits.length > 0 && <p className="mt-3 text-sm text-muted-foreground">{item.projectHits.map(project => project.title[locale]).join(" · ")}</p>}
        {item.postHits.length > 0 && <p className="mt-2 text-sm"><Link href={item.postHits[0].url} className="text-brand underline-offset-4 hover:underline">{item.postHits[0].title}</Link></p>}
        {item.projectHits.length === 0 && item.postHits.length === 0 && <p className="mt-3 text-sm text-muted-foreground">{locale === "pt" ? "Evidência descrita nas experiências profissionais." : locale === "en" ? "Evidence described in professional experience." : "Evidencia descrita en la experiencia profesional."}</p>}
      </article>)}
    </div>
    <section className="rounded-2xl border border-border bg-muted/25 p-6">
      <h2 className="text-2xl font-semibold">{locale === "pt" ? "Certificações" : locale === "en" ? "Certifications" : "Certificaciones"}</h2>
      <ul className="mt-4 grid gap-2 md:grid-cols-2">
        {personalData.certifications.map(item => <li key={item} className="rounded-lg bg-background p-3 text-sm">{item}</li>)}
      </ul>
    </section>
  </section>
}

function AnalyticsPageScreen({ locale }: { locale: Locale }) {
  return <AnalyticsDashboard locale={locale} />
}

function StatusPageScreen({ locale }: { locale: Locale }) {
  return <StatusBoard locale={locale} />
}

function CardScreen({ locale }: { locale: Locale }) {
  const cardUrl = "https://lagrotti.dev/api/vcard"
  const qrBase = process.env.NEXT_PUBLIC_QR_SERVICE_URL ?? "https://api.qrserver.com/v1/create-qr-code/"
  const qr = `${qrBase}${qrBase.includes("?") ? "&" : "?"}size=240x240&data=${encodeURIComponent(cardUrl)}`
  return <section className="mt-12 grid gap-8 md:grid-cols-[1fr_260px] md:items-start">
    <div className="rounded-2xl border border-border bg-background p-6">
      <h2 className="text-3xl font-bold">{personalData.name}</h2>
      <p className="mt-2 text-lg text-brand">{personalData.headline}</p>
      <p className="mt-5 leading-7 text-muted-foreground">{personalData.summary}</p>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <a href={`mailto:${personalData.socialLinks.email}`} className="inline-flex items-center gap-2 text-sm font-medium text-brand"><Mail className="h-4 w-4" aria-hidden="true" />{personalData.socialLinks.email}</a>
        <a href={`tel:${personalData.socialLinks.phone.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-2 text-sm font-medium text-brand"><Phone className="h-4 w-4" aria-hidden="true" />{personalData.socialLinks.phone}</a>
      </div>
      <div className="mt-7 flex flex-wrap gap-3">
        <a href="/api/vcard" download className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-contrast"><Download className="h-4 w-4" aria-hidden="true" />vCard</a>
        <a href={personalData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold">LinkedIn<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
      </div>
    </div>
    <figure className="rounded-2xl border border-border bg-background p-5 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- QR service is configurable and receives only the public vCard URL */}
      <img src={qr} alt={locale === "pt" ? "QR Code do cartão digital" : locale === "en" ? "QR Code for the digital card" : "Código QR de la tarjeta digital"} width={240} height={240} className="mx-auto rounded-lg" />
      <figcaption className="mt-3 text-xs text-muted-foreground">{cardUrl}</figcaption>
    </figure>
  </section>
}

function ResumeScreen({ locale }: { locale: Locale }) {
  const jobs = [...personalData.experience].sort((a, b) => b.order - a.order)
  const education = [...personalData.education].sort((a, b) => b.order - a.order)
  return <section className="mt-12 space-y-10">
    <div className="flex flex-wrap gap-3"><a href={getCvPath(locale)} download={getCvFileName(locale)} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-contrast"><Download className="h-4 w-4" aria-hidden="true" />PDF</a><a href={`/api/resume/${locale}`} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold"><FileJson className="h-4 w-4" aria-hidden="true" />JSON Resume</a></div>
    <section><h2 className="text-2xl font-semibold">{locale === "pt" ? "Resumo" : locale === "en" ? "Summary" : "Resumen"}</h2><p className="mt-3 leading-8 text-muted-foreground">{personalData.summary}</p></section>
    <section><h2 className="text-2xl font-semibold">{locale === "pt" ? "Experiência" : locale === "en" ? "Experience" : "Experiencia"}</h2><ol className="mt-5 space-y-6">{jobs.map(job => <li key={`${job.company}-${job.order}`} className="border-t border-border pt-5"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{job.position[locale]}</h3><span className="text-sm text-muted-foreground">{job.period[locale]}</span></div><p className="mt-1 text-sm font-medium text-brand">{job.company}</p><p className="mt-2 leading-7 text-muted-foreground">{job.description[locale]}</p></li>)}</ol></section>
    <section><h2 className="text-2xl font-semibold">{locale === "pt" ? "Projetos em destaque" : locale === "en" ? "Selected projects" : "Proyectos destacados"}</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{getCaseStudyProjects().slice(0, 6).map(project => <Link key={project.slug} href={`${locale === "pt" ? "" : `/${locale}`}/projetos/${project.slug}`} className="rounded-xl border border-border bg-background p-5 hover:border-brand/50"><h3 className="font-semibold">{project.title[locale]}</h3><p className="mt-2 text-sm text-muted-foreground">{project.tagline[locale]}</p></Link>)}</div></section>
    <section><h2 className="text-2xl font-semibold">{locale === "pt" ? "Formação e certificações" : locale === "en" ? "Education and certifications" : "Formación y certificaciones"}</h2><ol className="mt-5 space-y-4">{education.map(entry => <li key={`${entry.institution}-${entry.order}`} className="border-t border-border pt-4"><h3 className="font-semibold">{entry.degree[locale]}</h3><p className="text-sm text-muted-foreground">{entry.institution} · {entry.period[locale]}</p></li>)}</ol><ul className="mt-6 grid gap-2 md:grid-cols-2">{personalData.certifications.map(item => <li key={item} className="rounded-lg bg-muted/25 p-3 text-sm">{item}</li>)}</ul></section>
  </section>
}

function ParticipateScreen({ locale }: { locale: Locale }) {
  return <section className="mt-12">
    <div className="grid gap-4 md:grid-cols-2">
      {topicProposals.map(topic => <article key={topic.id} className="rounded-xl border border-border bg-background p-5"><h2 className="font-semibold">{topic.title[locale]}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{topic.description[locale]}</p></article>)}
    </div>
    <BlogPoll locale={locale} pollId="proximas-pautas" title={discoveryPages.participar.title[locale]} options={topicProposals.map(topic => ({ id: topic.id, label: topic.title[locale] }))} />
  </section>
}

export function DiscoveryScreen({ locale, slug }: { locale: Locale; slug: DiscoverySlug }) {
  return <PageShell locale={locale} slug={slug}>
    {slug === "links" && <LinksScreen locale={locale} />}
    {slug === "blogroll" && <BlogrollScreen locale={locale} />}
    {slug === "radar" && <RadarScreen locale={locale} />}
    {slug === "leitura" && <ReadingScreen locale={locale} />}
    {slug === "principios" && <PrinciplesScreen locale={locale} />}
    {slug === "ia" && <AiPolicyScreen locale={locale} />}
    {slug === "habilidades" && <SkillsScreen locale={locale} />}
    {slug === "status" && <StatusPageScreen locale={locale} />}
    {slug === "analytics" && <AnalyticsPageScreen locale={locale} />}
    {slug === "cartao" && <CardScreen locale={locale} />}
    {slug === "curriculo" && <ResumeScreen locale={locale} />}
    {slug === "participar" && <ParticipateScreen locale={locale} />}
  </PageShell>
}
