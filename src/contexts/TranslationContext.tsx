"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import translations
import ptTranslations from '../messages/pt.json';
import enTranslations from '../messages/en.json';

type Locale = 'pt' | 'en';

interface TranslationContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations: Record<Locale, Record<string, unknown>> = {
  pt: ptTranslations,
  en: enTranslations,
};

interface TranslationProviderProps {
  children: ReactNode;
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

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
