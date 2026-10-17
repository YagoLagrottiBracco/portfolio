"use client"

/**
 * @file Footer.tsx
 * @description Site footer — social links and copyright.
 *
 * Extracted from the page files so the LinkedIn URL has a single source of
 * truth (`profile.socialLinks`); the two previous copies had drifted apart
 * and one of them pointed at a wrong profile slug.
 */
import Link from "next/link"
import { useTranslation } from "@/contexts/TranslationContext"
import { Github, Linkedin, Mail } from "lucide-react"
import { profile } from "@/data/profile"
import { getDiscoveryPath } from "@/lib/discovery-routes"
import { getPagePath } from "@/lib/page-routes"
import { getResourcePath } from "@/lib/resource-routes"
import { getStackPath } from "@/lib/stack-routes"

const links = [
  { href: profile.socialLinks.github, label: "GitHub", Icon: Github },
  { href: profile.socialLinks.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: `mailto:${profile.socialLinks.email}`, label: "E-mail", Icon: Mail },
]

export function Footer() {
  const { t, locale } = useTranslation()
  return (
    <footer className="border-t border-hairline bg-muted/20 py-10 print:hidden">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-sm text-muted-foreground sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {t("footer.copyright")}
        </p>

        <nav aria-label={t("footer.pages")} className="flex flex-wrap items-center justify-center gap-5">
          <Link href={getPagePath(locale, "trabalhe-comigo")} className="transition-colors hover:text-foreground">{t("footer.workWithMe")}</Link>
          <Link href={getStackPath(locale)} className="transition-colors hover:text-foreground">{t("footer.stack")}</Link>
          <Link href={getResourcePath(locale)} className="transition-colors hover:text-foreground">{t("navigation.resources")}</Link>
          <Link href={getDiscoveryPath(locale, "links")} className="transition-colors hover:text-foreground">Links</Link>
          <Link href={getPagePath(locale, "agora")} className="transition-colors hover:text-foreground">{t("footer.now")}</Link>
          <Link href={getPagePath(locale, "privacidade")} className="transition-colors hover:text-foreground">{t("footer.privacy")}</Link>
        </nav>

        <div className="flex items-center gap-1">
          {links.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label === "E-mail" ? t("common.email") : label}
              title={label === "E-mail" ? t("common.email") : label}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-surface hover:text-foreground"
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
