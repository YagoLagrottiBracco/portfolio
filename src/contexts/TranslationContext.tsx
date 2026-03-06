"use client"

/**
 * @file TranslationContext.tsx
 * @description Custom i18n context for bilingual support (pt/en).
 *
 * Translations are stored in `src/messages/{locale}.json`.
 * The active locale is persisted in `localStorage` under the key `"locale"`.
 * On first load, `page.tsx` detects the browser language and pre-sets the locale;
 * this context picks it up from localStorage on mount.
 *
 * Usage:
 * const { t, locale, setLocale } = useTranslation();
 * t('hero.greeting') // resolves nested key via dot-notation
 * setLocale('en')    // switches language globally and persists
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import ptTranslations from '../messages/pt.json';
import enTranslations from '../messages/en.json';

type Locale = 'pt' | 'en';

/** Shape of the TranslationContext value exposed to consumers. */
interface TranslationContextType {
  /** Currently active locale. */
  locale: Locale;
  /** Switch locale and persist to localStorage. */
  setLocale: (locale: Locale) => void;
  /**
   * Resolve a dot-notation translation key for the current locale.
   * Falls back to the raw key string if the key is not found.
   * @example t('hero.greeting') // => "Olá, eu sou" | "Hi, I'm"
   */
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations: Record<Locale, Record<string, unknown>> = {
  pt: ptTranslations,
  en: enTranslations,
};

/** Props for `TranslationProvider`. */
interface TranslationProviderProps {
  children: ReactNode;
  /** Optional server-side locale hint (e.g. from URL segment). Falls back to localStorage or 'pt'. */
  initialLocale?: Locale;
}

export function TranslationProvider({ children, initialLocale }: TranslationProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? 'pt');

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale | null;

    if (savedLocale && (savedLocale === 'pt' || savedLocale === 'en')) {
      setLocaleState(savedLocale);
      return;
    }

    if (initialLocale && (initialLocale === 'pt' || initialLocale === 'en')) {
      setLocaleState(initialLocale);
      localStorage.setItem('locale', initialLocale);
    }
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[locale];

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

/**
 * Hook to consume the translation context.
 * Must be used inside a `<TranslationProvider>`.
 * @throws If called outside of a provider.
 */
export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
