/**
 * @file PrivacyScreen.tsx
 * @description `/privacidade` and its `/en` and `/es` versions. The text lives
 * in `src/data/privacy.ts` and must follow what the code collects.
 */
import { Footer } from "@/components/organisms/Footer"
import { Navigation } from "@/components/organisms/Navigation"
import { personalData } from "@/data/personal"
import { privacy } from "@/data/privacy"
import { localeTags, type Locale } from "@/lib/i18n"

export function PrivacyScreen({ locale }: { locale: Locale }) {
  const updated = new Intl.DateTimeFormat(localeTags[locale], { dateStyle: "long", timeZone: "UTC" }).format(new Date(privacy.updatedAt))

  return (
    <div className="min-h-screen" lang={localeTags[locale]}>
      <Navigation />
      <main id="main" className="pb-24 pt-28">
        <article className="container mx-auto max-w-3xl px-4">
          <header className="rise-in">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{privacy.title[locale]}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{privacy.description[locale]}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              {privacy.updated[locale]} <time dateTime={privacy.updatedAt}>{updated}</time>
            </p>
          </header>

          {privacy.sections.map((section) => (
            <section key={section.title.en} className="mt-12">
              <h2 className="text-2xl font-semibold tracking-tight">{section.title[locale]}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.en.slice(0, 32)} className="mt-4 leading-relaxed text-foreground/90">
                  {paragraph[locale]}
                </p>
              ))}
            </section>
          ))}

          <p className="mt-12 border-t border-hairline pt-8">
            {privacy.contact[locale]}{" "}
            <a href={`mailto:${personalData.socialLinks.email}`} className="font-medium text-brand underline underline-offset-4">
              {personalData.socialLinks.email}
            </a>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  )
}
