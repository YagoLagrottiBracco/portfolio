import React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Download,
  ExternalLink,
  Github,
  Layers,
  Linkedin,
  Mail,
  QrCode,
  Radio,
  Sparkles,
} from "lucide-react"

import { AnalyticsDashboard } from "@/components/discovery/AnalyticsDashboard"
import { StatusBoard } from "@/components/discovery/StatusBoard"
import { BlogPoll } from "@/components/blog/BlogPoll"
import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"
import {
  aiPolicy,
  articlePoll,
  blogroll,
  discoveryPages,
  engineeringPrinciples,
  radarEditions,
  readingShelf,
  topicProposals,
  type DiscoverySlug,
} from "@/data/discovery"
import { personalData } from "@/data/personal"
import { localeTags, type Locale } from "@/lib/i18n"
import { getDiscoveryPath } from "@/lib/discovery-routes"
import { getHomePath } from "@/lib/locale-routes"
import { SITE_URL } from "@/lib/site"

const backText: Record<Locale, string> = {
  pt: "Voltar para o início",
  en: "Back to home",
  es: "Volver al inicio",
}

export function DiscoveryScreen({ slug, locale }: { slug: DiscoverySlug; locale: Locale }) {
  const meta = discoveryPages[slug]
  const title = meta.title[locale]
  const description = meta.description[locale]
  const canonicalUrl = `${SITE_URL}${getDiscoveryPath(locale, slug)}`
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": slug === "blogroll" || slug === "radar" || slug === "leitura" ? "CollectionPage" : "WebPage",
    name: title,
    description,
    url: canonicalUrl,
    inLanguage: localeTags[locale],
    isPartOf: { "@type": "WebSite", name: personalData.name, url: SITE_URL },
    author: { "@type": "Person", name: personalData.name, url: SITE_URL },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}${getHomePath(locale)}` },
      { "@type": "ListItem", position: 2, name: title, item: canonicalUrl },
    ],
  }

  return (
    <div className="min-h-screen bg-background text-foreground" lang={localeTags[locale]}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Navigation />

      <main id="main" className="container mx-auto max-w-4xl px-4 pb-28 pt-32">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex min-w-0 items-center gap-2">
            <li>
              <Link href={getHomePath(locale)} className="inline-flex items-center gap-1.5 underline underline-offset-4 hover:text-foreground">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                {backText[locale]}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="truncate font-medium text-foreground">
              {title}
            </li>
          </ol>
        </nav>

        <header className="mt-8 border-b border-border pb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </header>

        <div className="mt-10">
          {slug === "links" && <LinksSection locale={locale} />}
          {slug === "blogroll" && <BlogrollSection locale={locale} />}
          {slug === "radar" && <RadarSection locale={locale} />}
          {slug === "leitura" && <ReadingSection locale={locale} />}
          {slug === "principios" && <PrinciplesSection locale={locale} />}
          {slug === "ia" && <AiPolicySection locale={locale} />}
          {slug === "habilidades" && <SkillsSection locale={locale} />}
          {slug === "status" && <StatusBoard locale={locale} />}
          {slug === "analytics" && <AnalyticsDashboard locale={locale} />}
          {slug === "cartao" && <BusinessCardSection locale={locale} canonicalUrl={canonicalUrl} />}
          {slug === "curriculo" && <ResumeSection locale={locale} />}
          {slug === "participar" && <ParticipateSection locale={locale} />}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function LinksSection({ locale }: { locale: Locale }) {
  const quickLinks = [
    { label: "LinkedIn", href: personalData.socialLinks.linkedin, icon: Linkedin, external: true },
    { label: "GitHub", href: personalData.socialLinks.github, icon: Github, external: true },
    { label: "E-mail", href: `mailto:${personalData.socialLinks.email}`, icon: Mail, external: true },
    { label: locale === "pt" ? "Currículo (PDF)" : locale === "es" ? "Currículum (PDF)" : "Résumé (PDF)", href: `/cv/${locale}`, icon: Download, external: false },
    { label: locale === "pt" ? "Biblioteca de Recursos" : locale === "es" ? "Biblioteca de Recursos" : "Engineering Resources", href: locale === "pt" ? "/recursos" : `/${locale}/recursos`, icon: Layers, external: false },
    { label: "Blog", href: locale === "pt" ? "/blog" : `/${locale}/blog`, icon: BookOpen, external: false },
    { label: locale === "pt" ? "Radar Técnico" : "Technical Radar", href: getDiscoveryPath(locale, "radar"), icon: Radio, external: false },
    { label: locale === "pt" ? "Status dos Projetos" : "Project Status", href: getDiscoveryPath(locale, "status"), icon: CheckCircle2, external: false },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6 text-center">
        <h2 className="text-xl font-bold">{personalData.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{personalData.headline}</p>
        <p className="mt-3 text-sm text-muted-foreground">{personalData.summary}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {quickLinks.map(link => {
          const Icon = link.icon
          const content = (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-brand/50 hover:bg-muted/30">
              <span className="flex items-center gap-3 font-medium">
                <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                {link.label}
              </span>
              {link.external ? <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> : <ExternalLink className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}
            </div>
          )

          return link.external ? (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">
              {content}
            </a>
          ) : (
            <Link key={link.label} href={link.href}>
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function BlogrollSection({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {blogroll.map(item => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:border-brand/50"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-foreground group-hover:text-brand">{item.name}</h3>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{item.description[locale]}</p>
            </div>
            <span className="mt-4 break-all text-xs text-muted-foreground group-hover:underline">{item.url}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

function RadarSection({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-8">
      {radarEditions.map(edition => (
        <article key={edition.edition} className="rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
            <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
              Edição #{edition.edition}
            </span>
            <time dateTime={edition.date} className="text-xs text-muted-foreground">
              {edition.date}
            </time>
          </div>
          <h2 className="mt-4 text-xl font-bold">{edition.title[locale]}</h2>
          <div className="mt-6 space-y-4">
            {edition.links.map(link => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-border bg-muted/20 p-4 transition-colors hover:border-brand/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-foreground group-hover:text-brand">{link.title}</h3>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{link.note[locale]}</p>
              </a>
            ))}
          </div>
        </article>
      ))}
    </div>
  )
}

function ReadingSection({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {readingShelf.map(book => (
        <div key={book.title} className="rounded-xl border border-border bg-card p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{book.author}</span>
          <h3 className="mt-1 text-lg font-bold">{book.title}</h3>
          <p className="mt-3 text-sm text-muted-foreground">{book.note[locale]}</p>
        </div>
      ))}
    </div>
  )
}

function PrinciplesSection({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {engineeringPrinciples.map((principle, index) => (
        <div key={principle.title.pt} className="relative rounded-xl border border-border bg-card p-5">
          <span className="text-3xl font-black text-muted-foreground/20" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2 text-lg font-bold">{principle.title[locale]}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{principle.body[locale]}</p>
        </div>
      ))}
    </div>
  )
}

function AiPolicySection({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {aiPolicy.map(item => (
        <div key={item.title.pt} className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" aria-hidden="true" />
            <h3 className="text-lg font-bold">{item.title[locale]}</h3>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{item.body[locale]}</p>
        </div>
      ))}
    </div>
  )
}

function SkillsSection({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-bold text-foreground">
          {locale === "pt" ? "Competências Principais" : locale === "es" ? "Competencias Principales" : "Core Competencies"}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {personalData.skills.map(skill => (
            <span key={skill} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {personalData.specializations.map(spec => (
          <div key={spec.category.pt} className="rounded-xl border border-border bg-card p-5">
            <h3 className="text-lg font-bold text-foreground">{spec.category[locale]}</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              {spec.courses.map(course => (
                <li key={course} className="flex items-start gap-2">
                  <span className="text-brand">•</span>
                  <span>{course}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function BusinessCardSection({ locale, canonicalUrl }: { locale: Locale; canonicalUrl: string }) {
  const vcardData = `BEGIN:VCARD\nVERSION:3.0\nFN:${personalData.name}\nTITLE:${personalData.headline}\nEMAIL:${personalData.socialLinks.email}\nURL:${SITE_URL}\nEND:VCARD`
  const vcardHref = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcardData)}`

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-lg">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
        <QrCode className="h-8 w-8" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-2xl font-bold">{personalData.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{personalData.headline}</p>

      <div className="mt-6 flex flex-col gap-3">
        <a
          href={vcardHref}
          download="yago-lagrotti.vcf"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-contrast transition-opacity hover:opacity-90"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {locale === "pt" ? "Salvar contato (vCard)" : locale === "es" ? "Guardar contacto (vCard)" : "Save Contact (vCard)"}
        </a>

        <a
          href={`mailto:${personalData.socialLinks.email}`}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          {personalData.socialLinks.email}
        </a>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        {locale === "pt" ? "Endereço público:" : "Public address:"}{" "}
        <span className="font-mono">{canonicalUrl}</span>
      </p>
    </div>
  )
}

function ResumeSection({ locale }: { locale: Locale }) {
  const downloadText = locale === "pt" ? "Baixar Currículo em PDF" : locale === "es" ? "Descargar Currículum en PDF" : "Download PDF Résumé"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-card p-6">
        <div>
          <h2 className="text-xl font-bold">{personalData.name}</h2>
          <p className="text-sm text-muted-foreground">{personalData.headline}</p>
        </div>
        <a
          href={`/cv/${locale}`}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-brand-contrast hover:opacity-90"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {downloadText}
        </a>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold">{locale === "pt" ? "Experiência Profissional" : locale === "es" ? "Experiencia Profesional" : "Work Experience"}</h3>
        <div className="space-y-4">
          {personalData.experience.map(exp => (
            <div key={`${exp.company}-${exp.order}`} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-semibold text-foreground">{exp.position[locale]}</h4>
                <span className="text-xs text-muted-foreground">{exp.period[locale]}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-brand">{exp.company}</p>
              <p className="mt-2 text-sm text-muted-foreground">{exp.description[locale]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ParticipateSection({ locale }: { locale: Locale }) {
  return (
    <div className="space-y-8">
      <BlogPoll
        locale={locale}
        pollId={articlePoll.id}
        options={articlePoll.options.map(opt => ({ id: opt.id, label: opt.label[locale] }))}
        title={locale === "pt" ? "Qual assunto técnico você gostaria de ver aprofundado?" : locale === "es" ? "¿Qué tema técnico te gustaría profundizar?" : "Which technical topic would you like to see explored deeper?"}
      />

      <section>
        <h2 className="text-xl font-bold">
          {locale === "pt" ? "Próximas pautas em análise" : locale === "es" ? "Próximos temas en análisis" : "Upcoming topics under analysis"}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {topicProposals.map(proposal => (
            <div key={proposal.id} className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold">{proposal.title[locale]}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{proposal.description[locale]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

