"use client"

/**
 * @file Footer.tsx
 * @description Site footer — social links and copyright.
 *
 * Extracted from the page files so the LinkedIn URL has a single source of
 * truth (`personalData.socialLinks`); the two previous copies had drifted apart
 * and one of them pointed at a wrong profile slug.
 */
import { useTranslation } from "@/contexts/TranslationContext"
import { Github, Linkedin, Mail } from "lucide-react"
import { personalData } from "@/data/personal"

const links = [
  { href: personalData.socialLinks.github, label: "GitHub", Icon: Github },
  { href: personalData.socialLinks.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: `mailto:${personalData.socialLinks.email}`, label: "E-mail", Icon: Mail },
]

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t border-hairline bg-muted/20 py-10">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 text-sm text-muted-foreground sm:flex-row">
        <p>
          &copy; {new Date().getFullYear()} {t("footer.copyright")}
        </p>

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
