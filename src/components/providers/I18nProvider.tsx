"use client"

import { ReactNode } from "react";
import { TranslationProvider } from "@/contexts/TranslationContext";

interface I18nProviderProps {
  children: ReactNode;
  locale?: "pt" | "en";
}

export function I18nProvider({ children, locale }: I18nProviderProps) {
  return (
    <TranslationProvider initialLocale={locale}>
      {children}
    </TranslationProvider>
  );
}
