"use client"

import { useTranslation } from "@/contexts/TranslationContext"
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

/** Language is client state: switching never replaces the current route. */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
          <span className="sr-only">{t("common.toggleLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={(value) => {
          if (isLocale(value)) setLocale(value)
        }}>
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
