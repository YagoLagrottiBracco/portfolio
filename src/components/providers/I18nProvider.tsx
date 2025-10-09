"use client"

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

interface I18nProviderProps {
  children: ReactNode;
  messages: Record<string, unknown>;
}

export function I18nProvider({ children, messages }: I18nProviderProps) {
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
