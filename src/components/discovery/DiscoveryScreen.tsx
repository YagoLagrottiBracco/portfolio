import Link from "next/link"
import { ArrowRight, Download, ExternalLink, FileJson, FileText, Mail, Phone, Rss } from "lucide-react"
import QRCode from "qrcode"

import { AnalyticsDashboard } from "@/components/discovery/AnalyticsDashboard"
import { StatusBoard } from "@/components/discovery/StatusBoard"
import { BlogPoll } from "@/components/blog/BlogPoll"
import { Navigation } from "@/components/organisms/Navigation"
import { Footer } from "@/components/organisms/Footer"
import { nowMeta } from "@/components/organisms/NowScreen"
import { stackCopy } from "@/components/organisms/StackScreens"
import { localizeLabel } from "@/data/content-labels"
import { aiPolicy, blogroll, channelLabels, discoveryPages, discoverySlugs, engineeringPrinciples, radarEditions, readingShelf, topicProposals, type DiscoverySlug } from "@/data/discovery"
import { personalData } from "@/data/personal"
import { workWithMe } from "@/data/work-with-me"
import { getAllPosts } from "@/lib/blog"
import { getBlogFeedPath, getBlogIndexPath } from "@/lib/blog-routes"
import { getCaseStudyPath } from "@/lib/case-study-routes"
import { cvFocuses, cvFocusSpecs } from "@/lib/cv-focus"
import { getCvFileName, getCvPath } from "@/lib/cv-routes"
import { getDiscoveryPath } from "@/lib/discovery-routes"
import { localeTags, type Locale } from "@/lib/i18n"
import { getHomePath } from "@/lib/locale-routes"
import { getPagePath } from "@/lib/page-routes"
import { getCaseStudyProjects } from "@/lib/projects"
import { getResourcePath } from "@/lib/resource-routes"
import { PERSON_ID, SITE_URL } from "@/lib/site"
import { getStackPath, publishedTechs, techFor } from "@/lib/stack"
import enMessages from "@/messages/en.json"
import esMessages from "@/messages/es.json"
import ptMessages from "@/messages/pt.json"

const messages = { pt: ptMessages, en: enMessages, es: esMessages }

const profileSlugs = new Set<DiscoverySlug>(["curriculo", "cartao"])
const collectionSlugs = new Set<DiscoverySlug>(["links", "blogroll", "radar", "leitura", "habilidades"])

function PageShell({ locale, slug, children }: { locale: Locale; slug: DiscoverySlug; children: React.ReactNode }) {
  const page = discoveryPages[slug]
  const url = `${SITE_URL}${getDiscoveryPath(locale, slug)}`
  const schemaType = profileSlugs.has(slug) ? "ProfilePage" : collectionSlugs.has(slug) ? "CollectionPage" : "WebPage"
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType,
    url,
    name: page.title[locale],
    description: page.description[locale],
    inLanguage: localeTags[locale],
    ...(profileSlugs.has(slug) ? { mainEntity: { "@id": PERSON_ID } } : {}),
    about: { "@id": PERSON_ID },
    author: { "@id": PERSON_ID },
    isPartOf: { "@type": "WebSite", name: personalData.name, url: SITE_URL },
  }
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: personalData.name, item: `${SITE_URL}${getHomePath(locale)}` },
      { "@type": "ListItem", position: 2, name: page.title[locale], item: url },
    ],
  }
  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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
    { href: personalData.socialLinks.github, label: "GitHub", external: true },
    { href: personalData.socialLinks.linkedin, label: "LinkedIn", external: true },
    { href: getBlogIndexPath(locale), label: channelLabels.follow[locale], external: false },
    { href: getBlogFeedPath(locale), label: "RSS", external: false },
  ].filter((item): item is NonNullable<typeof item> => item !== null)

  const corePages = [
    { href: getPagePath(locale, "trabalhe-comigo"), title: workWithMe.title[locale], description: workWithMe.description[locale] },
    { href: getStackPath(locale), title: stackCopy[locale].indexTitle, description: stackCopy[locale].indexMeta },
    {
      href: getResourcePath(locale),
      title: messages[locale].navigation.resources,
      description:
        locale === "pt"
          ? "Ferramentas interativas, simuladores, templates, guias e pacotes CLI/Action."
          : locale === "en"
            ? "Interactive tools, simulators, templates, guides and CLI/Action packages."
            : "Herramientas interactivas, simuladores, plantillas, guías y paquetes CLI/Action.",
    },
    { href: getPagePath(locale, "agora"), title: nowMeta[locale].title, description: nowMeta[locale].description },
  ]

  const hubSlugs = discoverySlugs.filter((slug) => slug !== "links")

  return (
    <div className="mt-12 space-y-12">
      <section className="grid gap-4 md:grid-cols-2">
        {channels.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-brand/50"
          >
            <span className="flex items-center justify-between gap-4 font-semibold">
              {item.label}
              {item.external && <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
            </span>
            <span className="mt-2 block break-all text-sm text-muted-foreground">{item.href}</span>
          </Link>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          {locale === "pt" ? "Páginas principais" : locale === "en" ? "Core pages" : "Páginas principales"}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {corePages.map((page) => (
            <Link key={page.href} href={page.href} className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-brand/50">
              <span className="flex items-center justify-between gap-3 font-semibold text-brand">
                {page.title}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{page.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">
          {locale === "pt" ? "Diretório de descoberta" : locale === "en" ? "Discovery directory" : "Directorio de descubrimiento"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hubSlugs.map((slug) => (
            <Link
              key={slug}
              href={getDiscoveryPath(locale, slug)}
              className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-brand/50"
            >
              <h3 className="font-semibold">{discoveryPages[slug].title[locale]}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{discoveryPages[slug].description[locale]}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-muted/25 p-5">
        <h2 className="font-semibold">{locale === "pt" ? "Últimos artigos" : locale === "en" ? "Latest articles" : "Últimos artículos"}</h2>
        <ol className="mt-4 space-y-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link className="font-medium text-brand underline-offset-4 hover:underline" href={post.url}>
                {post.title}
              </Link>
              <p className="mt-1 text-sm text-muted-foreground">{post.excerpt}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
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
  const published = new Set(publishedTechs(posts).map((entry) => entry.slug))
  const projects = personalData.projects
  const evidence = personalData.skills.map(skill => {
    const normalized = skill.toLowerCase()
    const tech = techFor(skill)
    const stackSlug = tech && published.has(tech.slug) ? tech.slug : undefined
    const projectHits = projects.filter(project => project.techStack.some(t => t.toLowerCase().includes(normalized) || normalized.includes(t.toLowerCase()))).slice(0, 3)
    const postHits = posts.filter(post => post.locale === locale && post.tags.some(tag => tag.toLowerCase().includes(normalized) || normalized.includes(tag.toLowerCase()))).slice(0, 2)
    return { skill, label: localizeLabel(skill, locale), stackSlug, projectHits, postHits }
  })

  return <section className="mt-12 space-y-8">
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {evidence.map(item => <article key={item.skill} className="rounded-xl border border-border bg-background p-5">
        <h2 className="font-semibold">
          {item.stackSlug ? (
            <Link href={getStackPath(locale, item.stackSlug)} className="inline-flex items-center gap-1.5 text-brand underline-offset-4 hover:underline">
              {item.label}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ) : (
            item.label
          )}
        </h2>
        {item.projectHits.length > 0 && (
          <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-sm text-muted-foreground">
            {item.projectHits.map((project, idx) => (
              <span key={project.slug}>
                {idx > 0 && "· "}
                {project.caseStudy ? (
                  <Link href={getCaseStudyPath(locale, project.slug)} className="hover:text-foreground hover:underline">
                    {project.title[locale]}
                  </Link>
                ) : (
                  project.title[locale]
                )}
              </span>
            ))}
          </p>
        )}
        {item.postHits.length > 0 && <p className="mt-2 text-sm"><Link href={item.postHits[0].url} className="text-brand underline-offset-4 hover:underline">{item.postHits[0].title}</Link></p>}
        {item.projectHits.length === 0 && item.postHits.length === 0 && <p className="mt-3 text-sm text-muted-foreground">{locale === "pt" ? "Evidência descrita nas experiências profissionais." : locale === "en" ? "Evidence described in professional experience." : "Evidencia descrita en la experiencia profesional."}</p>}
      </article>)}
    </div>
    <section className="rounded-2xl border border-border bg-muted/25 p-6">
      <h2 className="text-2xl font-semibold">{locale === "pt" ? "Certificações" : locale === "en" ? "Certifications" : "Certificaciones"}</h2>
      <ul className="mt-4 grid gap-2 md:grid-cols-2">
        {personalData.certifications.map(item => <li key={item} className="rounded-lg bg-background p-3 text-sm">{localizeLabel(item, locale)}</li>)}
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

async function CardScreen({ locale }: { locale: Locale }) {
  const cardUrl = "https://lagrotti.dev/api/vcard"
  const text = messages[locale]
  const svg = await QRCode.toString(cardUrl, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 240,
  })
  const qrDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
  return <section className="mt-12 grid gap-8 md:grid-cols-[1fr_260px] md:items-start">
    <div className="rounded-2xl border border-border bg-background p-6">
      <h2 className="text-3xl font-bold">{personalData.name}</h2>
      <p className="mt-2 text-lg text-brand">{text.hero.headline} · {text.hero.focus}</p>
      <p className="mt-5 leading-7 text-muted-foreground">{text.about.summary}</p>
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
      {/* eslint-disable-next-line @next/next/no-img-element -- Locally generated SVG Data URI */}
      <img src={qrDataUri} alt={locale === "pt" ? "QR Code do cartão digital" : locale === "en" ? "QR Code for the digital card" : "Código QR de la tarjeta digital"} width={240} height={240} className="mx-auto rounded-lg bg-white p-2" />
      <figcaption className="mt-3 text-xs text-muted-foreground">{cardUrl}</figcaption>
    </figure>
  </section>
}

function ResumeScreen({ locale }: { locale: Locale }) {
  const text = messages[locale]
  const jobs = [...personalData.experience].sort((a, b) => b.order - a.order)
  const education = [...personalData.education].sort((a, b) => b.order - a.order)
  return <section className="mt-12 space-y-10">
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <a href={getCvPath(locale)} download={getCvFileName(locale)} className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-brand-contrast"><Download className="h-4 w-4" aria-hidden="true" />PDF</a>
        <a href={`/cv/${locale}/plain.txt`} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold"><FileText className="h-4 w-4" aria-hidden="true" />{locale === "pt" ? "Texto puro (ATS)" : locale === "en" ? "Plain text (ATS)" : "Texto plano (ATS)"}</a>
        <a href={`/api/resume/${locale}`} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold"><FileJson className="h-4 w-4" aria-hidden="true" />JSON Resume</a>
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
        <span className="font-medium">{locale === "pt" ? "PDF por foco:" : locale === "en" ? "Focused PDF:" : "PDF por enfoque:"}</span>
        {cvFocuses.map((focus) => (
          <a
            key={focus}
            href={getCvPath(locale, focus)}
            download={getCvFileName(locale, focus)}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 font-medium text-foreground transition-colors hover:border-brand/50 hover:text-brand"
          >
            <Download className="h-3 w-3" aria-hidden="true" />
            {cvFocusSpecs[focus].label[locale]}
          </a>
        ))}
      </div>
    </div>
    <section><h2 className="text-2xl font-semibold">{locale === "pt" ? "Resumo" : locale === "en" ? "Summary" : "Resumen"}</h2><p className="mt-3 leading-8 text-muted-foreground">{text.about.summary}</p></section>
    <section><h2 className="text-2xl font-semibold">{locale === "pt" ? "Experiência" : locale === "en" ? "Experience" : "Experiencia"}</h2><ol className="mt-5 space-y-6">{jobs.map(job => <li key={`${job.company}-${job.order}`} className="border-t border-border pt-5"><div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold">{job.position[locale]}</h3><span className="text-sm text-muted-foreground">{job.period[locale]}</span></div><p className="mt-1 text-sm font-medium text-brand">{localizeLabel(job.company, locale)}</p><p className="mt-2 leading-7 text-muted-foreground">{job.description[locale]}</p></li>)}</ol></section>
    <section><h2 className="text-2xl font-semibold">{locale === "pt" ? "Projetos em destaque" : locale === "en" ? "Selected projects" : "Proyectos destacados"}</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{getCaseStudyProjects().slice(0, 6).map(project => <Link key={project.slug} href={getCaseStudyPath(locale, project.slug)} className="rounded-xl border border-border bg-background p-5 hover:border-brand/50"><h3 className="font-semibold">{project.title[locale]}</h3><p className="mt-2 text-sm text-muted-foreground">{project.tagline[locale]}</p></Link>)}</div></section>
    <section><h2 className="text-2xl font-semibold">{locale === "pt" ? "Formação e certificações" : locale === "en" ? "Education and certifications" : "Formación y certificaciones"}</h2><ol className="mt-5 space-y-4">{education.map(entry => <li key={`${entry.institution}-${entry.order}`} className="border-t border-border pt-4"><h3 className="font-semibold">{entry.degree[locale]}</h3><p className="text-sm text-muted-foreground">{entry.institution} · {entry.period[locale]}</p></li>)}</ol><ul className="mt-6 grid gap-2 md:grid-cols-2">{personalData.certifications.map(item => <li key={item} className="rounded-lg bg-muted/25 p-3 text-sm">{localizeLabel(item, locale)}</li>)}</ul></section>
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
