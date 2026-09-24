"use client"

import { usePathname, useRouter } from "next/navigation"

import { useTranslation } from "@/contexts/TranslationContext"
import { getBlogIndexPath, isBlogPath } from "@/lib/blog-routes"
import { isLocale, locales, localeNames } from "@/lib/i18n"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()

  const changeLanguage = (value: string) => {
    if (!isLocale(value)) return
    setLocale(value)

    if (!isBlogPath(pathname)) return

    const translatedPost = document.querySelector<HTMLAnchorElement>(`a[data-blog-locale="${value}"]`)
    router.push(translatedPost?.getAttribute("href") ?? getBlogIndexPath(value))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
          <span className="sr-only">{t("common.toggleLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={changeLanguage}>
          {locales.map((language) => (
            <DropdownMenuRadioItem key={language} value={language} lang={language}>
              {localeNames[language]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}