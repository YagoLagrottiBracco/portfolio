"use client"

/**
 * @file LanguageSwitcher.tsx
 * @description Dropdown button to switch the active locale between pt and en.
 *
 * Calls `setLocale()` from `TranslationContext` (which persists to localStorage)
 * and also updates the URL by replacing the locale segment in the pathname.
 * The currently active locale is highlighted with `bg-accent` in the dropdown.
 */

import { useTranslation } from '@/contexts/TranslationContext';
import { useRouter, usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: 'pt' | 'en') => {
    setLocale(newLocale);
    // Remove the current locale from pathname and add the new one
    const segments = pathname.split('/');
    segments[1] = newLocale; // Replace the locale segment
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchLocale('en')}
          className={locale === 'en' ? 'bg-accent' : ''}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale('pt')}
          className={locale === 'pt' ? 'bg-accent' : ''}
        >
          Português
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
